import './index.css'
import { io } from 'socket.io-client'

console.log('client side chatroom page.')

const url = new URL(location.href)
const qs = new URLSearchParams(url.search)
const userName = qs.get('user_name')
const roomName = qs.get('room_name')

if (!userName || !roomName) {
  location.href = '/main/main.html'
}

// 建立連接至 node server
const socket = io()

socket.on('join', msg => {
  console.log('msg:', msg)
})
