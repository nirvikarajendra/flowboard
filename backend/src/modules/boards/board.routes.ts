import { Router } from "express";
import {getAllBoards, createNewBoard, getBoard } from './board.controller'
import auth from '../../middleware/auth'

const router = Router()

router.get('/', auth, getAllBoards)
router.post('/', auth, createNewBoard)
router.get('/:boardId', auth, getBoard)

export default router