import { Router } from "express";
import { messageController } from "../controllers/messageController.js";
import { authenticate } from "../middlewares/auth.js";
import { validator } from "../middlewares/validator.js";
import { messageSchema } from "../schema/messageSchema.js";

const router = Router();

// Get all messages for a team with pagination
router.get("/teams/:teamId", 
    authenticate,
    validator({ 
        params: messageSchema.teamParams,
        query: messageSchema.getMessagesQuery 
    }),
    messageController.getTeamMessages
);

// Search messages in a team
router.get("/teams/:teamId/search", 
    authenticate,
    validator({ 
        params: messageSchema.teamParams,
        query: messageSchema.searchMessages 
    }),
    messageController.searchMessages
);

// Get message by ID
router.get("/:messageId", 
    authenticate,
    validator({ params: messageSchema.messageParams }),
    messageController.getMessageById
);

// Create new message
router.post("/", 
    authenticate,
    validator({ body: messageSchema.createMessage }),
    messageController.createMessage
);

// Update message (only sender can update)
router.put("/:messageId", 
    authenticate,
    validator({ 
        params: messageSchema.messageParams,
        body: messageSchema.updateMessage 
    }),
    messageController.updateMessage
);

// Delete message (sender or team admin can delete)
router.delete("/:messageId", 
    authenticate,
    validator({ params: messageSchema.messageParams }),
    messageController.deleteMessage
);

export { router as messageRouter };
