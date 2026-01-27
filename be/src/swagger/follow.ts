/**
 * @swagger
 * /api/v1/follows:
 *   post:
 *     summary: Toggle follow/unfollow a user
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToggleFollowRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/ToggleFollowSuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */





/**
 * @swagger
 * /api/v1/follows/suggestions:
 *   get:
 *     summary: Get suggested users to follow
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetUserSuggestionsSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */


