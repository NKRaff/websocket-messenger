const token = localStorage.getItem('token')

const socket = io('http://localhost:3000', {
  auth: {
    token
  }
})


// ========================================
// ELEMENTOS
// ========================================

const contactsElement =
  document.querySelector('#contacts')

const messagesElement =
  document.querySelector('#messages')

const chatUserName =
  document.querySelector('#chat-user-name')

const chatAvatar =
  document.querySelector('#chat-avatar')

const chatStatus =
  document.querySelector('#chat-status')

const messageInput =
  document.querySelector('#message-input')

const sendButton =
  document.querySelector('#send-button')

const newChatButton =
  document.querySelector('#new-chat-button')

const newChatForm =
  document.querySelector('#new-chat-form')

const usernameInput =
  document.querySelector('#username-input')

const startChatButton =
  document.querySelector('#start-chat-button')

const cancelChatButton =
  document.querySelector('#cancel-chat-button')

const searchInput =
  document.querySelector('#search-input')


// ========================================
// ESTADO DA APLICAÇÃO
// ========================================

let currentUser = null

let conversations = {}


// ========================================
// INICIAR
// ========================================

/*
  As conversas deverão ser carregadas pelo backend
  quando a página for iniciada.

  Exemplo futuro:

  loadConversations()
*/


// ========================================
// RENDERIZAR CONTATOS
// ========================================

function renderContacts() {

  contactsElement.innerHTML = ''

  Object.entries(conversations).forEach(
    ([conversationId, conversation]) => {

      const contact =
        document.createElement('div')

      contact.classList.add('contact')

      contact.dataset.conversationId =
        conversationId


      // Última mensagem
      const lastMessage =
        conversation.messages[
          conversation.messages.length - 1
        ]


      contact.innerHTML = `

        <div class="avatar">
          ${getInitials(conversation.user.name)}
        </div>

        <div class="contact-info">

          <div class="contact-name">
            ${escapeHTML(conversation.user.name)}
          </div>

          <div class="contact-message">
            ${
              lastMessage
                ? escapeHTML(lastMessage.content)
                : 'Nova conversa'
            }
          </div>

        </div>

      `


      contact.addEventListener(
        'click',
        () => {

          selectConversation(conversationId)

        }
      )


      contactsElement.appendChild(contact)

    }
  )

}


// ========================================
// SELECIONAR CONVERSA
// ========================================

function selectConversation(conversationId) {

  const conversation =
    conversations[conversationId]


  if (!conversation) {
    return
  }


  currentUser =
    conversation.user.name


  // ----------------------------------------
  // Atualiza contato ativo
  // ----------------------------------------

  document
    .querySelectorAll('.contact')
    .forEach(contact => {

      contact.classList.toggle(
        'active',
        contact.dataset.conversationId ===
        conversationId
      )

    })


  // ----------------------------------------
  // Atualiza cabeçalho
  // ----------------------------------------

  chatUserName.textContent =
    conversation.user.name

  chatAvatar.textContent =
    getInitials(conversation.user.name)


  chatStatus.textContent =
    conversation.user.online
      ? '● Online'
      : '● Offline'


  chatStatus.style.color =
    conversation.user.online
      ? '#22c55e'
      : '#9ca3af'


  // ----------------------------------------
  // Habilita envio
  // ----------------------------------------

  messageInput.disabled = false
  sendButton.disabled = false


  messageInput.placeholder =
    `Digite uma mensagem para ${conversation.user.name}...`


  // ----------------------------------------
  // Renderiza mensagens
  // ----------------------------------------

  renderMessages(conversationId)

}


// ========================================
// RENDERIZAR MENSAGENS
// ========================================

function renderMessages(conversationId) {

  messagesElement.innerHTML = ''


  const conversation =
    conversations[conversationId]


  if (!conversation) {
    return
  }


  if (!conversation.messages.length) {

    const empty =
      document.createElement('div')

    empty.classList.add('empty-chat')

    empty.textContent =
      `Inicie uma conversa com ${conversation.user.name}`

    messagesElement.appendChild(empty)

    return
  }


  conversation.messages.forEach(message => {

    addMessageToDOM(message)

  })


  scrollMessages()

}


// ========================================
// ADICIONAR MENSAGEM NA TELA
// ========================================

function addMessageToDOM(message) {

  const element =
    document.createElement('div')

  /*
    O backend retorna:

    {
      id,
      content,
      date
    }

    Ainda não temos no DTO quem enviou a mensagem.
    Portanto, por enquanto, as mensagens recebidas
    pelo histórico serão consideradas "received".

    Quando o backend enviar senderId, podemos
    determinar corretamente "sent" / "received".
  */

  element.classList.add(
    'message',
    message.type || 'received'
  )


  element.textContent =
    message.content


  const time =
    document.createElement('span')

  time.classList.add('time')

  time.textContent =
    formatMessageDate(message.date)


  element.appendChild(time)

  messagesElement.appendChild(element)

}


// ========================================
// ENVIAR MENSAGEM
// ========================================

function sendMessage() {

  if (!currentUser) {
    return
  }


  const text =
    messageInput.value.trim()


  if (!text) {
    return
  }


  const conversation =
    Object.values(conversations)
      .find(
        conversation =>
          conversation.user.name === currentUser
      )


  if (!conversation) {
    return
  }


  // ----------------------------------------
  // Envia para Socket.IO
  // ----------------------------------------

  socket.emit('message', {

    conversationId:
      conversation.id,

    message:
      text

  })


  messageInput.value = ''

  messageInput.focus()

}


// ========================================
// BOTÃO ENVIAR
// ========================================

sendButton.addEventListener(
  'click',
  sendMessage
)


// ========================================
// ENTER PARA ENVIAR
// ========================================

messageInput.addEventListener(
  'keydown',
  event => {

    if (event.key === 'Enter') {

      event.preventDefault()

      sendMessage()

    }

  }
)


// ========================================
// NOVO CHAT
// ========================================

newChatButton.addEventListener(
  'click',
  () => {

    newChatForm.classList.toggle('show')

    if (newChatForm.classList.contains('show')) {

      usernameInput.focus()

    }

  }
)


// ========================================
// CANCELAR
// ========================================

cancelChatButton.addEventListener(
  'click',
  () => {

    usernameInput.value = ''

    newChatForm.classList.remove('show')

  }
)


// ========================================
// CRIAR NOVO CHAT
// ========================================

async function createNewChat() {

  const soughtName =
    usernameInput.value.trim()


  if (!soughtName) {

    usernameInput.focus()

    return

  }


  // ----------------------------------------
  // Desabilita botão durante requisição
  // ----------------------------------------

  startChatButton.disabled = true


  try {

    const response =
      await fetch(
        'http://localhost:3000/chat/create',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          credentials: 'include',

          body: JSON.stringify({
            soughtName
          })
        }
      )


    const data =
      await response.json()


    // ----------------------------------------
    // Erro HTTP
    // ----------------------------------------

    if (!response.ok) {

      console.error(
        'Erro ao criar chat:',
        data
      )

      alert(
        data.message ||
        'Não foi possível iniciar a conversa.'
      )

      return

    }


    // ----------------------------------------
    // Resposta esperada
    // ----------------------------------------

    /*
      {
        message: string,

        conversation: {
          id: string,

          user: {
            id: string,
            name: string,
            online: boolean
          },

          messages: [
            {
              id: string,
              content: string,
              date: Date
            }
          ]
        }
      }
    */

    const conversation =
      data.conversation


    if (!conversation) {

      console.error(
        'Resposta inválida do backend:',
        data
      )

      alert(
        'O servidor retornou uma resposta inválida.'
      )

      return

    }


    // ----------------------------------------
    // Adiciona/atualiza conversa
    // ----------------------------------------

    conversations[conversation.id] =
      conversation


    // ----------------------------------------
    // Atualiza lista
    // ----------------------------------------

    renderContacts()


    // ----------------------------------------
    // Seleciona automaticamente
    // ----------------------------------------

    selectConversation(
      conversation.id
    )


    // ----------------------------------------
    // Fecha formulário
    // ----------------------------------------

    closeNewChatForm()


    // ----------------------------------------
    // Limpa input
    // ----------------------------------------

    usernameInput.value = ''


  } catch (error) {

    console.error(
      'Erro ao iniciar chat:',
      error
    )

    alert(
      'Não foi possível conectar ao servidor.'
    )

  } finally {

    startChatButton.disabled = false

  }

}


// ========================================
// BOTÃO CRIAR
// ========================================

startChatButton.addEventListener(
  'click',
  createNewChat
)


// ========================================
// ENTER NO NOME
// ========================================

usernameInput.addEventListener(
  'keydown',
  event => {

    if (event.key === 'Enter') {

      event.preventDefault()

      createNewChat()

    }

  }
)


// ========================================
// FECHAR FORMULÁRIO
// ========================================

function closeNewChatForm() {

  newChatForm.classList.remove('show')

}


// ========================================
// PESQUISAR
// ========================================

searchInput.addEventListener(
  'input',
  () => {

    const search =
      searchInput.value
        .toLowerCase()
        .trim()


    document
      .querySelectorAll('.contact')
      .forEach(contact => {

        const conversationId =
          contact.dataset.conversationId


        const conversation =
          conversations[conversationId]


        if (!conversation) {
          return
        }


        const username =
          conversation.user.name
            .toLowerCase()


        contact.style.display =
          username.includes(search)
            ? 'flex'
            : 'none'

      })

  }
)


// ========================================
// RECEBER MENSAGEM
// ========================================

socket.on(
  'message',
  data => {

    /*
      Idealmente o backend deverá enviar algo como:

      {
        id: "message-id",
        conversationId: "conversation-id",
        content: "Olá!",
        date: "2026-08-31T15:30:00.000Z"
      }

      Se o backend ainda enviar "from",
      podemos adaptar posteriormente.
    */


    const conversationId =
      data.conversationId


    if (!conversationId) {
      return
    }


    // ----------------------------------------
    // Verifica se a conversa existe
    // ----------------------------------------

    if (!conversations[conversationId]) {

      console.warn(
        'Mensagem recebida para conversa desconhecida:',
        conversationId
      )

      return

    }


    // ----------------------------------------
    // Adiciona mensagem
    // ----------------------------------------

    const message = {

      id:
        data.id,

      content:
        data.content,

      date:
        data.date,

      type:
        'received'

    }


    conversations[conversationId]
      .messages
      .push(message)


    // ----------------------------------------
    // Atualiza lista
    // ----------------------------------------

    renderContacts()


    // ----------------------------------------
    // Se a conversa está aberta
    // ----------------------------------------

    const currentConversation =
      Object.values(conversations)
        .find(
          conversation =>
            conversation.user.name === currentUser
        )


    if (
      currentConversation &&
      currentConversation.id === conversationId
    ) {

      renderMessages(conversationId)

      selectConversation(conversationId)

    }

  }
)


// ========================================
// SOCKET CONECTADO
// ========================================

socket.on(
  'connect',
  () => {

    console.log(
      'Conectado ao servidor'
    )

  }
)


// ========================================
// ERRO DE AUTENTICAÇÃO
// ========================================

socket.on(
  'connect_error',
  error => {

    if (
      error.message ===
      'User is not authenticated'
    ) {

      localStorage.removeItem('token')

      window.location.href =
        'http://localhost:3000/'

    }

  }
)


// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function getInitials(name) {

  const parts =
    name
      .trim()
      .split(/\s+/)


  if (parts.length === 1) {

    return parts[0]
      .substring(0, 2)
      .toUpperCase()

  }


  return (

    parts[0][0] +

    parts[parts.length - 1][0]

  ).toUpperCase()

}


function formatMessageDate(date) {

  if (!date) {
    return ''
  }


  const parsedDate =
    new Date(date)


  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }


  return (

    parsedDate
      .getHours()
      .toString()
      .padStart(2, '0') +

    ':' +

    parsedDate
      .getMinutes()
      .toString()
      .padStart(2, '0')

  )

}


function scrollMessages() {

  messagesElement.scrollTop =
    messagesElement.scrollHeight

}


function escapeHTML(text) {

  const element =
    document.createElement('div')

  element.textContent = text

  return element.innerHTML

}
