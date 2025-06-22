export const teamInvitationTemplate = (userName, teamName, inviterName) => {
    const subject = `You've been invited to join ${teamName} on Kunban`;
    
    const text = `Hello ${userName},

${inviterName} has invited you to join the team "${teamName}" on Kunban Platform.

Login to your account to start collaborating with your team.

Best regards,
Kunban Team`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">Team Invitation</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
                <p style="color: #555; line-height: 1.6;"><strong>${inviterName}</strong> has invited you to join the team <strong>"${teamName}"</strong> on Kunban Platform.</p>
                <p style="color: #555; line-height: 1.6;">Login to your account to start collaborating with your team members.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/teams" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Join Team</a>
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
