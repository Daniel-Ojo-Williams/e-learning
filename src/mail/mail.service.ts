import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { EnvVariables } from 'src/config/validateEnv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as ejs from 'ejs';
import { join } from 'node:path';
@Injectable()
export class MailService {
  private readonly transport: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  private readonly basePath: string;
  constructor(private env: ConfigService<EnvVariables, true>) {
    const config = createTransport({
      host: env.get('MAIL_HOST'),
      port: env.get('MAIL_PORT'),
      auth: {
        user: env.get('MAIL_USERNAME'),
        pass: env.get('MAIL_PASSWORD'),
      },
    });

    this.transport = config;
    this.basePath = join(__dirname, './templates');
  }

  async sendUserWelcomeEmail(
    user: { username: string; email: string },
    token: string,
  ): Promise<void> {
    const confirmationUrl = `http://localhost:3000/users/confirmEmail/${token}`;

    const template = join(this.basePath, 'welcomeEmail.ejs');
    const context = { username: user.username, confirmationUrl };
    const body = await ejs.renderFile(template, context);

    await this.transport.sendMail({
      to: user.email,
      subject: 'Welcome to the E-Learning App',
      html: body,
    });
  }
}
