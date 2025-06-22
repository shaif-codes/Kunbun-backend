import emailService from '../services/emailService.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { otpModel } from '../models/index.js';

// Test email configuration
export const testEmailConfig = async (req, res) => {
    try {
        const isConnected = await emailService.verifyConnection();
        
        if (isConnected) {
            return successResponse(res, {
                message: 'Email configuration is working correctly',
                isConnected: true
            });
        } else {
            return errorResponse(res, null, 'Email configuration failed', 500);
        }
    } catch (error) {
        console.error('Email config test error:', error);
        return errorResponse(res, error, 'Error testing email configuration', 500);
    }
};

// Send test email
export const sendTestEmail = async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return errorResponse(res, null, 'Please provide to, subject, and message fields', 400);
        }

        const result = await emailService.sendEmail(to, subject, message);

        if (result.success) {
            return successResponse(res, result, 'Test email sent successfully');
        } else {
            return errorResponse(res, result.error, 'Failed to send test email', 500);
        }
    } catch (error) {
        console.error('Send test email error:', error);
        return errorResponse(res, error, 'Error sending test email', 500);
    }
};

// Send welcome email
export const sendWelcomeEmail = async (req, res) => {
    try {
        const { email, name, newPassword } = req.body;

        if (!email || !name || !newPassword) {
            return errorResponse(res, null, 'Please provide email, name, and newPassword fields', 400);
        }

        const result = await emailService.sendWelcomeEmail(email, name, newPassword);

        if (result.success) {
            return successResponse(res, result, 'Welcome email sent successfully');
        } else {
            return errorResponse(res, result.error, 'Failed to send welcome email', 500);
        }
    } catch (error) {
        console.error('Send welcome email error:', error);
        return errorResponse(res, error, 'Error sending welcome email', 500);
    }
};

// Send team invitation email
export const sendTeamInvitationEmail = async (req, res) => {
    try {
        const { email, userName, teamName, inviterName } = req.body;

        if (!email || !userName || !teamName || !inviterName) {
            return errorResponse(res, null, 'Please provide email, userName, teamName, and inviterName fields', 400);
        }

        const result = await emailService.sendTeamInvitation(email, userName, teamName, inviterName);

        if (result.success) {
            return successResponse(res, result, 'Team invitation email sent successfully');
        } else {
            return errorResponse(res, result.error, 'Failed to send team invitation email', 500);
        }
    } catch (error) {
        console.error('Send team invitation email error:', error);
        return errorResponse(res, error, 'Error sending team invitation email', 500);
    }
};

// Send project assignment email
export const sendProjectAssignmentEmail = async (req, res) => {
    try {
        const { email, userName, projectName, assignerName } = req.body;

        if (!email || !userName || !projectName || !assignerName) {
            return errorResponse(res, null, 'Please provide email, userName, projectName, and assignerName fields', 400);
        }

        const result = await emailService.sendProjectAssignment(email, userName, projectName, assignerName);

        if (result.success) {
            return successResponse(res, result, 'Project assignment email sent successfully');
        } else {
            return errorResponse(res, result.error, 'Failed to send project assignment email', 500);
        }
    } catch (error) {
        console.error('Send project assignment email error:', error);
        return errorResponse(res, error, 'Error sending project assignment email', 500);
    }
};

// Send task assignment email
export const sendTaskAssignmentEmail = async (req, res) => {
    try {
        const { email, userName, taskTitle, projectName, assignerName } = req.body;

        if (!email || !userName || !taskTitle || !projectName || !assignerName) {
            return errorResponse(res, null, 'Please provide email, userName, taskTitle, projectName, and assignerName fields', 400);
        }

        const result = await emailService.sendTaskAssignment(email, userName, taskTitle, projectName, assignerName);

        if (result.success) {
            return successResponse(res, result, 'Task assignment email sent successfully');
        } else {
            return errorResponse(res, result.error, 'Failed to send task assignment email', 500);
        }
    } catch (error) {
        console.error('Send task assignment email error:', error);
        return errorResponse(res, error, 'Error sending task assignment email', 500);
    }
};

// Send notification email
export const sendNotificationEmail = async (req, res) => {
    try {
        const { email, userName, title, message, actionUrl } = req.body;

        if (!email || !userName || !title || !message) {
            return errorResponse(res, null, 'Please provide email, userName, title, and message fields', 400);
        }

        const result = await emailService.sendNotification(email, userName, title, message, actionUrl);

        if (result.success) {
            return successResponse(res, result, 'Notification email sent successfully');
        } else {
            return errorResponse(res, result.error, 'Failed to send notification email', 500);
        }
    } catch (error) {
        console.error('Send notification email error:', error);
        return errorResponse(res, error, 'Error sending notification email', 500);
    }
};

// Generate and send OTP verification email
export const sendOTPEmail = async (req, res) => {
    try {
        const { email, name, purpose = 'email_verification' } = req.body;

        if (!email || !name) {
            return errorResponse(res, null, 'Please provide email and name fields', 400);
        }

        // Get client IP and User Agent for security tracking
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        // Generate OTP and save to database
        const otpResult = await otpModel.createOTP(email, purpose, ipAddress, userAgent);

        if (!otpResult.success) {
            return errorResponse(res, otpResult.error, 'Failed to generate OTP', 500);
        }

        // Calculate expiry minutes for email template
        const expiryMinutes = Math.ceil((otpResult.expiresAt - new Date()) / (1000 * 60));

        // Send OTP email
        const emailResult = await emailService.sendOTP(email, name, otpResult.otp, expiryMinutes);

        if (emailResult.success) {
            return successResponse(res, {
                message: 'OTP sent successfully',
                otpId: otpResult.otpId,
                expiresAt: otpResult.expiresAt,
                expiryMinutes
            }, 'OTP verification email sent successfully');
        } else {
            return errorResponse(res, emailResult.error, 'Failed to send OTP email', 500);
        }
    } catch (error) {
        console.error('Send OTP email error:', error);
        return errorResponse(res, error, 'Error sending OTP verification email', 500);
    }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp, purpose = 'email_verification' } = req.body;

        if (!email || !otp) {
            return errorResponse(res, null, 'Please provide email and otp fields', 400);
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return errorResponse(res, null, 'OTP must be 6 digits', 400);
        }

        // Verify OTP
        const verificationResult = await otpModel.verifyOTP(email, otp, purpose);

        if (verificationResult.success) {
            return successResponse(res, {
                message: verificationResult.message,
                otpId: verificationResult.otpId,
                verifiedAt: new Date()
            }, 'OTP verified successfully');
        } else {
            // Record failed attempt if OTP exists but is invalid
            if (verificationResult.code === 'INVALID_OTP') {
                await otpModel.recordFailedAttempt(email, otp, purpose);
            }

            return errorResponse(res, null, verificationResult.message, 400);
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        return errorResponse(res, error, 'Error verifying OTP', 500);
    }
};

// Send account review email
export const sendAccountReviewEmail = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return errorResponse(res, null, 'Please provide email and name fields', 400);
        }

        const result = await emailService.sendAccountReviewEmail(email, name);

        if (result.success) {
            return successResponse(res, result, 'Account review email sent successfully');
        } else {
            return errorResponse(res, result.error, 'Failed to send account review email', 500);
        }
    } catch (error) {
        console.error('Send account review email error:', error);
        return errorResponse(res, error, 'Error sending account review email', 500);
    }
};
