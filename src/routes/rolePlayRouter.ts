import { rolePlayController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /role-play/user:
 *   get:
 *     summary: Retrieve a user's role play by scenario ID
 *     description: Retrieves a specific role play for the authenticated user based on the scenario ID. Requires authentication via a valid access token and ownership of the role play (matching userId). The scenario ID is provided as a query parameter.
 *     tags:
 *       - Role Play
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: scenarioId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 142e5d91-ece7-4535-840a-71e368f13a75
 *         description: The ID of the scenario associated with the role play
 *     responses:
 *       200:
 *         description: User Role Play retrieved successfully
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
 *                         example: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                         description: The ID of the role play
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who performed the role play
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if associated)
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 142e5d91-ece7-4535-840a-71e368f13a75
 *                         description: The ID of the scenario
 *                       timeSpent:
 *                         type: string
 *                         example: 20mins:30secs
 *                         description: Formatted total time spent on the role play
 *                       isDone:
 *                         type: boolean
 *                         example: true
 *                         description: Indicates if the role play is completed
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the role play is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T11:53:37.035Z
 *                         description: The creation date of the role play
 *                 message:
 *                   type: string
 *                   example: User Role Play retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     scenarioId: 142e5d91-ece7-4535-840a-71e368f13a75
 *                     timeSpent: 20mins:30secs
 *                     isDone: true
 *                     isDeleted: false
 *                     created_at: 2025-03-17T11:53:37.035Z
 *                 message: User Role Play retrieved successfully
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
 *                   example: Scenario ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Scenario ID is required
 *       404:
 *         description: Not Found - Role play not found or deleted
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
 *                   example: Role Play not found or deleted
 *       409:
 *         description: Conflict - Unauthorized access to role play
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
 *                   example: You are not authorized to view this role play
 */
router.get('/user', rolePlayController.getUserRolePlay);
/**
 * @openapi
 * /role-play/user/all:
 *   get:
 *     summary: Retrieve all role plays for a specific user
 *     description: Retrieves all role plays associated with a given user ID. Requires authentication via a valid access token and admin privileges. The user ID is provided as a query parameter.
 *     tags:
 *       - Role Play
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *         description: The ID of the user whose role plays are to be retrieved
 *     responses:
 *       200:
 *         description: User Role Play retrieved successfully
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
 *                         example: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                         description: The ID of the role play
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who performed the role play
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if associated)
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 142e5d91-ece7-4535-840a-71e368f13a75
 *                         description: The ID of the scenario
 *                       timeSpent:
 *                         type: string
 *                         example: 20mins:30secs
 *                         description: Formatted total time spent on the role play
 *                       isDone:
 *                         type: boolean
 *                         example: true
 *                         description: Indicates if the role play is completed
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the role play is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T11:53:37.035Z
 *                         description: The creation date of the role play
 *                 message:
 *                   type: string
 *                   example: User Role Play retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 4d7d8379-95f6-47ff-b48a-6fd5ec413252
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                     timeSpent: 30secs
 *                     isDone: false
 *                     isDeleted: false
 *                     created_at: 2025-03-17T12:33:13.233Z
 *                   - id: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     scenarioId: 142e5d91-ece7-4535-840a-71e368f13a75
 *                     timeSpent: 20mins:30secs
 *                     isDone: true
 *                     isDeleted: false
 *                     created_at: 2025-03-17T11:53:37.035Z
 *                 message: User Role Play retrieved successfully
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
 *                   example: User ID is required
 *                   enum:
 *                     - Please log in again
 *                     - User ID is required
 *       403:
 *         description: Forbidden - Insufficient privileges
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
 *                   example: Only an admin can view a users role play
 *       404:
 *         description: Not Found - No role plays found for the user
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
 *                   example: Role Play not found
 */
router.get('/user/all', rolePlayController.getUserRolePlays);
/**
 * @openapi
 * /role-play/create:
 *   post:
 *     summary: Create or update a role play
 *     description: Creates a new role play entry or updates an existing one for a user and scenario, unless the existing role play is already completed. Requires authentication via a valid access token. If a role play exists and is not done, it updates the time spent and isDone status; otherwise, it creates a new entry.
 *     tags:
 *       - Role Play
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scenarioId:
 *                 type: string
 *                 format: uuid
 *                 example: 142e5d91-ece7-4535-840a-71e368f13a75
 *                 description: The ID of the scenario for the role play
 *               timeSpent:
 *                 type: string
 *                 example: "300"
 *                 description: Time spent in seconds (as a string), will be formatted (e.g., to "5mins")
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                 description: The ID of the course (optional)
 *               isDone:
 *                 type: boolean
 *                 example: false
 *                 description: Indicates if the role play is completed (optional)
 *             required:
 *               - scenarioId
 *               - timeSpent
 *     responses:
 *       201:
 *         description: Role Play created successfully
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
 *                         example: 27e05fd1-4d8f-4ea1-a82d-b5446aa300b6
 *                         description: The ID of the role play
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who performed the role play
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if provided)
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 142e5d91-ece7-4535-840a-71e368f13a75
 *                         description: The ID of the scenario
 *                       timeSpent:
 *                         type: string
 *                         example: 5mins
 *                         description: Formatted time spent on the role play
 *                       isDone:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the role play is completed
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the role play is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T11:52:25.250Z
 *                         description: The creation date of the role play
 *                 message:
 *                   type: string
 *                   example: Role Play created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 27e05fd1-4d8f-4ea1-a82d-b5446aa300b6
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     scenarioId: 142e5d91-ece7-4535-840a-71e368f13a75
 *                     timeSpent: 5mins
 *                     isDone: false
 *                     isDeleted: false
 *                     created_at: 2025-03-17T11:52:25.250Z
 *                 message: Role Play created successfully
 *       200:
 *         description: Role Play updated successfully
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
 *                         example: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                         description: The ID of the role play
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who performed the role play
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if provided)
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 142e5d91-ece7-4535-840a-71e368f13a75
 *                         description: The ID of the scenario
 *                       timeSpent:
 *                         type: string
 *                         example: 10mins
 *                         description: Formatted time spent on the role play
 *                       isDone:
 *                         type: boolean
 *                         example: true
 *                         description: Indicates if the role play is completed
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the role play is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T11:53:37.035Z
 *                         description: The creation date of the role play
 *                 message:
 *                   type: string
 *                   example: Role Play updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     scenarioId: 142e5d91-ece7-4535-840a-71e368f13a75
 *                     timeSpent: 10mins
 *                     isDone: true
 *                     isDeleted: false
 *                     created_at: 2025-03-17T11:53:37.035Z
 *                 message: Role Play updated successfully
 *       400:
 *         description: Bad Request - Validation errors or completed role play
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
 *                   example: Scenario and Timespent are required
 *                   enum:
 *                     - Please log in again
 *                     - Scenario and Timespent are required
 *                     - Time spent must be a positive number of seconds
 *                     - Invalid or deleted scenario ID
 *                     - You have already completed this role play
 */
router.post('/create', rolePlayController.createRolePlay);
/**
 * @openapi
 * /role-play/update:
 *   post:
 *     summary: Update an existing role play
 *     description: Updates an existing role play by ID. Requires authentication via a valid access token, ownership of the role play (matching userId), and the role play must not be completed or deleted. The role play ID, scenario ID, and time spent are required in the request body.
 *     tags:
 *       - Role Play
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rolePlayId:
 *                 type: string
 *                 format: uuid
 *                 example: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                 description: The ID of the role play to update
 *               scenarioId:
 *                 type: string
 *                 format: uuid
 *                 example: 142e5d91-ece7-4535-840a-71e368f13a75
 *                 description: The ID of the scenario for the role play
 *               timeSpent:
 *                 type: string
 *                 example: "300"
 *                 description: Time spent in seconds (as a string), will be added to existing time and formatted (e.g., to "20mins")
 *               isDone:
 *                 type: boolean
 *                 example: true
 *                 description: Indicates if the role play is completed (optional)
 *             required:
 *               - rolePlayId
 *               - scenarioId
 *               - timeSpent
 *     responses:
 *       200:
 *         description: Role Play updated successfully
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
 *                         example: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                         description: The ID of the role play
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who performed the role play
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if provided)
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 142e5d91-ece7-4535-840a-71e368f13a75
 *                         description: The ID of the scenario
 *                       timeSpent:
 *                         type: string
 *                         example: 20mins
 *                         description: Formatted total time spent on the role play
 *                       isDone:
 *                         type: boolean
 *                         example: true
 *                         description: Indicates if the role play is completed
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the role play is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T11:53:37.035Z
 *                         description: The creation date of the role play
 *                 message:
 *                   type: string
 *                   example: Role Play updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 94ac4a28-1b93-4515-8a92-4b98c434167a
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     scenarioId: 142e5d91-ece7-4535-840a-71e368f13a75
 *                     timeSpent: 20mins
 *                     isDone: true
 *                     isDeleted: false
 *                     created_at: 2025-03-17T11:53:37.035Z
 *                 message: Role Play updated successfully
 *       400:
 *         description: Bad Request - Validation errors or completed role play
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
 *                   example: Role Play ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Role Play ID is required
 *                     - Timespent is required
 *                     - Time spent must be a positive number of seconds
 *                     - Invalid or deleted scenario ID
 *                     - Role play has already been completed
 *       403:
 *         description: Forbidden - Authorization error
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
 *                   example: You are not authorized to update this role play
 *       404:
 *         description: Not Found - Role play not found or deleted
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
 *                   example: Role play not found or deleted
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
 *                   example: Failed to update role play
 */
router.post('/update', rolePlayController.updateRolePlay);

export { router as rolePlayRouter };
