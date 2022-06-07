import { Injectable } from '@nestjs/common';

@Injectable()
export class ShowOtpButtonService {
    async initShowOtpModal({ body,client, ack, say }) {

         var OTP = JSON.parse(body.actions[0].value);
        console.log("OTP Modal opened.");
        
        // Acknowledge action request
        await ack();
        //----------------------
        try {
          // Call views.open with the built-in client
          const result = await client.views.open({
            // Pass a valid trigger_id within 3 seconds of receiving it
            trigger_id: body.trigger_id,
            // View payload
            view: {
              type: 'modal',
              // View identifier
              callback_id: 'show_otp',
              title: {
                type: 'plain_text',
                text: 'One Time Password'
              },
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: '*'+OTP+'*'
                  }
                }
              ]
            }
          });
          // console.log(result);
        }
        catch (error) {
          console.error(error);
        }
          // await say('Request approved 👍');

    };
}