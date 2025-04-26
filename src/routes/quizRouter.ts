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
 *     description: Creates a new quiz for a specific chapter. Requires authentication via a valid access token. Only admins can create quizzes. The request must include a question, chapterId, courseId, at least two options (optionA and optionB), and the correct answers (isCorrect) as an array of option keys that must match the provided options.
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
 *                 example: Which of the following are front-end JavaScript frameworks?
 *                 description: The question for the quiz
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                 description: The ID of the course the chapter belongs to
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                 description: The ID of the chapter the quiz belongs to
 *               optionA:
 *                 type: string
 *                 example: React
 *                 description: First option for the quiz
 *               optionB:
 *                 type: string
 *                 example: Angular
 *                 description: Second option for the quiz
 *               optionC:
 *                 type: string
 *                 example: Vue
 *                 description: Third option for the quiz (optional)
 *               optionD:
 *                 type: string
 *                 example: Django
 *                 description: Fourth option for the quiz (optional)
 *               optionE:
 *                 type: string
 *                 example: Express
 *                 description: Fifth option for the quiz (optional)
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
 *                         example: fb042671-5311-4a11-be87-27056cbdf8bb
 *                         description: The ID of the created quiz
 *                       question:
 *                         type: string
 *                         example: Which of the following are front-end JavaScript frameworks?
 *                         description: The question for the quiz
 *                       optionA:
 *                         type: string
 *                         example: React
 *                         description: First option for the quiz
 *                       optionB:
 *                         type: string
 *                         example: Angular
 *                         description: Second option for the quiz
 *                       optionC:
 *                         type: string
 *                         example: Vue
 *                         description: Third option for the quiz (if provided)
 *                       optionD:
 *                         type: string
 *                         example: Django
 *                         description: Fourth option for the quiz (if provided)
 *                       optionE:
 *                         type: string
 *                         example: Express
 *                         description: Fifth option for the quiz (if provided)
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
 *                         description: The ID of the course the chapter belongs to
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                         description: The ID of the chapter the quiz belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-18T03:55:43.724Z
 *                         description: The creation date of the quiz
 *                 message:
 *                   type: string
 *                   example: Quiz created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: fb042671-5311-4a11-be87-27056cbdf8bb
 *                     question: Which of the following are front-end JavaScript frameworks?
 *                     optionA: React
 *                     optionB: Angular
 *                     optionC: Vue
 *                     optionD: Django
 *                     optionE: Express
 *                     isCorrect: [optionA, optionB, optionC]
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                     created_at: 2025-04-18T03:55:43.724Z
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
 *                     - Course ID is required
 *                     - Option A is required
 *                     - Option B is required
 *                     - At least one correct answer is required
 *                     - Correct answers must match the provided options. Invalid options: optionX
 *                     - Chapter does not belong to the specified course
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
 * /quiz/get-quiz:
 *   get:
 *     summary: Find quiz by ID
 *     description: Retrieves a specific quiz by its ID. Requires authentication via a valid access token. The quiz ID must be provided as a query parameter.
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 1998f048-4a44-4740-bdc8-c43ecd1e2e93
 *         description: The ID of the quiz to retrieve
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
 *                         example: 1998f048-4a44-4740-bdc8-c43ecd1e2e93
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
 *                         type: [string, null]
 *                         example: null
 *                         description: Third option for the quiz (optional, can be null)
 *                       optionD:
 *                         type: [string, null]
 *                         example: null
 *                         description: Fourth option for the quiz (optional, can be null)
 *                       isCorrect:
 *                         type: string
 *                         example: optionB
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
 *                         description: The ID of the course the quiz belongs to
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                         description: The ID of the chapter the quiz belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-06T10:51:34.306Z
 *                         description: The creation date of the quiz
 *                 message:
 *                   type: string
 *                   example: Quiz retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 1998f048-4a44-4740-bdc8-c43ecd1e2e93
 *                     question: Are you a boy?
 *                     optionA: Yes
 *                     optionB: No
 *                     optionC: null
 *                     optionD: null
 *                     isCorrect: optionB
 *                     courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                     chapterId: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                     created_at: 2025-04-06T10:51:34.306Z
 *                 message: Quiz retrieved successfully
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
router.get('/get-quiz', quizController.findById);
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
 *   post:
 *     summary: Update an existing quiz
 *     description: Updates a specific quiz identified by its ID. Requires authentication via a valid access token. Only admins can update quizzes. The request must include the quizId, and optionally, any of the fields like question, chapterId, options, or the correct answers (isCorrect) as an array of option keys. The correct answers must match the provided options.
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
 *               quizId:
 *                 type: string
 *                 format: uuid
 *                 example: fb042671-5311-4a11-be87-27056cbdf8bb
 *                 description: The ID of the quiz to update
 *               question:
 *                 type: string
 *                 example: Which of the following are front-end JavaScript framework?
 *                 description: The updated question for the quiz (optional)
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                 description: The updated ID of the chapter the quiz belongs to (optional)
 *               optionA:
 *                 type: string
 *                 example: React
 *                 description: Updated first option for the quiz (optional)
 *               optionB:
 *                 type: string
 *                 example: Angular
 *                 description: Updated second option for the quiz (optional)
 *               optionC:
 *                 type: string
 *                 example: Vue
 *                 description: Updated third option for the quiz (optional)
 *               optionD:
 *                 type: string
 *                 example: Django
 *                 description: Updated fourth option for the quiz (optional)
 *               optionE:
 *                 type: string
 *                 example: Express
 *                 description: Updated fifth option for the quiz (optional)
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
 *                         example: fb042671-5311-4a11-be87-27056cbdf8bb
 *                         description: The ID of the updated quiz
 *                       question:
 *                         type: string
 *                         example: Which of the following are front-end JavaScript framework?
 *                         description: The question for the quiz
 *                       optionA:
 *                         type: string
 *                         example: React
 *                         description: First option for the quiz
 *                       optionB:
 *                         type: string
 *                         example: Angular
 *                         description: Second option for the quiz
 *                       optionC:
 *                         type: string
 *                         example: Vue
 *                         description: Third option for the quiz (if provided)
 *                       optionD:
 *                         type: string
 *                         example: Django
 *                         description: Fourth option for the quiz (if provided)
 *                       optionE:
 *                         type: string
 *                         example: Express
 *                         description: Fifth option for the quiz (if provided)
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
 *                         description: The ID of the course the quiz belongs to
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                         description: The ID of the chapter the quiz belongs to
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-18T03:55:43.724Z
 *                         description: The creation date of the quiz
 *                 message:
 *                   type: string
 *                   example: Quiz updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: fb042671-5311-4a11-be87-27056cbdf8bb
 *                     question: Which of the following are front-end JavaScript framework?
 *                     optionA: React
 *                     optionB: Angular
 *                     optionC: Vue
 *                     optionD: Django
 *                     optionE: Express
 *                     isCorrect: [optionA, optionB]
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                     created_at: 2025-04-18T03:55:43.724Z
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
/**
 * @openapi
 * /quiz/delete:
 *   post:
 *     summary: Delete a quiz permanently
 *     description: Permanently deletes a specific quiz identified by its ID. Requires authentication via a valid access token. Only admins can delete quizzes. The quizId must be provided in the request body.
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
 *               quizId:
 *                 type: string
 *                 format: uuid
 *                 example: df69938a-7242-4525-b125-e94fe36b235b
 *                 description: The ID of the quiz to delete
 *             required:
 *               - quizId
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
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
 *                   nullable: true
 *                   description: No data returned on successful deletion
 *                 message:
 *                   type: string
 *                   example: Quiz deleted successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Quiz deleted successfully
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
 *                   example: Only an admin can delete a quiz
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
 *                   example: Failed to delete quiz
 */
router.post('/delete', quizController.deleteQuiz);

export { router as quizRouter };
