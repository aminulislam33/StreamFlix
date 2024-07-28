const nodemailer = require('nodemailer');

async function handleSendEmail(email, subject, text) {
    try {
        
        if (!process.env.EMAIL || !process.env.PASSWORD) {
            throw new Error('Environment variables EMAIL and PASSWORD must be set');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text
        });

        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = handleSendEmail;