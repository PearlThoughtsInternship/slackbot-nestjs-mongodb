import { Injectable } from '@nestjs/common';

@Injectable()
export class OriginalButtonService {
    async initOriginalMessageModal({ body,client, ack, say }) {
        await ack();
        var orignalMessage = JSON.parse(body.actions[0].value);
        console.log(orignalMessage.sender+" Modal opened.");

        try {
          const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: {
              type: 'modal',
              callback_id: 'show_original_message_callback',
              title: {
                type: 'plain_text',
                text: 'Actual Message'
              },
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: '*'+orignalMessage.sender+'*'
                  }
                }
                ,{
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: orignalMessage.message
                  }
                  }
              ]
            }
          });
        }
        catch (error) {
          console.error(error);
        }
    };
}