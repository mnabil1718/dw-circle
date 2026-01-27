/**
 * @swagger
 * /api/v1/threads/{id}/replies:
 *   get:
 *     summary: Get all replies for a thread
 *     tags: [Thread]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Thread ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 50
 *         description: Maximum number of replies to return (max 100)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetRepliesSuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */






/**
 * @swagger
 * /api/v1/threads/{id}/replies:
 *   post:
 *     summary: Post a reply to a thread
 *     tags: [Thread]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Thread ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateReplyRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/PostReplySuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

