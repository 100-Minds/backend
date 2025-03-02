import { teamController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
//Team endpoints
router.get('/team', teamController.getTeam);
router.get('/user-teams', teamController.getUserTeams);
router.post('/create-team', teamController.createTeam);
router.post('/update-team', teamController.updateTeam);
router.post('/delete-team', teamController.deleteTeam);

//Team members endpoints
router.get('/team-members', teamController.getTeamMembers);
router.post('/join-team', teamController.joinTeam);
router.post('/remove-member', teamController.removeTeamMember);

//Team invites endpoints
router.post('/invite-member', teamController.createInvite);

export { router as teamRouter };
