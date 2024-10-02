import { Router } from "express";
import { authenticateToken } from "../middleware/authenticate";
import ExpenseController from "../controllers/expenseController";

const expenseRouter = Router()

expenseRouter.use(authenticateToken)

expenseRouter.route('/')
.post(ExpenseController.createExpense)
.get(ExpenseController.getExpenses)

expenseRouter.route('/:id')
.patch(ExpenseController.updateExpense)
.delete(ExpenseController.deleteExpense)

export default expenseRouter