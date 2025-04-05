import { quizScoresController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /quiz-score/create:
 *   post:
 *     summary: Submit answers for a chapter quiz
 *     description: Submits user answers for a quiz associated with a specific chapter and course. Requires authentication via a valid access token. The request must include chapterId, courseId, and an array of answers, each specifying a quizId and selected option. Users can only submit once per chapter quiz.
 *     tags:
 *       - Quiz Score
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                 description: The ID of the chapter the quiz belongs to
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                 description: The ID of the course the chapter belongs to
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quizId:
 *                       type: string
 *                       format: uuid
 *                       example: 4baaea2f-e9e3-44da-a272-91a191035837
 *                       description: The ID of the specific quiz question
 *                     selectedOption:
 *                       type: string
 *                       example: optionB
 *                       enum:
 *                         - optionA
 *                         - optionB
 *                         - optionC
 *                         - optionD
 *                       description: The user's selected answer option
 *                 minItems: 1
 *                 description: Array of user answers for each quiz question in the chapter
 *             required:
 *               - chapterId
 *               - courseId
 *               - answers
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
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
 *                         example: 6c3d3cc0-2c12-4c8b-b2eb-9322b73b0db7
 *                         description: The ID of the submitted quiz score
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who submitted the quiz
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                         description: The ID of the chapter the quiz belongs to
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                         description: The ID of the course the chapter belongs to
 *                       quizId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The ID of the quiz (can be null if aggregating multiple quiz questions)
 *                       score:
 *                         type: number
 *                         example: 50
 *                         description: The calculated average score (percentage) for the quiz
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-05T22:42:24.879Z
 *                         description: The creation date of the quiz submission
 *                 message:
 *                   type: string
 *                   example: Quiz submitted successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 6c3d3cc0-2c12-4c8b-b2eb-9322b73b0db7
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     chapterId: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                     courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                     quizId: null
 *                     score: 50
 *                     created_at: 2025-04-05T22:42:24.879Z
 *                 message: Quiz submitted successfully
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
 *                   example: Chapter ID, Course ID and answers are required
 *                   enum:
 *                     - Please log in again
 *                     - Chapter ID, Course ID and answers are required
 *                     - Chapter does not belong to the specified course
 *                     - You have already attempted this chapter quiz
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
 *         description: Not Found - Chapter or quiz not found
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
 *                   example: Chapter not found
 *                   enum:
 *                     - Chapter not found
 *                     - No quiz found for this chapter
 */
router.post('/create', quizScoresController.submitChapterQuiz);
/**
 * @openapi
 * /quiz-score/chapter/user/score:
 *   get:
 *     summary: Retrieve a user's quiz score by chapter ID
 *     description: Retrieves the quiz score for a specific user and chapter. Requires authentication via a valid access token. The chapterId must be provided as a query parameter.
 *     tags:
 *       - Quiz Score
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *         description: The ID of the chapter to retrieve the quiz score for
 *     responses:
 *       200:
 *         description: User quiz score retrieved successfully
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
 *                         example: 6c3d3cc0-2c12-4c8b-b2eb-9322b73b0db7
 *                         description: The ID of the quiz score entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who took the quiz
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                         description: The ID of the chapter the quiz belongs to
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                         description: The ID of the course the chapter belongs to
 *                       quizId:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                         description: The ID of the quiz (can be null if aggregating multiple quiz questions)
 *                       score:
 *                         type: number
 *                         example: 50
 *                         description: The score achieved in the quiz (percentage)
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-05T22:42:24.879Z
 *                         description: The creation date of the quiz score
 *                 message:
 *                   type: string
 *                   example: User Quiz score retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 6c3d3cc0-2c12-4c8b-b2eb-9322b73b0db7
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     chapterId: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                     courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                     quizId: null
 *                     score: 50
 *                     created_at: 2025-04-05T22:42:24.879Z
 *                 message: User Quiz score retrieved successfully
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
 *                   example: Chapter ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Chapter ID is required
 *       404:
 *         description: Not Found - Quiz score not found
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
 *                   example: Quiz not found
 */
router.get('/chapter/user/score', quizScoresController.findUserQuizScoreByChapterId);
/**
 * @openapi
 * /quiz-score/course/user/average:
 *   get:
 *     summary: Retrieve the average quiz score for a course
 *     description: Retrieves the average quiz score for a specific user across all quizzes in a given course. Requires authentication via a valid access token. The courseId must be provided as a query parameter.
 *     tags:
 *       - Quiz Score
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *         description: The ID of the course to calculate the average score for
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
 *                       type: number
 *                       example: 50
 *                       description: The rounded average score (percentage) across all quizzes in the course
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
 *         description: Not Found - No quiz scores found
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
 *                   example: No quiz scores found for this course
 */
router.get('/course/user/average', quizScoresController.findAverageScoreByCourseId);

export { router as quizScoresRouter };
