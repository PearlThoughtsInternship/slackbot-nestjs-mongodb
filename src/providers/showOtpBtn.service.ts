import { Injectable } from '@nestjs/common';

@Injectable()
export class ShowOtpButtonService {
  async initShowOtpModal({ body, client, ack }) {
    await ack();
    var OTP = body.actions[0].value;
    try {
     await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'show_otp_callback',
          title: {
            type: 'plain_text',
            text: 'One Time Password',
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*' + OTP + '*',
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
