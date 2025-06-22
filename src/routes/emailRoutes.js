import express from 'express';
import {
    testEmailConfig,
    sendTestEmail,
    sendWelcomeEmail,
    sendTeamInvitationEmail,
    sendProjectAssignmentEmail,
    sendTaskAssignmentEmail,
    sendNotificationEmail,
    sendOTPEmail,
    verifyOTP,
    sendAccountReviewEmail
} from '../controllers/emailController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';
import { validator } from '../middlewares/validator.js';
import {
    testEmailSchema,
    welcomeEmailSchema,
    teamInvitationEmailSchema,
    projectAssignmentEmailSchema,
    taskAssignmentEmailSchema,
    notificationEmailSchema,
    sendOTPEmailSchema,
    verifyOTPSchema,
    accountReviewEmailSchema
} from '../schema/emailSchema.js';
import { roleEnums } from '../config/index.js';

const router = express.Router();

// Test email configuration (Admin only)
router.get('/test-config', 
    authenticate, 
    authorizeRole(roleEnums.ADMIN), 
    testEmailConfig
);

// Send test email (Admin only)
router.post('/test', 
    authenticate, 
    authorizeRole(roleEnums.ADMIN), 
    validator({ body: testEmailSchema }), 
    sendTestEmail
);

// Send welcome email (Admin and Manager)
router.post('/welcome', 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER), 
    validator({ body: welcomeEmailSchema }), 
    sendWelcomeEmail
);

// Send team invitation email (Admin and Manager)
router.post('/team-invitation', 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER), 
    validator({ body: teamInvitationEmailSchema }), 
    sendTeamInvitationEmail
);

// Send project assignment email (Admin and Manager)
router.post('/project-assignment', 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER), 
    validator({ body: projectAssignmentEmailSchema }), 
    sendProjectAssignmentEmail
);

// Send task assignment email (Admin, Manager, and Member)
router.post('/task-assignment', 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER, roleEnums.MEMBER), 
    validator({ body: taskAssignmentEmailSchema }), 
    sendTaskAssignmentEmail
);

// Send notification email (Admin and Manager)
router.post('/notification', 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER), 
    validator({ body: notificationEmailSchema }), 
    sendNotificationEmail
);

// Send OTP verification email (Available to all authenticated users)
router.post('/send-otp',  
    validator({ body: sendOTPEmailSchema }), 
    sendOTPEmail
);

// Verify OTP (Available to all authenticated users)
router.post('/verify-otp',
    validator({ body: verifyOTPSchema }), 
    verifyOTP
);

// Send account review email (Admin and Manager)
router.post('/account-review', 
    authenticate, 
    authorizeRole(roleEnums.ADMIN, roleEnums.MANAGER), 
    validator({ body: accountReviewEmailSchema }), 
    sendAccountReviewEmail
);

export default router;
