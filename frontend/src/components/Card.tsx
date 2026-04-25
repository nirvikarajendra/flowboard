import type { Card as CardType } from '../types'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

interface CardProps {
  card: CardType
  onDelete: (id: string) => void
  onEdit: (cardId: string, title: string, description: string) => void
}

function Card({ card, onDelete, onEdit }: CardProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editDescription, setEditDescription] = useState(card.description || "")

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: card.id })
  const style = { transform: CSS.Translate.toString(transform) }

  const handleSave = () => {
    onEdit(card.id, editTitle, editDescription)
    setIsEditing(false)
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="bg-white rounded-md p-3 mb-2 shadow-sm">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-1 border rounded text-sm"
            placeholder="Card title..."
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-1 border rounded text-sm resize-none"
            placeholder="Description..."
            rows={3}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-blue-500 text-white rounded p-1 text-sm">Save</button>
            <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-400 text-white rounded p-1 text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <span {...listeners} className="font-medium cursor-grab flex-1">{editTitle}</span>
            <div className="flex items-center gap-2">

              {editDescription && (
                <button onClick={() => setShowDescription(!showDescription)} className="text-gray-400 text-sm hover:text-gray-600">
                  {showDescription ? '▲' : '▼'}
                </button>
              )}

              <button onClick={() => setIsEditing(true)} className="text-blue-400 text-sm hover:text-blue-600">✎</button>
              <button onClick={() => onDelete(card.id)} className="text-red-400 text-sm hover:text-red-600">x</button>
            </div>
          </div>

          {showDescription && editDescription && (
            <p className="text-gray-500 text-sm mt-2 border-t pt-2">{editDescription}</p>
          )}
        </>
      )}
    </div>
  )
}

export default Card