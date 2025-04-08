import { multerUpload } from '@/common/config';
import { authController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();
/**
 * @openapi
 * /auth/sign-up:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user account with the provided details. For organization accounts, an organization name and logo are required. Returns the user data without setting access or refresh tokens as cookies.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - username
 *               - accountType
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: daviscarlos2404@gmail.com
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 example: password123
 *                 description: User's password
 *               firstName:
 *                 type: string
 *                 example: Daviiii
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 example: Daviii
 *                 description: User's last name
 *               username:
 *                 type: string
 *                 example: Daviiiii
 *                 description: User's username
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *                 description: User's role (optional, defaults to user)
 *               accountType:
 *                 type: string
 *                 enum: [personal, organization]
 *                 example: organization
 *                 description: Type of account (personal or organization)
 *               organizationName:
 *                 type: string
 *                 example: Vigoplace
 *                 description: Name of the organization (required if accountType is organization)
 *               organizationWebsite:
 *                 type: string
 *                 format: uri
 *                 example: null
 *                 description: Website URL of the organization (optional for organization accounts)
 *               organizationDescription:
 *                 type: string
 *                 example: null
 *                 description: Description of the organization (optional for organization accounts)
 *               organizationLogo:
 *                 type: string
 *                 format: binary
 *                 description: Logo file for the organization (required if accountType is organization)
 *             example:
 *               email: daviscarlos2404@gmail.com
 *               password: password123
 *               firstName: Daviiii
 *               lastName: Daviii
 *               username: Daviiiii
 *               role: user
 *               accountType: organization
 *               organizationName: Vigoplace
 *               organizationWebsite: null
 *               organizationDescription: null
 *               organizationLogo: (binary file)
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
 *                         example: 3464ef77-f2f8-4e76-b3c3-53f36aee368e
 *                         description: The ID of the newly created user
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: daviscarlos2404@gmail.com
 *                         description: User's email address
 *                       username:
 *                         type: string
 *                         example: Daviiiii
 *                         description: User's username
 *                       firstName:
 *                         type: string
 *                         example: Daviiii
 *                         description: User's first name
 *                       lastName:
 *                         type: string
 *                         example: Daviii
 *                         description: User's last name
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: User's profile photo URL (null if not provided)
 *                       role:
 *                         type: string
 *                         enum:
 *                           - user
 *                           - admin
 *                         example: user
 *                         description: User's role
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user is suspended
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the user is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-08T14:26:27.192Z
 *                         description: The creation date of the user
 *                       accountType:
 *                         type: string
 *                         enum: [personal, organization]
 *                         example: organization
 *                         description: Type of account (personal or organization)
 *                       organizationLogo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: URL of the organization's logo (null for personal accounts)
 *                       organizationName:
 *                         type: string
 *                         nullable: true
 *                         example: Vigoplace
 *                         description: Name of the organization (null for personal accounts)
 *                       organizationWebsite:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: Website URL of the organization (null if not provided and null for personal accounts)
 *                       organizationDescription:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: Description of the organization (null if not provided and null for personal accounts)
 *                       bio:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: User's bio (null)
 *                       careerGoals:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: User's career goals (null)
 *                       opportunities:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: User's opportunities (null)
 *                       strengths:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: User's strengths (null)
 *                       assessment:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: User's assessment (null)
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 3464ef77-f2f8-4e76-b3c3-53f36aee368e
 *                     email: daviscarlos2404@gmail.com
 *                     username: Daviiiii
 *                     firstName: Daviiii
 *                     lastName: Daviii
 *                     photo: null
 *                     role: user
 *                     isSuspended: false
 *                     isDeleted: false
 *                     created_at: 2025-04-08T14:26:27.192Z
 *                     accountType: organization
 *                     organizationLogo: null
 *                     organizationName: Vigoplace
 *                     organizationWebsite: null
 *                     organizationDescription: null
 *                     bio: null
 *                     careerGoals: null
 *                     opportunities: null
 *                     strengths: null
 *                     assessment: null
 *                 message: User created successfully
 *       400:
 *         description: Bad Request - Incomplete or invalid signup data
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
 *                   examples:
 *                     - Incomplete signup data
 *                     - Invalid account type
 *                     - Organization name and logo are required
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
 *                   examples:
 *                     - User with this email already exists
 *                     - User with this username already exists
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
router.post('/sign-up', multerUpload.single('organizationLogo'), authController.signUp);
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
 * /auth/admin/sign-in:
 *   post:
 *     summary: Sign in an admin user
 *     description: Authenticates an admin user with email and password. On the first request (without OTP), sends an OTP to the user's email. On the second request (with OTP), validates the OTP and completes sign-in, returning user data with access and refresh tokens as cookies.
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
 *                     - Unauthorized access
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
router.post('/admin/sign-in', authController.adminSignIn);
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
router.get('/health', authController.appHealth);

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /auth/sign-out:
 *   get:
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
