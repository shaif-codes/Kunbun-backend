import Joi from "joi";

// Task validation schema
const taskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Task title is required",
    "string.min": "Task title must be at least 1 character long",
    "string.max": "Task title cannot exceed 200 characters",
    "any.required": "Task title is required",
  }),
  description: Joi.string().max(1000).allow("").messages({
    "string.max": "Task description cannot exceed 1000 characters",
  }),
  order: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Order must be a number",
    "number.integer": "Order must be an integer",
    "number.min": "Order cannot be negative",
  }),
});

// Project status section validation schema
const statusSectionSchema = Joi.object({
  status: Joi.string()

    .required()
    .messages({
      "any.only": "Status must be one of: todo, in-progress, done",
      "any.required": "Status is required",
    }),
  tasks: Joi.array().items(taskSchema).default([]),
});

// Create project validation
const createProject = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Project name is required",
    "string.min": "Project name must be at least 2 characters long",
    "string.max": "Project name cannot exceed 100 characters",
    "any.required": "Project name is required",
  }),
  description: Joi.string().max(500).allow("").messages({
    "string.max": "Project description cannot exceed 500 characters",
  }),
  members: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one team member is required",
      "any.required": "Team members are required",
      "string.pattern.base": "Invalid member ID format",
    }),
});

// Update project validation
const updateProject = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Project name must be at least 2 characters long",
    "string.max": "Project name cannot exceed 100 characters",
  }),
  description: Joi.string().max(500).allow("").messages({
    "string.max": "Project description cannot exceed 500 characters",
  }),
  members: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .messages({
      "array.min": "At least one team member is required",
      "string.pattern.base": "Invalid member ID format",
    }),
});

// Add task to project validation
const addTask = Joi.object({
  status: Joi.string().required().messages({
    "any.only": "Status must be one of: todo, in-progress, done",
    "any.required": "Status is required",
  }),
  task: taskSchema.required().messages({
    "any.required": "Task details are required",
  }),
});

// Update task validation
const updateTask = Joi.object({
  status: Joi.string().required().messages({
    "any.only": "Status must be one of: todo, in-progress, done",
    "any.required": "Status is required",
  }),
  taskId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid task ID format",
      "any.required": "Task ID is required",
    }),
  task: taskSchema.required().messages({
    "any.required": "Task details are required",
  }),
});

// Move task validation
const moveTask = Joi.object({
  fromStatus: Joi.string().required().messages({
    "any.only": "From status must be one of: todo, in-progress, done",
    "any.required": "From status is required",
  }),
  toStatus: Joi.string().required().messages({
    "any.only": "To status must be one of: todo, in-progress, done",
    "any.required": "To status is required",
  }),
  taskId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid task ID format",
      "any.required": "Task ID is required",
    }),
  newOrder: Joi.number().integer().min(0).default(0).messages({
    "number.base": "New order must be a number",
    "number.integer": "New order must be an integer",
    "number.min": "New order cannot be negative",
  }),
});

export const projectSchema = {
  createProject,
  updateProject,
  addTask,
  updateTask,
  moveTask,
};
