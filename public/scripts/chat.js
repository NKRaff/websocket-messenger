// ========================================
// SOCKET.IO
// ========================================

const socket =
  io('http://localhost:3000', {
    withCredentials: true
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


const logoutButton =
  document.querySelector('#logout-button')


// ========================================
// ESTADO
// ========================================

let currentUserId = null

let currentConversationId = null

let conversations = {}


// ========================================
// INICIALIZAÇÃO
// ========================================

async function initializeChat() {

  try {

    await loadCurrentUserId()

    await loadMessages()

    renderContacts()

  } catch (error) {

    console.error(
      'Erro ao inicializar chat:',
      error
    )

  }

}


// ========================================
// CARREGAR USUÁRIO LOGADO
// ========================================

async function loadCurrentUserId() {

  const response =
    await fetch(
      'http://localhost:3000/user/id',
      {
        method: 'GET',
        credentials: 'include'
      }
    )


  if (!response.ok) {

    throw new Error(
      `Não foi possível obter o usuário. HTTP ${response.status}`
    )

  }


  const data =
    await response.json()


  if (!data.userId) {

    throw new Error(
      'O servidor não retornou userId.'
    )

  }


  currentUserId =
    data.userId


}


// ========================================
// CARREGAR CHATS
// ========================================

async function loadMessages() {

  const response =
    await fetch(
      'http://localhost:3000/chat/load-messages',
      {
        method: 'GET',
        credentials: 'include'
      }
    )


  if (!response.ok) {

    throw new Error(
      `Erro ao carregar mensagens. HTTP ${response.status}`
    )

  }


  const data =
    await response.json()


  if (
    !data.chat ||
    !Array.isArray(data.chat)
  ) {

    console.warn(
      'Formato inesperado:',
      data
    )

    return

  }


  data.chat.forEach(
    chat => {

      conversations[chat.id] = {

        id:
          chat.id,

        type:
          chat.type,

        users:
          chat.users ?? [],

        messages:
          (chat.messages ?? [])
            .map(
              message => ({

                id:
                  message.id,

                senderId:
                  message.idSender,

                content:
                  message.content,

                date:
                  message.date,

                type:
                  message.idSender ===
                  currentUserId

                    ? 'sent'
                    : 'received'

              })
            )

      }

    }
  )

}


// ========================================
// USUÁRIOS DO CHAT
// ========================================

function getOtherUsers(
  conversation
) {

  return conversation.users
    .filter(
      user =>
        user.id !== currentUserId
    )

}


// ========================================
// NOME DA CONVERSA
// ========================================

function getConversationName(
  conversation
) {

  const otherUsers =
    getOtherUsers(
      conversation
    )


  // ----------------------------------------
  // GRUPO
  // ----------------------------------------

  if (
    conversation.type === 'group'
  ) {

    if (!otherUsers.length) {

      return 'Grupo'

    }


    return otherUsers
      .map(
        user =>
          user.name
      )
      .join(', ')

  }


  // ----------------------------------------
  // CHAT PRIVADO
  // ----------------------------------------

  const user =
    otherUsers[0]


  return user
    ? user.name
    : 'Usuário'

}


// ========================================
// AVATAR
// ========================================

function getConversationAvatar(
  conversation
) {

  return getInitials(
    getConversationName(
      conversation
    )
  )

}


// ========================================
// STATUS
// ========================================

function getConversationOnline(
  conversation
) {

  const otherUsers =
    getOtherUsers(
      conversation
    )


  if (!otherUsers.length) {

    return false

  }


  return otherUsers.some(
    user =>
      user.online
  )

}


// ========================================
// RENDERIZAR CONTATOS
// ========================================

function renderContacts() {

  contactsElement.innerHTML = ''


  Object.entries(
    conversations
  ).forEach(
    ([conversationId, conversation]) => {

      const contact =
        document.createElement('div')


      contact.classList.add(
        'contact'
      )


      contact.dataset.conversationId =
        conversationId


      const lastMessage =
        conversation.messages[
          conversation.messages.length - 1
        ]


      const conversationName =
        getConversationName(
          conversation
        )


      contact.innerHTML = `

        <div class="avatar">
          ${getConversationAvatar(conversation)}
        </div>

        <div class="contact-info">

          <div class="contact-name">
            ${escapeHTML(conversationName)}
          </div>

          <div class="contact-message">
            ${
              lastMessage
                ? escapeHTML(
                    lastMessage.content
                  )
                : 'Nova conversa'
            }
          </div>

        </div>

      `


      contact.addEventListener(
        'click',
        () => {

          selectConversation(
            conversationId
          )

        }
      )


      contactsElement.appendChild(
        contact
      )

    }
  )

}


// ========================================
// SELECIONAR CONVERSA
// ========================================

function selectConversation(
  conversationId
) {

  const conversation =
    conversations[
      conversationId
    ]


  if (!conversation) {

    return

  }


  currentConversationId =
    conversationId


  // ----------------------------------------
  // CONTATO ATIVO
  // ----------------------------------------

  document
    .querySelectorAll('.contact')
    .forEach(
      contact => {

        contact.classList.toggle(
          'active',

          contact.dataset.conversationId ===
            conversationId
        )

      }
    )


  // ----------------------------------------
  // CABEÇALHO
  // ----------------------------------------

  const conversationName =
    getConversationName(
      conversation
    )


  chatUserName.textContent =
    conversationName


  chatAvatar.textContent =
    getConversationAvatar(
      conversation
    )


  // ----------------------------------------
  // STATUS
  // ----------------------------------------

  const online =
    getConversationOnline(
      conversation
    )


  if (
    conversation.type === 'group'
  ) {

    const onlineCount =
      getOtherUsers(
        conversation
      )
        .filter(
          user =>
            user.online
        )
        .length


    chatStatus.textContent =
      `${onlineCount} online`

  } else {

    chatStatus.textContent =
      online
        ? '● Online'
        : '● Offline'

  }


  chatStatus.style.color =
    online
      ? '#22c55e'
      : '#9ca3af'


  // ----------------------------------------
  // ENVIO
  // ----------------------------------------

  messageInput.disabled =
    false

  sendButton.disabled =
    false


  messageInput.placeholder =
    `Digite uma mensagem para ${conversationName}...`


  // ----------------------------------------
  // MENSAGENS
  // ----------------------------------------

  renderMessages(
    conversationId
  )

}


// ========================================
// RENDERIZAR MENSAGENS
// ========================================

function renderMessages(
  conversationId
) {

  messagesElement.innerHTML = ''


  const conversation =
    conversations[
      conversationId
    ]


  if (!conversation) {

    return

  }


  if (
    !conversation.messages.length
  ) {

    const empty =
      document.createElement('div')


    empty.classList.add(
      'empty-chat'
    )


    empty.textContent =
      `Inicie uma conversa com ${getConversationName(conversation)}`


    messagesElement.appendChild(
      empty
    )


    return

  }


  conversation.messages.forEach(
    message => {

      addMessageToDOM(
        message
      )

    }
  )


  scrollMessages()

}


// ========================================
// ADICIONAR MENSAGEM
// ========================================

function addMessageToDOM(
  message
) {

  const element =
    document.createElement('div')


  element.classList.add(
    'message',
    message.type ||
      'received'
  )


  element.textContent =
    message.content


  const time =
    document.createElement('span')


  time.classList.add(
    'time'
  )


  time.textContent =
    formatMessageDate(
      message.date
    )


  element.appendChild(
    time
  )


  messagesElement.appendChild(
    element
  )

}


// ========================================
// ENVIAR MENSAGEM
// ========================================

function sendMessage() {

  if (
    !currentConversationId
  ) {

    return

  }


  const text =
    messageInput.value.trim()


  if (!text) {

    return

  }


  const conversation =
    conversations[
      currentConversationId
    ]


  if (!conversation) {

    return

  }


  const otherUsers =
    getOtherUsers(
      conversation
    )


  if (!otherUsers.length) {

    console.warn(
      'Nenhum destinatário encontrado.',
      conversation
    )

    return

  }


  /*
    Backend atual:

      socket.on("send_message", ...)

    recebe:

      recipientId
      message
      chatId

    Para chat privado temos apenas
    um destinatário.
  */

  const recipientId =
    otherUsers[0].id


  socket.emit(
    'send_message',
    {

      recipientId:

        recipientId,

      message:

        text,

      chatId:

        conversation.id

    }
  )


  messageInput.value =
    ''

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
// ENTER
// ========================================

messageInput.addEventListener(
  'keydown',
  event => {

    if (
      event.key === 'Enter'
    ) {

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

    newChatForm.classList.toggle(
      'show'
    )


    if (
      newChatForm.classList.contains(
        'show'
      )
    ) {

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

    usernameInput.value =
      ''

    newChatForm.classList.remove(
      'show'
    )

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


  startChatButton.disabled =
    true


  try {

    const response =
      await fetch(
        'http://localhost:3000/chat/create',
        {

          method:
            'POST',

          headers: {

            'Content-Type':
              'application/json'

          },

          credentials:
            'include',

          body:
            JSON.stringify({
              soughtName
            })

        }
      )


    const data =
      await response.json()


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


    const conversation =
      data.conversation


    if (!conversation) {

      console.error(
        'Resposta inválida:',
        data
      )


      alert(
        'O servidor retornou uma resposta inválida.'
      )


      return

    }


    // ----------------------------------------
    // ADICIONA CONVERSA
    // ----------------------------------------

    conversations[
      conversation.id
    ] = {

      id:
        conversation.id,

      type:
        conversation.type,

      users:
        conversation.users ?? [],

      messages:
        (conversation.messages ?? [])
          .map(
            message => ({

              id:
                message.id,

              senderId:
                message.idSender,

              content:
                message.content,

              date:
                message.date,

              type:
                message.idSender ===
                currentUserId

                  ? 'sent'
                  : 'received'

            })
          )

    }


    // ----------------------------------------
    // RENDERIZA
    // ----------------------------------------

    renderContacts()


    // ----------------------------------------
    // SELECIONA
    // ----------------------------------------

    selectConversation(
      conversation.id
    )


    // ----------------------------------------
    // FECHA
    // ----------------------------------------

    closeNewChatForm()


    usernameInput.value =
      ''


  } catch (error) {

    console.error(
      'Erro ao iniciar chat:',
      error
    )


    alert(
      'Não foi possível conectar ao servidor.'
    )

  } finally {

    startChatButton.disabled =
      false

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

    if (
      event.key === 'Enter'
    ) {

      event.preventDefault()

      createNewChat()

    }

  }
)


// ========================================
// FECHAR FORMULÁRIO
// ========================================

function closeNewChatForm() {

  newChatForm.classList.remove(
    'show'
  )

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
      .forEach(
        contact => {

          const conversationId =
            contact.dataset
              .conversationId


          const conversation =
            conversations[
              conversationId
            ]


          if (!conversation) {

            return

          }


          const name =
            getConversationName(
              conversation
            )
              .toLowerCase()


          contact.style.display =
            name.includes(search)
              ? 'flex'
              : 'none'

        }
      )

  }
)


// ========================================
// RECEBER MENSAGEM
// ========================================

socket.on(
  'message',
  data => {


    const chatId =
      data.chatId


    if (!chatId) {

      console.warn(
        'Mensagem sem chatId:',
        data
      )

      return

    }


    if (!data.sender) {

      console.warn(
        'Mensagem sem sender:',
        data
      )

      return

    }


    // ========================================
    // CRIA CHAT SE NÃO EXISTIR
    // ========================================

    if (
      !conversations[chatId]
    ) {

      conversations[chatId] = {

        id:
          chatId,

        type:
          'private',

        users: [

          {
            id:
              currentUserId,

            name:
              'Você',

            online:
              true

          },

          {
            id:
              data.sender.id,

            name:
              data.sender.name,

            online:
              data.sender.online ?? true

          }

        ],

        messages: []

      }

    }


    const conversation =
      conversations[
        chatId
      ]


    // ========================================
    // GARANTE O REMETENTE
    // ========================================

    const senderExists =
      conversation.users.some(
        user =>
          user.id ===
          data.sender.id
      )


    if (!senderExists) {

      conversation.users.push({

        id:
          data.sender.id,

        name:
          data.sender.name,

        online:
          data.sender.online ?? true

      })

    }


    // ========================================
    // EVITA DUPLICAÇÃO
    // ========================================

    const alreadyExists =
      conversation.messages.some(
        message =>
          message.id ===
          data.id
      )


    if (alreadyExists) {

      return

    }


    // ========================================
    // ADICIONA MENSAGEM
    // ========================================

    conversation.messages.push({

      id:
        data.id,

      senderId:
        data.sender.id,

      content:
        data.message,

      date:
        data.date,

      type:
        data.sender.id ===
        currentUserId

          ? 'sent'
          : 'received'

    })


    // ========================================
    // SIDEBAR
    // ========================================

    renderContacts()


    // ========================================
    // CHAT ABERTO
    // ========================================

    if (
      currentConversationId ===
      chatId
    ) {

      renderMessages(
        chatId
      )

    }

  }
)


// ========================================
// SOCKET CONECTADO
// ========================================

socket.on(
  'connect',
  () => {}
)


// ========================================
// ERRO SOCKET
// ========================================

socket.on(
  'connect_error',
  error => {

    console.error(
      'Erro de conexão Socket.IO:',
      error
    )


    if (
      error.message ===
      'User is not authenticated'
    ) {

      window.location.href =
        'http://localhost:3000/'

    }

  }
)


// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function getInitials(
  name
) {

  const parts =
    name
      .trim()
      .split(/\s+/)


  if (
    parts.length === 1
  ) {

    return parts[0]
      .substring(0, 2)
      .toUpperCase()

  }


  return (

    parts[0][0] +

    parts[
      parts.length - 1
    ][0]

  ).toUpperCase()

}


// ========================================
// DATA DA MENSAGEM
// ========================================

function formatMessageDate(
  date
) {

  if (!date) {

    return ''

  }


  const parsedDate =
    new Date(date)


  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {

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


// ========================================
// SCROLL
// ========================================

function scrollMessages() {

  messagesElement.scrollTop =
    messagesElement.scrollHeight

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(
  text
) {

  const element =
    document.createElement('div')


  element.textContent =
    text


  return element.innerHTML

}


// ========================================
// LOGOUT
// ========================================

function logout() {
  console.log('chamou logout')
  window.location.href =
    'http://localhost:3000/user/logout'

}


// ========================================
// BOTÃO LOGOUT
// ========================================

logoutButton.addEventListener(
  'click',
  logout
)


// ========================================
// INICIA
// ========================================

initializeChat()
