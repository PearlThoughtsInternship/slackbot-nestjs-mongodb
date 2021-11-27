import { Injectable } from '@nestjs/common';

@Injectable()
export class OriginalButtonService {
    async initOriginalMessageModal({ body,client, ack, say }) {
        var channelName = body.channel.name;
        var orignalMessage = JSON.parse(body.actions[0].value);
        console.log(orignalMessage.sender+" Modal opened.");

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
              callback_id: 'view_1',
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
          // console.log(result);
        }
        catch (error) {
          console.error(error);
        }
          // await say('Request approved 👍');
    };
}