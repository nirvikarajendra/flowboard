import pool from '../../config/db'

export const getBoards = async (userId: string) => {
    const result = await pool.query(
        `SELECT b.* FROM boards b
        JOIN board_members bm ON b.id = bm.board_id
        WHERE bm.user_id = $1
        ORDER BY b.created_at DESC`,
        [userId]
  )
  return result.rows
}

export const createBoard = async (name: string, userId: string) => {
    const board = await pool.query(
      'INSERT INTO boards (name, owner_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    )
  
    await pool.query(
      'INSERT INTO board_members (board_id, user_id, role) VALUES ($1, $2, $3)',
      [board.rows[0].id, userId, 'owner']
    )
  
    return board.rows[0]
  }

  export const getBoardById = async (boardId: string, userId: string) => {
    const boardResult = await pool.query(
      `SELECT b.* FROM boards b
       JOIN board_members bm ON b.id = bm.board_id
       WHERE b.id = $1 AND bm.user_id = $2`,
      [boardId, userId]
    )
  
    if (boardResult.rows.length === 0) {
      throw new Error('Board not found')
    }
  
    const columnsResult = await pool.query(
      'SELECT * FROM columns WHERE board_id = $1 ORDER BY position',
      [boardId]
    )
  
    const columns = await Promise.all(
      columnsResult.rows.map(async (col) => {
        const cardsResult = await pool.query(
          'SELECT * FROM cards WHERE column_id = $1 ORDER BY position',
          [col.id]
        )
        return { ...col, cards: cardsResult.rows }
      })
    )
  
    return { ...boardResult.rows[0], columns }
  }