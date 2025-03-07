import { authController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();
/**
 * @openapi
 * /auth/sign-up:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user account with the provided details and returns the user data along with access and refresh tokens set as cookies.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 1@2.com
 *               password:
 *                 type: string
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 example: David
 *               lastName:
 *                 type: string
 *                 example: Okonkwo
 *               username:
 *                 type: string
 *                 example: Davheed2
 *     responses:
 *       201:
 *         description: Successfully created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: c8d01b9a-b21d-4313-836b-37e55e4eb159
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: 1@2.com
 *                       username:
 *                         type: string
 *                         example: Davheed2
 *                       firstName:
 *                         type: string
 *                         example: David
 *                       lastName:
 *                         type: string
 *                         example: Okonkwo
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       role:
 *                         type: string
 *                         enum:
 *                           - user
 *                           - admin
 *                         example: user
 *                       passwordResetToken:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       passwordResetExpires:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *                       passwordChangedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-07T00:37:33.807Z
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly, refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly
 *       400:
 *         description: Bad Request - Incomplete signup data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Incomplete signup data
 *       409:
 *         description: Conflict - Email or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User with this email already exists
 *       500:
 *         description: Internal Server Error - Failed to create user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to create user
 */
router.post('/sign-up', authController.signUp);
/**
 * @openapi
 * /auth/sign-in:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticates a user with email and password. On the first request (without OTP), sends an OTP to the user's email. On the second request (with OTP), validates the OTP and completes sign-in, returning user data with access and refresh tokens as cookies.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - email
 *                   - password
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: 1@1.com
 *                   password:
 *                     type: string
 *                     example: password123
 *                 description: Initial request to trigger OTP generation and email
 *               - type: object
 *                 required:
 *                   - email
 *                   - password
 *                   - otp
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: 1@1.com
 *                   password:
 *                     type: string
 *                     example: password123
 *                   otp:
 *                     type: string
 *                     example: 123456
 *                     description: OTP received via email, required to complete sign-in
 *                 description: Second request to verify OTP and complete sign-in
 *     responses:
 *       200:
 *         description: OTP sent or user signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *                     data:
 *                       type: null
 *                       example: null
 *                     message:
 *                       type: string
 *                       example: OTP sent to your email. Please verify to complete sign-in.
 *                   example:
 *                     status: success
 *                     data: null
 *                     message: OTP sent to your email. Please verify to complete sign-in.
 *                   description: Response when OTP is sent (initial request without OTP)
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: success
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: 1@1.com
 *                           username:
 *                             type: string
 *                             example: Davheed
 *                           firstName:
 *                             type: string
 *                             example: David
 *                           lastName:
 *                             type: string
 *                             example: Okonkwo
 *                           photo:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           role:
 *                             type: string
 *                             enum:
 *                               - user
 *                               - admin
 *                             example: user
 *                           passwordResetToken:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           passwordResetExpires:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: null
 *                           passwordChangedAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: null
 *                           isSuspended:
 *                             type: boolean
 *                             example: false
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-03-07T00:36:19.842Z
 *                     message:
 *                       type: string
 *                       example: User logged in successfully
 *                   example:
 *                     status: success
 *                     data:
 *                       - id: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                         email: 1@1.com
 *                         username: Davheed
 *                         firstName: David
 *                         lastName: Okonkwo
 *                         photo: null
 *                         role: user
 *                         passwordResetToken: null
 *                         passwordResetExpires: null
 *                         passwordChangedAt: null
 *                         isSuspended: false
 *                         isDeleted: false
 *                         created_at: 2025-03-07T00:36:19.842Z
 *                     message: User logged in successfully
 *                   description: Response when sign-in is completed with valid OTP
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly, refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly
 *             description: Set only when OTP is valid and sign-in is completed
 *       401:
 *         description: Unauthorized - Various authentication failures
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Incomplete login data
 *                   enum:
 *                     - Incomplete login data
 *                     - login retries exceeded!
 *                     - Invalid credentials
 *                     - Your account is currently suspended
 *                     - Invalid or expired OTP
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.post('/sign-in', authController.signIn);
/**
 * @openapi
 * /auth/password/forgot:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset link to the user's email if the email exists in the system. The link is valid for 15 minutes.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 1@1.com
 *                 description: The email address of the user requesting a password reset
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Password reset link sent to 1@1.com
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Password reset link sent to 1@1.com
 *       400:
 *         description: Bad Request - Email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Email is required
 *       401:
 *         description: Unauthorized - Password reset retries exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Password reset retries exceeded! and account suspended
 *       404:
 *         description: Not Found - No user found with provided email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No user found with provided email
 */
router.post('/password/forgot', authController.forgotPassword);
/**
 * @openapi
 * /auth/password/reset:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using a valid reset token received via email. The new password must differ from the old one, and the token must be valid and not expired.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - confirmPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 description: The password reset token received via email from the forgot-password endpoint
 *               password:
 *                 type: string
 *                 example: newPassword123
 *                 description: The new password to set
 *               confirmPassword:
 *                 type: string
 *                 example: newPassword123
 *                 description: Confirmation of the new password (must match password)
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Password reset successfully
 *       400:
 *         description: Bad Request - Validation or processing errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *                   enum:
 *                     - All fields are required
 *                     - Passwords do not match
 *                     - Password reset token is invalid or has expired
 *                     - New password cannot be the same as the old password
 *                     - Password reset failed
 *       401:
 *         description: Unauthorized - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid token
 *       403:
 *         description: Forbidden - Missing fields or mismatch (alternative status)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *                   enum:
 *                     - All fields are required
 *                     - Passwords do not match
 */
router.post('/password/reset', authController.resetPassword);

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /auth/sign-out:
 *   post:
 *     summary: Sign out a user
 *     description: Logs out the authenticated user by clearing the access and refresh tokens from cookies. Requires authentication via a valid access token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Logout successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=expired; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT, refreshToken=expired; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *             description: Clears accessToken and refreshToken cookies by setting them to expired values
 *       401:
 *         description: Unauthorized - User is not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: You are not logged in
 */
router.get('/sign-out', authController.signOut);

export { router as authRouter };
