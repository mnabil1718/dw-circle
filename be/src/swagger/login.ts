/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login existing user
 *     tags: [Auth]
 *     security: []   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/LoginUserSuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
