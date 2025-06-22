import { Router } from "express";
import { teamController } from "../controllers/index.js";
import { authenticate, authorizeRole } from "../middlewares/auth.js";
import { validator } from "../middlewares/validator.js";
import { teamSchema } from "../schema/index.js";
import { roleEnums } from "../config/index.js";

const router = Router();

// Get all teams - accessible by all authenticated users
router.get("/", 
    authenticate, 
    teamController.getAllTeams
);

// Get user's teams - accessible by authenticated user
router.get("/my-teams", 
    authenticate, 
    teamController.getUserTeams
);

// Get team by ID - accessible by all authenticated users
router.get("/:id", 
    authenticate,
    validator({ params: teamSchema.teamParams }),
    teamController.getTeamById
);

// Create new team - managers and admins only
router.post("/", 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER),
    validator({ body: teamSchema.createTeam }),
    teamController.createTeam
);

// Update team - managers and admins only
router.put("/:id", 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER),
    validator({ 
        params: teamSchema.teamParams,
        body: teamSchema.updateTeam 
    }),
    teamController.updateTeam
);

// Delete team - admins only
router.delete("/:id", 
    authenticate, 
    authorizeRole(roleEnums.ADMIN),
    validator({ params: teamSchema.teamParams }),
    teamController.deleteTeam
);

// Add members to team - managers and admins only
router.post("/:id/members", 
    authenticate,
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER),
    validator({ 
        params: teamSchema.teamParams,
        body: teamSchema.addMembers 
    }),
    teamController.addMembers
);

// Remove member from team - managers and admins only
router.delete("/:id/members", 
    authenticate,
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER),
    validator({ 
        params: teamSchema.teamParams,
        body: teamSchema.removeMember 
    }),
    teamController.removeMember
);

export { router as teamRouter };
