import { Injectable } from '@nestjs/common';
// import { orgBtn } from 'src/providers/blocks';
// import { orgBtn, subBtn, unSubBtn, subModal, otpModal, unsubModal } from 'src/providers/blocks';
// import { orgBtn, subBtn } from 'src/providers/blocks';

import { OriginalButtonService } from 'src/providers/orgBtn.service';
import { ShowOtpButtonService } from './providers/showOtpBtn.service';
import { MessageService } from './modules/message/message.service';
import { ACTION_ADD_CHANNELS_ADMIN } from './common/constants/action';


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
        boltApp.action("show_orignal_message", async ({ body,client, ack, say }) => {
            var request = { body,client, ack, say };
            this.originalButtonService.initOriginalMessageModal(request);
            await this.messageService.fetchMsgDetails(request); 
        });

        boltApp.action("show_orignal_message_no_log", async ({ body,client, ack, say }) => {
            var request = { body,client, ack, say };
            this.originalButtonService.initOriginalMessageModal(request); 
        });

        boltApp.action("show_otp",async({body,client,ack,say}) =>{
            var request = { body,client, ack, say };
            await this.showOtpButtonService.initShowOtpModal(request);
            await this.messageService.fetchMsgDetails(request);   
        });

        boltApp.action("show_view_log",async({body,client,ack,say}) =>{
            var request = { body,client, ack, say };
            let showviewDetails = await this.messageService.fetchViewLogDetails(request);  
            await this.showOtpButtonService.initShowViewLogModal(request,showviewDetails);
             
        });

    }



    initAppHome(boltApp: any) {
        boltApp.event('app_home_opened', async ({ event, client, context }) => {
            
            try {
              const result = await client.views.publish({
                user_id: event.user,
                view: {
                  type: 'home',
                  callback_id: 'home_view',
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
                            "action_id": ACTION_ADD_CHANNELS_ADMIN,

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