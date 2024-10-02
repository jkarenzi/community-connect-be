import { Router } from "express";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes";
import expenseRoutes from "./expenseRoutes";

const router = Router()

router.use('/auth', authRoutes)
router.use('/category', categoryRoutes)
router.use('/expense', expenseRoutes)

export default router