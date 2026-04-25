import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import swaggerUi from 'swagger-ui-express'    
import swaggerSpec from './swagger' 
import './config/db'
import authRoutes from './modules/auth/auth.routes'
import boardRoutes from './modules/boards/board.routes'
import columnRoutes from './modules/columns/column.routes'
import cardRoutes from './modules/cards/card.routes'
import { initSocket } from './socket/socket'

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

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/columns', columnRoutes)
app.use('/api/cards', cardRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Flowboard API running' })
})

initSocket(io)

const PORT = process.env.PORT || 8000

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }