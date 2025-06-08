export const notificationTemplate = (userName, title, message, actionUrl = null) => {
    const subject = `Kunban Notification: ${title}`;
    
    const text = `Hello ${userName},

${title}

${message}

Best regards,
Kunban Team`;
    
    const actionButton = actionUrl ? 
        `<div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">View Details</a>
        </div>` : '';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">Notification</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
                <h3 style="color: #555;">${title}</h3>
                <p style="color: #555; line-height: 1.6;">${message}</p>
                ${actionButton}
                <p style="color: #888; font-size: 14px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>Kunban Team</strong>
                </p>
            </div>
        </div>
    `;

    return { subject, text, html };
};
