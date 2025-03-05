import { quizController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
router.post('/create', quizController.createQuiz);
router.get('/id', quizController.getUserQuizScoreById);
router.get('/all-courseid', quizController.findAllQuizScoreByCourseId);
router.get('/all-courseid-userid', quizController.findAllQuizScoreByCourseIdAndUserId);
router.get('/all-user', quizController.findAllQuizScoreByUserId);
router.get('/all-user-course', quizController.findAllUserCourseQuizScore);
router.post('/update', quizController.updateQuizScore);

export { router as quizRouter };
