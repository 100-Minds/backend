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
 * /course/get-courses:
 *   get:
 *     summary: Retrieve all courses
 *     description: Retrieves a list of all courses. Requires authentication via a valid access token.
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
 *                         example: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                         description: The ID of the course
 *                       name:
 *                         type: string
 *                         example: "PS101 Self-Leadership"
 *                         description: The name of the course
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                         description: The ID of the user who created the course
 *                       scenarioName:
 *                         type: string
 *                         example: "Expert"
 *                         description: The name of the associated scenario (null if not provided)
 *                       scenarioId:
 *                         type: string
 *                         format: uuid
 *                         example: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                         description: The ID of the associated scenario (null if not provided)
 *                       moduleId:
 *                         type: string
 *                         format: uuid
 *                         example: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                         description: The ID of the module associated with the course
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                         description: Indicates if the course is deleted
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-13T22:22:56.990Z
 *                         description: The creation date of the course
 *                 message:
 *                   type: string
 *                   example: Courses successfully fetched
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 9c816faa-7a82-4f5e-94ee-1869e77d33c1
 *                     name: "PS101 Self-Leadership"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     scenarioName: "Expert"
 *                     scenarioId: 1c7e3c87-b877-4239-a7cd-346d3d42af5c
 *                     moduleId: 65cf4f6d-01bf-4699-885f-191bb83d19d2
 *                     isDeleted: false
 *                     created_at: 2025-03-13T22:22:56.990Z
 *                   - id: abfb6988-c506-47f2-9fec-000ce3b35694
 *                     name: "PS102 Personal Effectiveness and Productivity"
 *                     userId: 0af8edf7-e4e6-4774-9dac-4ce104ace38c
 *                     scenarioName: "Intermediate"
 *                     scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                     moduleId: 20104f7d-a689-4c27-864a-db899e19068a
 *                     isDeleted: false
 *                     created_at: 2025-03-17T18:54:08.195Z
 *                 message: Courses successfully fetched
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
 *                   example: No Course found
 */
router.get('/get-courses', courseController.getCourses);
/**
 * @openapi
 * /course/create-course:
 *   post:
 *     summary: Create a new course
 *     description: Creates a new course with associated module, scenario, and power skills. Only admins can create courses. Requires authentication via a valid access token. The course details are provided in the request body.
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
 *               - moduleId
 *               - skills
 *             properties:
 *               name:
 *                 type: string
 *                 example: "PS102 Personal Effectiveness and Productivity"
 *                 description: The name of the course
 *               moduleId:
 *                 type: string
 *                 format: uuid
 *                 example: 20104f7d-a689-4c27-864a-db899e19068a
 *                 description: The ID of the module associated with the course
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Self Awareness", "Adaptability", "Critical Thinking"]
 *                 description: An array of power skill names to associate with the course
 *               scenario:
 *                 type: string
 *                 example: "Intermediate"
 *                 description: The name of the scenario (optional)
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
 *                         example: abfb6988-c506-47f2-9fec-000ce3b35694
 *                         description: The ID of the created course
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
 *                   example: Course created successfully
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
 *                 message: Course created successfully
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
 *                   example: Course name and at least one power skill are required
 *                   enum:
 *                     - Please log in again
 *                     - Course name and at least one power skill are required
 *                     - Invalid power skills provided
 *                     - Course name exist already
 *                     - Scenario not found
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
 *                   example: Only an admin can create a course
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
 *       500:
 *         description: Internal Server Error - Failed to create course or add skills
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
 *                   example: Failed to create course
 *                   enum:
 *                     - Failed to create course
 *                     - Failed to add power skills to course
 */
router.post('/create-course', courseController.createCourse);
/**
 * @openapi
 * /course/update-course:
 *   post:
 *     summary: Update a course
 *     description: Updates an existing course's details (name, scenario, and/or power skills). Only admins who created the course can update it. Requires authentication via a valid access token. The course ID and optional fields to update are provided in the request body.
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
 *                 description: The ID of the course to update
 *               name:
 *                 type: string
 *                 example: "PS102 Personal Effectiveness and Productivity"
 *                 description: The new name for the course (optional)
 *               scenario:
 *                 type: string
 *                 example: "Intermediate"
 *                 description: The new scenario name for the course (optional)
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Self Awareness", "Adaptability", "Critical Thinking"]
 *                 description: An array of new power skill names to associate with the course (optional)
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
 *                         example: abfb6988-c506-47f2-9fec-000ce3b35694
 *                         description: The ID of the updated course
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
 *                   example: Course updated successfully
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
 *                 message: Course updated successfully
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
 *                     - Course has already been deleted
 *                     - Scenario not found
 *                     - Invalid power skills provided
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
 *                   example: Only an admin can update a course
 *                   enum:
 *                     - Only an admin can update a course
 *                     - You are not authorized to update this course
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
 *       500:
 *         description: Internal Server Error - Failed to update skills
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
 *                   example: Failed to remove power skills from the course
 *                   enum:
 *                     - Failed to remove power skills from the course
 *                     - Failed to update power skills for the course
 */
router.post('/update-course', courseController.updateCourse);
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
 *     description: Retrieves a specific lesson (chapter and associated videos) for a course, identified by the courseId and chapterId. Requires authentication via a valid access token. The courseId and chapterId are provided as query parameters.
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
 *         description: The ID of the course to retrieve the lesson from
 *       - in: query
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: d23fd6d4-6416-4474-b056-748d162f34fa
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
 *                             example: abfb6988-c506-47f2-9fec-000ce3b35694
 *                             description: The ID of the course
 *                           name:
 *                             type: string
 *                             example: "PS102 Personal Effectiveness and Productivity"
 *                             description: The name of the course
 *                       chapter:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: d23fd6d4-6416-4474-b056-748d162f34fa
 *                             description: The ID of the chapter
 *                           title:
 *                             type: string
 *                             example: "Chapter 1"
 *                             description: The title of the chapter
 *                           chapterNumber:
 *                             type: integer
 *                             example: 1
 *                             description: The chapter number within the course
 *                           courseId:
 *                             type: string
 *                             format: uuid
 *                             example: abfb6988-c506-47f2-9fec-000ce3b35694
 *                             description: The ID of the course the chapter belongs to
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                             description: Indicates if the chapter is deleted
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-03-17T20:25:23.263Z
 *                             description: The creation date of the chapter
 *                       video:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: ff357bca-0e51-46f4-a37f-8fafbb9feb5e
 *                               description: The ID of the video
 *                             videoURL:
 *                               type: string
 *                               example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1742243123271-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                               description: The URL of the video file
 *                             isDeleted:
 *                               type: boolean
 *                               example: false
 *                               description: Indicates if the video is deleted
 *                             duration:
 *                               type: string
 *                               example: "00:24"
 *                               description: The duration of the video in MM:SS format
 *                             chapterId:
 *                               type: string
 *                               format: uuid
 *                               example: d23fd6d4-6416-4474-b056-748d162f34fa
 *                               description: The ID of the chapter the video belongs to
 *                             uploadStatus:
 *                               type: string
 *                               example: "processing"
 *                               description: The upload status of the video (e.g., processing, completed, failed)
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-03-17T20:25:23.326Z
 *                               description: The creation date of the video
 *                 message:
 *                   type: string
 *                   example: "Chapters and lessons successfully fetched"
 *               example:
 *                 status: success
 *                 data:
 *                   - course:
 *                       id: abfb6988-c506-47f2-9fec-000ce3b35694
 *                       name: "PS102 Personal Effectiveness and Productivity"
 *                     chapter:
 *                       id: d23fd6d4-6416-4474-b056-748d162f34fa
 *                       title: "Chapter 1"
 *                       chapterNumber: 1
 *                       courseId: abfb6988-c506-47f2-9fec-000ce3b35694
 *                       isDeleted: false
 *                       created_at: "2025-03-17T20:25:23.263Z"
 *                     video:
 *                       - id: ff357bca-0e51-46f4-a37f-8fafbb9feb5e
 *                         videoURL: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1742243123271-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                         isDeleted: false
 *                         duration: "00:24"
 *                         chapterId: d23fd6d4-6416-4474-b056-748d162f34fa
 *                         uploadStatus: "processing"
 *                         created_at: "2025-03-17T20:25:23.326Z"
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
 *                   example: "Please log in again"
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
 *         example: abfb6988-c506-47f2-9fec-000ce3b35694
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
 *                             example: abfb6988-c506-47f2-9fec-000ce3b35694
 *                             description: The ID of the course
 *                           name:
 *                             type: string
 *                             example: "PS102 Personal Effectiveness and Productivity"
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
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                             description: Indicates if the course is deleted
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-03-17T18:54:08.195Z
 *                             description: The creation date of the course
 *                       chapters:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: d23fd6d4-6416-4474-b056-748d162f34fa
 *                               description: The ID of the chapter
 *                             title:
 *                               type: string
 *                               example: "Chapter 1"
 *                               description: The title of the chapter
 *                             chapterNumber:
 *                               type: integer
 *                               example: 1
 *                               description: The chapter number within the course
 *                             videos:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     format: uuid
 *                                     example: ff357bca-0e51-46f4-a37f-8fafbb9feb5e
 *                                     description: The ID of the video
 *                                   videoURL:
 *                                     type: string
 *                                     example: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1742243123271-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
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
 *                                     example: d23fd6d4-6416-4474-b056-748d162f34fa
 *                                     description: The ID of the chapter the video belongs to
 *                                   uploadStatus:
 *                                     type: string
 *                                     example: "processing"
 *                                     description: The upload status of the video (e.g., processing, completed, failed)
 *                                   created_at:
 *                                     type: string
 *                                     format: date-time
 *                                     example: 2025-03-17T20:25:23.326Z
 *                                     description: The creation date of the video
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                               example: 2025-03-17T20:25:23.263Z
 *                               description: The creation date of the chapter
 *                 message:
 *                   type: string
 *                   example: "Chapters and lessons successfully fetched"
 *               example:
 *                 status: success
 *                 data:
 *                   - course:
 *                       id: abfb6988-c506-47f2-9fec-000ce3b35694
 *                       name: "PS102 Personal Effectiveness and Productivity"
 *                       scenarioName: "Intermediate"
 *                       scenarioId: 2c093d7a-bfc6-4e25-af67-7aeb7dae64b9
 *                       moduleId: 20104f7d-a689-4c27-864a-db899e19068a
 *                       isDeleted: false
 *                       created_at: "2025-03-17T18:54:08.195Z"
 *                     chapters:
 *                       - id: d23fd6d4-6416-4474-b056-748d162f34fa
 *                         title: "Chapter 1"
 *                         chapterNumber: 1
 *                         videos:
 *                           - id: ff357bca-0e51-46f4-a37f-8fafbb9feb5e
 *                             videoURL: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1742243123271-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                             isDeleted: false
 *                             duration: "00:24"
 *                             chapterId: d23fd6d4-6416-4474-b056-748d162f34fa
 *                             uploadStatus: "processing"
 *                             created_at: "2025-03-17T20:25:23.326Z"
 *                         created_at: "2025-03-17T20:25:23.263Z"
 *                       - id: 03f4dbb1-533c-49dd-be7d-19ea4a4d2625
 *                         title: "Chapter 2"
 *                         chapterNumber: 2
 *                         videos:
 *                           - id: bc417a3c-3c79-49e8-b199-c91e18c92ec8
 *                             videoURL: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1742243377519-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                             isDeleted: false
 *                             duration: "00:24"
 *                             chapterId: 03f4dbb1-533c-49dd-be7d-19ea4a4d2625
 *                             uploadStatus: "processing"
 *                             created_at: "2025-03-17T20:29:37.526Z"
 *                         created_at: "2025-03-17T20:29:37.518Z"
 *                       - id: 8b2565a5-e002-43eb-b520-2c7f8fff40bf
 *                         title: "Chapter 3"
 *                         chapterNumber: 3
 *                         videos:
 *                           - id: 17fe3554-61f3-466b-b9db-9fb75cf3276c
 *                             videoURL: "https://pub-b3c115b60ec04ceaae8ac7360bf42530.r2.dev/course-videos/1742243452503-WhatsApp Video 2025-03-10 at 23.37.22_66d88e03"
 *                             isDeleted: false
 *                             duration: "00:24"
 *                             chapterId: 8b2565a5-e002-43eb-b520-2c7f8fff40bf
 *                             uploadStatus: "processing"
 *                             created_at: "2025-03-17T20:30:52.510Z"
 *                         created_at: "2025-03-17T20:30:52.502Z"
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
 *                   example: "Please log in again"
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
 *     description: Creates a new lesson (chapter and video) for a course. Only admins who created the course can create lessons. Requires authentication via a valid access token. Returns a pre-signed URL to upload the video file.
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
 *               - title
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
 *                   example: "CourseId, title, fileName, fileType, fileSize and videoLength are required"
 *                   enum:
 *                     - Please log in again
 *                     - CourseId, title, fileName, fileType, fileSize and videoLength are required
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
 *                   example: "Only an admin can create a chapter"
 *                   enum:
 *                     - Only an admin can create a chapter
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
router.post('/create-lesson', courseController.createLesson);
/**
 * @openapi
 * /course/update-lesson:
 *   post:
 *     summary: Update an existing lesson
 *     description: Updates a lesson's title and/or video. Only admins can update lessons. Requires authentication via a valid access token. If a new video is provided, a pre-signed URL is returned for uploading the new video file.
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
 *               example:
 *                 status: success
 *                 data:
 *                   signedUrl: "https://mock-presigned-url.s3.amazonaws.com/upload?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *                   key: "course-videos/1742244360234-Vite + React - Google Chrome 2023-07-22 02-03-06"
 *                 message: "Lesson updated successfully."
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
router.post('/update-lesson', courseController.updateLesson);
/**
 * @openapi
 * /course/videos/upload-status:
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
router.post('/video/upload-status', courseController.updateVideoUploadedStatus);

// //chapter routes
// router.get('/get-chapter', courseController.getChapter);
// router.get('/get-chapters', courseController.getAllChapters);

export { router as courseRouter };
