import { assessmentController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /assessment/create:
 *   post:
 *     summary: Create a new assessment
 *     description: Creates a new assessment for a specific course. Requires authentication via a valid access token. Only admins can create assessments. The request must include a question, courseId, at least two options (optionA and optionB), and the correct answers (isCorrect) as an array of option keys that must match the provided options.
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: Which of the following are front-end JavaScript frameworks?
 *                 description: The question for the assessment
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                 description: The ID of the course the assessment belongs to
 *               optionA:
 *                 type: string
 *                 example: React
 *                 description: First option for the assessment
 *               optionB:
 *                 type: string
 *                 example: Angular
 *                 description: Second option for the assessment
 *               optionC:
 *                 type: string
 *                 example: Vue
 *                 description: Third option for the assessment (optional)
 *               optionD:
 *                 type: string
 *                 example: Django
 *                 description: Fourth option for the assessment (optional)
 *               optionE:
 *                 type: string
 *                 example: Express
 *                 description: Fifth option for the assessment (optional)
 *               isCorrect:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - optionA
 *                     - optionB
 *                     - optionC
 *                     - optionD
 *                     - optionE
 *                 example: [optionA, optionB, optionC]
 *                 description: Array of keys of the correct answers (must match provided options)
 *             required:
 *               - question
 *               - courseId
 *               - optionA
 *               - optionB
 *               - isCorrect
 *     responses:
 *       201:
 *         description: Assessment created successfully
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
 *                         example: 2cc4470b-dec5-401b-9fc9-10a8ad6c2cae
 *                         description: The ID of the created assessment
 *                       question:
 *                         type: string
 *                         example: Which of the following are front-end JavaScript frameworks?
 *                         description: The question for the assessment
 *                       optionA:
 *                         type: string
 *                         example: React
 *                         description: First option for the assessment
 *                       optionB:
 *                         type: string
 *                         example: Angular
 *                         description: Second option for the assessment
 *                       optionC:
 *                         type: string
 *                         example: Vue
 *                         description: Third option for the assessment (if provided)
 *                       optionD:
 *                         type: string
 *                         example: Django
 *                         description: Fourth option for the assessment (if provided)
 *                       optionE:
 *                         type: string
 *                         example: Express
 *                         description: Fifth option for the assessment (if provided)
 *                       isCorrect:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum:
 *                             - optionA
 *                             - optionB
 *                             - optionC
 *                             - optionD
 *                             - optionE
 *                         example: [optionA, optionB, optionC]
 *                         description: Array of keys of the correct answers
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course the assessment belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-18T04:03:59.436Z
 *                         description: The creation date of the assessment
 *                 message:
 *                   type: string
 *                   example: Assessment created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 2cc4470b-dec5-401b-9fc9-10a8ad6c2cae
 *                     question: Which of the following are front-end JavaScript frameworks?
 *                     optionA: React
 *                     optionB: Angular
 *                     optionC: Vue
 *                     optionD: Django
 *                     optionE: Express
 *                     isCorrect: [optionA, optionB, optionC]
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     created_at: 2025-04-18T04:03:59.436Z
 *                 message: Assessment created successfully
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
 *                   example: Question is required
 *                   enum:
 *                     - Please log in again
 *                     - Only an admin can create assessments
 *                     - Question is required
 *                     - Course ID is required
 *                     - Option A is required
 *                     - Option B is required
 *                     - At least one correct answer is required
 *                     - Correct answers must match the provided options. Invalid options: optionX
 *                     - Question already exists
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
 *                   example: Only an admin can create assessments
 *       404:
 *         description: Not Found - Course not found
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
 *                   example: Course not found
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
 *                   example: Failed to create assessment
 */
router.post('/create', assessmentController.createAssessment);
/**
 * @openapi
 * /assessment/course:
 *   get:
 *     summary: Find assessments by course ID
 *     description: Retrieves all assessments associated with a specific course. Requires authentication via a valid access token. The course ID must be provided as a query parameter.
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *         description: The ID of the course to retrieve assessments for
 *     responses:
 *       200:
 *         description: Assessments retrieved successfully
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
 *                         example: e2828560-4689-4dd9-bcee-4c4983278da7
 *                         description: The ID of the assessment
 *                       question:
 *                         type: string
 *                         example: Assessment question
 *                         description: The question for the assessment
 *                       optionA:
 *                         type: string
 *                         example: Yes
 *                         description: First option for the assessment
 *                       optionB:
 *                         type: string
 *                         example: No
 *                         description: Second option for the assessment
 *                       optionC:
 *                         type: string
 *                         example: Maybe
 *                         description: Third option for the assessment (if provided)
 *                       optionD:
 *                         type: string
 *                         example: hsdvyb
 *                         description: Fourth option for the assessment (if provided)
 *                       isCorrect:
 *                         type: string
 *                         example: optionA
 *                         enum:
 *                           - optionA
 *                           - optionB
 *                           - optionC
 *                           - optionD
 *                         description: The key of the correct answer
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                         description: The ID of the course the assessment belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-13T21:49:38.321Z
 *                         description: The creation date of the assessment
 *                 message:
 *                   type: string
 *                   example: Course assessment retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: e2828560-4689-4dd9-bcee-4c4983278da7
 *                     question: Assessment question
 *                     optionA: Yes
 *                     optionB: No
 *                     optionC: Maybe
 *                     optionD: hsdvyb
 *                     isCorrect: optionA
 *                     courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                     created_at: 2025-04-13T21:49:38.321Z
 *                   - id: 8c73c071-5b18-4885-bd4c-5f5429969dea
 *                     question: Assessment question 2
 *                     optionA: Yes
 *                     optionB: No
 *                     optionC: Maybe
 *                     optionD: hsdvyb
 *                     isCorrect: optionA
 *                     courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                     created_at: 2025-04-13T21:52:13.399Z
 *                 message: Course assessment retrieved successfully
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
 *                   example: Course ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Course ID is required
 *       404:
 *         description: Not Found - No assessments found for the course
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
 *                   example: Assessment not found
 */
router.get('/course', assessmentController.findAssessmentByCourseId);
/**
 * @openapi
 * /assessment/get-assessment:
 *   get:
 *     summary: Find assessment by ID
 *     description: Retrieves a specific assessment by its ID. Requires authentication via a valid access token. The assessment ID must be provided as a query parameter.
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 1ca52156-d8e4-4a16-a714-612e9bab997b
 *         description: The ID of the assessment to retrieve
 *     responses:
 *       200:
 *         description: Assessment retrieved successfully
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
 *                         example: 1ca52156-d8e4-4a16-a714-612e9bab997b
 *                         description: The ID of the assessment
 *                       question:
 *                         type: string
 *                         example: Assessment question
 *                         description: The question for the assessment
 *                       optionA:
 *                         type: string
 *                         example: Yes nahh
 *                         description: First option for the assessment
 *                       optionB:
 *                         type: string
 *                         example: No nahh
 *                         description: Second option for the assessment
 *                       optionC:
 *                         type: string
 *                         example: Maybe not
 *                         description: Third option for the assessment (if provided)
 *                       optionD:
 *                         type: string
 *                         example: hsdvyb yes
 *                         description: Fourth option for the assessment (if provided)
 *                       isCorrect:
 *                         type: string
 *                         example: optionA
 *                         enum:
 *                           - optionA
 *                           - optionB
 *                           - optionC
 *                           - optionD
 *                         description: The key of the correct answer
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                         description: The ID of the course the assessment belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-13T22:21:34.030Z
 *                         description: The creation date of the assessment
 *                 message:
 *                   type: string
 *                   example: Assessment retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 1ca52156-d8e4-4a16-a714-612e9bab997b
 *                     question: Assessment question
 *                     optionA: Yes nahh
 *                     optionB: No nahh
 *                     optionC: Maybe not
 *                     optionD: hsdvyb yes
 *                     isCorrect: optionA
 *                     courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                     created_at: 2025-04-13T22:21:34.030Z
 *                 message: Assessment retrieved successfully
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
 *                   example: Assessment ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Assessment ID is required
 *       404:
 *         description: Not Found - Assessment not found
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
 *                   example: Assessment not found
 */
router.get('/get-assessment', assessmentController.findById);
/**
 * @openapi
 * /assessment/update:
 *   post:
 *     summary: Update an existing assessment
 *     description: Updates an existing assessment for a specific assessment ID. Requires authentication via a valid access token. Only admins can update assessments. The request must include the assessment ID, course ID, and optionally the question, options (optionA, optionB, optionC, optionD, optionE), and the correct answers (isCorrect) as an array of option keys that must match the provided options.
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 format: uuid
 *                 example: 2cc4470b-dec5-401b-9fc9-10a8ad6c2cae
 *                 description: The ID of the assessment to update
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                 description: The ID of the course the assessment belongs to
 *               question:
 *                 type: string
 *                 example: Which of the following are front-end JavaScript framework now?
 *                 description: The updated question for the assessment (optional)
 *               optionA:
 *                 type: string
 *                 example: React
 *                 description: Updated first option for the assessment (optional)
 *               optionB:
 *                 type: string
 *                 example: Angular
 *                 description: Updated second option for the assessment (optional)
 *               optionC:
 *                 type: string
 *                 example: Vuetttt
 *                 description: Updated third option for the assessment (optional)
 *               optionD:
 *                 type: string
 *                 example: Django
 *                 description: Updated fourth option for the assessment (optional)
 *               optionE:
 *                 type: string
 *                 example: Express
 *                 description: Updated fifth option for the assessment (optional)
 *               isCorrect:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - optionA
 *                     - optionB
 *                     - optionC
 *                     - optionD
 *                     - optionE
 *                 example: [optionA, optionB]
 *                 description: Array of keys of the updated correct answers (optional, must match provided options)
 *             required:
 *               - assessmentId
 *               - courseId
 *     responses:
 *       200:
 *         description: Assessment updated successfully
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
 *                         example: 2cc4470b-dec5-401b-9fc9-10a8ad6c2cae
 *                         description: The ID of the updated assessment
 *                       question:
 *                         type: string
 *                         example: Which of the following are front-end JavaScript framework now?
 *                         description: The question for the assessment
 *                       optionA:
 *                         type: string
 *                         example: React
 *                         description: First option for the assessment
 *                       optionB:
 *                         type: string
 *                         example: Angular
 *                         description: Second option for the assessment
 *                       optionC:
 *                         type: string
 *                         example: Vuetttt
 *                         description: Third option for the assessment (if provided)
 *                       optionD:
 *                         type: string
 *                         example: Django
 *                         description: Fourth option for the assessment (if provided)
 *                       optionE:
 *                         type: string
 *                         example: Express
 *                         description: Fifth option for the assessment (if provided)
 *                       isCorrect:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum:
 *                             - optionA
 *                             - optionB
 *                             - optionC
 *                             - optionD
 *                             - optionE
 *                         example: [optionA, optionB]
 *                         description: Array of keys of the correct answers
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course the assessment belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-18T04:03:59.436Z
 *                         description: The creation date of the assessment
 *                 message:
 *                   type: string
 *                   example: Assessment updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 2cc4470b-dec5-401b-9fc9-10a8ad6c2cae
 *                     question: Which of the following are front-end JavaScript framework now?
 *                     optionA: React
 *                     optionB: Angular
 *                     optionC: Vuetttt
 *                     optionD: Django
 *                     optionE: Express
 *                     isCorrect: [optionA, optionB]
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     created_at: 2025-04-18T04:03:59.436Z
 *                 message: Assessment updated successfully
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
 *                   example: Assessment ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Assessment ID is required
 *                     - Course ID is required
 *                     - No fields to update
 *                     - Question already exists
 *                     - Invalid correct answers provided
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
 *                   example: Only an admin can update an assessment
 *       404:
 *         description: Not Found - Assessment not found
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
 *                   example: Assessment not found
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
 *                   example: Failed to update assessment
 */
router.post('/update', assessmentController.updateAssessment);
/**
 * @openapi
 * /assessment/delete:
 *   post:
 *     summary: Delete an existing assessment
 *     description: Deletes an existing assessment for a specific assessment ID. Requires authentication via a valid access token. Only admins can delete assessments. The request must include the assessment ID in the request body.
 *     tags:
 *       - Assessment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 format: uuid
 *                 example: e2828560-4689-4dd9-bcee-4c4983278da7
 *                 description: The ID of the assessment to delete
 *             required:
 *               - assessmentId
 *     responses:
 *       200:
 *         description: Assessment deleted successfully
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
 *                   description: No data is returned upon successful deletion
 *                 message:
 *                   type: string
 *                   example: Assessment deleted successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Assessment deleted successfully
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
 *                   example: Assessment ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Assessment ID is required
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
 *                   example: Only an admin can delete an assessment
 *       404:
 *         description: Not Found - Assessment not found
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
 *                   example: Assessment not found
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
 *                   example: Failed to delete assessment
 */
router.post('/delete', assessmentController.deleteAssessment);

export { router as assessmentRouter };
