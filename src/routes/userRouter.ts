import { userController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

router.use(protect);
router.get('/', userController.getProfile);
router.get('/all', userController.getAllUsers);
router.post('/update-user', userController.updateProfile);

export { router as userRouter };
