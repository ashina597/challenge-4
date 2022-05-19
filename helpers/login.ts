import Joi from'joi'
export const LoginSchema=Joi.object({
    email:Joi.string().email(),
    user_password:Joi.string().required().min(8).max(30)
})