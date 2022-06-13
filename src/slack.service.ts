import { Injectable } from '@nestjs/common';
// import { orgBtn } from 'src/providers/blocks';
// import { orgBtn, subBtn, unSubBtn, subModal, otpModal, unsubModal } from 'src/providers/blocks';
// import { orgBtn, subBtn } from 'src/providers/blocks';

import { OriginalButtonService } from 'src/providers/orgBtn.service';
import { ShowOtpButtonService } from './providers/showOtpBtn.service';
import { MessageService } from './modules/message/message.service';


// const actionMap = {
//     'orignal_message_button': orgBtn
// };
// 'whatsapp_unsub_button' : unSubBtn,
// 'view_whatsapp_sub_modal' : subModal

// const viewMap = {
//     'view_whatsapp_sub_modal' : subModal,
//     'view_otp_modal' : otpModal,
//     'view_whatsapp_unsub_modal' : unsubModal
// };

@Injectable()
export class SlackService {
    constructor(
        private originalButtonService: OriginalButtonService,
        private showOtpButtonService:ShowOtpButtonService,
        private messageService:MessageService
    ) {}

    initSlackCommand(boltApp: any): void {
        console.info("slack command");
        boltApp.command('/echo', ({ ack }) => {
            console.info("who are u");
            ack({
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hello, i am *Edhuku Indha Bot:gowtham*. "
                        }
                    }
                ]
            });
        });
    }

    initSlackInteractive(boltApp: any) {
        boltApp.action("orignal_message_button", async ({ body,client, ack, say }) => {
            var request = { body,client, ack, say };
            this.originalButtonService.initOriginalMessageModal(request);
        });


        boltApp.action("show_otp",async({body,client,ack,say}) =>{
            var request = { body,client, ack, say };
            await this.showOtpButtonService.initShowOtpModal(request);
            await this.messageService.FetchMsgDetails(request);   
        })

    }



    initAppHome(boltApp: any) {
        boltApp.event('app_home_opened', async ({ event, client, context }) => {
            
            try {
              /* view.publish is the method that your app uses to push a view to the Home tab */
              const result = await client.views.publish({
          
                /* the user that opened your app's app home */
                user_id: event.user,
                
          
                /* the view object that appears in the app home*/
                view: {
                  type: 'home',
                  callback_id: 'home_view',
          
                  /* body of the view */
                  blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Add channels where you wish to receive notification"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Add channels",
                                "emoji": true
                            },
                            "value": "add_channels",
                            "action_id": "button-action"
                        }
                    }
                ]
                }
              });
            }
            catch (error) {
              console.error(error);
            }
          });
    }

    
}