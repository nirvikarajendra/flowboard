import { Router } from 'express'
import { addColumn, removeColumn, editColumn } from './column.controller'
import auth from '../../middleware/auth'

const router = Router()

router.post('/', auth, addColumn)
router.delete('/:columnId', auth, removeColumn)
router.patch('/:columnId', auth, editColumn)

export default router