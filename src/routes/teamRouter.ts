import { teamController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
//Team endpoints
/**
 * @openapi
 * /team:
 *   get:
 *     summary: Get a team by ID
 *     description: Retrieves a specific team by its ID. Requires authentication via a valid access token and admin privileges, as only admins can own teams. The team ID is provided as a query parameter.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *         description: The ID of the team to retrieve
 *     responses:
 *       200:
 *         description: User team successfully fetched
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
 *                         example: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                       name:
 *                         type: string
 *                         example: Team A
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T01:18:34.291Z
 *                 message:
 *                   type: string
 *                   example: User team successfully fetched
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                     name: Team A
 *                     isDeleted: false
 *                     created_at: 2025-03-08T01:18:34.291Z
 *                 message: User team successfully fetched
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
 *                     - Team ID is required
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
 *                   example: Only an admin can own a team
 *       404:
 *         description: Not Found - Team not found
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
 *                   example: Team not found
 */
router.get('/', teamController.getTeam);
/**
 * @openapi
 * /team/user-teams:
 *   get:
 *     summary: Get teams owned by the admin user
 *     description: Retrieves a list of teams owned by the authenticated user. Requires authentication via a valid access token and admin privileges, as only admins can own teams.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User teams successfully fetched
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
 *                         example: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                       name:
 *                         type: string
 *                         example: Team A
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T01:18:34.291Z
 *                 message:
 *                   type: string
 *                   example: User teams successfully fetched
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                     name: Team A
 *                     isDeleted: false
 *                     created_at: 2025-03-08T01:18:34.291Z
 *                   - id: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *                     name: Team B
 *                     isDeleted: false
 *                     created_at: 2025-03-08T01:19:00.251Z
 *                 message: User teams successfully fetched
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
 *                   example: Only an admin can own a team
 */
router.get('/user-teams', teamController.getUserTeams);
/**
 * @openapi
 * /team/create-team:
 *   post:
 *     summary: Create a new team
 *     description: Creates a new team with a unique name and assigns the authenticated user as the owner. Requires authentication via a valid access token and admin privileges.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Team A
 *                 description: The name of the team to create (must be unique for the owner)
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Team created successfully
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
 *                         example: 5c9eb36c-e3b4-4056-a6b8-0f6c353d6fd9
 *                       name:
 *                         type: string
 *                         example: Team A
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T01:19:10.690Z
 *                 message:
 *                   type: string
 *                   example: Team created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 5c9eb36c-e3b4-4056-a6b8-0f6c353d6fd9
 *                     name: Team A
 *                     isDeleted: false
 *                     created_at: 2025-03-08T01:19:10.690Z
 *                 message: Team created successfully
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
 *                     - Team name is required
 *                     - Team name exist already
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
 *                   example: Only an admin can create a team
 *       500:
 *         description: Internal Server Error - Creation failed
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
 *                   example: Failed to create team
 */
router.post('/create-team', teamController.createTeam);
/**
 * @openapi
 * /team/update-team:
 *   post:
 *     summary: Update a team
 *     description: Updates the name of an existing team. Requires authentication via a valid access token, admin privileges, and ownership of the team (matching ownerId). Both team ID and new name are required.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: string
 *                 format: uuid
 *                 example: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                 description: The ID of the team to update
 *               name:
 *                 type: string
 *                 example: Team AA
 *                 description: The new name for the team
 *             required:
 *               - teamId
 *               - name
 *     responses:
 *       200:
 *         description: Team updated successfully
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
 *                         example: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                       name:
 *                         type: string
 *                         example: Team AA
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T01:18:34.291Z
 *                 message:
 *                   type: string
 *                   example: Team updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                     name: Team AA
 *                     isDeleted: false
 *                     created_at: 2025-03-08T01:18:34.291Z
 *                 message: Team updated successfully
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
 *                     - Incomplete update data
 *                     - Team has already been deleted
 *       403:
 *         description: Forbidden - Authorization errors
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
 *                   example: Only an admin can delete a team
 *                   enum:
 *                     - Only an admin can delete a team
 *                     - You are not authorized to update this team name
 *       404:
 *         description: Not Found - Team not found
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
 *                   example: Team not found
 */
router.post('/delete-team', teamController.updateTeam);
/**
 * @openapi
 * /team/delete-team:
 *   post:
 *     summary: Delete a team
 *     description: Deletes a team by its ID. Requires authentication via a valid access token, admin privileges, and ownership of the team (matching ownerId). The team ID is provided in the request body.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: string
 *                 format: uuid
 *                 example: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                 description: The ID of the team to delete
 *             required:
 *               - teamId
 *     responses:
 *       200:
 *         description: Team deleted successfully
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
 *                   example: Team deleted successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Team deleted successfully
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
 *                     - Team ID is required
 *                     - Team has already been deleted
 *       403:
 *         description: Forbidden - Authorization errors
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
 *                   example: Only an admin can delete a team
 *                   enum:
 *                     - Only an admin can delete a team
 *                     - You are not authorized to delete this team
 *       404:
 *         description: Not Found - Team not found
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
 *                   example: Team not found
 */
router.post('/delete-team', teamController.deleteTeam);

//Team members endpoints
/**
 * @openapi
 * /team/team-members:
 *   get:
 *     summary: Get team members
 *     description: Retrieves a list of members for a specified team. Requires authentication via a valid access token and authorization as either the team owner or an admin. The team ID is provided as a query parameter.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *         description: The ID of the team whose members are to be retrieved
 *     responses:
 *       200:
 *         description: User team members successfully fetched
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
 *                         example: 72601c9f-1934-43c8-b938-583c3e9bb2ed
 *                         description: The ID of the team member record
 *                       teamId:
 *                         type: string
 *                         format: uuid
 *                         example: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *                         description: The ID of the team
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                         description: The ID of the user
 *                       memberType:
 *                         type: string
 *                         enum: [owner, regular]
 *                         example: owner
 *                         description: The type of membership (owner or regular)
 *                       statusRequest:
 *                         type: string
 *                         enum: [pending, accepted]
 *                         example: accepted
 *                         description: The status of the membership request
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the membership is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T01:19:00.253Z
 *                         description: The creation date of the membership
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: 1@1.com
 *                         description: The member's email address
 *                       firstName:
 *                         type: string
 *                         example: David
 *                         description: The member's first name
 *                       lastName:
 *                         type: string
 *                         example: Okonkwo
 *                         description: The member's last name
 *                       username:
 *                         type: string
 *                         example: Davheed
 *                         description: The member's username
 *                 message:
 *                   type: string
 *                   example: User team members successfully fetched
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 72601c9f-1934-43c8-b938-583c3e9bb2ed
 *                     teamId: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *                     userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     memberType: owner
 *                     statusRequest: accepted
 *                     isDeleted: false
 *                     created_at: 2025-03-08T01:19:00.253Z
 *                     email: 1@1.com
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     username: Davheed
 *                   - id: c6ff5ec1-979a-485e-acaf-6d67724647cc
 *                     teamId: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *                     userId: 3d055ecc-d986-4a3c-9e0a-bbdef084fe0b
 *                     memberType: regular
 *                     statusRequest: pending
 *                     isDeleted: false
 *                     created_at: 2025-03-08T01:51:08.453Z
 *                     email: 1@5.com
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     username: Davheed5
 *                   - id: f67a95b3-10a1-47ca-9ff7-9e27dd85749b
 *                     teamId: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *                     userId: c8d01b9a-b21d-4313-836b-37e55e4eb159
 *                     memberType: regular
 *                     statusRequest: accepted
 *                     isDeleted: false
 *                     created_at: 2025-03-08T02:07:00.626Z
 *                     email: 1@2.com
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     username: Davheed2
 *                   - id: 7efe1f49-8285-417f-be95-405b0f1633e9
 *                     teamId: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *                     userId: db222b7c-f2b0-4a47-b70f-dd22aa5a8d7f
 *                     memberType: regular
 *                     statusRequest: accepted
 *                     isDeleted: false
 *                     created_at: 2025-03-08T02:07:13.037Z
 *                     email: 1@3.com
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     username: Davheed3
 *                   - id: 4bed67e7-0b95-45fb-874e-e6de5f4f1dff
 *                     teamId: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *                     userId: 2cc41c7c-2cb1-4de1-a52c-04f2ae5a57dc
 *                     memberType: regular
 *                     statusRequest: accepted
 *                     isDeleted: false
 *                     created_at: 2025-03-08T02:07:18.860Z
 *                     email: 1@4.com
 *                     firstName: David
 *                     lastName: Okonkwo
 *                     username: Davheed4
 *                 message: User team members successfully fetched
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
 *                     - Team ID is required
 *       403:
 *         description: Forbidden - User not authorized
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
 *                   example: You are not authorized to view this team’s members
 *       404:
 *         description: Not Found - Team not found or deleted
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
 *                   example: Team not found or deleted
 */
router.get('/team-members', teamController.getTeamMembers);
/**
 * @openapi
 * /team/join-team:
 *   get:
 *     summary: Join a team using an invite link
 *     description: Allows a user to join a team by providing a valid invite link as a query parameter. Requires authentication via a valid access token. The invite link must be unused, unexpired, associated with an existing team, and intended for the authenticated user (matching inviteeId).
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: inviteLink
 *         required: true
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImZjMTJjMDg0ZjkwNWM1ZDE2NmUzNzM1OTkwYzRkYWRkYjcwYjA0OTliMWFjYjZiYjBhNjM1ZmM4YmEwNDc5MDciLCJpYXQiOjE3MTAyMDM1MDUsImV4cCI6MTcxMDgwODMwNX0._eI8eQ1g7y8j8Y5e8eQ1g7y8j8Y5e8eQ1g7y8j8Y5e8e
 *         description: The invite link token provided to join the team
 *     responses:
 *       200:
 *         description: Successfully joined the team
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
 *                   example: You have successfully joined the team
 *               example:
 *                 status: success
 *                 data: null
 *                 message: You have successfully joined the team
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
 *                     - Invite link is required
 *                     - Invite link has already been used
 *                     - Invite link has expired
 *                     - You are already a member of this team
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
 *                   example: Invalid token link
 *       403:
 *         description: Forbidden - User not authorized for this invite
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
 *                   example: You are not authorized to join this team
 *       404:
 *         description: Not Found - Invite or team issues
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
 *                   example: Invalid or expired invite link
 *                   enum:
 *                     - Invalid or expired invite link
 *                     - Team not found or deleted
 *                     - Team member not found
 */
router.get('/join-team', teamController.joinTeam);
/**
 * @openapi
 * /team/remove-member:
 *   post:
 *     summary: Remove a team member
 *     description: Soft-deletes a team member by setting their `isDeleted` flag to true. Requires authentication via a valid access token, admin privileges, and ownership of the team (matching ownerId). The team ID and member ID (userId) are provided in the request body.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: string
 *                 format: uuid
 *                 example: 0beb9a74-3481-4f3e-9407-0b98fd9caf2c
 *                 description: The ID of the team from which to remove the member
 *               memberId:
 *                 type: string
 *                 format: uuid
 *                 example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                 description: The ID of the user (member) to remove from the team
 *             required:
 *               - teamId
 *               - memberId
 *     responses:
 *       200:
 *         description: Team member removed successfully
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
 *                   example: Team member removed successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Team member removed successfully
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
 *                     - Team ID and Member ID are required
 *       403:
 *         description: Forbidden - Authorization errors
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
 *                   example: Only an admin can remove team members
 *                   enum:
 *                     - Only an admin can remove team members
 *                     - Only the team owner can remove members
 *       404:
 *         description: Not Found - Team or member issues
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
 *                   example: Team not found or deleted
 *                   enum:
 *                     - Team not found or deleted
 *                     - Member not found or already removed
 */
router.post('/remove-member', teamController.removeTeamMember);

//Team invites endpoints
/**
 * @openapi
 * /team/invite-member:
 *   post:
 *     summary: Create a team invite
 *     description: Creates an invite link for a user to join a team. Requires authentication via a valid access token, admin privileges, and ownership of the team. The invite link is valid for 7 days and is associated with the specified email.
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: string
 *                 format: uuid
 *                 example: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                 description: The ID of the team to invite the user to
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 1@2.com
 *                 description: The email address of the user to invite
 *             required:
 *               - teamId
 *               - email
 *     responses:
 *       201:
 *         description: Invite link created and sent
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
 *                         example: c0ac989b-66af-4f73-a125-aa395763688e
 *                       teamId:
 *                         type: string
 *                         format: uuid
 *                         example: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                       inviterId:
 *                         type: string
 *                         format: uuid
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       inviteeId:
 *                         type: string
 *                         format: uuid
 *                         example: 1165f172-3db2-4eb9-939b-6567cdfy899d
 *                       inviteLink:
 *                         type: string
 *                         example: fc12c084f905c5d166e3735990c4daddb70b0499b1acb6bb0a635fc8ba047907
 *                         description: The unique invite link token
 *                       inviteLinkExpires:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-15T01:45:05.445Z
 *                         description: The expiration date of the invite link (7 days from creation)
 *                       linkIsUsed:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the invite link has been used
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T01:45:05.450Z
 *                 message:
 *                   type: string
 *                   example: Invite link sent to 1@2.com
 *               example:
 *                 status: success
 *                 data:
 *                   - id: c0ac989b-66af-4f73-a125-aa395763688e
 *                     teamId: 113c65f1-d7cb-4fc2-817b-d0d5bc7ff8ee
 *                     inviterId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     inviteeId: 1165f172-3db2-4eb9-939b-6567cdfy899d
 *                     inviteLink: fc12c084f905c5d166e3735990c4daddb70b0499b1acb6bb0a635fc8ba047907
 *                     inviteLinkExpires: 2025-03-15T01:45:05.445Z
 *                     linkIsUsed: false
 *                     created_at: 2025-03-08T01:45:05.450Z
 *                 message: Invite link sent to 1@2.com
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
 *                     - Team ID and email are required
 *                     - Cannot invite to a deleted team
 *                     - You cannot invite yourself to the team
 *       403:
 *         description: Forbidden - Authorization errors
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
 *                   example: Only an admin can invite to a team
 *                   enum:
 *                     - Only an admin can invite to a team
 *                     - You are not authorized to invite to this team
 *       404:
 *         description: Not Found - Team or invitee not found
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
 *                   example: Team not found
 *                   enum:
 *                     - Team not found
 *                     - Invitee not found
 */
router.post('/invite-member', teamController.createInvite);

export { router as teamRouter };
