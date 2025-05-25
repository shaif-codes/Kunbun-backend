import Joi from "joi";

// Parameter validation for message routes
const messageParams = Joi.object({
    messageId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid message ID format',
            'any.required': 'Message ID is required'
        })
});

// Team parameter validation
const teamParams = Joi.object({
    teamId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid team ID format',
            'any.required': 'Team ID is required'
        })
});

// Create message validation
const createMessage = Joi.object({
    content: Joi.string()
        .trim()
        .min(1)
        .max(2000)
        .required()
        .messages({
            'string.empty': 'Message content is required',
            'string.min': 'Message cannot be empty',
            'string.max': 'Message cannot exceed 2000 characters',
            'any.required': 'Message content is required'
        }),
    teamId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid team ID format',
            'any.required': 'Team ID is required'
        })
});

// Update message validation
const updateMessage = Joi.object({
    content: Joi.string()
        .trim()
        .min(1)
        .max(2000)
        .required()
        .messages({
            'string.empty': 'Message content is required',
            'string.min': 'Message cannot be empty',
            'string.max': 'Message cannot exceed 2000 characters',
            'any.required': 'Message content is required'
        })
});

// Query validation for getting messages
const getMessagesQuery = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be at least 1'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(50)
        .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 100'
        })
});

// Search messages validation
const searchMessages = Joi.object({
    query: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Search query is required',
            'string.min': 'Search query cannot be empty',
            'string.max': 'Search query cannot exceed 100 characters',
            'any.required': 'Search query is required'
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be at least 1'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(20)
        .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 50'
        })
});

export const messageSchema = {
    messageParams,
    teamParams,
    createMessage,
    updateMessage,
    getMessagesQuery,
    searchMessages
};
