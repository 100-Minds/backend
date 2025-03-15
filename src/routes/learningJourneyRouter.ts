import { learningJourneyController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
//learning journey
router.post('/create', learningJourneyController.addLearningJourney);
router.get('/all', learningJourneyController.getAllLearningJourney);

//user learning journey
router.post('/create-user', learningJourneyController.addUserLearningJourney);
router.get('/all-user', learningJourneyController.getAllUserLearningJourney);

// course learning journey
router.get('/all-course', learningJourneyController.getAllCourseLearningJourney);
router.get('/all-user-course', learningJourneyController.getAllUserCourseLearningJourney);

export { router as learningJourneyRouter };
