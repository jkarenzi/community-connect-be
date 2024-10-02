import Joi from 'joi'

export const categorySchema = Joi.object({
    name: Joi.string().required(),
    limit: Joi.number().allow(null)
})