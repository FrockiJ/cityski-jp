import handlebars = require('handlebars');
import fs = require('fs');
import * as SendGrid from '@sendgrid/mail';
import nodemailer from 'nodemailer';

import path = require('path');

const htmlPath = path.join(__dirname, '../../../server/public/email.html');

const sgMail = SendGrid;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function getHtmlToSend({
  // htmlPath,
  hasImage,
  subject,
  imagePath,
  content,
  buttonUrl,
  buttonLabel,
}) {
  const source = fs.readFileSync(htmlPath, 'utf-8').toString();
  const context = handlebars.compile(source);
  const replacements = {
    hasImage,
    subject,
    imagePath,
    content,
    buttonUrl,
    buttonLabel,
  };
  const htmlToSend = context(replacements);
  return htmlToSend;
}

export interface MailData {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html: MailDataHtml;
  icsContent?: string;
  senderCustomName?: string;
}

export interface MailDataHtml {
  htmlPath?: string;
  hasImage?: boolean;
  subject?: string;
  imagePath?: string;
  content?: string;
  buttonUrl?: string;
  buttonLabel?: string;
}

export async function sendEmail(message, { host, port, user, pass }) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host,
    port,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
  Object.assign(message);

  const info = await transporter.sendMail(message);

  return info;
}

export async function sendGridMail(
  to: string | string[],
  subject: string,
  html: string,
) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API key is not configured');
  }

  if (!process.env.SENDGRID_SENDER_MAIL) {
    throw new Error('SendGrid sender email is not configured');
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const recipients = Array.isArray(to) ? to : [to];
  const from = {
    email: process.env.SENDGRID_SENDER_MAIL,
    name: 'CitySki', // Your company name
  };

  const sendMailPromises = recipients.map(async (recipient) => {
    const msg = {
      to: recipient,
      from,
      subject,
      html,
      // Add these fields to improve deliverability
      mailSettings: {
        sandboxMode: {
          enable: false,
        },
        bypassListManagement: {
          enable: false,
        },
      },
      trackingSettings: {
        clickTracking: {
          enable: true,
        },
        openTracking: {
          enable: true,
        },
        subscriptionTracking: {
          enable: false,
        },
      },
      // Add custom headers
      headers: {
        'List-Unsubscribe': `<mailto:unsubscribe@${process.env.SENDGRID_SENDER_MAIL}>`,
        Precedence: 'Bulk',
      },
      // Add categories for tracking
      categories: ['transactional'],
      // Add custom args for tracking
      customArgs: {
        app: 'cityski',
      },
      // Add IP pool name if you have dedicated IPs
      // ipPoolName: process.env.SENDGRID_IP_POOL_NAME,
    };

    try {
      const [result] = await sgMail.send(msg);
      console.log('Email sent successfully to:', recipient);
      return result;
    } catch (error) {
      console.error('SendGrid Error Details:', {
        statusCode: error.code,
        message: error.message,
        response: error.response?.body,
      });
      throw error;
    }
  });

  return Promise.all(sendMailPromises);
}
