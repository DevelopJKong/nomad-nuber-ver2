import got from 'got';
import * as FormData from 'form-data';
import { MailModuleOptions, EmailVar } from './mail.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('testing', 'test', [])
      .then(() => {
        console.log('Message sent');
      })
      .catch((error) => {
        console.log(error.response.body);
      });
  }

  private async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append(
      'from',
      `Jeongkong from Nuber2 <mailgun@${this.options.domain}>`,
    );
    form.append('to', `jeongkong000@naver.com`);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
