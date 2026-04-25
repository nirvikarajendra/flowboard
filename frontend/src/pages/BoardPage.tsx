import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import type { Board } from '../types'
import Column from '../components/Column'
import Navbar from '../components/Navbar'
import { io, Socket } from 'socket.io-client'
import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'

function BoardPage() {
  const { boardId } = useParams()
  const [board, setBoard] = useState<Board | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io('http://localhost:8000')
    socketRef.current.emit('join_board', boardId)

    socketRef.current.on('card_created', (data: any) => {
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === data.card.column_id
              ? { ...col, cards: [...col.cards, data.card] }
              : col
          )
        }
      })
    })

    socketRef.current.on('card_deleted', (data: any) => {
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            cards: col.cards.filter(card => card.id !== data.cardId)
          }))
        }
      })
    })

    socketRef.current.on('card_moved', (data: any) => {
      setBoard(prev => {
        if (!prev) return prev
        let movedCard: any = null
        return {
          ...prev,
          columns: prev.columns.map(col => {
            const found = col.cards.find(c => c.id === data.cardId)
            if (found) movedCard = found
            return { ...col, cards: col.cards.filter(c => c.id !== data.cardId) }
          }).map(col => {
            if (col.id === data.toColumnId && movedCard) {
              return { ...col, cards: [...col.cards, movedCard] }
            }
            return col
          })
        }
      })
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [boardId])

  useEffect(() => {
    fetchBoard()
  }, [boardId])

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/boards/${boardId}`)
      setBoard(res.data)
    } catch (err) {
      console.log("Error fetching board:", err)
    }
  }

  const addColumn = async () => {
    if (newColumnTitle.trim() === "") return
    try {
      const res = await api.post('/columns', {
        board_id: boardId,
        title: newColumnTitle,
        position: board?.columns.length || 0
      })
      setBoard(prev => {
        if (!prev) return prev
        return { ...prev, columns: [...prev.columns, { ...res.data, cards: [] }] }
      })
      setNewColumnTitle("")
    } catch (err) {
      console.log("Error adding column:", err)
    }
  }

  const addCard = async (columnId: string, title: string, description: string = "") => {
    try {
      const res = await api.post('/cards', {
        column_id: columnId,
        title,
        position: 0,
        description
      })
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === columnId
              ? { ...col, cards: [...col.cards, res.data] }
              : col
          )
        }
      })
      socketRef.current?.emit('card_created', { boardId, card: res.data })
    } catch (err) {
      console.log("Error adding card:", err)
    }
  }

  const editCard = async (cardId: string, title: string, description: string) => {
    try {
      const res = await api.put(`/cards/${cardId}`, {
        title,
        description
      })
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            cards: col.cards.map(card =>
              card.id === cardId ? { ...card, ...res.data } : card
            )
          }))
        }
      })
    } catch (err) {
      console.log("Error editing card:", err)
    }
  }

  const editColumn = async (columnId: string, title: string) => {
    try {
      await api.patch(`/columns/${columnId}`, { title })
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === columnId ? { ...col, title } : col
          )
        }
      })
    } catch (err) {
      console.log("Error editing column:", err)
    }
  }


  const deleteCard = async (cardId: string) => {
    try {
      await api.delete(`/cards/${cardId}`)
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            cards: col.cards.filter(card => card.id !== cardId)
          }))
        }
      })
      socketRef.current?.emit('card_deleted', { boardId, cardId })
    } catch (err) {
      console.log("Error deleting card:", err)
    }
  }

  const deleteColumn = async (columnId: string) => {
    try {
      await api.delete(`/columns/${columnId}`)
      setBoard(prev => {
        if (!prev) return prev
        return {
          ...prev,
          columns: prev.columns.filter(col => col.id !== columnId)
        }
      })
    } catch (err) {
      console.log("Error deleting column:", err)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return
    if (!board) return

    const cardId = active.id as string
    const toColumnId = over.id as string

    const fromColumn = board.columns.find(col =>
      col.cards.some(card => card.id === cardId)
    )

    if (!fromColumn) return
    if (fromColumn.id === toColumnId) return

    const card = fromColumn.cards.find(card => card.id === cardId)!

    setBoard(prev => {
      if (!prev) return prev
      return {
        ...prev,
        columns: prev.columns.map(col => {
          if (col.id === fromColumn.id) {
            return { ...col, cards: col.cards.filter(c => c.id !== cardId) }
          }
          if (col.id === toColumnId) {
            return { ...col, cards: [...col.cards, card] }
          }
          return col
        })
      }
    })

    try {
      await api.patch(`/cards/${cardId}/move`, {
        column_id: toColumnId,
        position: 0
      })
      socketRef.current?.emit('card_moved', { boardId, cardId, toColumnId })
    } catch (err) {
      console.log("Error moving card:", err)
    }
  }

  if (!board) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{board.name}</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="New column title..."
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="p-2 border rounded text-sm w-64"
          />
          <button
            onClick={addColumn}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm font-bold"
          >
            Add Column
          </button>
        </div>
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {board.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
                onDeleteColumn={deleteColumn}
                onEditCard={editCard} 
                onEditColumn={editColumn}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  )
}

export default BoardPage