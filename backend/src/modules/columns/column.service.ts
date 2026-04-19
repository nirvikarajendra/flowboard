import pool from '../../config/db'

export const createColumn = async (boardId: string, title: string, position: number) => {
    const result = await pool.query(
        'INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3) RETURNING *',
        [boardId, title, position]
    )
    return result.rows[0];
}

export const deleteColumn = async (columnId: string) => {
    await pool.query(
        'Delete from columns where id = $1',
        [columnId]
    )
}

export const updateColumn = async (columnId: string, title: string) => {
    const result = await pool.query(
        'Update columns set title = $1 where id = $2 RETURNING *',
    [title, columnId]
    )
    return result.rows[0];
}