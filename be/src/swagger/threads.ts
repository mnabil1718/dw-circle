/**
 * @swagger
 * /api/v1/threads:
 *   get:
 *     summary: Get list of threads
 *     tags: [Thread]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 20
 *         description: Maximum number of threads to return (max 100)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         description: Filter threads by user ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetThreadsSuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */


/**
 * @swagger
 * /api/v1/threads:
 *   post:
 *     summary: Create a new thread
 *     tags: [Thread]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateThreadRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateThreadSuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */


/**
 * @swagger
 * /api/v1/threads/{id}:
 *   get:
 *     summary: Get thread by ID
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
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetThreadByIdSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

