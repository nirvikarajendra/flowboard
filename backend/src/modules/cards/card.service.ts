
import pool from '../../config/db'

export const createCard = async (columnId: string, title: string, position: number, description: string = "") => {
    const result = await pool.query(
        'INSERT INTO cards (column_id, title, position, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [columnId, title, position, description]
  )
  return result.rows[0]
}

export const deleteCard = async (cardId: string) => {
    await pool.query(
        'Delete from cards where id = $1',
        [cardId]
    )
}

export const updateCard = async (cardId: string, title: string, description: string) => {
    const result = await pool.query(
        'Update cards set title = $1, description = $2 where id = $3 RETURNING*',
        [title, description, cardId ]
    )
    return result.rows[0]
}

export const moveCard = async (cardId: string, columnId: string, position: number) => {
    const result = await pool.query(
        'Update cards set column_id = $1, position = $2 where id = $3 Returning*',
        [columnId, position, cardId]
    )
    return result.rows[0]
}