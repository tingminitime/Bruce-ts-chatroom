import './index.css'
// import { io } from 'socket.io-client'

const nameInput = document.querySelector('#nameInput') as HTMLInputElement
const roomSelect = document.querySelector('#roomSelect') as HTMLSelectElement
const startBtn = document.querySelector('#startBtn') as HTMLButtonElement

startBtn.addEventListener('click', () => {
  if (!nameInput) return
  if (nameInput.value.trim() === '') {
    alert('請輸入名稱')
    nameInput.focus()
    return
  }

  const userName = nameInput.value
  const roomName = roomSelect.value

  location.href = `/chatRoom/chatRoom.html?user_name=${userName}&room_name=${roomName}`
})
