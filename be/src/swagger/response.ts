/**
 * @swagger
 * components:
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     ## =========================
 *     ## AUTH — REGISTER
 *     ## =========================
 *     RegisterUserRequest:
 *       type: object
 *       required: [email, user_name, name, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         user_name:
 *           type: string
 *         name:
 *           type: string
 *         password:
 *           type: string
 *
 *     RegisterUserResponse:
 *       type: object
 *       properties:
 *         user_id:
 *           type: number
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *
 *     APIResponseRegisterSuccess:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           example: 201
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/RegisterUserResponse'
 *
 *     ## =========================
 *     ## AUTH — LOGIN
 *     ## =========================
 *     LoginUserRequest:
 *       type: object
 *       required: [identifier, password]
 *       properties:
 *         identifier:
 *           type: string
 *           description: Username or email
 *         password:
 *           type: string
 *           format: password
 *
 *     LoginUserResponse:
 *       type: object
 *       properties:
 *         user_id:
 *           type: number
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 *           nullable: true
 *         token:
 *           type: string
 *           description: JWT access token
 *
 *     APIResponseLoginSuccess:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           example: 200
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/LoginUserResponse'
 *
 *     ## =========================
 *     ## THREADS
 *     ## =========================
 *     ThreadAuthor:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         profile_picture:
 *           type: string
 *           nullable: true
 *
 *     ThreadResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         content:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         likes:
 *           type: number
 *         replies:
 *           type: number
 *         isLiked:
 *           type: boolean
 *         user:
 *           $ref: '#/components/schemas/ThreadAuthor'
 *
 *     APIResponseGetThreadsSuccess:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           example: 200
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             threads:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ThreadResponse'
 *
 *     ## =========================
 *     ## REPLIES
 *     ## =========================
 *     ReplyAuthor:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         profile_picture:
 *           type: string
 *           nullable: true
 *
 *     ReplyResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         thread_id:
 *           type: number
 *         content:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         likes:
 *           type: number
 *         isLiked:
 *           type: boolean
 *         user:
 *           $ref: '#/components/schemas/ReplyAuthor'
 *
 *     APIResponseGetRepliesSuccess:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           example: 200
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             replies:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReplyResponse'
 *
 *     CreateReplyRequest:
 *       type: object
 *       required: [content]
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 300
 *         image:
 *           type: string
 *           format: binary
 *           nullable: true
 *
 *     ReplyResponsePost:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         thread_id:
 *           type: number
 *         content:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         likes:
 *           type: number
 *         isLiked:
 *           type: boolean
 *         user:
 *           $ref: '#/components/schemas/ThreadAuthor'
 *
 *     APIResponsePostReplySuccess:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           example: 201
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             reply:
 *               $ref: '#/components/schemas/ReplyResponsePost'
 *             metadata:
 *               type: object
 *               description: Optional metadata about the parent thread
 *
 *     ## =========================
 *     ## USER PROFILE
 *     ## =========================
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         avatar:
 *           type: string
 *           nullable: true
 *         bio:
 *           type: string
 *           nullable: true
 *         followers:
 *           type: number
 *         following:
 *           type: number
 *
 *     APIResponseGetUserProfileSuccess:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *           example: 200
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/UserProfileResponse'
 *
  *     UpdateProfileRequest:
 *       type: object
 *       required: [name, username]
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *         username:
 *           type: string
 *           minLength: 1
 *         bio:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *         image:
 *           type: string
 *           format: binary
 *           nullable: true
 *
 *
  *     CreateLikeRequest:
 *       type: object
 *       required: [user_id, tweet_id]
 *       properties:
 *         user_id:
 *           type: number
 *           description: ID of the logged-in user
 *         tweet_id:
 *           type: number
 *           description: ID of the thread to like/unlike
 *
 *     ToggleLikeResponse:
 *       type: object
 *       properties:
 *         user_id:
 *           type: number
 *         thread_id:
 *           type: number
 *         likes:
 *           type: number
 *           description: Total likes after toggle
 *
  *     CreateReplyLikeRequest:
 *       type: object
 *       required: [user_id, reply_id]
 *       properties:
 *         user_id:
 *           type: number
 *           description: ID of the logged-in user
 *         reply_id:
 *           type: number
 *           description: ID of the reply to like/unlike
 *
 *     ToggleReplyLikeResponse:
 *       type: object
 *       properties:
 *         user_id:
 *           type: number
 *         reply_id:
 *           type: number
 *         likes:
 *           type: number
 *           description: Total likes after toggle
 *
  *     ToggleFollowRequest:
 *       type: object
 *       required: [following_id]
 *       properties:
 *         following_id:
 *           type: number
 *           description: ID of the user to follow/unfollow
 *
 *     ToggleUser:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         bio:
 *           type: string
 *           nullable: true
 *         avatar:
 *           type: string
 *           nullable: true
 *         following:
 *           type: number
 *           description: Total number of users this user is following
 *         followers:
 *           type: number
 *           description: Total number of followers this user has
 *
 *     ToggleFollowResponse:
 *       type: object
 *       properties:
 *         following_id:
 *           type: number
 *         follower_id:
 *           type: number
 *         following:
 *           $ref: '#/components/schemas/ToggleUser'
 *         follower:
 *           $ref: '#/components/schemas/ToggleUser'
 *
 *     FollowSuggestion:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         bio:
 *           type: string
 *           nullable: true
 *         avatar:
 *           type: string
 *           nullable: true
 *         is_followed:
 *           type: boolean
 *           description: Whether the current user is already following this user
 *
 *
 *   responses:
 *     ## =========================
 *     ## SUCCESS RESPONSES
 *     ## =========================
 *
  *     GetUserSuggestionsSuccess:
 *       description: List of suggested users to follow
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/FollowSuggestion'
 *
 *     RegisterUserSuccess:
 *       description: User registered successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIResponseRegisterSuccess'
 *
 *     LoginUserSuccess:
 *       description: Login successful
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIResponseLoginSuccess'
 *
 *     GetThreadsSuccess:
 *       description: Get threads successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIResponseGetThreadsSuccess'
 *
 *     GetRepliesSuccess:
 *       description: Get replies successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIResponseGetRepliesSuccess'
 *
  *     PostReplySuccess:
 *       description: Reply posted successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIResponsePostReplySuccess'
 *
  *     GetUserProfileSuccess:
 *       description: User profile fetched successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIResponseGetUserProfileSuccess'
 *
  *     GetUserProfileByUsernameSuccess:
 *       description: User profile fetched successfully by username
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIResponseGetUserProfileSuccess'
 *
  *     UpdateUserProfileSuccess:
 *       description: User profile updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileResponse'
 *
  *     ToggleLikeSuccess:
 *       description: Thread like toggled successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToggleLikeResponse'
 *
  *     ToggleReplyLikeSuccess:
 *       description: Reply like toggled successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToggleReplyLikeResponse'
 *
  *     ToggleFollowSuccess:
 *       description: Follow/unfollow action completed successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToggleFollowResponse'
 *
 *     ## =========================
 *     ## ERROR RESPONSES
 *     ## =========================
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 example: 400
 *               status:
 *                 type: string
 *                 example: error
 *               message:
 *                 type: string
 *               errors:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *
 *     UnauthorizedError:
 *       description: Unauthorized / invalid credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 example: 401
 *               status:
 *                 type: string
 *                 example: error
 *               message:
 *                 type: string
 *
 *     ForbiddenError:
 *       description: Action not allowed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 example: 403
 *               status:
 *                 type: string
 *                 example: error
 *               message:
 *                 type: string
 */
