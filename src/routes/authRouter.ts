import { authController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/password/forgot', authController.forgotPassword);
router.post('/password/reset', authController.resetPassword);

//protect all routes after this middleware
router.use(protect);
router.get('/sign-out', authController.signOut);

export { router as authRouter };
