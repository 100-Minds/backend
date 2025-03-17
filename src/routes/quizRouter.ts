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
 *     summary: Create a quiz entry
 *     description: Creates a new quiz entry for a user. Requires authentication via a valid access token. A score is required, and if courseId is provided, difficulty must also be included (and vice versa). Difficulty must be one of 'beginner', 'intermediate', or 'expert'.
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
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                 description: The ID of the course (optional, but required if difficulty is provided)
 *               difficulty:
 *                 type: string
 *                 example: beginner
 *                 enum:
 *                   - beginner
 *                   - intermediate
 *                   - expert
 *                 description: The difficulty level of the quiz (optional, but required if courseId is provided)
 *               score:
 *                 type: number
 *                 example: 70
 *                 description: The score achieved in the quiz
 *             required:
 *               - score
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
 *                         example: 062d8b49-6c16-4f47-bf85-612f31932916
 *                         description: The ID of the quiz entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who took the quiz
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if provided)
 *                       score:
 *                         type: number
 *                         example: 70
 *                         description: The score achieved in the quiz
 *                       difficulty:
 *                         type: string
 *                         example: beginner
 *                         enum:
 *                           - beginner
 *                           - intermediate
 *                           - expert
 *                         description: The difficulty level of the quiz (if provided)
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T14:12:52.872Z
 *                         description: The creation date of the quiz entry
 *                 message:
 *                   type: string
 *                   example: Quiz created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 062d8b49-6c16-4f47-bf85-612f31932916
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 70
 *                     difficulty: beginner
 *                     created_at: 2025-03-17T14:12:52.872Z
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
 *                   example: A Score is required for this quiz
 *                   enum:
 *                     - Please log in again
 *                     - A Score is required for this quiz
 *                     - Both courseId and difficulty must be provided together
 *                     - Invalid difficulty level. Must be beginner, intermediate, or expert
 *                     - Score must be a positive number
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
 * /quiz/user/score:
 *   get:
 *     summary: Retrieve a user's quiz by ID
 *     description: Retrieves a specific quiz entry for the authenticated user based on the quiz ID. Requires authentication via a valid access token. The quiz ID is provided as a query parameter.
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
 *         example: 062d8b49-6c16-4f47-bf85-612f31932916
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
 *                         example: 062d8b49-6c16-4f47-bf85-612f31932916
 *                         description: The ID of the quiz entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who took the quiz
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if associated)
 *                       score:
 *                         type: number
 *                         example: 70
 *                         description: The score achieved in the quiz
 *                       difficulty:
 *                         type: string
 *                         example: beginner
 *                         enum:
 *                           - beginner
 *                           - intermediate
 *                           - expert
 *                         description: The difficulty level of the quiz (if provided)
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T14:12:52.872Z
 *                         description: The creation date of the quiz entry
 *                 message:
 *                   type: string
 *                   example: Quiz retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 062d8b49-6c16-4f47-bf85-612f31932916
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 70
 *                     difficulty: beginner
 *                     created_at: 2025-03-17T14:12:52.872Z
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
router.get('/user/score', quizController.getUserQuizScoreById);
/**
 * @openapi
 * /quiz/course/scores:
 *   get:
 *     summary: Retrieve all quiz scores for a course
 *     description: Retrieves all quiz entries associated with a specific course ID. Requires authentication via a valid access token and admin privileges. The course ID is provided as a query parameter.
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *         description: The ID of the course for which to retrieve quiz scores
 *     responses:
 *       200:
 *         description: All User Course Quiz retrieved successfully
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
 *                         example: 062d8b49-6c16-4f47-bf85-612f31932916
 *                         description: The ID of the quiz entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who took the quiz
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       score:
 *                         type: number
 *                         example: 70
 *                         description: The score achieved in the quiz
 *                       difficulty:
 *                         type: string
 *                         example: beginner
 *                         enum:
 *                           - beginner
 *                           - intermediate
 *                           - expert
 *                         description: The difficulty level of the quiz
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T14:12:52.872Z
 *                         description: The creation date of the quiz entry
 *                 message:
 *                   type: string
 *                   example: All User Course Quiz retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 062d8b49-6c16-4f47-bf85-612f31932916
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 70
 *                     difficulty: beginner
 *                     created_at: 2025-03-17T14:12:52.872Z
 *                   - id: 63a2118e-38c9-41ad-8115-7706bd192eee
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 70
 *                     difficulty: intermediate
 *                     created_at: 2025-03-17T14:17:53.649Z
 *                   - id: 7f7150e6-4eb9-4510-bbad-9264af1d3e08
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 50
 *                     difficulty: expert
 *                     created_at: 2025-03-17T14:18:02.557Z
 *                 message: All User Course Quiz retrieved successfully
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
 *                   example: Only an admin can delete a team
 *       404:
 *         description: Not Found - No quizzes found for the course
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
router.get('/course/scores', quizController.findAllQuizScoreByCourseId);
/**
 * @openapi
 * /quiz/course/user/scores:
 *   get:
 *     summary: Retrieve all quiz scores for a course and user
 *     description: Retrieves all quiz entries for a specific course and user. Requires authentication via a valid access token and admin privileges. The course ID and user ID are provided as query parameters.
 *     tags:
 *       - Quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *         description: The ID of the course for which to retrieve quiz scores
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *         description: The ID of the user whose quiz scores are to be retrieved
 *     responses:
 *       200:
 *         description: All User Course Quiz retrieved successfully
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
 *                         example: 062d8b49-6c16-4f47-bf85-612f31932916
 *                         description: The ID of the quiz entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who took the quiz
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       score:
 *                         type: number
 *                         example: 70
 *                         description: The score achieved in the quiz
 *                       difficulty:
 *                         type: string
 *                         example: beginner
 *                         enum:
 *                           - beginner
 *                           - intermediate
 *                           - expert
 *                         description: The difficulty level of the quiz
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T14:12:52.872Z
 *                         description: The creation date of the quiz entry
 *                 message:
 *                   type: string
 *                   example: All User Course Quiz retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 062d8b49-6c16-4f47-bf85-612f31932916
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 70
 *                     difficulty: beginner
 *                     created_at: 2025-03-17T14:12:52.872Z
 *                   - id: 63a2118e-38c9-41ad-8115-7706bd192eee
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 70
 *                     difficulty: intermediate
 *                     created_at: 2025-03-17T14:17:53.649Z
 *                   - id: 7f7150e6-4eb9-4510-bbad-9264af1d3e08
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 50
 *                     difficulty: expert
 *                     created_at: 2025-03-17T14:18:02.557Z
 *                 message: All User Course Quiz retrieved successfully
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
 *                   example: Course ID and User ID are required
 *                   enum:
 *                     - Please log in again
 *                     - Course ID and User ID are required
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
 *                   example: Only an admin can view all quiz scores
 *       404:
 *         description: Not Found - No quizzes found for the course and user
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
router.get('/course/user/scores', quizController.findAllQuizScoreByCourseIdAndUserId);
/**
 * @openapi
 * /quiz/user/scores:
 *   get:
 *     summary: Retrieve all quiz scores for the authenticated user
 *     description: Retrieves all quiz entries associated with the authenticated user's ID. Requires authentication via a valid access token. The user ID provided as a query parameter must match the authenticated user's ID; otherwise, access is denied.
 *     tags:
 *       - Quiz
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
 *         description: The ID of the user whose quiz scores are to be retrieved (must match the authenticated user's ID)
 *     responses:
 *       200:
 *         description: All User Quiz retrieved successfully
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
 *                         example: 062d8b49-6c16-4f47-bf85-612f31932916
 *                         description: The ID of the quiz entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who took the quiz
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if associated)
 *                       score:
 *                         type: number
 *                         example: 70
 *                         description: The score achieved in the quiz
 *                       difficulty:
 *                         type: string
 *                         example: beginner
 *                         enum:
 *                           - beginner
 *                           - intermediate
 *                           - expert
 *                         description: The difficulty level of the quiz (if provided)
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T14:12:52.872Z
 *                         description: The creation date of the quiz entry
 *                 message:
 *                   type: string
 *                   example: All User Quiz retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 062d8b49-6c16-4f47-bf85-612f31932916
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 70
 *                     difficulty: beginner
 *                     created_at: 2025-03-17T14:12:52.872Z
 *                   - id: 63a2118e-38c9-41ad-8115-7706bd192eee
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 70
 *                     difficulty: intermediate
 *                     created_at: 2025-03-17T14:17:53.649Z
 *                   - id: 7f7150e6-4eb9-4510-bbad-9264af1d3e08
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 50
 *                     difficulty: expert
 *                     created_at: 2025-03-17T14:18:02.557Z
 *                 message: All User Quiz retrieved successfully
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
 *                   example: You are not authorized to view this users quiz scores
 *       404:
 *         description: Not Found - No quizzes found for the user
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
router.get('/user/scores', quizController.findAllQuizScoreByUserId);
/**
 * @openapi
 * /quiz/update:
 *   patch:
 *     summary: Update a quiz score
 *     description: Updates the score of an existing quiz entry by quiz ID. Requires authentication via a valid access token and admin privileges. The quiz ID and new score (a positive number) are provided in the request body.
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
 *                 example: 63a2118e-38c9-41ad-8115-7706bd192eee
 *                 description: The ID of the quiz to update
 *               score:
 *                 type: number
 *                 example: 61
 *                 description: The new score to set for the quiz (must be a positive number)
 *             required:
 *               - quizId
 *               - score
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
 *                         example: 63a2118e-38c9-41ad-8115-7706bd192eee
 *                         description: The ID of the quiz entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who took the quiz
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course (if associated)
 *                       score:
 *                         type: number
 *                         example: 61
 *                         description: The updated score of the quiz
 *                       difficulty:
 *                         type: string
 *                         example: intermediate
 *                         enum:
 *                           - beginner
 *                           - intermediate
 *                           - expert
 *                         description: The difficulty level of the quiz (if provided)
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T14:17:53.649Z
 *                         description: The creation date of the quiz entry
 *                 message:
 *                   type: string
 *                   example: Quiz updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 63a2118e-38c9-41ad-8115-7706bd192eee
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     score: 61
 *                     difficulty: intermediate
 *                     created_at: 2025-03-17T14:17:53.649Z
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
 *                     - Score must be a positive number
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
 *                   example: Only an admin can update quiz scores
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
router.post('/update', quizController.updateQuizScore);

export { router as quizRouter };
