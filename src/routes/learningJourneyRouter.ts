import { learningJourneyController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
//learning journey
/**
 * @openapi
 * /journey/create:
 *   post:
 *     summary: Add a learning journey for a module
 *     description: Adds a learning journey by associating all courses within a specified module. Only admins can perform this action. Requires authentication via a valid access token. The moduleId is provided in the request body.
 *     tags:
 *       - Learning Journey
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *             properties:
 *               moduleId:
 *                 type: string
 *                 format: uuid
 *                 example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                 description: The ID of the module to create the learning journey for
 *     responses:
 *       201:
 *         description: Learning journey added successfully
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
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                         description: The ID of the module
 *                       moduleName:
 *                         type: string
 *                         example: "Leading Self"
 *                         description: The name of the module
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       courseName:
 *                         type: string
 *                         example: "PS101 Self-Leadership"
 *                         description: The name of the course
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                         description: The ID of the associated scenario (null if not provided)
 *                       scenarioName:
 *                         type: string
 *                         example: "Expert"
 *                         description: The name of the associated scenario (null if not provided)
 *                 message:
 *                   type: string
 *                   example: "Learning journey added successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - moduleId: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     moduleName: "Leading Self"
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     courseName: "PS101 Self-Leadership"
 *                     scenarioId: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                     scenarioName: "Expert"
 *                   - moduleId: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     moduleName: "Leading Self"
 *                     courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                     courseName: "PS102 Personal Effectiveness and Productivity"
 *                     scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                     scenarioName: "Intermediate"
 *                 message: "Learning journey added successfully"
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
 *                   example: "ModuleId is required"
 *                   enum:
 *                     - Please log in again
 *                     - ModuleId is required
 *                     - Module is deleted
 *                     - No courses available in this module
 *                     - No Course in this module
 *                     - All courses in this module are already added to the learning journey
 *       403:
 *         description: Forbidden - Insufficient permissions
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
 *                   example: "Only an admin can add a learning journey"
 *       404:
 *         description: Not Found - Module not found
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
 *                   example: "Module not found"
 *       500:
 *         description: Internal Server Error - Failed to add learning journey
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
 *                   example: "Failed to add learning journey"
 */
router.post('/create', learningJourneyController.addLearningJourney);
/**
 * @openapi
 * /journey/all:
 *   get:
 *     summary: Retrieve all learning journeys
 *     description: Retrieves all learning journeys, structured by modules, courses, scenarios, and chapters. Requires authentication via a valid access token.
 *     tags:
 *       - Learning Journey
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning journeys retrieved successfully
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
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                         description: The ID of the module
 *                       moduleName:
 *                         type: string
 *                         example: "Leading Self"
 *                         description: The name of the module
 *                       courses:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             courseId:
 *                               type: string
 *                               format: uuid
 *                               example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                               description: The ID of the course
 *                             courseName:
 *                               type: string
 *                               example: "PS101 Self-Leadership"
 *                               description: The name of the course
 *                             scenarios:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   scenarioId:
 *                                     type: string
 *                                     format: uuid
 *                                     example: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                                     description: The ID of the scenario
 *                                   scenarioName:
 *                                     type: string
 *                                     example: "Expert"
 *                                     description: The name of the scenario
 *                             chapters:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   chapterId:
 *                                     type: string
 *                                     format: uuid
 *                                     example: 6a26edc7-4437-4a45-9c58-d6505f914c72
 *                                     description: The ID of the chapter
 *                                   chapterTitle:
 *                                     type: string
 *                                     example: "Chapter 3"
 *                                     description: The title of the chapter
 *                 message:
 *                   type: string
 *                   example: "Learning journey retrieved successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - moduleId: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     moduleName: "Leading Self"
 *                     courses:
 *                       - courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         courseName: "PS101 Self-Leadership"
 *                         scenarios:
 *                           - scenarioId: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                             scenarioName: "Expert"
 *                         chapters:
 *                           - chapterId: 6a26edc7-4437-4a45-9c58-d6505f914c72
 *                             chapterTitle: "Chapter 3"
 *                           - chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                             chapterTitle: "Chapter 2"
 *                           - chapterId: 550ba9c1-ff74-444b-add5-f4561914b7ae
 *                             chapterTitle: "Chapter 1"
 *                   - moduleId: 20104f7d-a689-4c27-864a-db899e19068a
 *                     moduleName: "Leading Others"
 *                     courses:
 *                       - courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                         courseName: "PS102 Personal Effectiveness and Productivity"
 *                         scenarios:
 *                           - scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                             scenarioName: "Intermediate"
 *                         chapters:
 *                           - chapterId: d23fd6d4-6416-4474-b056-748d162f34fa
 *                             chapterTitle: "Chapter 1"
 *                           - chapterId: 03f4dbb1-533c-49dd-be7d-19ea4a4d2625
 *                             chapterTitle: "Chapter 2"
 *                           - chapterId: 8b2565a5-e002-43eb-b520-2c7f8fff40bf
 *                             chapterTitle: "Chapter 3"
 *                 message: "Learning journey retrieved successfully"
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
 *                   example: "Please log in again"
 *       404:
 *         description: Not Found - No learning journey found
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
 *                   example: "No learning journey found"
 */
router.get('/all', learningJourneyController.getAllLearningJourney);

//user learning journey
/**
 * @openapi
 * /journey/create-user:
 *   post:
 *     summary: Add a learning journey for a user
 *     description: Adds a specific chapter to a user's learning journey. Requires authentication via a valid access token. The chapterId is provided in the request body.
 *     tags:
 *       - Learning Journey
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
 *             properties:
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                 description: The ID of the chapter to add to the user's learning journey
 *     responses:
 *       201:
 *         description: Learning journey added successfully to user data
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
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                         description: The ID of the module
 *                       moduleName:
 *                         type: string
 *                         example: "Leading Self"
 *                         description: The name of the module
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       courseName:
 *                         type: string
 *                         example: "PS101 Self-Leadership"
 *                         description: The name of the course
 *                       chapterId:
 *                         type: string
 *                         format: uuid
 *                         example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                         description: The ID of the chapter
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                         description: The ID of the associated scenario (null if not provided)
 *                       scenarioName:
 *                         type: string
 *                         example: "Expert"
 *                         description: The name of the associated scenario (null if not provided)
 *                       status:
 *                         type: string
 *                         example: "completed"
 *                         description: The status of the learning journey for this chapter
 *                 message:
 *                   type: string
 *                   example: "Learning journey added successfully to user data"
 *               example:
 *                 status: success
 *                 data:
 *                   - userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     moduleId: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     moduleName: "Leading Self"
 *                     courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     courseName: "PS101 Self-Leadership"
 *                     chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                     scenarioId: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                     scenarioName: "Expert"
 *                     status: "completed"
 *                 message: "Learning journey added successfully to user data"
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
 *                   example: "ChapterId is required"
 *                   enum:
 *                     - Please log in again
 *                     - ChapterId is required
 *                     - User learning journey already exists
 *       404:
 *         description: Not Found - Chapter not found or deleted
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
 *                     - Chapter is deleted
 *       500:
 *         description: Internal Server Error - Failed to add learning journey
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
 *                   example: "Failed to add learning journey"
 */
router.post('/create-user', learningJourneyController.addUserLearningJourney);
/**
 * @openapi
 * /journey/all-user:
 *   get:
 *     summary: Retrieve all learning journeys for a user
 *     description: Retrieves all learning journeys for the authenticated user, structured by modules, courses, and chapters, including the completion status of each course and chapter. Requires authentication via a valid access token.
 *     tags:
 *       - Learning Journey
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning journeys retrieved successfully
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
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                         description: The ID of the module
 *                       moduleName:
 *                         type: string
 *                         example: "Leading Self"
 *                         description: The name of the module
 *                       courses:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             courseId:
 *                               type: string
 *                               format: uuid
 *                               example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                               description: The ID of the course
 *                             courseName:
 *                               type: string
 *                               example: "PS101 Self-Leadership"
 *                               description: The name of the course
 *                             scenarioId:
 *                               type: string
 *                               format: uuid
 *                               example: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                               description: The ID of the associated scenario (null if not provided)
 *                             scenarioName:
 *                               type: string
 *                               example: "Expert"
 *                               description: The name of the associated scenario (null if not provided)
 *                             status:
 *                               type: string
 *                               enum: ["completed", "not-completed"]
 *                               example: "not-completed"
 *                               description: The completion status of the course (completed if all chapters are completed)
 *                             chapters:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   chapterId:
 *                                     type: string
 *                                     format: uuid
 *                                     example: 550ba9c1-ff74-444b-add5-f4561914b7ae
 *                                     description: The ID of the chapter
 *                                   chapterNumber:
 *                                     type: integer
 *                                     example: 1
 *                                     description: The chapter number within the course
 *                                   status:
 *                                     type: string
 *                                     enum: ["completed", "not-completed"]
 *                                     example: "completed"
 *                                     description: The completion status of the chapter
 *                 message:
 *                   type: string
 *                   example: "Learning journey retrieved successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - moduleId: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     moduleName: "Leading Self"
 *                     courses:
 *                       - courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         courseName: "PS101 Self-Leadership"
 *                         scenarioId: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                         scenarioName: "Expert"
 *                         status: "not-completed"
 *                         chapters:
 *                           - chapterId: 550ba9c1-ff74-444b-add5-f4561914b7ae
 *                             chapterNumber: 1
 *                             status: "completed"
 *                           - chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                             chapterNumber: 2
 *                             status: "completed"
 *                           - chapterId: 6a26edc7-4437-4a45-9c58-d6505f914c72
 *                             chapterNumber: 3
 *                             status: "not-completed"
 *                   - moduleId: 20104f7d-a689-4c27-864a-db899e19068a
 *                     moduleName: "Leading Others"
 *                     courses:
 *                       - courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                         courseName: "PS102 Personal Effectiveness and Productivity"
 *                         scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                         scenarioName: "Intermediate"
 *                         status: "not-completed"
 *                         chapters:
 *                           - chapterId: d23fd6d4-6416-4474-b056-748d162f34fa
 *                             chapterNumber: 1
 *                             status: "completed"
 *                           - chapterId: 03f4dbb1-533c-49dd-be7d-19ea4a4d2625
 *                             chapterNumber: 2
 *                             status: "not-completed"
 *                           - chapterId: 8b2565a5-e002-43eb-b520-2c7f8fff40bf
 *                             chapterNumber: 3
 *                             status: "not-completed"
 *                 message: "Learning journey retrieved successfully"
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
 *                   example: "Please log in again"
 *       404:
 *         description: Not Found - No learning journey found for the user
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
 *                   example: "No learning journey found"
 */
router.get('/all-user', learningJourneyController.getAllUserLearningJourney);

// course learning journey
/**
 * @openapi
 * /journey/all-course:
 *   get:
 *     summary: Retrieve all course learning journeys
 *     description: Retrieves all learning journeys structured by courses, including their scenarios and chapters. Requires authentication via a valid access token.
 *     tags:
 *       - Learning Journey
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course learning journeys retrieved successfully
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
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       courseName:
 *                         type: string
 *                         example: "PS101 Self-Leadership"
 *                         description: The name of the course
 *                       scenarios:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             scenarioId:
 *                               type: string
 *                               format: uuid
 *                               example: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                               description: The ID of the scenario
 *                             scenarioName:
 *                               type: string
 *                               example: "Expert"
 *                               description: The name of the scenario
 *                       chapters:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             chapterId:
 *                               type: string
 *                               format: uuid
 *                               example: 550ba9c1-ff74-444b-add5-f4561914b7ae
 *                               description: The ID of the chapter
 *                             courseId:
 *                               type: string
 *                               format: uuid
 *                               example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                               description: The ID of the course the chapter belongs to
 *                             chapterName:
 *                               type: string
 *                               example: "Chapter 1"
 *                               description: The title of the chapter
 *                             chapterNumber:
 *                               type: integer
 *                               example: 1
 *                               description: The chapter number within the course
 *                 message:
 *                   type: string
 *                   example: "Learning journey retrieved successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     courseName: "PS101 Self-Leadership"
 *                     scenarios:
 *                       - scenarioId: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                         scenarioName: "Expert"
 *                     chapters:
 *                       - chapterId: 550ba9c1-ff74-444b-add5-f4561914b7ae
 *                         courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         chapterName: "Chapter 1"
 *                         chapterNumber: 1
 *                       - chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                         courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         chapterName: "Chapter 2"
 *                         chapterNumber: 2
 *                       - chapterId: 6a26edc7-4437-4a45-9c58-d6505f914c72
 *                         courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         chapterName: "Chapter 3"
 *                         chapterNumber: 3
 *                   - courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                     courseName: "PS102 Personal Effectiveness and Productivity"
 *                     scenarios:
 *                       - scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                         scenarioName: "Intermediate"
 *                     chapters:
 *                       - chapterId: d23fd6d4-6416-4474-b056-748d162f34fa
 *                         courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                         chapterName: "Chapter 1"
 *                         chapterNumber: 1
 *                       - chapterId: 03f4dbb1-533c-49dd-be7d-19ea4a4d2625
 *                         courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                         chapterName: "Chapter 2"
 *                         chapterNumber: 2
 *                       - chapterId: 8b2565a5-e002-43eb-b520-2c7f8fff40bf
 *                         courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                         chapterName: "Chapter 3"
 *                         chapterNumber: 3
 *                 message: "Learning journey retrieved successfully"
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
 *                   example: "Please log in again"
 *       404:
 *         description: Not Found - No learning journey found
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
 *                   example: "No learning journey found"
 */
router.get('/all-course', learningJourneyController.getAllCourseLearningJourney);
/**
 * @openapi
 * /journey/all-user-course:
 *   get:
 *     summary: Retrieve all course learning journeys for a user
 *     description: Retrieves all course learning journeys for the authenticated user, including their scenarios, chapters, and completion status. Requires authentication via a valid access token.
 *     tags:
 *       - Learning Journey
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User course learning journeys retrieved successfully
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
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       courseName:
 *                         type: string
 *                         example: "PS101 Self-Leadership"
 *                         description: The name of the course
 *                       scenarios:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             scenarioId:
 *                               type: string
 *                               format: uuid
 *                               example: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                               description: The ID of the scenario
 *                             scenarioName:
 *                               type: string
 *                               example: "Expert"
 *                               description: The name of the scenario
 *                       chapters:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             chapterId:
 *                               type: string
 *                               format: uuid
 *                               example: 550ba9c1-ff74-444b-add5-f4561914b7ae
 *                               description: The ID of the chapter
 *                             chapterTitle:
 *                               type: string
 *                               example: "Chapter 1"
 *                               description: The title of the chapter
 *                             chapterNumber:
 *                               type: integer
 *                               example: 1
 *                               description: The chapter number within the course
 *                             status:
 *                               type: string
 *                               enum: ["completed", "not-completed"]
 *                               example: "completed"
 *                               description: The completion status of the chapter
 *                       courseStatus:
 *                         type: string
 *                         enum: ["completed", "not-completed"]
 *                         example: "not-completed"
 *                         description: The overall completion status of the course (completed if all chapters are completed)
 *                 message:
 *                   type: string
 *                   example: "Learning journey retrieved successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - courseId: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     courseName: "PS101 Self-Leadership"
 *                     scenarios:
 *                       - scenarioId: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                         scenarioName: "Expert"
 *                     chapters:
 *                       - chapterId: 550ba9c1-ff74-444b-add5-f4561914b7ae
 *                         chapterTitle: "Chapter 1"
 *                         chapterNumber: 1
 *                         status: "completed"
 *                       - chapterId: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                         chapterTitle: "Chapter 2"
 *                         chapterNumber: 2
 *                         status: "completed"
 *                       - chapterId: 6a26edc7-4437-4a45-9c58-d6505f914c72
 *                         chapterTitle: "Chapter 3"
 *                         chapterNumber: 3
 *                         status: "not-completed"
 *                     courseStatus: "not-completed"
 *                   - courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                     courseName: "PS102 Personal Effectiveness and Productivity"
 *                     scenarios:
 *                       - scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                         scenarioName: "Intermediate"
 *                     chapters:
 *                       - chapterId: d23fd6d4-6416-4474-b056-748d162f34fa
 *                         chapterTitle: "Chapter 1"
 *                         chapterNumber: 1
 *                         status: "completed"
 *                       - chapterId: 03f4dbb1-533c-49dd-be7d-19ea4a4d2625
 *                         chapterTitle: "Chapter 2"
 *                         chapterNumber: 2
 *                         status: "not-completed"
 *                       - chapterId: 8b2565a5-e002-43eb-b520-2c7f8fff40bf
 *                         chapterTitle: "Chapter 3"
 *                         chapterNumber: 3
 *                         status: "not-completed"
 *                     courseStatus: "not-completed"
 *                 message: "Learning journey retrieved successfully"
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
 *                   example: "Please log in again"
 *       404:
 *         description: Not Found - No learning journey found for the user
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
 *                   example: "No learning journey found"
 */
router.get('/all-user-course', learningJourneyController.getAllUserCourseLearningJourney);

export { router as learningJourneyRouter };
