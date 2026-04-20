import { useState } from 'react'
import type { Column as ColumnType } from '../types'
import Card from './Card'

interface ColumnProps {
  column: ColumnType
  onAddCard: (columnId: string, title: string) => void
  onDeleteCard: (cardId: string) => void
  onDeleteColumn: (columnId: string) => void
}

function Column({ column, onAddCard, onDeleteCard, onDeleteColumn }: ColumnProps) {
  const [input, setInput] = useState("")

  const handleAdd = () => {
    if (input.trim() === "") return
    onAddCard(column.id, input)
    setInput("")
  }

  return (
    <div className="bg-gray-200 rounded-lg p-4 w-72 shrink-0">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-base">{column.title}</h2>
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-red-400 text-sm hover:text-red-600"
        >
          x
        </button>
      </div>
      {column.cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onDelete={onDeleteCard}
        />
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a card..."
        className="w-full p-2 rounded mt-2 text-sm"
      />
      <button
        onClick={handleAdd}
        className="w-full bg-blue-500 text-white rounded p-2 mt-2 text-sm"
      >
        Add Card
      </button>
    </div>
  )
}

export default Column