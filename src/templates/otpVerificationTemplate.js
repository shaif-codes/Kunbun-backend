const otpVerificationTemplate = (userName, otp, expiryMinutes = 10) => {
    const subject = 'Email Verification - Your OTP Code';
    
    const text = `
        Hi ${userName},
        
        Please use the following One-Time Password (OTP) to verify your email address:
        
        OTP: ${otp}
        
        This code will expire in ${expiryMinutes} minutes.
        
        If you didn't request this verification, please ignore this email.
        
        Best regards,
        The Kunban Team
    `;

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification - OTP</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f8f9fa;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                }
                .header .icon {
                    font-size: 48px;
                    margin-bottom: 10px;
                    display: block;
                }
                .content {
                    padding: 40px 30px;
                    text-align: center;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 20px;
                    color: #2d3748;
                    text-align: left;
                }
                .otp-container {
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    border: 2px dashed #4f46e5;
                    border-radius: 12px;
                    padding: 30px;
                    margin: 30px 0;
                    text-align: center;
                }
                .otp-label {
                    font-size: 14px;
                    color: #64748b;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                }
                .otp-code {
                    font-size: 36px;
                    font-weight: 700;
                    color: #4f46e5;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 8px;
                    margin: 10px 0;
                    text-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);
                }
                .expiry-notice {
                    background-color: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    color: #92400e;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .expiry-notice .warning-icon {
                    margin-right: 8px;
                    font-size: 16px;
                }
                .instructions {
                    background-color: #f0f9ff;
                    border-left: 4px solid #0ea5e9;
                    padding: 20px;
                    margin: 25px 0;
                    text-align: left;
                }
                .instructions h3 {
                    margin-top: 0;
                    color: #0c4a6e;
                    font-size: 16px;
                }
                .instructions ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .instructions li {
                    margin-bottom: 8px;
                    color: #0369a1;
                }
                .security-notice {
                    background-color: #fef2f2;
                    border: 1px solid #fca5a5;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    font-size: 14px;
                    color: #991b1b;
                    text-align: left;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 20px 30px;
                    text-align: center;
                    color: #6c757d;
                    font-size: 14px;
                }
                .footer a {
                    color: #4f46e5;
                    text-decoration: none;
                }
                @media (max-width: 600px) {
                    .container {
                        margin: 10px;
                    }
                    .header, .content {
                        padding: 20px;
                    }
                    .otp-code {
                        font-size: 28px;
                        letter-spacing: 4px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="icon">🔐</span>
                    <h1>Email Verification</h1>
                </div>
                <div class="content">
                    <div class="greeting">
                        <strong>Hi ${userName},</strong>
                    </div>
                    
                    <p>To complete your email verification, please use the One-Time Password (OTP) below:</p>
                    
                    <div class="otp-container">
                        <div class="otp-label">Your Verification Code</div>
                        <div class="otp-code">${otp}</div>
                    </div>
                    
                    <div class="expiry-notice">
                        <span class="warning-icon">⏰</span>
                        <strong>This code expires in ${expiryMinutes} minutes</strong>
                    </div>
                    
                    <div class="instructions">
                        <h3>📋 How to use this code:</h3>
                        <ul>
                            <li>Return to the verification page in your browser</li>
                            <li>Enter the 6-digit code exactly as shown above</li>
                            <li>Click "Verify Email" to complete the process</li>
                        </ul>
                    </div>
                    
                    <div class="security-notice">
                        <strong>🛡️ Security Notice:</strong><br>
                        • Never share this code with anyone<br>
                        • Our team will never ask for this code<br>
                        • If you didn't request this verification, please ignore this email
                    </div>
                    
                    <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
                        Having trouble? Contact our support team for assistance.
                    </p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The Kunban Team</p>
                    <p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support">Support</a> | 
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact">Contact Us</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    return { subject, text, html };
};

export { otpVerificationTemplate };
