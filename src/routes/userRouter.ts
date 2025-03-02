import { userController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import { multerUpload } from '@/common/config';
import express from 'express';

const router = express.Router();

router.use(protect);
router.get('/', userController.getProfile);
router.get('/all', userController.getAllUsers);
router.post('/update-user', userController.updateProfile);
router.post('/upload-profile-picture', multerUpload.single('photo'), userController.uploadProfilePicture);

export { router as userRouter };
