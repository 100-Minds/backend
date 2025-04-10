import { favouritesController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

router.use(protect);
/**
 * @openapi
 * /favourites/create:
 *   post:
 *     summary: Create a new favourite chapter
 *     description: Allows a user to mark a chapter as a favourite for a specific course. Requires authentication via a valid access token. The endpoint checks if the user is logged in, validates the chapter and course IDs, and ensures the chapter belongs to the specified course before creating the favourite.
 *     tags:
 *       - Favourites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chapterId
 *               - courseId
 *             properties:
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: "0088909d-5a6a-4931-acd7-6af3084b7ade"
 *                 description: The unique identifier of the chapter to favourite
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                 description: The unique identifier of the course the chapter belongs to
 *     responses:
 *       200:
 *         description: Chapter favourited successfully
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
 *                         example: "42142849-4510-44f9-a9d0-5d7e843a59c3"
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: "0088909d-5a6a-4931-acd7-6af3084b7ade"
 *                       isDeleted:
 *                         type: string
 *                         example: "false"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-10T15:51:46.602Z"
 *                 message:
 *                   type: string
 *                   example: "Chapter favourited successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - id: "42142849-4510-44f9-a9d0-5d7e843a59c3"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     courseId: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                     chapterId: "0088909d-5a6a-4931-acd7-6af3084b7ade"
 *                     isDeleted: "false"
 *                     created_at: "2025-04-10T15:51:46.602Z"
 *                 message: "Chapter favourited successfully"
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
 *                   example: "Chapter ID, Course ID are required"
 *                   enum:
 *                     - Chapter ID, Course ID are required
 *                     - Chapter does not belong to the specified course
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
 *                   example: "Chapter not found"
 *       500:
 *         description: Internal Server Error - Failed to favourite chapter
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
 *                   example: "Failed to favourite chapter this chapter"
 */
router.post('/create', favouritesController.createFavourite);
/**
 * @openapi
 * /favourites/user:
 *   get:
 *     summary: Get a user's favourite chapter
 *     description: Retrieves a specific favourite entry for a chapter and course by a logged-in user. Requires authentication via a valid access token. The endpoint checks if the user is logged in, validates the chapter and course IDs from the query parameters, and ensures the chapter exists before returning the favourite details.
 *     tags:
 *       - Favourites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "0088909d-5a6a-4931-acd7-6af3084b7ade"
 *         description: The unique identifier of the chapter to check
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *         description: The unique identifier of the course the chapter belongs to
 *     responses:
 *       200:
 *         description: Favourite retrieved successfully
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
 *                         example: "42142849-4510-44f9-a9d0-5d7e843a59c3"
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: "0088909d-5a6a-4931-acd7-6af3084b7ade"
 *                       isDeleted:
 *                         type: string
 *                         example: "false"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-10T15:51:46.602Z"
 *                 message:
 *                   type: string
 *                   example: "Favourite fetched successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - id: "42142849-4510-44f9-a9d0-5d7e843a59c3"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     courseId: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                     chapterId: "0088909d-5a6a-4931-acd7-6af3084b7ade"
 *                     isDeleted: "false"
 *                     created_at: "2025-04-10T15:51:46.602Z"
 *                 message: "Favourite fetched successfully"
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
 *                   example: "Chapter ID and Course ID are required"
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
 *         description: Not Found - Chapter or favourite not found
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
 *                   example: "Chapter not found"
 *                   enum:
 *                     - Chapter not found
 *                     - No favourite entry found
 */
router.get('/user', favouritesController.getUserChapterFavourite);
/**
 * @openapi
 * /favourites/delete:
 *   post:
 *     summary: Delete a user's favourite chapter
 *     description: Allows a logged-in user to delete (mark as deleted) a specific favourite entry for a chapter and course. Requires authentication via a valid access token. The endpoint checks if the user is logged in, validates the chapter, course, and favourite IDs, ensures the chapter belongs to the specified course, and updates the favourite entry to mark it as deleted.
 *     tags:
 *       - Favourites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chapterId
 *               - courseId
 *               - favouriteId
 *             properties:
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: "0088909d-5a6a-4931-acd7-6af3084b7ade"
 *                 description: The unique identifier of the chapter to unfavourite
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                 description: The unique identifier of the course the chapter belongs to
 *               favouriteId:
 *                 type: string
 *                 format: uuid
 *                 example: "42142849-4510-44f9-a9d0-5d7e843a59c3"
 *                 description: The unique identifier of the favourite entry to delete
 *     responses:
 *       200:
 *         description: Favourite deleted successfully
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
 *                   description: No data returned for this operation
 *                 message:
 *                   type: string
 *                   example: "Course favourite deleted successfully"
 *               example:
 *                 status: success
 *                 data: null
 *                 message: "Course favourite deleted successfully"
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
 *                   example: "Chapter ID, Course, and Favourite ID are required"
 *                   enum:
 *                     - Chapter ID, Course, and Favourite ID are required
 *                     - Chapter does not belong to the specified course
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
 *         description: Not Found - Chapter or favourite not found
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
 *                   example: "Chapter not found"
 *                   enum:
 *                     - Chapter not found
 *                     - No favourite entry found
 *       500:
 *         description: Internal Server Error - Failed to delete favourite
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
 *                   example: "Failed to delete favourites"
 */
router.post('/delete', favouritesController.deleteFavourite);


export { router as favouritesRouter };