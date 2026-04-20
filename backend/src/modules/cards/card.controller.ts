import { AuthRequest } from "../../middleware/auth"
import { Response } from "express"
import { createCard, deleteCard, updateCard, moveCard } from './card.service'

export const addCard = async (req: AuthRequest, res: Response) =>{
    try {
        const {column_id, title, position, description} = req.body
        const card = await createCard(column_id, title, position, description)
        res.status(201).json(card)
    } catch (error: any) {
        res.status(400).json({ message: error.message})
    }
}

export const removeCard = async (req: AuthRequest, res: Response) => {
    try {
      await deleteCard(req.params.cardId as string)
      res.status(200).json({ message: 'Card deleted' })
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  }
  
  export const editCard = async (req: AuthRequest, res: Response) => {
    try {
      const { title, description } = req.body
      const card = await updateCard(req.params.cardId as string, title, description)
      res.status(200).json(card)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  }
  
  export const transferCard = async (req: AuthRequest, res: Response) => {
    try {
      const { column_id, position } = req.body
      const card = await moveCard(req.params.cardId as string, column_id, position)
      res.status(200).json(card)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  }