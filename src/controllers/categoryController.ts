import { Request, Response } from "express";
import Category from "../entities/Category";
import { AppDataSource } from "../config/dataSource";
import { categorySchema } from "../middleware/categorySchema";
import User from "../entities/User";

const categoryRepository = AppDataSource.getRepository(Category)

export default class CategoryController {
    static async createCategory (req:Request,res:Response) {
        const user = req.user!
        const formData = req.body;

        console.log(formData)

        const validationResult = categorySchema.validate(formData);
        
        if (validationResult.error) {
            return res
            .status(400)
            .json({
                status: 'error',
                message: validationResult.error.details[0].message,
            });
        }

        try {
            const existingCategory = await categoryRepository.findOne({where:{
                name: formData.name,
                user: {id: user.id}
            }})

            if(existingCategory){
                return res.status(409).json({message:'Category already exists'})
            }

            const category = new Category();
            category.user = user as User
            category.name = formData.name;

            if(formData.limit){
                category.limit = formData.limit
            }
        
            await categoryRepository.save(category);
            return res.status(201).json({...category, totalExpenses: 0});
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getCategories (req:Request,res:Response) {
        const user = req.user!
        try {
            const { raw, entities } = await categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.expenses', 'expense')
            .select([
                'category.id', 
                'category.name', 
                'category.limit',
                'SUM(expense.amount) as totalExpenses'
            ])
            .where('category.userId = :id', {id: user.id})
            .groupBy('category.id')
            .getRawAndEntities();

            const formattedResult = entities.map((entity, index) => {
                return {
                    id: entity.id,
                    name: entity.name,
                    limit: entity.limit,
                    totalExpenses: raw[index].totalexpenses || 0
                }
            })

            return res.status(200).json(formattedResult);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async updateCategory (req:Request,res:Response) {
        const { id } = req.params;
        const formData = req.body;

        const validationResult = categorySchema.validate(formData);
        
        if (validationResult.error) {
            return res
            .status(400)
            .json({
                status: 'error',
                message: validationResult.error.details[0].message,
            });
        }
    
        try {
            const category = await categoryRepository.findOne({
                where:{
                    id:parseInt(id)
                },
                relations:["expenses"]
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        
            // Update values
            category.name = formData.name;
            if(formData.limit){
                category.limit = formData.limit
            }
        
            // Save updated category
            await categoryRepository.save(category);

            const { raw, entities } = await categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.expenses', 'expense')
            .select([
                'category.id', 
                'category.name', 
                'category.limit',
                'SUM(expense.amount) as totalExpenses'
            ])
            .where('category.id = :id', {id: id})
            .groupBy('category.id')
            .getRawAndEntities();

            const formattedResult = entities.map((entity, index) => {
                return {
                    id: entity.id,
                    name: entity.name,
                    limit: entity.limit,
                    totalExpenses: raw[index].totalexpenses || 0
                }
            })

            return res.status(200).json(formattedResult[0]);
        } catch (error) {
            console.log (error)
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteCategory (req:Request,res:Response) {
        const { id } = req.params;
        
        try {
            const category = await categoryRepository.findOneBy({id: parseInt(id)});
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await categoryRepository.remove(category);
            return res.status(204).json({});
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}