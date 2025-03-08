import { multerUpload } from '@/common/config';
import { scenarioController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /scenario:
 *   get:
 *     summary: Get a scenario by ID
 *     description: Retrieves a specific scenario by its ID. Requires authentication via a valid access token and admin privileges. The scenario ID is provided as a query parameter.
 *     tags:
 *       - Scenario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: scenarioId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *         description: The ID of the scenario to retrieve
 *     responses:
 *       200:
 *         description: Scenario retrieved successfully
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
 *                         example: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *                       scenario:
 *                         type: string
 *                         example: Beginners
 *                       scenarioImage:
 *                         type: string
 *                         example: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394743259-GK5kZ7xXMAEltG9.png
 *                         description: Secure URL of the scenario image
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T00:45:45.940Z
 *                 message:
 *                   type: string
 *                   example: Scenario retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *                     scenario: Beginners
 *                     scenarioImage: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394743259-GK5kZ7xXMAEltG9.png
 *                     userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     isDeleted: false
 *                     created_at: 2025-03-08T00:45:45.940Z
 *                 message: Scenario retrieved successfully
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
 *                     - Scenario ID is required
 *       404:
 *         description: Not Found - Scenario not found
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
 *                   example: Scenario not found
 */
router.get('/', scenarioController.findOne);
/**
 * @openapi
 * /scenario/all:
 *   get:
 *     summary: Get all scenarios
 *     description: Retrieves a list of all scenarios in the system. Requires authentication via a valid access token and admin privileges.
 *     tags:
 *       - Scenario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scenarios retrieved successfully
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
 *                         example: 142e5d91-ece7-4535-840a-71e368f13a75
 *                       scenario:
 *                         type: string
 *                         example: Beginner
 *                       scenarioImage:
 *                         type: string
 *                         example: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394438611-GK5kZ7xXMAEltG9.png
 *                         description: Secure URL of the scenario image
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T00:40:41.877Z
 *                 message:
 *                   type: string
 *                   example: Scenarios retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 142e5d91-ece7-4535-840a-71e368f13a75
 *                     scenario: Beginner
 *                     scenarioImage: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394438611-GK5kZ7xXMAEltG9.png
 *                     userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     isDeleted: false
 *                     created_at: 2025-03-08T00:40:41.877Z
 *                   - id: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                     scenario: Intermediate
 *                     scenarioImage: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394510534-GK5kZ7xXMAEltG9.png
 *                     userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     isDeleted: false
 *                     created_at: 2025-03-08T00:41:51.565Z
 *                   - id: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                     scenario: Expert
 *                     scenarioImage: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394518994-GK5kZ7xXMAEltG9.png
 *                     userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     isDeleted: false
 *                     created_at: 2025-03-08T00:42:00.165Z
 *                 message: Scenarios retrieved successfully
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
 *         description: Not Found - No scenarios found
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
 *                   example: No scenarios found
 */
router.get('/all', scenarioController.getAllScenarios);
/**
 * @openapi
 * /scenario/create-scenario:
 *   post:
 *     summary: Create a new scenario
 *     description: Creates a new scenario with a name and an associated image. Requires authentication via a valid access token and admin privileges. The request includes a scenario name and an image file.
 *     tags:
 *       - Scenario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               scenario:
 *                 type: string
 *                 example: Beginners
 *                 description: The name or title of the scenario
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the scenario (e.g., PNG, JPG)
 *             required:
 *               - scenario
 *               - file
 *     responses:
 *       201:
 *         description: Scenario created successfully
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
 *                         example: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *                       scenario:
 *                         type: string
 *                         example: Beginners
 *                       scenarioImage:
 *                         type: string
 *                         example: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394743259-GK5kZ7xXMAEltG9.png
 *                         description: Secure URL of the uploaded scenario image
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T00:45:45.940Z
 *                 message:
 *                   type: string
 *                   example: Scenario created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *                     scenario: Beginners
 *                     scenarioImage: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394743259-GK5kZ7xXMAEltG9.png
 *                     userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     isDeleted: false
 *                     created_at: 2025-03-08T00:45:45.940Z
 *                 message: Scenario created successfully
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
 *                     - Scenario image is required
 *                     - Scenario is required
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
 *                   example: Only an admin can create a scenario
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
 *                   example: Failed to create scenario
 */
router.post('/create-scenario', multerUpload.single('scenarioImage'), scenarioController.createScenario);
/**
 * @openapi
 * /scenario/update-scenario:
 *   post:
 *     summary: Update a scenario
 *     description: Updates an existing scenario’s name and optionally its image. Requires authentication via a valid access token, admin privileges, and ownership of the scenario (matching userId). The scenario ID and new scenario name are required, while the image file is optional.
 *     tags:
 *       - Scenario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               scenarioId:
 *                 type: string
 *                 format: uuid
 *                 example: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *                 description: The ID of the scenario to update
 *               scenario:
 *                 type: string
 *                 example: Masters Edition
 *                 description: The updated name or title of the scenario
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The new image file for the scenario (e.g., PNG, JPG), optional
 *             required:
 *               - scenarioId
 *               - scenario
 *     responses:
 *       200:
 *         description: Scenario updated successfully
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
 *                         example: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *                       scenario:
 *                         type: string
 *                         example: Masters Edition
 *                       scenarioImage:
 *                         type: string
 *                         example: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741395784888-Screenshot 2024-04-25 201809.png
 *                         description: Secure URL of the scenario image
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-08T00:45:45.940Z
 *                 message:
 *                   type: string
 *                   example: Scenario updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *                     scenario: Masters Edition
 *                     scenarioImage: https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741395784888-Screenshot 2024-04-25 201809.png
 *                     userId: 1165f172-3db2-4eb9-939b-34a5e6efd6e6
 *                     isDeleted: false
 *                     created_at: 2025-03-08T00:45:45.940Z
 *                 message: Scenario updated successfully
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
 *                     - Scenario ID is required
 *                     - Scenario is required
 *                     - Scenario has already been deleted
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
 *                   example: Only an admin can update a scenario
 *                   enum:
 *                     - Only an admin can update a scenario
 *                     - You are not authorized to update this scenario
 *       404:
 *         description: Not Found - Scenario not found
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
 *                   example: Scenario not found
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
 *                   example: Failed to update scenario
 */
router.post('/update-scenario', multerUpload.single('scenarioImage'), scenarioController.updateScenario);
/**
 * @openapi
 * /scenario/delete-scenario:
 *   post:
 *     summary: Delete a scenario
 *     description: Soft deletes a scenario by setting its `isDeleted` flag to true. Requires authentication via a valid access token, admin privileges, and ownership of the scenario (matching userId). The scenario ID is provided in the request body.
 *     tags:
 *       - Scenario
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
 *                 example: 2ffbfeb8-3a9d-4f26-b518-f1b70db1b105
 *                 description: The ID of the scenario to delete
 *             required:
 *               - scenarioId
 *     responses:
 *       200:
 *         description: Scenario deleted successfully
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
 *                   example: Scenario deleted successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Scenario deleted successfully
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
 *                     - Scenario ID is required
 *                     - Scenario has already been deleted
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
 *                   example: Only an admin can delete a scenario
 *                   enum:
 *                     - Only an admin can delete a scenario
 *                     - You are not authorized to delete this scenario
 *       404:
 *         description: Not Found - Scenario not found
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
 *                   example: Scenario not found
 *       500:
 *         description: Internal Server Error - Deletion failed
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
 *                   example: Failed to delete scenario
 */
router.post('/delete-scenario', scenarioController.deleteScenario);

export { router as scenarioRouter };
