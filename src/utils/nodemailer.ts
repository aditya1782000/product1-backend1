import nodemailer from 'nodemailer';
import ejs, { Data } from 'ejs';
import path from 'path';
import fs from 'fs';

interface MaileOption {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
}

const transporter = nodemailer.createTransport(
    JSON.parse(
        JSON.stringify({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 465,
            auth: {
                user: process.env.SMTP_USERNAME || 'example@gmail.com',
                pass: process.env.SMTP_PASSWORD || 'example@123',
            },
            tls: {
                rejectUnauthorized: false,
            },
        }),
    ),
);

const services = {
    send: function (
        templateName: string,
        data: Data,
        maileOption: MaileOption,
    ) {
        const emailTemplatePath = path.join(__dirname, 'email_templates');

        const template = fs.readFileSync(
            `${emailTemplatePath}/${templateName}`,
            {
                encoding: 'utf-8',
            },
        );
        const emailBody = ejs.render(template, data);
        maileOption.html = emailBody;
        return transporter.sendMail(maileOption);
    },

    sendMail: function (maileOption: MaileOption) {
        return transporter.sendMail(maileOption);
    },
};

export default services;
