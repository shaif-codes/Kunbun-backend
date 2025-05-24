import { Router } from "express";
import { projectController } from "../controllers/index.js";
import { authenticate, authorizeRole } from "../middlewares/auth.js";
import { validator } from "../middlewares/validator.js";
import { projectSchema } from "../schema/index.js";
import { roleEnums } from "../config/index.js";

const router = Router();

// Get all projects - accessible by all authenticated users
router.get("/", 
    authenticate, 
    projectController.getAllProjects
);

// Get project by ID - accessible by all authenticated users
router.get("/:id", 
    authenticate, 
    projectController.getProjectById
);

// Create new project - managers and admins only
router.post("/", 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER),
    validator({ body: projectSchema.createProject }),
    projectController.createProject
);

// Update project - managers and admins only
router.put("/:id", 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER),
    validator({ body: projectSchema.updateProject }),
    projectController.updateProject
);

// Delete project - admins only
router.delete("/:id", 
    authenticate, 
    authorizeRole(roleEnums.ADMIN),
    projectController.deleteProject
);

// Add task to project - all authenticated users
router.post("/:id/tasks", 
    authenticate,
    validator({ body: projectSchema.addTask }),
    projectController.addTask
);

// Update task in project - all authenticated users
router.put("/:id/tasks", 
    authenticate,
    validator({ body: projectSchema.updateTask }),
    projectController.updateTask
);

// Move task between status sections - all authenticated users
router.put("/:id/tasks/move", 
    authenticate,
    validator({ body: projectSchema.moveTask }),
    projectController.moveTask
);

// Delete task from project - all authenticated users
router.delete("/:id/tasks/:taskId", 
    authenticate,
    projectController.deleteTask
);

export { router as projectRouter };
