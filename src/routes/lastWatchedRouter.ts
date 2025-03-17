import { lastWatchedController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
router.post('/create', lastWatchedController.create);
router.get('/user', lastWatchedController.getUserLastWatched);

export { router as lastWatchedRouter };
