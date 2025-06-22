export const taskAssignmentTemplate = (userName, taskTitle, projectName, assignerName) => {
    const subject = `New task assigned: ${taskTitle}`;
    
    const text = `Hello ${userName},

${assignerName} has assigned you a new task "${taskTitle}" in project "${projectName}".

Login to your account to view task details and start working.

Best regards,
Kunban Team`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">Task Assignment</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
                <p style="color: #555; line-height: 1.6;"><strong>${assignerName}</strong> has assigned you a new task:</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin: 0 0 10px 0;">${taskTitle}</h3>
                    <p style="color: #666; margin: 0;"><strong>Project:</strong> ${projectName}</p>
                </div>
                <p style="color: #555; line-height: 1.6;">Login to your account to view task details and start working.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">View Task</a>
                </div>
                <p style="color: #888; font-size: 14px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>Kunban Team</strong>
                </p>
            </div>
        </div>
    `;

    return { subject, text, html };
};
