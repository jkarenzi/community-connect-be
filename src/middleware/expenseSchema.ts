import Joi from 'joi'

export const expenseSchema = Joi.object({
    description: Joi.string().required(),
    amount: Joi.number().required(),
    categoryId: Joi.number().required(),
    date: Joi.date().required()
})