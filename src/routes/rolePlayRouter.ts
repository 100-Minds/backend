import { rolePlayController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
router.get('/user', rolePlayController.getUserRolePlay);
router.get('/all-user', rolePlayController.getUserRolePlays);
router.post('/create-role-play', rolePlayController.createRolePlay);
router.post('/update-role-play', rolePlayController.updateRolePlay);

export { router as rolePlayRouter };
