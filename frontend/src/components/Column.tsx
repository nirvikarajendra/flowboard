import { useState } from 'react'
import type { Column as ColumnType } from '../types'
import Card from './Card'
import { useDroppable } from '@dnd-kit/core'

interface ColumnProps {
  column: ColumnType
  onAddCard: (columnId: string, title: string, description?: string) => void
  onDeleteCard: (cardId: string) => void
  onDeleteColumn: (columnId: string) => void
  onEditCard: (cardId: string, title: string, description: string) => void
  onEditColumn: (columnId: string, title: string) => void  // ✅ Added
}

function Column({ column, onAddCard, onDeleteCard, onDeleteColumn, onEditCard, onEditColumn }: ColumnProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)        // ✅ Added
  const [columnTitle, setColumnTitle] = useState(column.title)       // ✅ Added

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const handleAdd = () => {
    if (title.trim() === "") return
    onAddCard(column.id, title, description)
    setTitle("")
    setDescription("")
    setShowForm(false)
  }

  // ✅ Added
  const handleTitleSave = () => {
    if (columnTitle.trim() === "") return
    onEditColumn(column.id, columnTitle)
    setIsEditingTitle(false)
  }

  return (
    <div className="bg-gray-200 rounded-lg p-4 w-72 shrink-0">

      {/* Column Header */}
      <div className="flex justify-between items-center mb-3">
        {isEditingTitle ? (
          // ✅ Edit title mode
          <input
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            className="font-bold text-base w-full p-1 rounded border"
            autoFocus
          />
        ) : (
          // ✅ View title mode - click to edit
          <h2
            onClick={() => setIsEditingTitle(true)}
            className="font-bold text-base cursor-pointer hover:text-blue-500"
          >
            {columnTitle}
          </h2>
        )}

        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-red-400 text-sm hover:text-red-600 ml-2"
        >
          x
        </button>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`min-h-16 rounded ${isOver ? 'bg-gray-300' : ''}`}
      >
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
            onEdit={onEditCard}
          />
        ))}
      </div>

      {/* Add Card Form */}
      {showForm ? (
        <div className="mt-2 flex flex-col gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title..."
            className="w-full p-2 rounded text-sm"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)..."
            className="w-full p-2 rounded text-sm resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-blue-500 text-white rounded p-2 text-sm">
              Add Card
            </button>
            <button
              onClick={() => { setShowForm(false); setTitle(""); setDescription("") }}
              className="flex-1 bg-gray-400 text-white rounded p-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-500 text-white rounded p-2 mt-2 text-sm"
        >
          + Add Card
        </button>
      )}

    </div>
  )
}

export default Column