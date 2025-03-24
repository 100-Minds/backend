import { statsController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);

/**
 * @openapi
 * /statistics/stats:
 *   get:
 *     summary: Retrieve system statistics
 *     description: Fetches various system statistics such as total users, role plays, teams, power skills, learning journeys, and courses. Only accessible to admin users. Requires authentication via a valid access token.
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
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
 *                       totalUsers:
 *                         type: integer
 *                         example: 12
 *                         description: Total number of users in the system
 *                       totalRolePlay:
 *                         type: integer
 *                         example: 6
 *                         description: Total number of role play scenarios
 *                       totalTeams:
 *                         type: integer
 *                         example: 4
 *                         description: Total number of teams
 *                       totalPowerSkill:
 *                         type: integer
 *                         example: 7
 *                         description: Total number of power skills
 *                       totalLearningJourney:
 *                         type: integer
 *                         example: 1
 *                         description: Total number of learning journeys
 *                       totalCourses:
 *                         type: integer
 *                         example: 1
 *                         description: Total number of courses
 *                 message:
 *                   type: string
 *                   example: Stats fetched successfully
 *               example:
 *                 status: success
 *                 data:
 *                   - totalUsers: 12
 *                     totalRolePlay: 6
 *                     totalTeams: 4
 *                     totalPowerSkill: 7
 *                     totalLearningJourney: 1
 *                     totalCourses: 1
 *                 message: Stats fetched successfully
 *       400:
 *         description: Bad Request - User not authenticated
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
 *       401:
 *         description: Unauthorized - Insufficient permissions
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
 *                   example: Unauthorized access
 *       404:
 *         description: Not Found - No statistics available
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
 *                   example: No statistics found
 */
router.get('/stats', statsController.findStats);

export { router as statsRouter };
