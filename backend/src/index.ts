import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import './config/db'
import authRoutes from './modules/auth/auth.routes'
import boardRoutes from './modules/boards/board.routes'
import columnRoutes from './modules/columns/column.routes'
import cardRoutes from './modules/cards/card.routes'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/columns', columnRoutes)
app.use('/api/cards', cardRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Flowboard API running' })
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join_board', (boardId: string) => {
    socket.join(boardId)
    console.log(`Socket ${socket.id} joined board ${boardId}`)
  })

  socket.on('card_moved', (data) => {
    socket.to(data.boardId).emit('card_moved', data)
  })

  socket.on('card_created', (data) => {
    socket.to(data.boardId).emit('card_created', data)
  })

  socket.on('card_deleted', (data) => {
    socket.to(data.boardId).emit('card_deleted', data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }