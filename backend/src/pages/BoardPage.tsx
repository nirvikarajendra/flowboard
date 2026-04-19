import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import type { Board } from '../types'
import Column from '../components/Column'
import Navbar from '../components/Navbar'

function BoardPage() {
  const { boardId } = useParams()
  const [board, setBoard] = useState<Board | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState("")

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

  const addCard = async (columnId: string, title: string) => {
    try {
      const res = await api.post('/cards', {
        column_id: columnId,
        title,
        position: 0
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
    } catch (err) {
      console.log("Error adding card:", err)
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
    } catch (err) {
      console.log("Error deleting card:", err)
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
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BoardPage