import { courseController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';
import { multerUpload } from '@/common/config';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
router.get('/get-course', courseController.getCourse);
router.post('/create-course', courseController.createCourse);
router.post('/update-course', courseController.updateCourse);
router.post('/delete-course', courseController.deleteCourse);

//lesson route
router.get('/get-lesson', courseController.getCourseLesson);
router.get('/get-lessons', courseController.getCourseLessons);
router.post('/create-lesson', multerUpload.single('video'), courseController.createLesson);
router.post('/update-lesson', multerUpload.single('video'), courseController.updateLesson);

// //chapter routes
// router.get('/get-chapter', courseController.getChapter);
// router.get('/get-chapters', courseController.getAllChapters);

export { router as courseRouter };
