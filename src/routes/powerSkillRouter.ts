import { multerUpload } from '@/common/config';
import { powerSkillController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /skill:
 *   get:
 *     summary: Retrieve a power skill by ID
 *     description: Retrieves a specific power skill by its ID. Requires authentication via a valid access token. The skill ID is provided as a query parameter.
 *     tags:
 *       - Power Skills
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 4293468b-1da2-4e56-9c19-d83020ccb371
 *         description: The ID of the power skill to retrieve
 *     responses:
 *       200:
 *         description: Power skill retrieved successfully
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
 *                         example: 4293468b-1da2-4e56-9c19-d83020ccb371
 *                         description: The ID of the power skill
 *                       powerskill:
 *                         type: string
 *                         example: Critical Thinking
 *                         description: The name of the power skill
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the power skill
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the power skill is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-12T23:52:21.910Z
 *                         description: The creation date of the power skill
 *                 message:
 *                   type: string
 *                   example: Power skill retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 4293468b-1da2-4e56-9c19-d83020ccb371
 *                     powerskill: Critical Thinking
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:52:21.910Z
 *                 message: Power skill retrieved successfully
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
 *                   example: Power skill ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Power skill ID is required
 *       404:
 *         description: Not Found - Power skill not found or deleted
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
 *                   example: Power skill not found
 *                   enum:
 *                     - Power skill not found
 *                     - Power skill is deleted
 */
router.get('/', powerSkillController.findOne);
/**
 * @openapi
 * /skill/all:
 *   get:
 *     summary: Retrieve all power skills
 *     description: Retrieves a list of all power skills. Requires authentication via a valid access token.
 *     tags:
 *       - Power Skills
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Power skills retrieved successfully
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
 *                         example: 4293468b-1da2-4e56-9c19-d83020ccb371
 *                         description: The ID of the power skill
 *                       powerskill:
 *                         type: string
 *                         example: Critical Thinking
 *                         description: The name of the power skill
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the power skill
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the power skill is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-12T23:52:21.910Z
 *                         description: The creation date of the power skill
 *                 message:
 *                   type: string
 *                   example: Power skills retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 9f83a70a-77d4-40ba-b008-050fa8fa32b9
 *                     powerskill: Self Awareness
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:28:57.983Z
 *                   - id: 06c351cb-c71a-4c28-86e9-4325a0698829
 *                     powerskill: Resilience
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:29:18.875Z
 *                   - id: 2f4bdaa0-1e8d-47c4-b812-a32b567f999e
 *                     powerskill: Adaptability
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:29:29.409Z
 *                   - id: 0820806c-0028-49c5-8c8f-744b1b9d5db6
 *                     powerskill: Curiosity
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:29:37.792Z
 *                   - id: 0137c123-17b6-45f6-b081-429c9c731cec
 *                     powerskill: Empathy
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:29:46.945Z
 *                   - id: 4293468b-1da2-4e56-9c19-d83020ccb371
 *                     powerskill: Critical Thinking
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:52:21.910Z
 *                 message: Power skills retrieved successfully
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
 *       404:
 *         description: Not Found - No power skills available
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
 *                   example: No power skills found
 */
router.get('/all', powerSkillController.getAllPowerSkills);
/**
 * @openapi
 * /skill/create-skill:
 *   post:
 *     summary: Create a new power skill
 *     description: Creates a new power skill. Requires authentication via a valid access token and admin privileges. The skill name is provided in the request body.
 *     tags:
 *       - Power Skills
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skill:
 *                 type: string
 *                 example: Critical Thinking
 *                 description: The name of the power skill to create
 *             required:
 *               - skill
 *     responses:
 *       201:
 *         description: Power skill created successfully
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
 *                         example: 4293468b-1da2-4e56-9c19-d83020ccb371
 *                         description: The ID of the created power skill
 *                       powerskill:
 *                         type: string
 *                         example: Critical Thinking
 *                         description: The name of the power skill
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the power skill
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the power skill is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-12T23:52:21.910Z
 *                         description: The creation date of the power skill
 *                 message:
 *                   type: string
 *                   example: Power skill created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 4293468b-1da2-4e56-9c19-d83020ccb371
 *                     powerskill: Critical Thinking
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:52:21.910Z
 *                 message: Power skill created successfully
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
 *                   example: Skill is required
 *                   enum:
 *                     - Please log in again
 *                     - Skill is required
 *                     - Power skill already exists
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
 *                   example: Only an admin can create a power skill
 *                   enum:
 *                     - Only an admin can create a power skill
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
 *                   example: Failed to create power skill
 */
router.post('/create-skill', multerUpload.single('skillImage'), powerSkillController.createPowerSkill);
/**
 * @openapi
 * /skill/update-skill:
 *   post:
 *     summary: Update a power skill
 *     description: Updates an existing power skill. Requires authentication via a valid access token, admin privileges, and ownership of the power skill (matching userId). The power skill ID and new skill value are provided in the request body.
 *     tags:
 *       - Power Skills
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skillId:
 *                 type: string
 *                 format: uuid
 *                 example: 87c3f34d-4c5f-4e5d-b80c-1de3130a14b3
 *                 description: The ID of the power skill to update
 *               skill:
 *                 type: string
 *                 example: Critical Thinkings
 *                 description: The new value for the power skill
 *             required:
 *               - skillId
 *               - skill
 *     responses:
 *       200:
 *         description: Power skill updated successfully
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
 *                         example: 87c3f34d-4c5f-4e5d-b80c-1de3130a14b3
 *                         description: The ID of the power skill
 *                       powerskill:
 *                         type: string
 *                         example: Critical Thinkings
 *                         description: The updated power skill value
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who owns the power skill
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the power skill is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-12T23:29:57.559Z
 *                         description: The creation date of the power skill
 *                 message:
 *                   type: string
 *                   example: Power skill updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 87c3f34d-4c5f-4e5d-b80c-1de3130a14b3
 *                     powerskill: Critical Thinkings
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-12T23:29:57.559Z
 *                 message: Power skill updated successfully
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
 *                     - Power skill ID is required
 *                     - Skill is required
 *                     - Power skill has already been deleted
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
 *                   example: Only an admin can update a power skill
 *                   enum:
 *                     - Only an admin can update a power skill
 *                     - You are not authorized to update this power skill
 *       404:
 *         description: Not Found - Power skill not found
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
 *                   example: Power skill not found
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
 *                   example: Failed to update power skill
 */
router.post('/update-skill', multerUpload.single('skillImage'), powerSkillController.updatePowerSkill);
/**
 * @openapi
 * /skill/delete-skill:
 *   post:
 *     summary: Delete a power skill
 *     description: Soft-deletes a power skill by setting its `isDeleted` flag to true. Requires authentication via a valid access token, admin privileges, and ownership of the power skill (matching userId). The power skill ID is provided in the request body.
 *     tags:
 *       - Power Skills
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skillId:
 *                 type: string
 *                 format: uuid
 *                 example: 87c3f34d-4c5f-4e5d-b80c-1de3130a14b3
 *                 description: The ID of the power skill to delete
 *             required:
 *               - skillId
 *     responses:
 *       200:
 *         description: Power skill deleted successfully
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
 *                   example: Power skill deleted successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Power skill deleted successfully
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
 *                     - Power skill ID is required
 *                     - Power skill has already been deleted
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
 *                   example: Only an admin can delete a power skill
 *                   enum:
 *                     - Only an admin can delete a power skill
 *                     - You are not authorized to delete this power skill
 *       404:
 *         description: Not Found - Power skill not found
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
 *                   example: Power skill not found
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
 *                   example: Failed to delete power skill
 */
router.post('/delete-skill', powerSkillController.deletePowerSkill);

export { router as powerSkillRouter };
