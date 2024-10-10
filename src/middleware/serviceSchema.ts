import Joi from 'joi';


export const createServiceSchema = Joi.object({
    type: Joi.string().required(),
    location: Joi.string().required(),
    availability: Joi.boolean().required(),
    pricing: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required()
});


export const updateServiceSchema = Joi.object({
    type: Joi.string().optional(),
    location: Joi.string().optional(),
    availability: Joi.boolean().optional(),
    pricing: Joi.number().optional(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().uri().optional(),
});
