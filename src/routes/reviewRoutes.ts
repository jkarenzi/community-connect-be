import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticate';
import { getReviewsByServiceId, leaveReview } from '../controllers/reviewController';

const router = Router();

router.route('/')
    .get(authenticateToken, getReviewsByServiceId)
    .post(authenticateToken, leaveReview); 


export default router;
