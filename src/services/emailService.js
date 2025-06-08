import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import {
    welcomeEmailTemplate,
    teamInvitationTemplate,
    projectAssignmentTemplate,
    taskAssignmentTemplate,
    passwordResetTemplate,
    notificationTemplate,
    otpVerificationTemplate
} from '../templates/index.js';

class EmailService {
    constructor() {
        this.transporter = null;
        this.init();
    }

    // Initialize the email transporter
    init() {
        try {
            this.transporter = nodemailer.createTransport({
                host: config.email.host,
                port: config.email.port,
                secure: config.email.secure,
                auth: {
                    user: config.email.user,
                    pass: config.email.password,
                },
                tls: {
                    rejectUnauthorized: false // Allow self-signed certificates
                }
            });

            console.log('Email service initialized successfully');
        } catch (error) {
            console.error('Error initializing email service:', error);
        }
    }

    // Verify email configuration
    async verifyConnection() {
        try {
            if (!this.transporter) {
                throw new Error('Email transporter not initialized');
            }

            await this.transporter.verify();
            console.log('Email server connection verified');
            return true;
        } catch (error) {
            console.error('Email verification failed:', error);
            return false;
        }
    }

    // Send basic email
    async sendEmail(to, subject, text, html = null) {
        try {
            if (!this.transporter) {
                throw new Error('Email transporter not initialized');
            }

            const mailOptions = {
                from: `"Kunban Platform" <${config.email.from}>`,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject,
                text,
                html: html || `<p>${text}</p>`
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', result.messageId);
            return {
                success: true,
                messageId: result.messageId,
                message: 'Email sent successfully'
            };
        } catch (error) {
            console.error('Error sending email:', error);
            return {
                success: false,
                error: error.message,
                message: 'Failed to send email'
            };
        }
    }

    // Send welcome email to new users
    async sendWelcomeEmail(userEmail, userName) {
        const { subject, text, html } = welcomeEmailTemplate(userName);
        return await this.sendEmail(userEmail, subject, text, html);
    }

    // Send team invitation email
    async sendTeamInvitation(userEmail, userName, teamName, inviterName) {
        const { subject, text, html } = teamInvitationTemplate(userName, teamName, inviterName);
        return await this.sendEmail(userEmail, subject, text, html);
    }

    // Send project assignment notification
    async sendProjectAssignment(userEmail, userName, projectName, assignerName) {
        const { subject, text, html } = projectAssignmentTemplate(userName, projectName, assignerName);
        return await this.sendEmail(userEmail, subject, text, html);
    }

    // Send task assignment notification
    async sendTaskAssignment(userEmail, userName, taskTitle, projectName, assignerName) {
        const { subject, text, html } = taskAssignmentTemplate(userName, taskTitle, projectName, assignerName);
        return await this.sendEmail(userEmail, subject, text, html);
    }

    // Send password reset email
    async sendPasswordReset(userEmail, userName, resetToken) {
        const { subject, text, html } = passwordResetTemplate(userName, resetToken);
        return await this.sendEmail(userEmail, subject, text, html);
    }

    // Send notification email
    async sendNotification(userEmail, userName, title, message, actionUrl = null) {
        const { subject, text, html } = notificationTemplate(userName, title, message, actionUrl);
        return await this.sendEmail(userEmail, subject, text, html);
    }
    // Send OTP verification email
    async sendOTP(userEmail, userName, otp, expiryMinutes = 10) {
        const { subject, text, html } = otpVerificationTemplate(userName, otp, expiryMinutes);
        return await this.sendEmail(userEmail, subject, text, html);
    }

}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;
