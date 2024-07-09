import nodemailer from 'nodemailer';
import config from '../config/config';
import logger from '../config/logger';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() =>
            logger.warn(
                'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
            )
        );
}

const sendEmail = async (
    to: string,
    subject: string,
    text: string
): Promise<SMTPTransport.SentMessageInfo> => {
    const msg = { from: config.email.from, to, subject, text };
    return await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (
    to: string,
    token: string
): Promise<SMTPTransport.SentMessageInfo> => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    return await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (
    to: string,
    token: string
): Promise<SMTPTransport.SentMessageInfo> => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    return await sendEmail(to, subject, text);
};

export default {
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
