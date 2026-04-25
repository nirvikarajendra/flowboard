import { Router } from "express";
import { getAllBoards, createNewBoard, getBoard } from './board.controller'
import auth from '../../middleware/auth'

const router = Router()

/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: Get all boards for logged in user
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of boards
 *       400:
 *         description: Error fetching boards
 */
router.get('/', auth, getAllBoards)

/**
 * @swagger
 * /api/boards:
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Board created successfully
 *       400:
 *         description: Error creating board
 */
router.post('/', auth, createNewBoard)

/**
 * @swagger
 * /api/boards/{boardId}:
 *   get:
 *     summary: Get a single board with columns and cards
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board data with columns and cards
 *       400:
 *         description: Error fetching board
 */
router.get('/:boardId', auth, getBoard)

export default router