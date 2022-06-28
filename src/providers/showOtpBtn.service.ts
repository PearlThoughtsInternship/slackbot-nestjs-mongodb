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

  async initShowViewLogModal({body,client,ack},showViewDetails){
    await ack();
    let blocks = [];
    for(let showViewDetail of showViewDetails){
      blocks.push(
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `<@${showViewDetail.userName}> \t \t \t \t \t \t \t \t \t \t \t ${showViewDetail.viewedOn}`
        }
      })
    }

    try{
      await client.views.open({
        trigger_id:body.trigger_id,
        view:{
          "type": "modal",
          "title": {
            "type": "plain_text",
            "text": "OTP View Log",
            "emoji": true
          },
          "close": {
            "type": "plain_text",
            "text": "Close",
            "emoji": true
          },
          "blocks": [{
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "User \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \tViewed on",
              "emoji": true
            }
          },
          ...blocks
        ]
        }
      })

    }catch(error){
      console.log(error)
    }
    
  }
}
