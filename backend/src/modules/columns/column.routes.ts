import { Router } from 'express'
import { addColumn, removeColumn, editColumn } from './column.controller'
import auth from '../../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/columns:
 *   post:
 *     summary: Create a new column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               board_id:
 *                 type: string
 *               title:
 *                 type: string
 *               position:
 *                 type: number
 *     responses:
 *       201:
 *         description: Column created successfully
 *       400:
 *         description: Error creating column
 */
router.post('/', auth, addColumn)

/**
 * @swagger
 * /api/columns/{columnId}:
 *   delete:
 *     summary: Delete a column
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Column deleted successfully
 *       400:
 *         description: Error deleting column
 */
router.delete('/:columnId', auth, removeColumn)

/**
 * @swagger
 * /api/columns/{columnId}:
 *   patch:
 *     summary: Edit a column title
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Column updated successfully
 *       400:
 *         description: Error updating column
 */
router.patch('/:columnId', auth, editColumn)

export default router