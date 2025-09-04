import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getHtmlToSend, MailData, sendGridMail } from './mail.util';

@Injectable()
export class SMTPService {
  constructor(private readonly configService: ConfigService) {}

  async sendExampleMail(to: string) {
    const mailData: MailData = {
      to,
      subject: 'Welcome to CitySki!',
      html: {
        hasImage: true,
        subject: 'Welcome to CitySki!',
        imagePath: 'https://your-platform-url.com/logo.png',
        content: `
          歡迎加入CitySki！
          我們很高興您能成為我們的一員。
          現在就開始探索滑雪的樂趣吧！
        `,
        buttonUrl: 'https://your-platform-url.com',
        buttonLabel: '立即開始',
      },
    };

    return this.sendMail(mailData);
  }

  private async sendMail(data: MailData) {
    const { to, subject, html } = data;

    // Format content with paragraph tags
    const newContent = html.content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => `<p>${line}</p>`)
      .join('');

    const newHtml = await getHtmlToSend({
      hasImage: html.hasImage,
      subject: html.subject,
      imagePath: html.imagePath,
      content: newContent,
      buttonUrl: html.buttonUrl,
      buttonLabel: html.buttonLabel,
    });

    try {
      const results = await sendGridMail(to, subject, newHtml);
      return {
        success: true,
        statusCode: results[0].statusCode,
        message: '郵件發送成功',
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendVerificationEmail({
    to,
    name,
    verificationUrl,
  }: {
    to: string;
    name: string;
    verificationUrl: string;
  }) {
    const subject = '會員驗證信';

    type MailContentData = {
      contentData?: { [key: string]: string };
      buttonLabel?: string;
      buttonUrl?: string;
    };

    const mailContentData: MailContentData = {
      contentData: {
        content: `
          親愛的 ${name}，感謝您註冊CitySki會員。
          請點擊下方按鈕驗證您的電子信箱。
          此連結將在24小時後失效，請盡快完成驗證。
        `,
      },
      buttonLabel: '驗證電子信箱',
      buttonUrl: verificationUrl,
    };

    const html = await getHtmlToSend({
      hasImage: false,
      subject,
      imagePath: '',
      content: mailContentData.contentData.content,
      buttonUrl: mailContentData.buttonUrl,
      buttonLabel: mailContentData.buttonLabel,
    });

    await sendGridMail(to, subject, html);
  }

  async sendResetPasswordEmail({
    to,
    name,
    resetUrl,
  }: {
    to: string;
    name: string;
    resetUrl: string;
  }) {
    const mailData: MailData = {
      to,
      subject: '重設密碼',
      html: {
        hasImage: false,
        subject: '重設密碼',
        imagePath: '',
        content: `
          親愛的 ${name}，
          我們收到了您重設密碼的請求。
          請點擊下方按鈕重設您的密碼。
          此連結將在1小時後失效，請盡快完成重設。
          如果這不是您發出的請求，請忽略此信件。
        `,
        buttonUrl: resetUrl,
        buttonLabel: '重設密碼',
      },
    };

    return this.sendMail(mailData);
  }

  async sendAdminResetPasswordEmail({
    to,
    name,
    resetUrl,
  }: {
    to: string;
    name: string;
    resetUrl: string;
  }) {
    const mailData: MailData = {
      to,
      subject: 'CitySki管理系統 - 重設密碼',
      html: {
        hasImage: false,
        subject: '重設密碼',
        imagePath: '',
        content: `
          親愛的 ${name}，
          我們收到了您重設CitySki管理系統密碼的請求。
          請點擊下方按鈕重設您的密碼。
          此連結將在10分鐘後失效，請盡快完成重設。
          如果這不是您發出的請求，請忽略此信件並立即聯繫系統管理員。
        `,
        buttonUrl: resetUrl,
        buttonLabel: '重設密碼',
      },
    };

    return this.sendMail(mailData);
  }

  async sendEmailForCreateUser(to: string, resetUrl: string) {
    const mailData: MailData = {
      to,
      subject: 'CitySki 後台登入通知',
      html: {
        hasImage: false,
        subject: 'CitySki 後台登入通知',
        imagePath: '',
        content: `
          您已被邀請加入CitySki的後台，請點擊以下按鈕，並透過暫時的帳號密碼登入後台。建議在登入後修改您的密碼，感謝。
          帳號
          ${to}
          密碼
          ${this.configService.get('NEW_ADMIN_DEFAULT_PWD')}
        `,
        buttonUrl: resetUrl,
        buttonLabel: '登入後台',
      },
    };

    return this.sendMail(mailData);
  }
}
