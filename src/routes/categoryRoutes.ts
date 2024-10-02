import { Router } from "express";
import { authenticateToken } from "../middleware/authenticate";
import CategoryController from "../controllers/categoryController";

const categoryRouter = Router()

categoryRouter.use(authenticateToken)

categoryRouter
.route('/')
.get(CategoryController.getCategories)
.post(CategoryController.createCategory)

categoryRouter
.route('/:id')
.patch(CategoryController.updateCategory)
.delete(CategoryController.deleteCategory)

export default categoryRouter