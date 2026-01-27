/**
 * @swagger
 * /api/v1/users/{id}/profile:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetUserProfileSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */



/**
 * @swagger
 * /api/v1/users/{username}/profile/username:
 *   get:
 *     summary: Get user profile by username
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetUserProfileSuccess'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */



/**
 * @swagger
 * /api/v1/users/{id}/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateUserProfileSuccess'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

