import { Router } from "express";
import authRoutes from "./authRoutes";
import serviceRoutes from "./serviceRoutes"
import reviewRoutes from './reviewRoutes'


const router = Router()

router.use('/auth', authRoutes)
router.use('/service', serviceRoutes)
router.use('review', reviewRoutes)


export default router