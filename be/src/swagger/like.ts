/**
 * @swagger
 * /api/v1/likes:
 *   post:
 *     summary: Toggle like for a thread
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLikeRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ToggleLikeSuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */


/**
 * @swagger
 * /api/v1/likes/replies:
 *   post:
 *     summary: Toggle like for a reply
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReplyLikeRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ToggleReplyLikeSuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

