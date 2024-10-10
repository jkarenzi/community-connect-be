import Joi from 'joi'

export const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[A-Za-z0-9]{8,}$/)
    .message(
      'Password must be at least 8 characters long and contain only letters and numbers'
    )
    .required()
})

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^[A-Za-z0-9]{8,}$/)
  .message(
    'Password must be at least 8 characters long and contain only letters and numbers'
  )
  .required(),
  role: Joi.string().valid('consumer','serviceProvider')
})