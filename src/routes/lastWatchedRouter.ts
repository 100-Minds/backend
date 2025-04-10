import { lastWatchedController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
/**
 * @openapi
 * /last-watched/create:
 *   post:
 *     summary: Create or update a user's last watched video record
 *     description: Allows a logged-in user to create a new last watched record for a video within a course or update an existing one. Requires authentication via a valid access token. The endpoint checks if the user is logged in, validates the required fields (courseId, videoId, duration, and isChapterCompleted), and ensures the course and video exist before creating or updating the record.
 *     tags:
 *       - Last Watched
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - videoId
 *               - duration
 *               - isChapterCompleted
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                 description: The unique identifier of the course
 *               videoId:
 *                 type: string
 *                 format: uuid
 *                 example: "3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d"
 *                 description: The unique identifier of the video
 *               duration:
 *                 type: string
 *                 example: "00.10"
 *                 description: The duration of the video watched (e.g., "00.10" for 10 seconds)
 *               isChapterCompleted:
 *                 type: boolean
 *                 example: false
 *                 description: Indicates whether the chapter associated with the video is completed
 *     responses:
 *       200:
 *         description: Last watched video created or updated successfully
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
 *                         example: "e0870195-33fc-41d6-a3bb-eea6f854c1df"
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: "20104f7d-a689-4c27-864a-db899e19068a"
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                       chapterNumber:
 *                         type: string
 *                         example: "1"
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: "ce807c4a-6d90-4a38-86c4-55e3cd5f53b8"
 *                       videoId:
 *                         type: string
 *                         format: uuid
 *                         example: "3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d"
 *                       duration:
 *                         type: string
 *                         example: "00.10"
 *                       isChapterCompleted:
 *                         type: boolean
 *                         example: false
 *                       lastWatchedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-10T16:37:26.540Z"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-10T16:37:26.543Z"
 *                 message:
 *                   type: string
 *                   example: "Last watched video created successfully"
 *               examples:
 *                 createSuccess:
 *                   value:
 *                     status: success
 *                     data:
 *                       - id: "e0870195-33fc-41d6-a3bb-eea6f854c1df"
 *                         userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                         moduleId: "20104f7d-a689-4c27-864a-db899e19068a"
 *                         courseId: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                         chapterNumber: "1"
 *                         chapterId: "ce807c4a-6d90-4a38-86c4-55e3cd5f53b8"
 *                         videoId: "3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d"
 *                         duration: "00.10"
 *                         isChapterCompleted: false
 *                         lastWatchedAt: "2025-04-10T16:37:26.540Z"
 *                         created_at: "2025-04-10T16:37:26.543Z"
 *                     message: "Last watched video created successfully"
 *                 updateSuccess:
 *                   value:
 *                     status: success
 *                     data:
 *                       - id: "e0870195-33fc-41d6-a3bb-eea6f854c1df"
 *                         userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                         moduleId: "20104f7d-a689-4c27-864a-db899e19068a"
 *                         courseId: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                         chapterNumber: "1"
 *                         chapterId: "ce807c4a-6d90-4a38-86c4-55e3cd5f53b8"
 *                         videoId: "3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d"
 *                         duration: "00.24"
 *                         isChapterCompleted: true
 *                         lastWatchedAt: "2025-04-10T16:37:33.513Z"
 *                         created_at: "2025-04-10T16:37:26.543Z"
 *                     message: "Last watched video updated successfully"
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
 *                   example: "CourseId, videoId, duration and isChapterCompleted are required"
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
 *                   example: "Please log in again"
 *       404:
 *         description: Not Found - Course or video not found
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
 *                   example: "Course not found"
 *                   enum:
 *                     - Course not found
 *                     - Video not found
 *       500:
 *         description: Internal Server Error - Failed to create or update last watched
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
 *                   example: "Failed to create last watched"
 */
router.post('/create', lastWatchedController.create);
/**
 * @openapi
 * /last-watched/user:
 *   get:
 *     summary: Get a user's last watched video for a course
 *     description: Retrieves the last watched video record for a logged-in user within a specific course. Requires authentication via a valid access token. The endpoint checks if the user is logged in, validates the course ID from the query parameters, and ensures the course exists before returning the last watched details.
 *     tags:
 *       - Last Watched
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *         description: The unique identifier of the course
 *     responses:
 *       200:
 *         description: Last watched video retrieved successfully
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
 *                         example: "c953b2e6-37ff-4416-9b26-3cb227967cd5"
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: "20104f7d-a689-4c27-864a-db899e19068a"
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                       chapterNumber:
 *                         type: number
 *                         example: 2
 *                         description: The number of the chapter within the course
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: "4bf0434f-04ab-49ea-9654-5eb548dfd796"
 *                       videoId:
 *                         type: string
 *                         format: uuid
 *                         example: "8e99d987-d8aa-4422-b25b-35eda67531f9"
 *                       duration:
 *                         type: string
 *                         example: "00.10"
 *                         description: The duration of the video watched (e.g., "00.10" for 10 seconds)
 *                       isChapterCompleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates whether the chapter associated with the video is completed
 *                       lastWatchedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-10T17:21:26.183Z"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-10T17:21:26.189Z"
 *                 message:
 *                   type: string
 *                   example: "Last watched video retrieved successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - id: "c953b2e6-37ff-4416-9b26-3cb227967cd5"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     moduleId: "20104f7d-a689-4c27-864a-db899e19068a"
 *                     courseId: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                     chapterNumber: 2
 *                     chapterId: "4bf0434f-04ab-49ea-9654-5eb548dfd796"
 *                     videoId: "8e99d987-d8aa-4422-b25b-35eda67531f9"
 *                     duration: "00.10"
 *                     isChapterCompleted: false
 *                     lastWatchedAt: "2025-04-10T17:21:26.183Z"
 *                     created_at: "2025-04-10T17:21:26.189Z"
 *                 message: "Last watched video retrieved successfully"
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
 *                   example: "CourseId is required"
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
 *                   example: "Please log in again"
 *       404:
 *         description: Not Found - Course or last watched video not found
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
 *                   example: "Course not found"
 *                   enum:
 *                     - Course not found
 *                     - Last watched video not found
 */
router.get('/user', lastWatchedController.getUserLastWatched);

export { router as lastWatchedRouter };
