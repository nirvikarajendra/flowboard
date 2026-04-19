import { Response } from 'express'
import { AuthRequest } from '../../middleware/auth'
import { createColumn, deleteColumn, updateColumn } from './column.service'

export const addColumn = async (req: AuthRequest, res: Response) => {
  try {
    const { board_id, title, position } = req.body
    const column = await createColumn(board_id, title, position)
    res.status(201).json(column)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const removeColumn = async (req: AuthRequest, res: Response) => {
  try {
    await deleteColumn(req.params.columnId as string)
    res.status(200).json({ message: 'Column deleted' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const editColumn = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body
    const column = await updateColumn(req.params.columnId as string, title)
    res.status(200).json(column)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}