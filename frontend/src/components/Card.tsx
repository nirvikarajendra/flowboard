import type { Card as CardType } from '../types'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface CardProps{
    card: CardType
    onDelete: (id: string) => void
}

function Card({card, onDelete} : CardProps){
    const { attributes, listeners, setNodeRef, transform } = useDraggable({id : card.id});

    const style = { transform: CSS.Translate.toString(transform)}

    return (
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="bg-white rounded-md p-3 mb-2 shadow-sm flex justify-between items-center cursor-grab"
        >
          <span>{card.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(card.id)
            }}
            className="text-red-400 text-sm ml-2 hover:text-red-600"
          >
            x
          </button>
        </div>
      )
    }

export default Card