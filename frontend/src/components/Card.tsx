import type { Card as CardType } from '../types'

interface CardProps{
    card: CardType
    onDelete: (id: string) => void
}

function Card({card, onDelete} : CardProps){
    return (
        <div className="bg-white rounded-md p-3 mb-2 shadow-sm flex justify-between items-center">
        <span>{card.title}</span>
        <button onClick={()=> onDelete(card.id)}
        className="text-red-400 text-sm ml-2 hover:text-red-600"
        >
        x
        </button>
        </div>
    )
}

export default Card