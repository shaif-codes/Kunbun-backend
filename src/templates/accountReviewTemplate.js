const accountReviewTemplate = (userName, userEmail) => {
    const subject = 'Account Registration Received - Under Review';
    
    const text = `
        Dear ${userName},
        
        Thank you for your interest in joining Kunban Team Collaboration Platform.
        
        We have successfully received your registration request for the email address: ${userEmail}
        
        Your account is currently under review by our administrative team. We carefully review all registration requests to ensure the security and quality of our platform.
        
        What happens next:
        • Our admin team will review your registration details
        • You will receive an email notification once your account has been approved
        • Upon approval, you will be able to access all platform features
        
        This review process typically takes 1-2 business days. We appreciate your patience during this time.
        
        If you have any questions or concerns, please don't hesitate to contact our support team.
        
        Best regards,
        The Kunban Platform Team
    `;

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Registration - Under Review</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #2c3e50;
                    margin: 0;
                    padding: 0;
                    background-color: #f8f9fa;
                }
                .container {
                    max-width: 650px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .header .subtitle {
                    margin-top: 8px;
                    font-size: 14px;
                    opacity: 0.9;
                    font-weight: 300;
                }
                .content {
                    padding: 40px 30px;
                }
                .greeting {
                    font-size: 16px;
                    margin-bottom: 20px;
                    color: #2c3e50;
                    font-weight: 500;
                }
                .main-message {
                    font-size: 15px;
                    margin-bottom: 25px;
                    color: #34495e;
                    line-height: 1.7;
                }
                .registration-details {
                    background-color: #ecf0f1;
                    border-left: 4px solid #3498db;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 4px;
                }
                .registration-details h3 {
                    margin-top: 0;
                    color: #2c3e50;
                    font-size: 16px;
                    font-weight: 600;
                }
                .registration-details p {
                    margin: 8px 0;
                    color: #34495e;
                }
                .status-container {
                    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 6px;
                    text-align: center;
                    margin: 25px 0;
                }
                .status-container .status-icon {
                    font-size: 32px;
                    margin-bottom: 10px;
                    display: block;
                }
                .status-container h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                .status-container p {
                    margin: 5px 0 0 0;
                    opacity: 0.9;
                    font-size: 14px;
                }
                .process-steps {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 25px;
                    margin: 25px 0;
                }
                .process-steps h3 {
                    margin-top: 0;
                    color: #2c3e50;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                .process-steps ul {
                    margin: 0;
                    padding-left: 20px;
                }
                .process-steps li {
                    margin-bottom: 10px;
                    color: #34495e;
                    font-size: 14px;
                }
                .timeline-notice {
                    background-color: #e8f5e8;
                    border: 1px solid #27ae60;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: center;
                }
                .timeline-notice .clock-icon {
                    color: #27ae60;
                    font-size: 20px;
                    margin-right: 8px;
                }
                .timeline-notice p {
                    margin: 0;
                    color: #27ae60;
                    font-weight: 500;
                    font-size: 14px;
                }
                .support-section {
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    padding: 20px;
                    margin: 25px 0;
                    text-align: center;
                }
                .support-section h4 {
                    margin-top: 0;
                    color: #2c3e50;
                    font-size: 15px;
                }
                .support-section p {
                    margin: 8px 0;
                    color: #7f8c8d;
                    font-size: 13px;
                }
                .footer {
                    background-color: #2c3e50;
                    color: white;
                    padding: 25px 30px;
                    text-align: center;
                }
                .footer p {
                    margin: 5px 0;
                    font-size: 14px;
                }
                .footer .company-name {
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 8px;
                }
                .footer .contact-info {
                    opacity: 0.8;
                    font-size: 13px;
                }
                .footer a {
                    color: #3498db;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
                @media (max-width: 600px) {
                    .container {
                        margin: 10px;
                    }
                    .header, .content, .footer {
                        padding: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Registration Received</h1>
                    <div class="subtitle">Kunban Team Collaboration Platform</div>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Dear ${userName},
                    </div>
                    
                    <div class="main-message">
                        Thank you for your interest in joining the Kunban Team Collaboration Platform. We have successfully received your registration request and appreciate you taking the time to apply for access to our platform.
                    </div>
                    
                    <div class="registration-details">
                        <h3>📋 Registration Details</h3>
                        <p><strong>Email Address:</strong> ${userEmail}</p>
                        <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                        })}</p>
                        <p><strong>Status:</strong> Under Administrative Review</p>
                    </div>
                    
                    <div class="status-container">
                        <span class="status-icon">⏳</span>
                        <h3>Account Under Review</h3>
                        <p>Our administrative team is currently reviewing your registration</p>
                    </div>
                    
                    <div class="process-steps">
                        <h3>🔄 What Happens Next</h3>
                        <ul>
                            <li><strong>Administrative Review:</strong> Our team will carefully review your registration details to ensure platform security and quality</li>
                            <li><strong>Verification Process:</strong> We verify all user information to maintain a trusted professional environment</li>
                            <li><strong>Approval Notification:</strong> You will receive an email notification once your account has been approved</li>
                            <li><strong>Platform Access:</strong> Upon approval, you will gain full access to all Kunban platform features</li>
                        </ul>
                    </div>
                    
                    <div class="timeline-notice">
                        <p><span class="clock-icon">🕐</span><strong>Expected Review Time:</strong> 1-2 business days</p>
                    </div>
                    
                    <div class="main-message">
                        We carefully review all registration requests to ensure the security, quality, and professional standards of our collaboration platform. This process helps us maintain a trusted environment for all our users.
                    </div>
                    
                    <div class="main-message">
                        <strong>Important:</strong> Please ensure that the email address ${userEmail} is accessible, as all future communications regarding your account status will be sent to this address.
                    </div>
                    
                    <div class="support-section">
                        <h4>Need Assistance?</h4>
                        <p>If you have any questions about your registration or need immediate assistance, please don't hesitate to contact our support team.</p>
                        <p>We are here to help and ensure a smooth onboarding experience.</p>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="company-name">Kunban Team Collaboration Platform</div>
                    <p class="contact-info">
                        <a href="${process.env.SUPPORT_CENTER_URL || 'http://localhost:3000'}/support">Support Center</a> | 
                        <a href="${process.env.CONTACT_US_URL || 'http://localhost:3000'}/contact">Contact Us</a> | 
                        <a href="${process.env.HELP_DOCUMENTATION_URL || 'http://localhost:3000'}/help">Help Documentation</a>
                    </p>
                    <p class="contact-info">
                        This is an automated message. Please do not reply directly to this email.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    return { subject, text, html };
};

export { accountReviewTemplate };
