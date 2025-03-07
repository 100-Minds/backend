import { userController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import { multerUpload } from '@/common/config';
import express from 'express';

const router = express.Router();

router.use(protect);
/**
 * @openapi
 * /user:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile of the currently authenticated user. Requires authentication via a valid access token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: 1@1.com
 *                       username:
 *                         type: string
 *                         example: Davheed
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
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-07T00:36:19.842Z
 *                 message:
 *                   type: string
 *                   example: Profile retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     email: 1@1.com
 *                     username: Davheed
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     photo: null
 *                     role: user
 *                     isSuspended: false
 *                     isDeleted: false
 *                     created_at: 2025-03-07T00:36:19.842Z
 *                 message: Profile retrieved successfully
 *       400:
 *         description: Bad Request - User not authenticated
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
 *                   example: Please log in again
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
router.get('/', userController.getProfile);
/**
 * @openapi
 * /user/all:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users in the system. Requires authentication and admin privileges.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: 1@1.com
 *                       username:
 *                         type: string
 *                         example: Davheed
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
 *                         example: admin
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-07T00:36:19.842Z
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     email: 1@1.com
 *                     username: Davheed
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     photo: null
 *                     role: admin
 *                     isSuspended: false
 *                     isDeleted: false
 *                     created_at: 2025-03-07T00:36:19.842Z
 *                   - id: c8d01b9a-b21d-4313-836b-37e55e4eb159
 *                     email: 1@2.com
 *                     username: Davheed2
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     photo: null
 *                     role: user
 *                     isSuspended: false
 *                     isDeleted: false
 *                     created_at: 2025-03-07T00:37:33.807Z
 *                 message: Users retrieved successfully
 *       401:
 *         description: Unauthorized - User not logged in
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
 *                   example: Please log in again
 *       403:
 *         description: Forbidden - User is not an admin
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
 *                   example: Only admins can view all users
 *       404:
 *         description: Not Found - No users found
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
 *                   example: No users found
 */
router.get('/all', userController.getAllUsers);
/**
 * @openapi
 * /user/update-user:
 *   post:
 *     summary: Update user profile
 *     description: Updates the authenticated user's profile with any combination of allowed fields (firstName, lastName, email, username). Requires authentication via a valid access token. At least one field must be provided for the update to succeed.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: David
 *                 description: User's first name (optional)
 *               lastName:
 *                 type: string
 *                 example: Okonkwo
 *                 description: User's last name (optional)
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 1@1.com
 *                 description: User's email address (optional)
 *               username:
 *                 type: string
 *                 example: Davheed
 *                 description: User's username (optional)
 *             example:
 *               firstName: David
 *               lastName: Okonkwo
 *               email: 1@1.com
 *               username: Davheed
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: 1@1.com
 *                       username:
 *                         type: string
 *                         example: Davheed
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
 *                         example: admin
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-07T00:36:19.842Z
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     email: 1@1.com
 *                     username: Davheed
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     photo: null
 *                     role: user
 *                     isSuspended: false
 *                     isDeleted: false
 *                     created_at: 2025-03-07T00:36:19.842Z
 *                 message: Profile updated successfully
 *       400:
 *         description: Bad Request - Validation errors
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
 *                   example: Please log in again
 *                   enum:
 *                     - Please log in again
 *                     - Invalid update fields!
 *                     - No valid fields to update
 *       500:
 *         description: Internal Server Error - Update failed
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
 *                   example: Failed to update profile
 */
router.post('/update-user', userController.updateProfile);
/**
 * @openapi
 * /user/upload-profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     description: Uploads a profile picture for the authenticated user and updates their profile with the secure URL of the uploaded image. Requires authentication via a valid access token and a file upload.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload as the user's profile picture (e.g., PNG, JPG)
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: Profile updated successfully with new picture
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
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: 1@1.com
 *                       username:
 *                         type: string
 *                         example: Davheed
 *                       firstName:
 *                         type: string
 *                         example: David
 *                       lastName:
 *                         type: string
 *                         example: Okonkwo
 *                       photo:
 *                         type: string
 *                         example: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/profile-picture/1741314626015-code.png
 *                         description: Secure URL of the uploaded profile picture
 *                       role:
 *                         type: string
 *                         enum:
 *                           - user
 *                           - admin
 *                         example: admin
 *                       isSuspended:
 *                         type: boolean
 *                         example: false
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-07T00:36:19.842Z
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     email: 1@1.com
 *                     username: Davheed
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     photo: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/profile-picture/1741314626015-code.png
 *                     role: user
 *                     isSuspended: false
 *                     isDeleted: false
 *                     created_at: 2025-03-07T00:36:19.842Z
 *                 message: Profile picture updated successfully
 *       400:
 *         description: Bad Request - Validation errors
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
 *                   example: Please log in again
 *                   enum:
 *                     - Please log in again
 *                     - File is required
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
 *       500:
 *         description: Internal Server Error - Update failed
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
 *                   example: Failed to update profile picture
 */
router.post('/upload-profile-picture', multerUpload.single('photo'), userController.uploadProfilePicture);

export { router as userRouter };
