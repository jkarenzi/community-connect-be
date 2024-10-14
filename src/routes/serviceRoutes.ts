import { Router } from 'express';
import { 
    createService, 
    getAllServices, 
    getServiceById, 
    updateService, 
    deleteService, 
    getAllOwnServices
} from '../controllers/serviceController';
import { authenticateToken } from '../middleware/authenticate';
import { upload } from '../middleware/multer';

const router = Router();

router.route('/')
    .get(getAllServices)
    .post(authenticateToken, upload.single('image'), createService);

router.route('/own').get(authenticateToken, getAllOwnServices)    

router.route('/:id')
    .get(getServiceById)
    .patch(authenticateToken, updateService)
    .delete(authenticateToken, deleteService);

export default router;
