import { Server, Socket } from 'socket.io'

export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
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
}