import type {Column as ColumnType} from "../types"
import { useState } from "react"
import Card from "./Card"

interface ColumnProps{
    column: ColumnType,
    onAddCard: (columnId: string, title: string) => void,
    onDeleteCard: (cardId: string) => void
}

function Column({ column, onAddCard, onDeleteCard } : ColumnProps){
    const [input, setInput] = useState("")

    const handleAdd = () => {
        if (input.trim() === "") return
        onAddCard(column.id, input)
        setInput("")
    }

    return (
        <div>
            <h2>{column.title}</h2>
            {column.cards.map((card) => (
                <Card 
                   key = {card.id}
                   card = {card}
                   onDelete={onDeleteCard}
                />
            ))}

            <input 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Add a card.."
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