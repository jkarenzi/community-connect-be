import { Request, Response } from "express";
import Expense from "../entities/Expense";
import { AppDataSource } from "../config/dataSource";
import Category from "../entities/Category";
import { expenseSchema } from "../middleware/expenseSchema";
import User from "../entities/User";

const expenseRepository = AppDataSource.getRepository(Expense)
const categoryRepository = AppDataSource.getRepository(Category)

export default class ExpenseController {
    static async createExpense (req:Request,res:Response) {
        const user = req.user!
        const formData = req.body;

        const validationResult = expenseSchema.validate(formData);
        
        if (validationResult.error) {
            return res
            .status(400)
            .json({
                status: 'error',
                message: validationResult.error.details[0].message,
            });
        }

        try {
            const category = await categoryRepository.findOneBy({id: parseInt(formData.categoryId)})
            console.log(category)
            const expense = new Expense();
            expense.description = formData.description
            expense.amount = formData.amount
            expense.category = category!
            expense.user = user as User
            expense.date = formData.date
        
            await expenseRepository.save(expense);
            return res.status(201).json(expense);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getExpenses (req:Request,res:Response) {
        const user = req.user!
        const from = req.query.from as string | undefined;
        const to = req.query.to as string | undefined;
        const categories = req.query.categories as string[] | undefined

        console.log(from)
        console.log(to)
        console.log(categories)

        try {
            const queryBuilder = expenseRepository.createQueryBuilder('expense')
            .where('expense.userId = :userId', { userId: user.id });

            if (from) {
                const fromDate = new Date(from)
                queryBuilder.andWhere('expense.date >= :fromDate', { fromDate });
            }

            if (to) {
                const toDate = new Date(to)
                queryBuilder.andWhere('expense.date <= :toDate', { toDate });
            }

            if (categories) {
                const categoryIds = categories.map(Number);
                queryBuilder.andWhere('expense.categoryId IN (:...categoryIds)', { categoryIds });
            }

            const expenses = await queryBuilder
                .leftJoinAndSelect('expense.category', 'category')
                .getMany();

            return res.status(200).json(expenses);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async updateExpense (req:Request,res:Response) {
        const { id } = req.params;
        const formData = req.body;

        const validationResult = expenseSchema.validate(formData);
        
        if (validationResult.error) {
            return res
            .status(400)
            .json({
                status: 'error',
                message: validationResult.error.details[0].message,
            });
        }
    
        try {
            const expense = await expenseRepository.findOneBy({id:parseInt(id)});
            if (!expense) {
                return res.status(404).json({ message: "Expense not found" });
            }

            const category = await categoryRepository.findOneBy({id:parseInt(formData.categoryId)})

        
            // Update values
            expense.description = formData.description ?? expense.description
            expense.category = category ?? expense.category
            expense.amount = formData.amount ?? expense.amount
            expense.date = formData.date ?? expense.date
            
            // Save updated category
            await expenseRepository.save(expense);
            return res.status(200).json(expense);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteExpense (req:Request,res:Response) {
        const { id } = req.params;
        
        try {
            const expense = await expenseRepository.findOneBy({id: parseInt(id)});
            if (!expense) {
                return res.status(404).json({ message: "Expense not found" });
            }

            await expenseRepository.remove(expense);
            return res.status(204).json({});
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}