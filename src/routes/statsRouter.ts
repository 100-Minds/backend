import { statsController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);

router.get('/stats', statsController.findStats);

export { router as statsRouter };
