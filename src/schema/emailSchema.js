import Joi from 'joi';

// Test email schema
export const testEmailSchema = Joi.object({
    to: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
    }),
    subject: Joi.string().min(1).max(200).required().messages({
        'string.min': 'Subject must be at least 1 character long',
        'string.max': 'Subject cannot exceed 200 characters',
        'any.required': 'Subject is required'
    }),
    message: Joi.string().min(1).max(5000).required().messages({
        'string.min': 'Message must be at least 1 character long',
        'string.max': 'Message cannot exceed 5000 characters',
        'any.required': 'Message is required'
    })
});

// Welcome email schema
export const welcomeEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
    }),
    name: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Name must be at least 1 character long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
    })
});

// Team invitation email schema
export const teamInvitationEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
    }),
    userName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'User name must be at least 1 character long',
        'string.max': 'User name cannot exceed 100 characters',
        'any.required': 'User name is required'
    }),
    teamName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Team name must be at least 1 character long',
        'string.max': 'Team name cannot exceed 100 characters',
        'any.required': 'Team name is required'
    }),
    inviterName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Inviter name must be at least 1 character long',
        'string.max': 'Inviter name cannot exceed 100 characters',
        'any.required': 'Inviter name is required'
    })
});

// Project assignment email schema
export const projectAssignmentEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
    }),
    userName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'User name must be at least 1 character long',
        'string.max': 'User name cannot exceed 100 characters',
        'any.required': 'User name is required'
    }),
    projectName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Project name must be at least 1 character long',
        'string.max': 'Project name cannot exceed 100 characters',
        'any.required': 'Project name is required'
    }),
    assignerName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Assigner name must be at least 1 character long',
        'string.max': 'Assigner name cannot exceed 100 characters',
        'any.required': 'Assigner name is required'
    })
});

// Task assignment email schema
export const taskAssignmentEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
    }),
    userName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'User name must be at least 1 character long',
        'string.max': 'User name cannot exceed 100 characters',
        'any.required': 'User name is required'
    }),
    taskTitle: Joi.string().min(1).max(200).required().messages({
        'string.min': 'Task title must be at least 1 character long',
        'string.max': 'Task title cannot exceed 200 characters',
        'any.required': 'Task title is required'
    }),
    projectName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Project name must be at least 1 character long',
        'string.max': 'Project name cannot exceed 100 characters',
        'any.required': 'Project name is required'
    }),
    assignerName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Assigner name must be at least 1 character long',
        'string.max': 'Assigner name cannot exceed 100 characters',
        'any.required': 'Assigner name is required'
    })
});

// Notification email schema
export const notificationEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
    }),
    userName: Joi.string().min(1).max(100).required().messages({
        'string.min': 'User name must be at least 1 character long',
        'string.max': 'User name cannot exceed 100 characters',
        'any.required': 'User name is required'
    }),
    title: Joi.string().min(1).max(200).required().messages({
        'string.min': 'Title must be at least 1 character long',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required'
    }),
    message: Joi.string().min(1).max(5000).required().messages({
        'string.min': 'Message must be at least 1 character long',
        'string.max': 'Message cannot exceed 5000 characters',
        'any.required': 'Message is required'
    }),
    actionUrl: Joi.string().uri().optional().messages({
        'string.uri': 'Action URL must be a valid URL'
    })
});

// Send OTP email schema (auto-generates OTP)
export const sendOTPEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
    }),
    name: Joi.string().min(1).max(100).required().messages({
        'string.min': 'Name must be at least 1 character long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
    }),
    purpose: Joi.string().valid('email_verification', 'password_reset', 'two_factor', 'login').optional().default('email_verification').messages({
        'any.only': 'Purpose must be one of: email_verification, password_reset, two_factor, login'
    })
});

// Verify OTP schema
export const verifyOTPSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email address is required'
    }),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'OTP must be exactly 6 digits',
        'string.pattern.base': 'OTP must contain only numeric digits',
        'any.required': 'OTP is required'
    }),
    purpose: Joi.string().valid('email_verification', 'password_reset', 'two_factor', 'login').optional().default('email_verification').messages({
        'any.only': 'Purpose must be one of: email_verification, password_reset, two_factor, login'
    })
});
