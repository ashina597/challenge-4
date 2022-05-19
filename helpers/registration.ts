import Joi from "joi";

 export const Registerschema=Joi.object({
    fullname:Joi.string().required(),
    username:Joi.string().required(),
    email:Joi.string().required(),
    age:Joi.number().required(),
    roles:Joi.string().required(),
    user_password:Joi.string().required().min(8).max(30)
})