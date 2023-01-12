import express from 'express'
import devServer from '@/server/dev'
import prodServer from '@/server/prod'
import http from 'http'
import { Server } from 'socket.io'
import { name } from '@/utils'

const port = process.env.PORT || '3000'
const app = express()
const server = http.createServer(app)
const io = new Server(server)

if (process.env.NODE_ENV === 'development') {
  devServer(app)
} else {
  prodServer(app)
}

console.log('server side: ', name)

// 監聽連線
io.on('connection', socket => {
  socket.emit('join', 'welcome')
})

server.listen(port, () => {
  console.log(`Server is running at port ${port} ...`)
})
