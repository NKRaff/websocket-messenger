const token = localStorage.getItem('token')

var socket = io('http://localhost:3000', {
  auth: { token }
})

socket.on('connect_error', (error) => {
  if (error.message === 'User is not authenticated') {
    localStorage.removeItem('token')
    window.location.href = 'http://localhost:3000/'
  }
})

var button = document.querySelector("#send-button")
var input = document.querySelector("#message-input")
var messages = document.querySelector("#messages")

button.addEventListener('click', () => {
  const message = input.value
  if(message) {
    socket.emit('message', message)
    input.value = ''
  }
})

socket.on('message', (msg) => {
  var time = document.createElement('span')
  var date = new Date()
  time.textContent = date.getHours() + ':' + date.getMinutes();
  time.classList.add('time')

  var message = document.createElement('div')
  message.textContent = msg
  message.classList.add('message', 'sent')
  message.appendChild(time)

  messages.appendChild(message)
})
