import { learningJourneyController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
router.post('/create', learningJourneyController.addLearningJourney);
router.get('/all', learningJourneyController.getAllLearningJourney);
router.post('/create-user', learningJourneyController.addUserLearningJourney);
router.get('/all-user', learningJourneyController.getAllUserLearningJourney);
// router.get('/all-user', quizController.findAllQuizScoreByUserId);
// router.get('/all-user-course', quizController.findAllUserCourseQuizScore);
// router.post('/update', quizController.updateQuizScore);

export { router as learningJourneyRouter };
