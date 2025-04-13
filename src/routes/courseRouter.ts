import { multerUpload } from '@/common/config';
import { courseController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
//module route
/**
 * @openapi
 * /course/create-module:
 *   post:
 *     summary: Create a new module
 *     description: Creates a new module for a course. Only admins can create modules. Requires authentication via a valid access token. The module name is provided in the request body.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Leading Other"
 *                 description: The name of the module to be created
 *     responses:
 *       201:
 *         description: Module created successfully
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
 *                         example: 85549869-558c-4fdc-ae1f-bde167012eac
 *                         description: The ID of the created module
 *                       name:
 *                         type: string
 *                         example: "Leading Others"
 *                         description: The name of the module
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the module
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the module is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T18:14:27.793Z
 *                         description: The creation date of the module
 *                 message:
 *                   type: string
 *                   example: Module created successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 85549869-558c-4fdc-ae1f-bde167012eac
 *                     name: "Leading Others"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-17T18:14:27.793Z
 *                 message: Module created successfully
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
 *                   example: Name is required
 *                   enum:
 *                     - Please log in again
 *                     - Name is required
 *                     - Module name exist already
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
 *                   example: Only an admin can create a module
 */
router.post('/create-module', courseController.createModule);
/**
 * @openapi
 * /course/get-module:
 *   get:
 *     summary: Retrieve a module by ID
 *     description: Retrieves a specific module based on its ID. Requires authentication via a valid access token. The module ID is provided as a query parameter.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 9e81f18b-5481-4475-ae5f-3c953bf7609e
 *         description: The ID of the module to retrieve
 *     responses:
 *       200:
 *         description: Module retrieved successfully
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
 *                         example: 9e81f18b-5481-4475-ae5f-3c953bf7609e
 *                         description: The ID of the module
 *                       name:
 *                         type: string
 *                         example: "Leading Others"
 *                         description: The name of the module
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the module
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the module is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-13T21:50:02.555Z
 *                         description: The creation date of the module
 *                 message:
 *                   type: string
 *                   example: Module successfully fetched
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 9e81f18b-5481-4475-ae5f-3c953bf7609e
 *                     name: "Leading Others"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-13T21:50:02.555Z
 *                 message: Module successfully fetched
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
 *                   example: Module ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Module ID is required
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
 *                   example: Module not found
 */
router.get('/get-module', courseController.getModule);
/**
 * @openapi
 * /course/get-modules:
 *   get:
 *     summary: Retrieve all modules
 *     description: Retrieves a list of all modules. Requires authentication via a valid access token.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
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
 *                         example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                         description: The ID of the module
 *                       name:
 *                         type: string
 *                         example: "Leading Self"
 *                         description: The name of the module
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the module
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the module is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-13T21:48:34.998Z
 *                         description: The creation date of the module
 *                 message:
 *                   type: string
 *                   example: Modules successfully fetched
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     name: "Leading Self"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-13T21:48:34.998Z
 *                   - id: 9e81f18b-5481-4475-ae5f-3c953bf7609e
 *                     name: "Leading Others"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-13T21:50:02.555Z
 *                   - id: 20104f7d-a689-4c27-864a-db899e19068a
 *                     name: "Leading Organizations"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-13T21:50:23.052Z
 *                 message: Modules successfully fetched
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
 *                   example: Please log in again
 *       404:
 *         description: Not Found - No modules available
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
 *                   example: No modules found
 */
router.get('/get-modules', courseController.getAllModules);
/**
 * @openapi
 * /course/update-module:
 *   post:
 *     summary: Update a module
 *     description: Updates an existing module's name. Only admins can update modules. Requires authentication via a valid access token. The module ID and new name are provided in the request body.
 *     tags:
 *       - Course
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
 *               - name
 *             properties:
 *               moduleId:
 *                 type: string
 *                 format: uuid
 *                 example: 5b2affd9-f2a9-4121-b851-1eda50588e90
 *                 description: The ID of the module to update
 *               name:
 *                 type: string
 *                 example: "Leading Othersssss"
 *                 description: The new name for the module
 *     responses:
 *       200:
 *         description: Module updated successfully
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
 *                         example: 5b2affd9-f2a9-4121-b851-1eda50588e90
 *                         description: The ID of the updated module
 *                       name:
 *                         type: string
 *                         example: "Leading Othersssss"
 *                         description: The updated name of the module
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the module
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the module is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T18:29:23.652Z
 *                         description: The creation date of the module
 *                 message:
 *                   type: string
 *                   example: Module updated successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 5b2affd9-f2a9-4121-b851-1eda50588e90
 *                     name: "Leading Othersssss"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     isDeleted: false
 *                     created_at: 2025-03-17T18:29:23.652Z
 *                 message: Module updated successfully
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
 *                   example: Incomplete update data
 *                   enum:
 *                     - Please log in again
 *                     - Incomplete update data
 *                     - Module not updated
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
 *                   example: Only an admin can update a module
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
 *                   example: Module not found
 */
router.post('/update-module', courseController.updateModule);
/**
 * @openapi
 * /course/delete-module:
 *   post:
 *     summary: Delete a module
 *     description: Soft deletes a module by setting its `isDeleted` flag to true. Only admins can delete modules. Requires authentication via a valid access token. The module ID is provided in the request body.
 *     tags:
 *       - Course
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
 *                 example: 5b2affd9-f2a9-4121-b851-1eda50588e90
 *                 description: The ID of the module to delete
 *     responses:
 *       200:
 *         description: Module deleted successfully
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
 *                   description: No data returned for deletion
 *                 message:
 *                   type: string
 *                   example: Module deleted successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Module deleted successfully
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
 *                   example: Module ID is required
 *                   enum:
 *                     - Please log in again
 *                     - Module ID is required
 *                     - Module has already been deleted
 *                     - Module not deleted
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
 *                   example: Only an admin can delete a module
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
 *                   example: Module not found
 */
router.post('/delete-module', courseController.deleteModule);

//course route
/**
 * @openapi
 * /course/get-course:
 *   get:
 *     summary: Retrieve a course by ID
 *     description: Retrieves a specific course based on its ID. Requires authentication via a valid access token. The course ID is provided as a query parameter.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: abfb6988-c506-47f2-9fec-000ce3b35694
 *         description: The ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Course retrieved successfully
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
 *                         example: abfb6988-c506-47f2-9fec-000ce3b35694
 *                         description: The ID of the course
 *                       name:
 *                         type: string
 *                         example: "PS102 Personal Effectiveness and Productivity"
 *                         description: The name of the course
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the course
 *                       scenarioName:
 *                         type: string
 *                         example: "Intermediate"
 *                         description: The name of the associated scenario (null if not provided)
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                         description: The ID of the associated scenario (null if not provided)
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: 20104f7d-a689-4c27-864a-db899e19068a
 *                         description: The ID of the module associated with the course
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the course is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-17T18:54:08.195Z
 *                         description: The creation date of the course
 *                 message:
 *                   type: string
 *                   example: Course successfully fetched
 *               example:
 *                 status: success
 *                 data:
 *                   - id: abfb6988-c506-47f2-9fec-000ce3b35694
 *                     name: "PS102 Personal Effectiveness and Productivity"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     scenarioName: "Intermediate"
 *                     scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                     moduleId: 20104f7d-a689-4c27-864a-db899e19068a
 *                     isDeleted: false
 *                     created_at: 2025-03-17T18:54:08.195Z
 *                 message: Course successfully fetched
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
 *                   example: Please log in again
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
 */
router.get('/get-course', courseController.getCourse);
/**
 * @openapi
 * /course/get-course:
 *   get:
 *     summary: Retrieve a course by ID
 *     description: Retrieves a specific course based on its ID. Requires authentication via a valid access token. The course ID is provided as a query parameter.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *         description: The ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Course retrieved successfully
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
 *                       course:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                             description: The ID of the course
 *                           name:
 *                             type: string
 *                             example: "Updated course to now"
 *                             description: The name of the course
 *                           userId:
 *                             type: string
 *                             format: uuid
 *                             example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                             description: The ID of the user who created the course
 *                           moduleId:
 *                             type: string
 *                             format: uuid
 *                             example: "20104f7d-a689-4c27-864a-db899e19068a"
 *                             description: The ID of the module associated with the course
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                             description: Indicates if the course is deleted
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-12T13:12:42.899Z"
 *                             description: The creation date of the course
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-12T14:37:31.489Z"
 *                             description: The last update date of the course
 *                           courseResources:
 *                             type: string
 *                             nullable: true
 *                             example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-documents/1744466751732-David Okonkwo Resume .pdf"
 *                             description: Secure URL of the uploaded course resources (null if not provided)
 *                           courseImage:
 *                             type: string
 *                             nullable: true
 *                             example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-image/1744465138431-image 13.png"
 *                             description: Secure URL of the uploaded course image (null if not provided)
 *                           status:
 *                             type: string
 *                             example: "published"
 *                             description: The status of the course
 *                       scenarios:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             scenarioId:
 *                               type: string
 *                               format: uuid
 *                               example: "1c7e3c87-b877-4239-a7cd-346d3d42af5c"
 *                               description: The ID of the scenario
 *                             scenarioName:
 *                               type: string
 *                               example: "Expert"
 *                               description: The name of the scenario
 *                         description: List of scenarios associated with the course
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             powerSkillId:
 *                               type: string
 *                               format: uuid
 *                               example: "06c351cb-c71a-4c28-86e9-4325a0698829"
 *                               description: The ID of the power skill
 *                             powerSkillName:
 *                               type: string
 *                               example: "Resilience"
 *                               description: The name of the power skill
 *                         description: List of power skills associated with the course
 *                 message:
 *                   type: string
 *                   example: "Course successfully fetched"
 *               example:
 *                 status: success
 *                 data:
 *                   - course:
 *                       id: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                       name: "Updated course to now"
 *                       userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                       moduleId: "20104f7d-a689-4c27-864a-db899e19068a"
 *                       isDeleted: false
 *                       created_at: "2025-04-12T13:12:42.899Z"
 *                       updated_at: "2025-04-12T14:37:31.489Z"
 *                       courseResources: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-documents/1744466751732-David Okonkwo Resume .pdf"
 *                       courseImage: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-image/1744465138431-image 13.png"
 *                       status: "published"
 *                     scenarios:
 *                       - scenarioId: "1c7e3c87-b877-4239-a7cd-346d3d42af5c"
 *                         scenarioName: "Expert"
 *                       - scenarioId: "2c093d7a-bfc6-4e25-af67-7aeb7dae64b9"
 *                         scenarioName: "Intermediate"
 *                     skills:
 *                       - powerSkillId: "06c351cb-c71a-4c28-86e9-4325a0698829"
 *                         powerSkillName: "Resilience"
 *                       - powerSkillId: "0137c123-17b6-45f6-b081-429c9c731cec"
 *                         powerSkillName: "Empathy"
 *                 message: "Course successfully fetched"
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
 *                   example: "Course ID is required"
 *                   enum:
 *                     - Please log in again
 *                     - Course ID is required
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
 *                   example: "Course not found"
 */
router.get('/get-admin-course', courseController.getAdminCourse);
/**
 * @openapi
 * /course/get-courses:
 *   get:
 *     summary: Retrieve all published courses
 *     description: Retrieves a list of all published courses. Requires authentication via a valid access token.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Published courses retrieved successfully
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
 *                         example: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                         description: The ID of the course
 *                       name:
 *                         type: string
 *                         example: "DOCUMENT COURSE"
 *                         description: The name of the course
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                         description: The ID of the user who created the course
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: "20104f7d-a689-4c27-864a-db899e19068a"
 *                         description: The ID of the module associated with the course
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the course is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-03T01:32:44.488Z"
 *                         description: The creation date of the course
 *                       courseResources:
 *                         type: string
 *                         nullable: true
 *                         example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-resources/1743643964048-David Okonkwo Resume .pdf"
 *                         description: Secure URL of the uploaded course resources (null if not provided)
 *                       courseImage:
 *                         type: string
 *                         nullable: true
 *                         example: ""
 *                         description: Secure URL of the uploaded course image (empty string if not provided)
 *                       status:
 *                         type: string
 *                         example: "published"
 *                         description: The status of the course
 *                       moduleName:
 *                         type: string
 *                         example: "Leading Organizations"
 *                         description: The name of the module associated with the course
 *                 message:
 *                   type: string
 *                   example: "Published Courses successfully fetched"
 *               example:
 *                 status: success
 *                 data:
 *                   - id: "070200b9-bd6b-4bde-8a45-99a247ed6f98"
 *                     name: "DOCUMENT COURSE"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     moduleId: "20104f7d-a689-4c27-864a-db899e19068a"
 *                     isDeleted: false
 *                     created_at: "2025-04-03T01:32:44.488Z"
 *                     courseResources: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-resources/1743643964048-David Okonkwo Resume .pdf"
 *                     courseImage: ""
 *                     status: "published"
 *                     moduleName: "Leading Organizations"
 *                   - id: "0e41b4b3-485b-45eb-881d-46613fc86da2"
 *                     name: "ibvgctctctctxcrfxfcggc"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     moduleId: "20104f7d-a689-4c27-864a-db899e19068a"
 *                     isDeleted: false
 *                     created_at: "2025-03-26T22:31:36.130Z"
 *                     courseResources: null
 *                     courseImage: ""
 *                     status: "published"
 *                     moduleName: "Leading Organizations"
 *                 message: "Published Courses successfully fetched"
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
 *         description: Not Found - No published courses available
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
 *                   example: "No Course found"
 */
router.get('/get-courses', courseController.getPublishedCourses);
/**
 * @openapi
 * /course/get-admin-courses:
 *   get:
 *     summary: Retrieve all courses for admin
 *     description: Retrieves a list of all courses, including both published and draft statuses. Requires authentication via a valid access token. Only accessible by admins.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
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
 *                         example: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                         description: The ID of the course
 *                       name:
 *                         type: string
 *                         example: "Updated Course"
 *                         description: The name of the course
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                         description: The ID of the user who created the course
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: "65cf4f6d-01bf-4699-885f-191bb83d19d2"
 *                         description: The ID of the module associated with the course
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the course is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-12T13:12:42.899Z"
 *                         description: The creation date of the course
 *                       courseResources:
 *                         type: string
 *                         nullable: true
 *                         example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-resources/1743644797667-Demo_credit.docx"
 *                         description: Secure URL of the uploaded course resources (null if not provided)
 *                       courseImage:
 *                         type: string
 *                         nullable: true
 *                         example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-image/1744463560100-100minds.jpg"
 *                         description: Secure URL of the uploaded course image (empty string or URL if provided)
 *                       status:
 *                         type: string
 *                         example: "draft"
 *                         description: The status of the course (e.g., "draft" or "published")
 *                       moduleName:
 *                         type: string
 *                         example: "Leading Self"
 *                         description: The name of the module associated with the course
 *                 message:
 *                   type: string
 *                   example: "Courses successfully fetched"
 *               example:
 *                 status: success
 *                 data:
 *                   - id: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                     name: "Updated Course"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     moduleId: "65cf4f6d-01bf-4699-885f-191bb83d19d2"
 *                     isDeleted: false
 *                     created_at: "2025-04-12T13:12:42.899Z"
 *                     courseResources: null
 *                     courseImage: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-image/1744463560100-100minds.jpg"
 *                     status: "draft"
 *                     moduleName: "Leading Self"
 *                   - id: "f4c46959-ac12-4344-a9d2-b59c7e0e1bef"
 *                     name: "DOCUMENT without coursee"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     moduleId: "20104f7d-a689-4c27-864a-db899e19068a"
 *                     isDeleted: false
 *                     created_at: "2025-04-03T01:36:35.025Z"
 *                     courseResources: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-documents/1743644797667-Demo_credit.docx"
 *                     courseImage: ""
 *                     status: "draft"
 *                     moduleName: "Leading Organizations"
 *                 message: "Courses successfully fetched"
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
 *         description: Not Found - No courses available
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
 *                   example: "No Course found"
 */
router.get('/get-admin-courses', courseController.getCourses);
/**
 * @openapi
 * /course/create-course:
 *   post:
 *     summary: Create a new course
 *     description: Creates a new course with associated module and image. Only admins can create courses. Requires authentication via a valid access token. The course details are provided in the request body and the request includes an image file.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - moduleId
 *               - courseImage
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Course"
 *                 description: The name of the course
 *               courseImage:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the course (e.g., PNG, JPG)
 *               moduleId:
 *                 type: string
 *                 format: uuid
 *                 example: "65cf4f6d-01bf-4699-885f-191bb83d19d2"
 *                 description: The ID of the module associated with the course
 *     responses:
 *       201:
 *         description: Course created successfully
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
 *                         example: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                         description: The ID of the created course
 *                       name:
 *                         type: string
 *                         example: "Updated Course"
 *                         description: The name of the course
 *                       courseImage:
 *                         type: string
 *                         example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-image/1744463560100-100minds.jpg"
 *                         description: Secure URL of the uploaded course image
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                         description: The ID of the user who created the course
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: "65cf4f6d-01bf-4699-885f-191bb83d19d2"
 *                         description: The ID of the module associated with the course
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the course is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-12T13:12:42.899Z"
 *                         description: The creation date of the course
 *                       status:
 *                         type: string
 *                         example: "draft"
 *                         description: The status of the course
 *                 message:
 *                   type: string
 *                   example: "Course created successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - id: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                     name: "Updated Course"
 *                     courseImage: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-image/1744463560100-100minds.jpg"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     moduleId: "65cf4f6d-01bf-4699-885f-191bb83d19d2"
 *                     isDeleted: false
 *                     created_at: "2025-04-12T13:12:42.899Z"
 *                     status: "draft"
 *                 message: "Course created successfully"
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
 *                   example: "Course name and moduleId are required"
 *                   enum:
 *                     - Please log in again
 *                     - Course name and moduleId are required
 *                     - Course name exist already
 *                     - Course image is required
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
 *                   example: "Only an admin can create a course"
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
 *         description: Internal Server Error - Failed to create course
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
 *                   example: "Failed to create course"
 */
router.post('/create-course', multerUpload.single('courseImage'), courseController.createCourse);
/**
 * @openapi
 * /course/update-course:
 *   post:
 *     summary: Update an existing course
 *     description: Updates an existing course with new details such as name, module, image, resources, status, skills, and scenarios. Only admins can update courses. Requires authentication via a valid access token. The request includes optional files (course image and resources) and JSON data in the body.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                 description: The ID of the course to update
 *               name:
 *                 type: string
 *                 example: "Updated course to now"
 *                 description: The new name of the course (optional)
 *               moduleId:
 *                 type: string
 *                 format: uuid
 *                 example: "20104f7d-a689-4c27-864a-db899e19068a"
 *                 description: The ID of the new module to associate with the course (optional)
 *               scenario:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Intermediate"]
 *                 description: Array of scenario names to associate with the course (optional)
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Self Awareness", "Adaptability"]
 *                 description: Array of power skill names or IDs to associate with the course (optional)
 *               status:
 *                 type: string
 *                 example: "published"
 *                 description: The new status of the course (e.g., "draft" or "published") (optional)
 *               courseImage:
 *                 type: string
 *                 format: binary
 *                 description: New image file for the course (e.g., PNG, JPG) (optional)
 *               courseResources:
 *                 type: string
 *                 format: binary
 *                 description: New resource file for the course (e.g., PDF, DOC) (optional)
 *     responses:
 *       200:
 *         description: Course updated successfully
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
 *                         example: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                         description: The ID of the updated course
 *                       name:
 *                         type: string
 *                         example: "Updated course to now"
 *                         description: The name of the updated course
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                         description: The ID of the user who updated the course
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: "20104f7d-a689-4c27-864a-db899e19068a"
 *                         description: The ID of the module associated with the course
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the course is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-12T13:12:42.899Z"
 *                         description: The creation date of the course
 *                       courseResources:
 *                         type: string
 *                         nullable: true
 *                         example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-documents/1744465323621-David Okonkwo Resume .pdf"
 *                         description: Secure URL of the uploaded course resources (null if not provided)
 *                       courseImage:
 *                         type: string
 *                         nullable: true
 *                         example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-image/1744465138431-image 13.png"
 *                         description: Secure URL of the uploaded course image (null if not provided)
 *                       status:
 *                         type: string
 *                         example: "published"
 *                         description: The status of the updated course
 *                 message:
 *                   type: string
 *                   example: "Course updated successfully"
 *               example:
 *                 status: success
 *                 data:
 *                   - id: "d41f7b6f-1dcb-4b47-90ef-391a79c1168d"
 *                     name: "Updated course to now"
 *                     userId: "0af8edf7-e4e6-4774-9dac-4ce104ace38c"
 *                     moduleId: "20104f7d-a689-4c27-864a-db899e19068a"
 *                     isDeleted: false
 *                     created_at: "2025-04-12T13:12:42.899Z"
 *                     courseResources: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-documents/1744465323621-David Okonkwo Resume .pdf"
 *                     courseImage: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-image/1744465138431-image 13.png"
 *                     status: "published"
 *                 message: "Course updated successfully"
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
 *                   example: "Course ID is required"
 *                   enum:
 *                     - Please log in again
 *                     - Only an admin can update a course
 *                     - Course ID is required
 *                     - Invalid course status provided
 *                     - Course not found
 *                     - Course has already been deleted
 *                     - Module not found
 *                     - Invalid power skills provided
 *                     - Invalid scenarios provided
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
 *                   example: "Only an admin can update a course"
 *       404:
 *         description: Not Found - Course or module not found
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
 *       500:
 *         description: Internal Server Error - Failed to update course or related data
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
 *                   example: "Failed to update course"
 *                   enum:
 *                     - Failed to update course
 *                     - Failed to remove power skills from the course
 *                     - Failed to update power skills for the course
 *                     - Failed to remove scenarios from the course
 *                     - Failed to update scenarios for the course
 */
router.post(
	'/update-course',
	multerUpload.fields([
		{ name: 'courseImage', maxCount: 1 },
		{ name: 'courseResources', maxCount: 1 },
	]),
	courseController.updateCourse
);
/**
 * @openapi
 * /course/delete-course:
 *   post:
 *     summary: Delete a course
 *     description: Soft deletes a course by marking it as deleted. Only admins who created the course can delete it. Requires authentication via a valid access token. The course ID is provided in the request body.
 *     tags:
 *       - Course
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
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: abfb6988-c506-47f2-9fec-000ce3b35694
 *                 description: The ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
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
 *                   description: No data returned for deletion
 *                 message:
 *                   type: string
 *                   example: Course deleted successfully
 *               example:
 *                 status: success
 *                 data: null
 *                 message: Course deleted successfully
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
 *                   example: courseId ID is required
 *                   enum:
 *                     - Please log in again
 *                     - courseId ID is required
 *                     - Course has already been deleted
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
 *                   example: Only an admin can delete a course
 *                   enum:
 *                     - Only an admin can delete a course
 *                     - You are not authorized to delete this course
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
 *                   example: courseId not found
 */
router.post('/delete-course', courseController.deleteCourse);

//lesson route
/**
 * @openapi
 * /course/get-lesson:
 *   get:
 *     summary: Retrieve a specific lesson for a course
 *     description: Retrieves a specific lesson (chapter, video, role play, and quiz) for a course, identified by the courseId and chapterId. Requires authentication via a valid access token. The courseId and chapterId are provided as query parameters.
 *     tags:
 *       - Course
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
 *         description: The ID of the course to retrieve the lesson from
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *         description: The ID of the specific chapter to retrieve
 *     responses:
 *       200:
 *         description: Lesson retrieved successfully
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
 *                       course:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                             description: The ID of the course
 *                           name:
 *                             type: string
 *                             example: "DOCUMENT COURSE"
 *                             description: The name of the course
 *                           courseResources:
 *                             type: string
 *                             nullable: true
 *                             example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-resources/1743643964048-David Okonkwo Resume .pdf"
 *                             description: The URL of the course resources (null if not provided)
 *                       chapter:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                             description: The ID of the chapter
 *                           title:
 *                             type: string
 *                             example: "Introduction to Emotional Resilience and Well-Being"
 *                             description: The title of the chapter
 *                           description:
 *                             type: string
 *                             example: ""
 *                             description: The description of the chapter
 *                           chapterNumber:
 *                             type: integer
 *                             example: 1
 *                             description: The chapter number within the course
 *                           chapterResources:
 *                             type: string
 *                             nullable: true
 *                             example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/chapter-resources/1743647751033-David Okonkwo Resume .pdf"
 *                             description: The URL of the chapter resources (null if not provided)
 *                           courseId:
 *                             type: string
 *                             format: uuid
 *                             example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                             description: The ID of the course the chapter belongs to
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                             description: Indicates if the chapter is deleted
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-03T02:12:23.866Z"
 *                             description: The creation date of the chapter
 *                       video:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: a8b4fe46-5337-49d7-b155-fc2cd6e2f2fd
 *                             description: The ID of the video
 *                           videoURL:
 *                             type: string
 *                             example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1743646343875-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                             description: The URL of the video file
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                             description: Indicates if the video is deleted
 *                           duration:
 *                             type: string
 *                             example: "00:24"
 *                             description: The duration of the video in MM:SS format
 *                           chapterId:
 *                             type: string
 *                             format: uuid
 *                             example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                             description: The ID of the chapter the video belongs to
 *                           uploadStatus:
 *                             type: string
 *                             example: "processing"
 *                             description: The upload status of the video (e.g., processing, completed, failed)
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-03T02:12:23.881Z"
 *                             description: The creation date of the video
 *                       rolePlay:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                             description: The ID of the role play
 *                           scenario:
 *                             type: string
 *                             example: "Intermediate"
 *                             description: The scenario of the role play
 *                           scenarioImage:
 *                             type: string
 *                             example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394510534-GK5kZ7xXMAEltG9.png"
 *                             description: The URL of the scenario image
 *                       quiz:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: 1998f048-4a44-4740-bdc8-c43ecd1e2e93
 *                               description: The ID of the quiz question
 *                             question:
 *                               type: string
 *                               example: "Are you a boy?"
 *                               description: The question text
 *                             optionA:
 *                               type: string
 *                               example: "Yes"
 *                               description: First option for the question
 *                             optionB:
 *                               type: string
 *                               example: "No"
 *                               description: Second option for the question
 *                             optionC:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                               description: Third option for the question (optional)
 *                             optionD:
 *                               type: string
 *                               nullable: true
 *                               example: null
 *                               description: Fourth option for the question (optional)
 *                 message:
 *                   type: string
 *                   example: "Chapters and lessons successfully fetched"
 *               example:
 *                 status: success
 *                 data:
 *                   - course:
 *                       id: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                       name: "DOCUMENT COURSE"
 *                       courseResources: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-resources/1743643964048-David Okonkwo Resume .pdf"
 *                     chapter:
 *                       id: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                       title: "Introduction to Emotional Resilience and Well-Being"
 *                       description: ""
 *                       chapterNumber: 1
 *                       chapterResources: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/chapter-resources/1743647751033-David Okonkwo Resume .pdf"
 *                       courseId: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                       isDeleted: false
 *                       created_at: "2025-04-03T02:12:23.866Z"
 *                     video:
 *                       id: a8b4fe46-5337-49d7-b155-fc2cd6e2f2fd
 *                       videoURL: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1743646343875-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                       isDeleted: false
 *                       duration: "00:24"
 *                       chapterId: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                       uploadStatus: "processing"
 *                       created_at: "2025-04-03T02:12:23.881Z"
 *                     rolePlay:
 *                       id: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                       scenario: "Intermediate"
 *                       scenarioImage: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/scenario-image/1741394510534-GK5kZ7xXMAEltG9.png"
 *                     quiz:
 *                       - id: 1998f048-4a44-4740-bdc8-c43ecd1e2e93
 *                         question: "Are you a boy?"
 *                         optionA: "Yes"
 *                         optionB: "No"
 *                         optionC: null
 *                         optionD: null
 *                       - id: e0b66b3c-e0c1-40e6-a461-bb6292c1993b
 *                         question: "Are you a girl?"
 *                         optionA: "Yes"
 *                         optionB: "No"
 *                         optionC: "Maybe"
 *                         optionD: "Other"
 *                 message: "Chapters and lessons successfully fetched"
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
 *                   examples:
 *                     - Please log in again
 *                     - ChapterId and CourseId are required
 *       404:
 *         description: Not Found - Course or lesson not found
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
 *                   examples:
 *                     - Course not found
 *                     - Lessons not found
 */
router.get('/get-lesson', courseController.getCourseLesson);
/**
 * @openapi
 * /course/get-lessons:
 *   get:
 *     summary: Retrieve all lessons for a course
 *     description: Retrieves all lessons (chapters and associated videos) for a specific course. Requires authentication via a valid access token. The courseId is provided as a query parameter.
 *     tags:
 *       - Course
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
 *         description: The ID of the course to retrieve lessons for
 *     responses:
 *       200:
 *         description: Lessons retrieved successfully
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
 *                       course:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                             description: The ID of the course
 *                           name:
 *                             type: string
 *                             example: "DOCUMENT COURSE"
 *                             description: The name of the course
 *                           scenarioName:
 *                             type: string
 *                             example: "Intermediate"
 *                             description: The name of the associated scenario (null if not provided)
 *                           scenarioId:
 *                             type: string
 *                             format: uuid
 *                             example: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                             description: The ID of the associated scenario (null if not provided)
 *                           moduleId:
 *                             type: string
 *                             format: uuid
 *                             example: 20104f7d-a689-4c27-864a-db899e19068a
 *                             description: The ID of the module associated with the course
 *                           courseResources:
 *                             type: string
 *                             nullable: true
 *                             example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-resources/1743643964048-David Okonkwo Resume .pdf"
 *                             description: The URL of the course resources (null if not provided)
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                             description: Indicates if the course is deleted
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-04-03T01:32:44.488Z"
 *                             description: The creation date of the course
 *                       chapters:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                               description: The ID of the chapter
 *                             title:
 *                               type: string
 *                               example: "Introduction to Emotional Resilience and Well-Being"
 *                               description: The title of the chapter
 *                             description:
 *                               type: string
 *                               example: "This is a description for a resource"
 *                               description: The description of the chapter
 *                             chapterNumber:
 *                               type: integer
 *                               example: 1
 *                               description: The chapter number within the course
 *                             chapterResources:
 *                               type: string
 *                               nullable: true
 *                               example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/chapter-resources/1743646342827-Honeybook Cover Letter.docx"
 *                               description: The URL of the chapter resources (null if not provided)
 *                             videos:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     format: uuid
 *                                     example: a8b4fe46-5337-49d7-b155-fc2cd6e2f2fd
 *                                     description: The ID of the video
 *                                   videoURL:
 *                                     type: string
 *                                     example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1743646343875-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                                     description: The URL of the video file
 *                                   isDeleted:
 *                                     type: boolean
 *                                     example: false
 *                                     description: Indicates if the video is deleted
 *                                   duration:
 *                                     type: string
 *                                     example: "00:24"
 *                                     description: The duration of the video in MM:SS format
 *                                   chapterId:
 *                                     type: string
 *                                     format: uuid
 *                                     example: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                                     description: The ID of the chapter the video belongs to
 *                                   uploadStatus:
 *                                     type: string
 *                                     example: "processing"
 *                                     description: The upload status of the video (e.g., processing, completed, failed)
 *                                   created_at:
 *                                     type: string
 *                                     format: date-time
 *                                     example: "2025-04-03T02:12:23.881Z"
 *                                     description: The creation date of the video
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-04-03T02:12:23.866Z"
 *                               description: The creation date of the chapter
 *                 message:
 *                   type: string
 *                   example: "Chapters and lessons successfully fetched"
 *               example:
 *                 status: success
 *                 data:
 *                   - course:
 *                       id: 070200b9-bd6b-4bde-8a45-99a247ed6f98
 *                       name: "DOCUMENT COURSE"
 *                       scenarioName: "Intermediate"
 *                       scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                       moduleId: 20104f7d-a689-4c27-864a-db899e19068a
 *                       courseResources: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-resources/1743643964048-David Okonkwo Resume .pdf"
 *                       isDeleted: false
 *                       created_at: "2025-04-03T01:32:44.488Z"
 *                     chapters:
 *                       - id: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                         title: "Introduction to Emotional Resilience and Well-Being"
 *                         description: "This is a description for a resource"
 *                         chapterNumber: 1
 *                         chapterResources: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/chapter-resources/1743646342827-Honeybook Cover Letter.docx"
 *                         videos:
 *                           - id: a8b4fe46-5337-49d7-b155-fc2cd6e2f2fd
 *                             videoURL: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1743646343875-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                             isDeleted: false
 *                             duration: "00:24"
 *                             chapterId: 0088909d-5a6a-4931-acd7-6af3084b7ade
 *                             uploadStatus: "processing"
 *                             created_at: "2025-04-03T02:12:23.881Z"
 *                         created_at: "2025-04-03T02:12:23.866Z"
 *                       - id: 4bf0434f-04ab-49ea-9654-5eb548dfd796
 *                         title: "Introduction to Emotional Resilience and Well-Bein"
 *                         description: "This is a description for a without resumhh"
 *                         chapterNumber: 2
 *                         chapterResources: null
 *                         videos:
 *                           - id: 8e99d987-d8aa-4422-b25b-35eda67531f9
 *                             videoURL: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1743646489242-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                             isDeleted: false
 *                             duration: "00:24"
 *                             chapterId: 4bf0434f-04ab-49ea-9654-5eb548dfd796
 *                             uploadStatus: "processing"
 *                             created_at: "2025-04-03T02:14:49.246Z"
 *                         created_at: "2025-04-03T02:14:49.241Z"
 *                 message: "Chapters and lessons successfully fetched"
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
 *                   enum:
 *                     - Please log in again
 *                     - CourseId is required
 *                     - Course has already been deleted
 *       404:
 *         description: Not Found - Course or lessons not found
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
 *                     - Lessons not found
 */
router.get('/get-lessons', courseController.getCourseLessons);
/**
 * @openapi
 * /course/create-lesson:
 *   post:
 *     summary: Create a new lesson
 *     description: Creates a new lesson (chapter and video) for a course, including a chapter with optional resources and a video with a pre-signed URL for upload. Only admins who created the course can create lessons. Requires authentication via a valid access token. The request includes JSON fields and an optional file for chapter resources. Returns a pre-signed URL to upload the video file.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - title
 *               - description
 *               - fileName
 *               - fileType
 *               - fileSize
 *               - videoLength
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                 description: The ID of the course to which the lesson belongs
 *               title:
 *                 type: string
 *                 example: "Introduction to Self-Leadership"
 *                 description: The title of the lesson (chapter)
 *               description:
 *                 type: string
 *                 example: "Introduction to Self-Leadership is the beginning of leadership. One should learn how to lead before leading others"
 *                 description: The description of the lesson (chapter)
 *               fileName:
 *                 type: string
 *                 example: "WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                 description: The name of the video file to be uploaded
 *               fileType:
 *                 type: string
 *                 example: "video/mp4"
 *                 description: The MIME type of the video file
 *               fileSize:
 *                 type: integer
 *                 example: 5242880
 *                 description: The size of the video file in bytes
 *               videoLength:
 *                 type: string
 *                 example: "00:02:30"
 *                 description: The duration of the video in HH:MM:SS format
 *               chapterResources:
 *                 type: string
 *                 format: binary
 *                 description: Optional resource file for the chapter (e.g., PDF, DOC) (optional)
 *     responses:
 *       201:
 *         description: Lesson created successfully, pre-signed URL returned for video upload
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
 *                     signedUrl:
 *                       type: string
 *                       example: "https://mock-presigned-url.s3.amazonaws.com/upload?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *                       description: The pre-signed URL to upload the video file
 *                     key:
 *                       type: string
 *                       example: "course-videos/1742243123271-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                       description: The key (path) where the video will be stored
 *                 message:
 *                   type: string
 *                   example: "Lesson created successfully, use the signed URL to upload."
 *               example:
 *                 status: success
 *                 data:
 *                   signedUrl: "https://mock-presigned-url.s3.amazonaws.com/upload?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *                   key: "course-videos/1742243123271-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                 message: "Lesson created successfully, use the signed URL to upload."
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
 *                   example: "CourseId, title, description, fileName, fileType, fileSize and videoLength are required"
 *                   enum:
 *                     - Please log in again
 *                     - CourseId, title, description, fileName, fileType, fileSize and videoLength are required
 *                     - Course has already been deleted
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
 *                   example: "Only an admin can create a lesson"
 *                   enum:
 *                     - Only an admin can create a lesson
 *                     - You are not authorized to create a lesson for this course
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
 *                   example: "Course not found"
 *       500:
 *         description: Internal Server Error - Failed to create chapter or video metadata
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
 *                   example: "Failed to create chapter"
 *                   enum:
 *                     - Failed to create chapter
 *                     - Failed to store video metadata
 */
/**
 * @openapi
 * /presigned-url:
 *   put:
 *     summary: Upload a video using a pre-signed URL
 *     description: Uploads a video file to the storage service using the pre-signed URL obtained from the create lesson endpoint. The request body should contain the binary video file.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: query
 *         name: signedUrl
 *         required: true
 *         schema:
 *           type: string
 *         example: "https://mock-presigned-url.s3.amazonaws.com/upload?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *         description: The pre-signed URL provided by the create lesson endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             format: binary
 *             description: The binary video file to upload
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 *               description: No data is returned upon successful upload
 *       403:
 *         description: Forbidden - Invalid or expired pre-signed URL
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
 *                   example: "The request signature we calculated does not match the signature you provided"
 *       500:
 *         description: Internal Server Error - Failed to upload the video
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
 *                   example: "Failed to upload the video to the storage service"
 */
router.post('/create-lesson', multerUpload.single('chapterResources'), courseController.createLesson);
/**
 * @openapi
 * /course/update-lesson:
 *   post:
 *     summary: Update an existing lesson
 *     description: Updates a lesson's title, description, resources, and/or video. Only admins can update lessons. Requires authentication via a valid access token. If a new video is provided, a pre-signed URL is returned for uploading the new video file. The request includes JSON fields and an optional file for chapter resources.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - chapterId
 *             properties:
 *               chapterId:
 *                 type: string
 *                 format: uuid
 *                 example: ce807c4a-6d90-4a38-86c4-55e3cd5f53b8
 *                 description: The ID of the chapter (lesson) to update
 *               title:
 *                 type: string
 *                 example: "Updated Introduction to Self-Leadership"
 *                 description: The new title of the lesson (optional)
 *               description:
 *                 type: string
 *                 example: "Updated Introduction to Self-Leadership is the beginning of leadership. One should learn how to lead before leading others"
 *                 description: The new description of the lesson (optional)
 *               chapterResources:
 *                 type: string
 *                 format: binary
 *                 description: Optional resource file for the chapter (e.g., PDF, DOC) (optional)
 *               fileName:
 *                 type: string
 *                 example: "Vite + React - Google Chrome 2023-07-22 02-03-06"
 *                 description: The name of the new video file to be uploaded (optional, required if updating video)
 *               fileType:
 *                 type: string
 *                 example: "video/mp4"
 *                 description: The MIME type of the new video file (optional, required if updating video)
 *               fileSize:
 *                 type: integer
 *                 example: 5242880
 *                 description: The size of the new video file in bytes (optional, required if updating video)
 *               videoLength:
 *                 type: string
 *                 example: "00:02:30"
 *                 description: The duration of the new video in HH:MM:SS format (optional, required if updating video)
 *     responses:
 *       200:
 *         description: Lesson updated successfully, pre-signed URL returned if video is updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         signedUrl:
 *                           type: string
 *                           example: "https://mock-presigned-url.s3.amazonaws.com/upload?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *                           description: The pre-signed URL to upload the new video file
 *                         key:
 *                           type: string
 *                           example: "course-videos/1742244360234-Vite + React - Google Chrome 2023-07-22 02-03-06"
 *                           description: The key (path) where the new video will be stored
 *                     - type: null
 *                       description: Returned when no video is updated
 *                 message:
 *                   type: string
 *                   example: "Lesson updated successfully."
 *               examples:
 *                 withVideoUpdate:
 *                   summary: Response when video is updated
 *                   value:
 *                     status: success
 *                     data:
 *                       signedUrl: "https://mock-presigned-url.s3.amazonaws.com/upload?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *                       key: "course-videos/1742244360234-Vite + React - Google Chrome 2023-07-22 02-03-06"
 *                     message: "Lesson updated successfully."
 *                 withoutVideoUpdate:
 *                   summary: Response when no video is updated
 *                   value:
 *                     status: success
 *                     data: null
 *                     message: "Lesson updated successfully."
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
 *                     - Chapter has already been deleted
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
 *                   example: "Only an admin can update a lesson"
 *       404:
 *         description: Not Found - Chapter or video not found
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
 *                     - Video not found
 *       500:
 *         description: Internal Server Error - Failed to update chapter or video metadata
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
 *                   example: "Failed to update chapter"
 *                   enum:
 *                     - Failed to update chapter
 *                     - Failed to update lesson video
 *                     - Failed to delete the existing document
 *                     - Invalid file URL. Could not extract object key
 */
/**
 * @openapi
 * /presigned-url2:
 *   put:
 *     summary: Upload a video using a pre-signed URL
 *     description: Uploads a video file to the storage service using the pre-signed URL obtained from the update lesson endpoint. The request body should contain the binary video file.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: query
 *         name: signedUrl
 *         required: true
 *         schema:
 *           type: string
 *         example: "https://mock-presigned-url.s3.amazonaws.com/upload?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *         description: The pre-signed URL provided by the update lesson endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             format: binary
 *             description: The binary video file to upload
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 *               description: No data is returned upon successful upload
 *       403:
 *         description: Forbidden - Invalid or expired pre-signed URL
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
 *                   example: "The request signature we calculated does not match the signature you provided"
 *       500:
 *         description: Internal Server Error - Failed to upload the video
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
 *                   example: "Failed to upload the video to the storage service"
 */
router.post('/update-lesson', multerUpload.single('chapterResources'), courseController.updateLesson);
/**
 * @openapi
 * /course/video/upload-status:
 *   post:
 *     summary: Update video upload status
 *     description: Updates the upload status of a video (e.g., to COMPLETED or FAILED) after the video has been uploaded using a pre-signed URL. Only admins can update the status. Requires authentication via a valid access token. Sends an email notification to the user based on the status.
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - videoUploadStatus
 *             properties:
 *               key:
 *                 type: string
 *                 example: "course-videos/1742244360234-Vite + React - Google Chrome 2023-07-22 02-03-06"
 *                 description: The key (path) of the video in the storage service
 *               videoUploadStatus:
 *                 type: string
 *                 enum: [completed, failed]
 *                 example: "completed"
 *                 description: The new upload status of the video
 *     responses:
 *       200:
 *         description: Video upload status updated successfully
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
 *                   example: "Video upload confirmed"
 *               example:
 *                 status: success
 *                 data: null
 *                 message: "Video upload confirmed"
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
 *                   example: "Video key is required"
 *                   enum:
 *                     - Please log in again
 *                     - Video key is required
 *                     - Video has already been uploaded
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
 *                   example: "Only an admin can update an uploaded video"
 *       404:
 *         description: Not Found - Video, chapter, or course not found
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
 *                   example: "Video not found"
 *                   enum:
 *                     - Video not found
 *                     - Chapter not found
 *                     - Course not found
 *       500:
 *         description: Internal Server Error - Video upload failed
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
 *                   example: "Video upload failed"
 */
router.post('/video/upload-status', courseController.createVideoUploadedStatus);
router.post('/video/upload-status-update', courseController.updateVideoUploadedStatus);

// //chapter routes
// router.get('/get-chapter', courseController.getChapter);
router.get('/get-chapters', courseController.getAllChapters);
router.post('/delete-lesson', courseController.deleteLesson);

export { router as courseRouter };
