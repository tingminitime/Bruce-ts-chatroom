import './index.css'
import { io } from 'socket.io-client'
import CHANNELS from '@/channels'
import type { UserData } from '@/service/UserService'

type UserMsg = { userData: UserData; msg: string; time: string | number }

const url = new URL(location.href)
const qs = new URLSearchParams(url.search)
const userName = qs.get('user_name')
const roomName = qs.get('room_name')

if (!userName || !roomName) {
  location.href = '/main/main.html'
}

// --- Socket.io connect to node server ---
const socket = io()

// --- Message input and submit event ---

const messageInput = document.querySelector('#messageInput') as HTMLInputElement
const submitBtn = document.querySelector('#submitBtn') as HTMLButtonElement
const chatBoard = document.querySelector('#chatBoard') as HTMLDivElement
const roomTitle = document.querySelector('#roomTitle') as HTMLParagraphElement
const backBtn = document.querySelector('#backBtn') as HTMLButtonElement
let userId: string = ''

roomTitle.innerText = roomName || ' - '

function scrollToBottom(el: HTMLElement) {
  el.scrollTop = el.scrollHeight
}

function messageHandler(data: UserMsg) {
  const date = new Date(data.time)
  const time = `${date.getHours()}:${date.getMinutes()}`

  const messageDiv = document.createElement('div')
  messageDiv.classList.add('flex', 'mb-4', 'items-end')

  if (data.userData.id === userId) {
    messageDiv.classList.add('justify-end')
    messageDiv.innerHTML = `
    <p class="text-xs text-gray-700 mr-4">${time}</p>
    <div>
      <p class="text-xs text-white mb-1 text-right">
        ${data.userData.userName}
      </p>
      <p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full">
        ${data.msg}
      </p>
    </div>
    `
  } else {
    messageDiv.classList.add('justify-start')
    messageDiv.innerHTML = `
    <div>
      <p class="text-xs text-gray-700 mb-1">${data.userData.userName}</p>
      <p class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-bl-full text-white">
      ${data.msg}
      </p>
    </div>

    <p class="text-xs text-gray-700 ml-4">${time}</p>
    `
  }

  chatBoard.appendChild(messageDiv)
  scrollToBottom(chatBoard)
}

function submitMessageHandler() {
  const message = messageInput.value
  if (!message) return

  socket.emit(CHANNELS.CHAT, message)

  console.log('[client] to chat:', message)
  messageInput.value = ''
}

function broadcastMessageHandler(msg: string) {
  const broadcastMsgDiv = document.createElement('div')
  broadcastMsgDiv.classList.add(
    'flex',
    'justify-center',
    'mb-4',
    'items-center'
  )
  broadcastMsgDiv.innerHTML = `
  <p class="text-gray-700 text-sm">${msg}</p>
  `

  chatBoard.appendChild(broadcastMsgDiv)
  scrollToBottom(chatBoard)
}

submitBtn.addEventListener('click', submitMessageHandler)
messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    submitMessageHandler()
  }
  return
})

backBtn.addEventListener('click', () => {
  location.href = '/main/main.html'
})

// --- Socket.io message listening ---
// - Join to chat room
socket.emit(CHANNELS.JOIN, { userName, roomName })

// - Listening on channel: join

socket.on(CHANNELS.JOIN, msg => {
  console.log(`[client] join:`, msg)
  broadcastMessageHandler(msg)
})

// - Listening on channel: chat
socket.on(CHANNELS.CHAT, (data: UserMsg) => {
  console.log('[client] from chat', data)
  messageHandler(data)
})

// - Listening on channel: leave
socket.on(CHANNELS.LEAVE, msg => {
  broadcastMessageHandler(msg)
})

// - Listening on channel: userId

socket.on(CHANNELS.USER_ID, socketId => {
  userId = socketId
})
