import Joi from "joi";

// Parameter validation for team routes
const teamParams = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid team ID format',
            'any.required': 'Team ID is required'
        })
});

// Create team validation
const createTeam = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Team name is required',
            'string.min': 'Team name must be at least 2 characters long',
            'string.max': 'Team name cannot exceed 100 characters',
            'any.required': 'Team name is required'
        }),
    description: Joi.string()
        .max(500)
        .allow('')
        .messages({
            'string.max': 'Team description cannot exceed 500 characters'
        }),
    adminId: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one admin is required',
            'any.required': 'Team admin is required',
            'string.pattern.base': 'Invalid admin ID format'
        })
});

// Update team validation
const updateTeam = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages({
            'string.min': 'Team name must be at least 2 characters long',
            'string.max': 'Team name cannot exceed 100 characters'
        }),
    description: Joi.string()
        .max(500)
        .allow('')
        .messages({
            'string.max': 'Team description cannot exceed 500 characters'
        }),
    adminId: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .messages({
            'array.min': 'At least one admin is required',
            'string.pattern.base': 'Invalid admin ID format'
        })
});

// Add members to team validation
const addMembers = Joi.object({
    userIds: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one user ID is required',
            'any.required': 'User IDs are required',
            'string.pattern.base': 'Invalid user ID format'
        })
});

// Remove member from team validation
const removeMember = Joi.object({
    userId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid user ID format',
            'any.required': 'User ID is required'
        })
});

export const teamSchema = {
    teamParams,
    createTeam,
    updateTeam,
    addMembers,
    removeMember
};
