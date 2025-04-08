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
 *     description: Updates the authenticated user's profile with any combination of allowed fields (firstName, lastName, email, username, bio, careerGoals, opportunities, strengths). Requires authentication via a valid access token. At least one valid field must be provided for the update to succeed.
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
 *               bio:
 *                 type: string
 *                 example: Software developer with 5 years of experience
 *                 description: User's bio or description (optional)
 *               careerGoals:
 *                 type: string
 *                 example: Become a senior developer
 *                 description: User's career goals (optional)
 *               opportunities:
 *                 type: string
 *                 example: Looking for remote work opportunities
 *                 description: User's opportunities or interests (optional)
 *               strengths:
 *                 type: string
 *                 example: Problem-solving, teamwork, coding
 *                 description: User's strengths or skills (optional)
 *             example:
 *               firstName: David
 *               lastName: Okonkwo
 *               email: 1@1.com
 *               username: Davheed
 *               bio: Software developer with 5 years of experience
 *               careerGoals: Become a senior developer
 *               opportunities: Looking for remote work opportunities
 *               strengths: Problem-solving, teamwork, coding
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
 *                       bio:
 *                         type: string
 *                         nullable: true
 *                         example: Software developer with 5 years of experience
 *                       careerGoals:
 *                         type: string
 *                         nullable: true
 *                         example: Become a senior developer
 *                       opportunities:
 *                         type: string
 *                         nullable: true
 *                         example: Looking for remote work opportunities
 *                       strengths:
 *                         type: string
 *                         nullable: true
 *                         example: Problem-solving, teamwork, coding
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
 *                     bio: Software developer with 5 years of experience
 *                     careerGoals: Become a senior developer
 *                     opportunities: Looking for remote work opportunities
 *                     strengths: Problem-solving, teamwork, coding
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
 *                   examples:
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
/**
 * @openapi
 * /user/suspend-user:
 *   post:
 *     summary: Suspend or unsuspend a user
 *     description: Suspends or unsuspends a user based on the provided user ID and suspend flag. Only accessible to admin users. Requires authentication via a valid access token.
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
 *             required:
 *               - userId
 *               - suspend
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                 description: The ID of the user to suspend or unsuspend
 *               suspend:
 *                 type: boolean
 *                 example: true
 *                 description: Set to true to suspend the user, false to unsuspend
 *             example:
 *               userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *               suspend: true
 *     responses:
 *       200:
 *         description: User suspension status updated successfully
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
 *                   example: User suspended successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: User suspended successfully
 *       401:
 *         description: Unauthorized - User not authenticated
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
 *         description: Forbidden - Insufficient permissions
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
 *                   example: Only admins can modify user data
 *       404:
 *         description: Not Found - User does not exist
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
 *         description: Internal Server Error - Suspension update failed
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
 *                   example: Failed to suspend user
 *                   enum:
 *                     - Failed to suspend user
 *                     - Failed to unsuspend user
 */
router.post('/suspend-user', userController.suspendUser);
/**
 * @openapi
 * /user/make-admin:
 *   post:
 *     summary: Promote or demote a user to/from admin role
 *     description: Changes a user's role to admin or back to regular user based on the provided user ID and makeAdmin flag. Only accessible to admin users. Requires authentication via a valid access token.
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
 *             required:
 *               - userId
 *               - makeAdmin
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                 description: The ID of the user to promote or demote
 *               makeAdmin:
 *                 type: boolean
 *                 example: true
 *                 description: Set to true to promote the user to admin, false to demote to regular user
 *             example:
 *               userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *               makeAdmin: true
 *     responses:
 *       200:
 *         description: User role updated successfully
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
 *                   example: User promoted successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: User promoted successfully
 *       401:
 *         description: Unauthorized - User not authenticated
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
 *         description: Forbidden - Insufficient permissions
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
 *                   example: Only admins can assign admin roles
 *       404:
 *         description: Not Found - User does not exist
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
 *         description: Internal Server Error - Role update failed
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
 *                   example: Failed to promote user
 *                   enum:
 *                     - Failed to promote user
 *                     - Failed to demote user
 */
router.post('/make-admin', userController.makeAdmin);
/**
 * @openapi
 * /user/update-assessment:
 *   post:
 *     summary: Update user assessment
 *     description: Updates the assessment for a specific user. Only admins can perform this action. Requires authentication via a valid access token and the user ID and assessment data in the request body.
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
 *             required:
 *               - userId
 *               - assessment
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: e2e38985-9cdd-402c-9b7d-c92443dd5fe2
 *                 description: The ID of the user whose assessment needs to be updated
 *               assessment:
 *                 type: string
 *                 example: https://readyourbook.com
 *                 description: The new assessment value (e.g., URL or text)
 *             example:
 *               userId: e2e38985-9cdd-402c-9b7d-c92443dd5fe2
 *               assessment: https://readyourbook.com
 *     responses:
 *       200:
 *         description: User assessment updated successfully
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
 *                         example: e2e38985-9cdd-402c-9b7d-c92443dd5fe2
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: davidcarlos2404@gmail.com
 *                       username:
 *                         type: string
 *                         example: Daviiiiiii
 *                       firstName:
 *                         type: string
 *                         example: Daviiii
 *                       lastName:
 *                         type: string
 *                         example: Daviii
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
 *                         example: 2025-04-07T23:46:51.970Z
 *                       accountType:
 *                         type: string
 *                         enum: [personal, organization]
 *                         example: organization
 *                       organizationLogo:
 *                         type: string
 *                         nullable: true
 *                         example: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/organization-logo/1744069612011-100minds.jpg
 *                       organizationName:
 *                         type: string
 *                         nullable: true
 *                         example: Vigoplace
 *                       organizationWebsite:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       organizationDescription:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       bio:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       careerGoals:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       opportunities:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       strengths:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       assessment:
 *                         type: string
 *                         example: https://readyourbook.com
 *                 message:
 *                   type: string
 *                   example: User assessment updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: e2e38985-9cdd-402c-9b7d-c92443dd5fe2
 *                     email: davidcarlos2404@gmail.com
 *                     username: Daviiiiiii
 *                     firstName: Daviiii
 *                     lastName: Daviii
 *                     photo: null
 *                     role: user
 *                     isSuspended: false
 *                     isDeleted: false
 *                     created_at: 2025-04-07T23:46:51.970Z
 *                     accountType: organization
 *                     organizationLogo: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/organization-logo/1744069612011-100minds.jpg
 *                     organizationName: Vigoplace
 *                     organizationWebsite: null
 *                     organizationDescription: null
 *                     bio: null
 *                     careerGoals: null
 *                     opportunities: null
 *                     strengths: null
 *                     assessment: https://readyourbook.com
 *                 message: User assessment updated successfully
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
 *                   examples:
 *                     - Please log in again
 *                     - User ID is required
 *                     - Assessment is required
 *       403:
 *         description: Forbidden - Only admins can update user assessment
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
 *                   example: Only admins can update user assessment
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
 *                   example: Failed to update user assessment
 */
router.post('/update-assessment', userController.updateUserAssessment);
/**
 * @openapi
 * /user/update-organization:
 *   post:
 *     summary: Update organizational account
 *     description: Updates the details of an organizational account. Only admins or users with an organizational account type can perform this action. Requires authentication via a valid access token. The request can include a new organization logo file and other organizational details.
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
 *               organizationName:
 *                 type: string
 *                 example: Vigoplacesssss
 *                 description: New name for the organization (optional)
 *               organizationWebsite:
 *                 type: string
 *                 format: uri
 *                 example: https://vigoplace.com
 *                 description: New website URL for the organization (optional)
 *               organizationDescription:
 *                 type: string
 *                 example: Fintech App
 *                 description: New description for the organization (optional)
 *               organizationLogo:
 *                 type: string
 *                 format: binary
 *                 description: New logo file for the organization (optional)
 *             example:
 *               organizationName: Vigoplacesssss
 *               organizationWebsite: https://vigoplace.com
 *               organizationDescription: Fintech App
 *               organizationLogo: (binary file)
 *     responses:
 *       200:
 *         description: Organization updated successfully
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
 *                         example: e2e38985-9cdd-402c-9b7d-c92443dd5fe2
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: davidcarlos2404@gmail.com
 *                       username:
 *                         type: string
 *                         example: Daviiiiiii
 *                       firstName:
 *                         type: string
 *                         example: Daviiii
 *                       lastName:
 *                         type: string
 *                         example: Daviii
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
 *                         example: 2025-04-07T23:46:51.970Z
 *                       accountType:
 *                         type: string
 *                         enum: [personal, organization]
 *                         example: organization
 *                       organizationLogo:
 *                         type: string
 *                         nullable: true
 *                         example: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/organization-logo/1744069612011-100minds.jpg
 *                       organizationName:
 *                         type: string
 *                         nullable: true
 *                         example: Vigoplacesssss
 *                       organizationWebsite:
 *                         type: string
 *                         nullable: true
 *                         example: https://vigoplace.com
 *                       organizationDescription:
 *                         type: string
 *                         nullable: true
 *                         example: Fintech App
 *                       bio:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       careerGoals:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       opportunities:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       strengths:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       assessment:
 *                         type: string
 *                         nullable: true
 *                         example: https://readyourbook.com
 *                 message:
 *                   type: string
 *                   example: Organization updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: e2e38985-9cdd-402c-9b7d-c92443dd5fe2
 *                     email: davidcarlos2404@gmail.com
 *                     username: Daviiiiiii
 *                     firstName: Daviiii
 *                     lastName: Daviii
 *                     photo: null
 *                     role: user
 *                     isSuspended: false
 *                     isDeleted: false
 *                     created_at: 2025-04-07T23:46:51.970Z
 *                     accountType: organization
 *                     organizationLogo: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/organization-logo/1744069612011-100minds.jpg
 *                     organizationName: Vigoplacesssss
 *                     organizationWebsite: https://vigoplace.com
 *                     organizationDescription: Fintech App
 *                     bio: null
 *                     careerGoals: null
 *                     opportunities: null
 *                     strengths: null
 *                     assessment: https://readyourbook.com
 *                 message: Organization updated successfully
 *       400:
 *         description: Bad Request - Authentication or input error
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
 *         description: Forbidden - Unauthorized access
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
 *                     - Only an admin can update an organizational account
 *                     - Only organizational accounts can update their account
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
 *                   example: Failed to update organization data
 */
router.post('/update-organization', multerUpload.single('organizationLogo'), userController.updateOrganizationalAccount);

export { router as userRouter };
