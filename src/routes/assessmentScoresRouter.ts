import { assessmentScoresController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /assessment-score/create:
 *   post:
 *     summary: Submit answers for a course assessment
 *     description: Allows a user to submit answers for assessments associated with a specific course. Requires authentication via a valid access token. The request must include the course ID and an array of answers, each linking an assessment ID to a selected option. The user's score is calculated and stored.
 *     tags:
 *       - Assessment Score
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                 description: The ID of the course for which the assessment is being submitted
 *               assessmentAnswers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     assessmentId:
 *                       type: string
 *                       format: uuid
 *                       example: 8c73c071-5b18-4885-bd4c-5f5429969dea
 *                       description: The ID of the assessment being answered
 *                     selectedOption:
 *                       type: string
 *                       example: optionA
 *                       enum:
 *                         - optionA
 *                         - optionB
 *                         - optionC
 *                         - optionD
 *                       description: The user's selected answer for the assessment
 *                 minItems: 1
 *                 description: Array of answers, each mapping an assessment ID to a selected option
 *             required:
 *               - courseId
 *               - assessmentAnswers
 *     responses:
 *       200:
 *         description: Assessment submitted successfully
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
 *                         example: b78bdd09-cbcf-44c5-9f4c-33ae462f0e81
 *                         description: The ID of the submitted assessment score record
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who submitted the assessment
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                         description: The ID of the course the assessment belongs to
 *                       assessmentId:
 *                         type: null
 *                         description: No specific assessment ID is associated with the score (set to null)
 *                       score:
 *                         type: integer
 *                         example: 50
 *                         description: The calculated percentage score (0-100)
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-13T22:23:36.633Z
 *                         description: The creation date of the score record
 *                 message:
 *                   type: string
 *                   example: Assessment submitted successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: b78bdd09-cbcf-44c5-9f4c-33ae462f0e81
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                     assessmentId: null
 *                     score: 50
 *                     created_at: 2025-04-13T22:23:36.633Z
 *                 message: Assessment submitted successfully
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
 *                   example: Course ID and answers are required
 *                   enum:
 *                     - Please log in again
 *                     - Course ID and answers are required
 *                     - You have already attempted this course assessment
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
 *       404:
 *         description: Not Found - Course or assessments not found
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
 *                   enum:
 *                     - Course not found
 *                     - No assessment found for this course
 */
router.post('/create', assessmentScoresController.submitCourseAssessment);
/**
 * @openapi
 * /assessment-score/course/user:
 *   get:
 *     summary: Find user's assessment score by course ID
 *     description: Retrieves the assessment score for a specific user and course. Requires authentication via a valid access token. The course ID must be provided as a query parameter.
 *     tags:
 *       - Assessment Score
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
 *         description: The ID of the course to retrieve the assessment score for
 *     responses:
 *       200:
 *         description: User assessment score retrieved successfully
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
 *                         example: b78bdd09-cbcf-44c5-9f4c-33ae462f0e81
 *                         description: The ID of the assessment score record
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who took the assessment
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                         description: The ID of the course the assessment belongs to
 *                       assessmentId:
 *                         type: null
 *                         description: No specific assessment ID is associated with the score (set to null)
 *                       score:
 *                         type: integer
 *                         example: 50
 *                         description: The calculated percentage score (0-100)
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-13T22:23:36.633Z
 *                         description: The creation date of the score record
 *                 message:
 *                   type: string
 *                   example: User Assessment score retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: b78bdd09-cbcf-44c5-9f4c-33ae462f0e81
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                     assessmentId: null
 *                     score: 50
 *                     created_at: 2025-04-13T22:23:36.633Z
 *                 message: User Assessment score retrieved successfully
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
 *         description: Not Found - Assessment score not found
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
 *                   example: Assessment Score not found
 */
router.get('/course/user', assessmentScoresController.findUserAssessmentScoreByCourseId);
/**
 * @openapi
 * /assessment-score/average-score:
 *   get:
 *     summary: Find average assessment score by course ID
 *     description: Retrieves the average assessment score for a specific course for the authenticated user. Requires authentication via a valid access token. The course ID must be provided as a query parameter.
 *     tags:
 *       - Assessment Score
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
 *         description: The ID of the course to retrieve the average assessment score for
 *     responses:
 *       200:
 *         description: Average course score retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     averageScore:
 *                       type: integer
 *                       example: 50
 *                       description: The calculated average percentage score (0-100) for all assessments in the course
 *                 message:
 *                   type: string
 *                   example: Average course score retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   averageScore: 50
 *                 message: Average course score retrieved successfully
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
 *                   example: Course ID are required
 *                   enum:
 *                     - Please log in again
 *                     - Course ID are required
 *       404:
 *         description: Not Found - No assessment scores found
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
 *                   example: No assessment scores found for this course
 */
router.get('/average-score', assessmentScoresController.findAverageScoreByCourseId);

export { router as assessmentScoresRouter };
