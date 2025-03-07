import { userController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import { multerUpload } from '@/common/config';
import express from 'express';

const router = express.Router();

router.use(protect);
router.get('/', userController.getProfile);
/**
 * @openapi
 * /user/all:
 *   get:
 *     summary: Retrieve all users
 *     description: Returns a list of all users in the system. Requires admin privileges and Bearer token authentication via Authorization header or cookie.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
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
 *                         example: 991b4560-655a-4526-a99c-db5ca9c74dfc
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: 1@1.com
 *                       username:
 *                         type: string
 *                         example: Davheed
 *                       firstName:
 *                         type: string
 *                         example: Dave
 *                       lastName:
 *                         type: string
 *                         example: Okonkwo
 *                       photo:
 *                         type: string
 *                         nullable: true
 *                         example: https://31f803c9d1e856307b77a4ffb1fe91d9.r2.cloudflarestorage.com/100minds-backend-storage-2/profile-picture/1740961168221-ebook edit.png
 *                       role:
 *                         type: string
 *                         enum:
 *                           - user
 *                           - admin
 *                           - superuser
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
 *                         example: 2025-02-26T22:35:12.568Z
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *       401:
 *         description: Unauthorized 
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
router.post('/update-user', userController.updateProfile);
router.post('/upload-profile-picture', multerUpload.single('photo'), userController.uploadProfilePicture);

export { router as userRouter };
