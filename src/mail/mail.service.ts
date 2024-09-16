import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcomeEmail(
    user: { username: string; email: string },
    token: string,
  ): Promise<void> {
    const confirmationUrl = `http://localhost:3000/users/confirmEmail/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to the E-Learning App',
      template: './welcomeEmail',
      context: {
        username: user.username,
        confirmationUrl,
      },
    });
  }
}
