import express from 'express'
import devServer from '@/server/dev'
import prodServer from '@/server/prod'
import http from 'http'
import { Server } from 'socket.io'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { name } from '@/utils'
import CHANNELS from '@/channels'
import UserService from '@/service/UserService'

const port = process.env.PORT || '3000'
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const userService = new UserService()

dayjs.extend(utc)

if (process.env.NODE_ENV === 'development') {
  devServer(app)
} else {
  prodServer(app)
}

console.log('server side: ', name)

// --- Connection event listening ---
io.on('connection', socket => {
  // socket.emit(CHANNELS.JOIN, '[Server] Welcome.')

  socket.emit(CHANNELS.USER_ID, socket.id)

  // - Listening on channel: join
  socket.on(
    CHANNELS.JOIN,
    ({ userName, roomName }: { userName: string; roomName: string }) => {
      const userData = userService.getUserData(socket.id, userName, roomName)
      userService.createUser(userData)

      socket.join(userData.roomName)
      socket.broadcast
        .to(userData.roomName)
        .emit(CHANNELS.JOIN, `${userName} 加入 ${roomName} 聊天室`)
    }
  )

  // - Listening on channel: chat
  socket.on(CHANNELS.CHAT, msg => {
    console.log('[server] from chat:', msg)
    const time = dayjs.utc().format()
    const userData = userService.getUser(socket.id)

    if (userData) {
      io.to(userData.roomName).emit(CHANNELS.CHAT, { userData, msg, time })
    }
  })

  socket.on('disconnect', () => {
    const userData = userService.getUser(socket.id)
    const userName = userData?.userName
    if (userName) {
      socket.broadcast
        .to(userData.roomName)
        .emit(CHANNELS.LEAVE, `${userName} 離開聊天室`)
    }
    userService.deleteUser(socket.id)
  })
})

server.listen(port, () => {
  console.log(`Server is running at port ${port} ...`)
})
