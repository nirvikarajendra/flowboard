import { AuthRequest } from "../../middleware/auth"
import { Response } from 'express'
import { getBoards, createBoard, getBoardById } from './board.service'


export const getAllBoards = async (req: AuthRequest, res: Response) => {
    try {
      const boards = await getBoards(req.userId!)
      res.status(200).json(boards)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  }

export const createNewBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body
    const board = await createBoard(name, req.userId!)
    res.status(201).json(board)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getBoard = async (req: AuthRequest, res: Response) => {
  try {
    const board = await getBoardById(req.params.boardId as string, req.userId!)
    res.status(200).json(board)
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}