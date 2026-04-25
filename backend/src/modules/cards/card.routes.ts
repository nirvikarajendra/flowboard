import { Router } from 'express'
import { addCard, removeCard, editCard, transferCard } from './card.controller'
import auth from '../../middleware/auth'

const router = Router()

router.post('/', auth, addCard)
router.delete('/:cardId', auth, removeCard)
router.put('/:cardId', auth, editCard)
router.patch('/:cardId/move', auth, transferCard)

export default router