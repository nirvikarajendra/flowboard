import { Router } from 'express'
import { addCard, removeCard, editCard, transferCard } from './card.controller'
import auth from '../../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               column_id:
 *                 type: string
 *               title:
 *                 type: string
 *               position:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Card created successfully
 *       400:
 *         description: Error creating card
 */
router.post('/', auth, addCard)

/**
 * @swagger
 * /api/cards/{cardId}:
 *   delete:
 *     summary: Delete a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card deleted successfully
 *       400:
 *         description: Error deleting card
 */
router.delete('/:cardId', auth, removeCard)

/**
 * @swagger
 * /api/cards/{cardId}:
 *   put:
 *     summary: Edit a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Card updated successfully
 *       400:
 *         description: Error updating card
 */
router.put('/:cardId', auth, editCard)

/**
 * @swagger
 * /api/cards/{cardId}/move:
 *   patch:
 *     summary: Move a card to another column
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
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
 *               column_id:
 *                 type: string
 *               position:
 *                 type: number
 *     responses:
 *       200:
 *         description: Card moved successfully
 *       400:
 *         description: Error moving card
 */
router.patch('/:cardId/move', auth, transferCard)

export default router