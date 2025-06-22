export const welcomeEmailTemplate = (userName, newPassword) => {
  const subject = "Welcome to Kunban Platform - Your Account is Ready!";

  const text = `Hello ${userName},

Welcome to Kunban Platform! We're excited to have you on board.

Your account has been approved and is now ready to use!

Your login credentials:
Email: (use the email address this message was sent to)
Password: ${newPassword}

Please keep this password secure and consider changing it after your first login.

You can now start collaborating with your team, managing projects, and tracking tasks efficiently.

Login at: ${process.env.FRONTEND_URL || "http://localhost:3000"}/login

Best regards,
Kunban Team`;

  const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Kunban Platform</title>
            <style>
                .copy-button {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-left: 10px;
                    transition: background-color 0.3s;
                }
                .copy-button:hover {
                    background: #5a6fd8;
                }
                .password-container {
                    background: #f8f9fa;
                    border: 2px solid #667eea;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }
                .password-field {
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 10px 15px;
                    font-family: 'Courier New', monospace;
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                    display: inline-block;
                    min-width: 200px;
                    letter-spacing: 1px;
                }
                .security-notice {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 20px 0;
                    color: #856404;
                }
                @media (max-width: 600px) {
                    .copy-button {
                        display: block;
                        margin: 10px auto 0 auto;
                    }
                    .password-field {
                        display: block;
                        margin: 0 auto 10px auto;
                        min-width: auto;
                        width: 90%;
                    }
                }
            </style>
        </head>
        <body>
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Kunban!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Your account is ready to use</p>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
                    <p style="color: #555; line-height: 1.6;">🎊 <strong>Congratulations!</strong> Your account has been approved and is now ready to use. Welcome to the Kunban Platform!</p>
                    
                    <div class="password-container">
                        <h3 style="color: #667eea; margin-top: 0;">🔐 Your Login Credentials</h3>
                        <p style="color: #666; margin: 10px 0;"><strong>Email:</strong> Use the email address this message was sent to</p>
                        <p style="color: #666; margin: 10px 0;"><strong>Password:</strong></p>
                        <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap;">
                            <span class="password-field" id="userPassword">${newPassword}</span>
                            <button class="copy-button" onclick="copyPassword()" id="copyBtn">📋 Copy</button>
                        </div>
                    </div>

                    <div class="security-notice">
                        <p style="margin: 0; font-size: 14px;"><strong>🛡️ Security Reminder:</strong> Please keep this password secure and consider changing it after your first login for enhanced security.</p>
                    </div>
                    
                    <p style="color: #555; line-height: 1.6; margin-top: 25px;">Now you can start:</p>
                    <ul style="color: #555; line-height: 1.6;">
                        <li>✅ Collaborating with your team members</li>
                        <li>📊 Managing projects efficiently</li>
                        <li>⏰ Tracking tasks in real-time</li>
                        <li>💬 Communicating through team chat</li>
                        <li>📈 Monitoring project progress</li>
                    </ul>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${
                          process.env.FRONTEND_URL || "http://localhost:3000"
                        }/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">🚀 Login Now</a>
                    </div>

                    <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                        <h4 style="color: #667eea; margin-bottom: 15px;">📞 Need Help?</h4>
                        <p style="color: #666; font-size: 14px; margin: 5px 0;">If you have any questions or need assistance, our support team is here to help:</p>
                        <p style="color: #666; font-size: 14px; margin: 5px 0;">
                            📧 <a href="mailto:support@kunban.com" style="color: #667eea; text-decoration: none;">support@kunban.com</a> | 
                            📚 <a href="${
                              process.env.FRONTEND_URL ||
                              "http://localhost:3000"
                            }/help" style="color: #667eea; text-decoration: none;">Help Center</a>
                        </p>
                    </div>
                    
                    <p style="color: #888; font-size: 14px; margin-top: 30px; text-align: center;">
                        Best regards,<br>
                        <strong>The Kunban Team</strong>
                    </p>
                </div>
            </div>

            <script>
                function copyPassword() {
                    const passwordElement = document.getElementById('userPassword');
                    const copyBtn = document.getElementById('copyBtn');
                    const password = passwordElement.textContent;
                    
                    // Try to use the modern Clipboard API
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(password).then(function() {
                            copyBtn.innerHTML = '✅ Copied!';
                            copyBtn.style.background = '#28a745';
                            setTimeout(function() {
                                copyBtn.innerHTML = '📋 Copy';
                                copyBtn.style.background = '#667eea';
                            }, 2000);
                        }).catch(function(err) {
                            fallbackCopyTextToClipboard(password);
                        });
                    } else {
                        // Fallback for older browsers
                        fallbackCopyTextToClipboard(password);
                    }
                }

                function fallbackCopyTextToClipboard(text) {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.top = "0";
                    textArea.style.left = "0";
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        const successful = document.execCommand('copy');
                        const copyBtn = document.getElementById('copyBtn');
                        if (successful) {
                            copyBtn.innerHTML = '✅ Copied!';
                            copyBtn.style.background = '#28a745';
                            setTimeout(function() {
                                copyBtn.innerHTML = '📋 Copy';
                                copyBtn.style.background = '#667eea';
                            }, 2000);
                        } else {
                            copyBtn.innerHTML = '❌ Failed';
                            copyBtn.style.background = '#dc3545';
                            setTimeout(function() {
                                copyBtn.innerHTML = '📋 Copy';
                                copyBtn.style.background = '#667eea';
                            }, 2000);
                        }
                    } catch (err) {
                        console.error('Fallback: Oops, unable to copy', err);
                    }
                    
                    document.body.removeChild(textArea);
                }
            </script>
        </body>
        </html>
    `;

  return { subject, text, html };
};
