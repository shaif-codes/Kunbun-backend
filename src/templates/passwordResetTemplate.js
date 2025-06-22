export const passwordResetTemplate = (userName, resetToken) => {
  const subject = "Password Reset Request - Kunban Platform";
  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/reset-password?token=${resetToken}`;

  const text = `Hello ${userName},

You requested a password reset for your Kunban account.

Click the following link to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this reset, please ignore this email.

Best regards,
Kunban Team`;

  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">Password Reset</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
                <p style="color: #555; line-height: 1.6;">You requested a password reset for your Kunban account.</p>
                <p style="color: #555; line-height: 1.6;">Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Reset Password</a>
                </div>
                <p style="color: #888; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
                <p style="color: #888; font-size: 14px;">If you didn't request this reset, please ignore this email.</p>
                <p style="color: #888; font-size: 14px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>Kunban Team</strong>
                </p>
            </div>
        </div>
    `;

  return { subject, text, html };
};
