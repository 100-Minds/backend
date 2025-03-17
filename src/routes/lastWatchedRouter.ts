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
 *     summary: Create or update a last watched video entry
 *     description: Creates a new last watched video entry or updates an existing one for a user, course, and video. Requires authentication via a valid access token. If an entry exists for the video and course, it updates the duration and last watched timestamp; otherwise, it creates a new entry.
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
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                 description: The ID of the course
 *               videoId:
 *                 type: string
 *                 format: uuid
 *                 example: 3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d
 *                 description: The ID of the video
 *               duration:
 *                 type: string
 *                 example: "00.19"
 *                 description: The duration watched in the format MM.SS
 *             required:
 *               - courseId
 *               - videoId
 *               - duration
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
 *                         example: 80d84ed8-1419-4c60-9a84-5f14e8bd4c5f
 *                         description: The ID of the last watched entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                         description: The ID of the module associated with the course
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                         description: The ID of the chapter containing the video
 *                       videoId:
 *                         type: string
 *                         format: uuid
 *                         example: 3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d
 *                         description: The ID of the video
 *                       duration:
 *                         type: string
 *                         example: "00.19"
 *                         description: The duration watched in the format MM.SS
 *                       lastWatchedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T13:54:40.000Z
 *                         description: The timestamp of the last watched update
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T01:18:28.595Z
 *                         description: The creation date of the last watched entry
 *                 message:
 *                   type: string
 *                   example: Last watched video created successfully
 *                   enum:
 *                     - Last watched video created successfully
 *                     - Last watched video updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 80d84ed8-1419-4c60-9a84-5f14e8bd4c5f
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     moduleId: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                     videoId: 3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d
 *                     duration: "00.19"
 *                     lastWatchedAt: 2025-03-17T13:54:40.000Z
 *                     created_at: 2025-03-17T01:18:28.595Z
 *                 message: Last watched video created successfully
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
 *                   example: CourseId, videoId, duration and lastwatched are required
 *                   enum:
 *                     - Please log in again
 *                     - CourseId, videoId, duration and lastwatched are required
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
 *                   example: Course not found
 *                   enum:
 *                     - Course not found
 *                     - Video not found
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
 *                   example: Failed to create last watched
 */
router.post('/create', lastWatchedController.create);
/**
 * @openapi
 * /last-watched/user:
 *   get:
 *     summary: Retrieve a user's last watched video for a course
 *     description: Retrieves the last watched video entry for the authenticated user and a specific course. Requires authentication via a valid access token. The course ID is provided as a query parameter.
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
 *         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *         description: The ID of the course for which to retrieve the last watched video
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
 *                         example: 80d84ed8-1419-4c60-9a84-5f14e8bd4c5f
 *                         description: The ID of the last watched entry
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                         description: The ID of the module associated with the course
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                         description: The ID of the chapter containing the video
 *                       videoId:
 *                         type: string
 *                         format: uuid
 *                         example: 3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d
 *                         description: The ID of the video
 *                       duration:
 *                         type: string
 *                         example: "00.19"
 *                         description: The duration watched in the format MM.SS
 *                       lastWatchedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T13:54:40.000Z
 *                         description: The timestamp of the last watched update
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T01:18:28.595Z
 *                         description: The creation date of the last watched entry
 *                 message:
 *                   type: string
 *                   example: Last watched video retrieved successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 80d84ed8-1419-4c60-9a84-5f14e8bd4c5f
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     moduleId: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                     videoId: 3d6b1223-7c98-4c4e-8891-5c3ae13f2b7d
 *                     duration: "00.19"
 *                     lastWatchedAt: 2025-03-17T13:54:40.000Z
 *                     created_at: 2025-03-17T01:18:28.595Z
 *                 message: Last watched video retrieved successfully
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
 *                   example: CourseId is required
 *                   enum:
 *                     - Please log in again
 *                     - CourseId is required
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
 *                   example: Course not found
 *                   enum:
 *                     - Course not found
 *                     - Last watched video not found
 */
router.get('/user', lastWatchedController.getUserLastWatched);

export { router as lastWatchedRouter };
