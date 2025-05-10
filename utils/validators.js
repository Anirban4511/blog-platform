import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

//Login validation schema
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Post validation schemas
export const postSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    content: Joi.string().min(10).required(),
    tags: Joi.array().items(Joi.string()).max(5)
});

// Comment validation schemas
export const commentSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required()
});

// Profile update validation schema
export const profileUpdateSchema = Joi.object({
    username: Joi.string().min(3).max(30),
    bio: Joi.string().max(500),
    avatar: Joi.string().uri()
});

// Search validation schema
export const searchSchema = Joi.object({
    query: Joi.string().min(1).required(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(10)
});
