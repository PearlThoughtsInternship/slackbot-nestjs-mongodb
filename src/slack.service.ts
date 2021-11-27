import { Injectable } from '@nestjs/common';
// import { orgBtn } from 'src/providers/blocks';
// import { orgBtn, subBtn, unSubBtn, subModal, otpModal, unsubModal } from 'src/providers/blocks';
// import { orgBtn, subBtn } from 'src/providers/blocks';

import { SubscriptionService } from 'src/providers/subscription.service';
import { UnsubscriptionService } from 'src/providers/unsubscription.service';
import { OtpService } from 'src/providers/otp.service';
import { OriginalButtonService } from 'src/providers/orgBtn.service';

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
        private subscriptionService: SubscriptionService,
        private unsubscriptionService: UnsubscriptionService,
        private otpService: OtpService,
        private originalButtonService: OriginalButtonService,
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

        boltApp.action("whatsapp_sub_button", async ({body,client, ack, say }) => {
            var request = {body,client, ack, say };
            this.subscriptionService.initSubBtn(request);
        });

        boltApp.action("whatsapp_unsub_button", async ({body,client, ack, say }) => {
            var request = {body,client, ack, say };
            this.unsubscriptionService.initUnsubBtn(request);
        });

        boltApp.view("view_whatsapp_sub_modal", async ({ ack, body, view, client }) => {
            var request = {ack, body, view, client};
            this.subscriptionService.initSubModal(request);
        });

        boltApp.view("view_otp_modal", async ({ ack, body, view, client}) => {
            var request = {ack, body, view, client};
            this.otpService.initOtpModal(request);
        });
    
        boltApp.view("view_whatsapp_unsub_modal", async ({ ack, body, view, client}) => {
            var request = {ack, body, view, client};
            this.unsubscriptionService.initUnsubModal(request);
        });
    }
}