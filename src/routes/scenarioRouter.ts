import { multerUpload } from '@/common/config';
import { scenarioController } from '@/controllers';
import { protect } from '@/middlewares/protect';
import express from 'express';

const router = express.Router();

//protect all routes after this middleware
router.use(protect);
router.get('/', scenarioController.getAllScenarios);
router.get('/all', scenarioController.findOne);
router.post('/create-scenario', multerUpload.single('scenarioImage'), scenarioController.createScenario);
router.post('/update-scenario', multerUpload.single('scenarioImage'), scenarioController.updateScenario);
router.post('/delete-scenario', scenarioController.deleteScenario);

export { router as scenarioRouter };
