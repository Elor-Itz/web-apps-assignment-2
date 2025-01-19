import express from "express";
const router = express.Router();
import commentsController from "../controllers/commentController";
import { authMiddleware } from "../controllers/authController";

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * components:
 *   schemas: 
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - postId
 *         - sender
 *       properties:
 *         content:
 *           type: string
 *           description: The comment content
 *         postId:
 *           type: string
 *           description: The ID of the post the comment is associated with
 *         sender:
 *           type: string
 *           description: The ID of the user who created the comment
 *       example:
 *         content: 'This is a sample comment.'
 *         postId: '60d0fe4f5311236168a109ca'
 *         sender: '60d0fe4f5311236168a109cb'
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 */
router.get("/", commentsController.getAll.bind(commentsController));

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get comments by Post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Comments not found
 */
router.get("/post/:postId", commentsController.getCommentsByPostId.bind(commentsController));

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: string
 *               sender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post("/", authMiddleware, commentsController.createItem.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.put("/:id", authMiddleware, commentsController.updateItem.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete("/:id", authMiddleware, commentsController.deleteItem.bind(commentsController));

export default router;