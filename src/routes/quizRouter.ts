import { quizController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /quiz/create:
 *   post:
 *     summary: Create a new quiz
 *     description: Creates a new quiz for a specific chapter. Requires authentication via a valid access token. Only admins can create quizzes. The request must include a question, chapterId, at least two options (optionA and optionB), and the correct answer (isCorrect) which must match one of the options.
 *     tags:
 *       - Quiz
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
 *                 example: Are you a boy?
 *                 description: The question for the quiz
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                 description: The ID of the chapter the quiz belongs to
 *               optionA:
 *                 type: string
 *                 example: Yes
 *                 description: First option for the quiz
 *               optionB:
 *                 type: string
 *                 example: No
 *                 description: Second option for the quiz
 *               optionC:
 *                 type: string
 *                 example: Maybe
 *                 description: Third option for the quiz (optional)
 *               optionD:
 *                 type: string
 *                 example: Other
 *                 description: Fourth option for the quiz (optional)
 *               isCorrect:
 *                 type: string
 *                 example: optionA
 *                 enum:
 *                   - optionA
 *                   - optionB
 *                   - optionC
 *                   - optionD
 *                 description: The key of the correct answer (must match one of the provided options)
 *             required:
 *               - question
 *               - chapterId
 *               - optionA
 *               - optionB
 *               - isCorrect
 *     responses:
 *       201:
 *         description: Quiz created successfully
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
 *                         example: df69938a-7242-4525-b125-e94fe36b235b
 *                         description: The ID of the created quiz
 *                       question:
 *                         type: string
 *                         example: Are you a boy?
 *                         description: The question for the quiz
 *                       optionA:
 *                         type: string
 *                         example: Yes
 *                         description: First option for the quiz
 *                       optionB:
 *                         type: string
 *                         example: No
 *                         description: Second option for the quiz
 *                       optionC:
 *                         type: string
 *                         example: Maybe
 *                         description: Third option for the quiz (if provided)
 *                       optionD:
 *                         type: string
 *                         example: Other
 *                         description: Fourth option for the quiz (if provided)
 *                       isCorrect:
 *                         type: string
 *                         example: optionA
 *                         enum:
 *                           - optionA
 *                           - optionB
 *                           - optionC
 *                           - optionD
 *                         description: The key of the correct answer
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                         description: The ID of the chapter the quiz belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-05T20:30:55.731Z
 *                         description: The creation date of the quiz
 *                 message:
 *                   type: string
 *                   example: Quiz created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: df69938a-7242-4525-b125-e94fe36b235b
 *                     question: Are you a boy?
 *                     optionA: Yes
 *                     optionB: No
 *                     optionC: Maybe
 *                     optionD: Other
 *                     isCorrect: optionA
 *                     chapterId: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                     created_at: 2025-04-05T20:30:55.731Z
 *                 message: Quiz created successfully
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
 *                     - Only an admin can create quiz
 *                     - Question is required
 *                     - Chapter ID is required
 *                     - Option A is required
 *                     - Option B is required
 *                     - Correct answer must match one of the provided options
 *                     - Quiz already exists for this chapter
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
 *                   example: Only an admin can create quiz
 *       404:
 *         description: Not Found - Chapter not found
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
 *                   example: Failed to create quiz
 */
router.post('/create', quizController.createQuiz);
/**
 * @openapi
 * /quiz/chapter:
 *   get:
 *     summary: Retrieve a quiz by chapter ID
 *     description: Retrieves a quiz associated with a specific chapter. Requires authentication via a valid access token. The chapterId must be provided as a query parameter.
 *     tags:
 *       - Quiz
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
 *         description: The ID of the chapter to retrieve the quiz for
 *     responses:
 *       200:
 *         description: Quiz retrieved successfully
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
 *                         example: df69938a-7242-4525-b125-e94fe36b235b
 *                         description: The ID of the quiz
 *                       question:
 *                         type: string
 *                         example: Are you a boy?
 *                         description: The question for the quiz
 *                       optionA:
 *                         type: string
 *                         example: Yes
 *                         description: First option for the quiz
 *                       optionB:
 *                         type: string
 *                         example: No
 *                         description: Second option for the quiz
 *                       optionC:
 *                         type: string
 *                         example: Maybe
 *                         description: Third option for the quiz (if provided)
 *                       optionD:
 *                         type: string
 *                         example: Other
 *                         description: Fourth option for the quiz (if provided)
 *                       isCorrect:
 *                         type: string
 *                         example: optionA
 *                         enum:
 *                           - optionA
 *                           - optionB
 *                           - optionC
 *                           - optionD
 *                         description: The key of the correct answer
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                         description: The ID of the chapter the quiz belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-05T20:30:55.731Z
 *                         description: The creation date of the quiz
 *                 message:
 *                   type: string
 *                   example: Chapters Quiz retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: df69938a-7242-4525-b125-e94fe36b235b
 *                     question: Are you a boy?
 *                     optionA: Yes
 *                     optionB: No
 *                     optionC: Maybe
 *                     optionD: Other
 *                     isCorrect: optionA
 *                     chapterId: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                     created_at: 2025-04-05T20:30:55.731Z
 *                 message: Chapters Quiz retrieved successfully
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
 *         description: Not Found - Quiz not found
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
router.get('/chapter', quizController.findQuizByChapterId);
/**
 * @openapi
 * /quiz/update:
 *   patch:
 *     summary: Update an existing quiz
 *     description: Updates a specific quiz identified by its ID. Requires authentication via a valid access token. Only admins can update quizzes. The request must include the quizId, and optionally, any of the fields like question, chapterId, options, or the correct answer (isCorrect). The correct answer must match one of the provided options.
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: df69938a-7242-4525-b125-e94fe36b235b
 *         description: The ID of the quiz to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: Are you a boy?
 *                 description: The updated question for the quiz (optional)
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: 4bf0434f-04ab-49ea-9654-5eb548dfd796
 *                 description: The updated ID of the chapter the quiz belongs to (optional)
 *               optionA:
 *                 type: string
 *                 example: Yes
 *                 description: Updated first option for the quiz (optional)
 *               optionB:
 *                 type: string
 *                 example: No
 *                 description: Updated second option for the quiz (optional)
 *               optionC:
 *                 type: string
 *                 example: Maybe
 *                 description: Updated third option for the quiz (optional)
 *               optionD:
 *                 type: string
 *                 example: Other
 *                 description: Updated fourth option for the quiz (optional)
 *               isCorrect:
 *                 type: string
 *                 example: optionA
 *                 enum:
 *                   - optionA
 *                   - optionB
 *                   - optionC
 *                   - optionD
 *                 description: The key of the updated correct answer (optional, must match one of the provided options)
 *             required:
 *               - quizId
 *     responses:
 *       200:
 *         description: Quiz updated successfully
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
 *                         example: df69938a-7242-4525-b125-e94fe36b235b
 *                         description: The ID of the updated quiz
 *                       question:
 *                         type: string
 *                         example: Are you a boy?
 *                         description: The question for the quiz
 *                       optionA:
 *                         type: string
 *                         example: Yes
 *                         description: First option for the quiz
 *                       optionB:
 *                         type: string
 *                         example: No
 *                         description: Second option for the quiz
 *                       optionC:
 *                         type: string
 *                         example: Maybe
 *                         description: Third option for the quiz (if provided)
 *                       optionD:
 *                         type: string
 *                         example: Other
 *                         description: Fourth option for the quiz (if provided)
 *                       isCorrect:
 *                         type: string
 *                         example: optionA
 *                         enum:
 *                           - optionA
 *                           - optionB
 *                           - optionC
 *                           - optionD
 *                         description: The key of the correct answer
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: 4bf0434f-04ab-49ea-9654-5eb548dfd796
 *                         description: The ID of the chapter the quiz belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-05T20:30:55.731Z
 *                         description: The creation date of the quiz
 *                 message:
 *                   type: string
 *                   example: Quiz updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: df69938a-7242-4525-b125-e94fe36b235b
 *                     question: Are you a boy?
 *                     optionA: Yes
 *                     optionB: No
 *                     optionC: Maybe
 *                     optionD: Other
 *                     isCorrect: optionA
 *                     chapterId: 4bf0434f-04ab-49ea-9654-5eb548dfd796
 *                     created_at: 2025-04-05T20:30:55.731Z
 *                 message: Quiz updated successfully
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
 *                   example: Quiz ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Quiz ID is required
 *                     - Correct answer must match one of the provided options
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
 *                   example: Only an admin can update a quiz
 *       404:
 *         description: Not Found - Quiz not found
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
 *                   example: Failed to update quiz
 */
router.post('/update', quizController.updateQuiz);

export { router as quizRouter };
