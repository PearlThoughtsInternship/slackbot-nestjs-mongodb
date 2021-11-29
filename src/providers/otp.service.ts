import { Injectable } from '@nestjs/common';

import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { MessageService } from 'src/modules/message/message.service';
import { WhatsappService } from 'src/modules/whatsapp/whatsapp.service';
import { SlackApiService } from 'src/modules/slack/slack.service';
import { ConfigService } from 'src/shared/config.service';
let attemptsLeft = 4;

@Injectable()
export class OtpService {
    constructor(
        private workspaceService: WorkspaceService,
        private configService: ConfigService,
        private slackService: SlackApiService,
        private messageService: MessageService,
        private whatsAppService: WhatsappService,
    ) {}

    async initOtpModal({ack, body, view, client}) {
        let modalUpdate;
        var recievedData = JSON.parse(body.view.private_metadata);
        var userID = recievedData.userID;
        var whatsappNum = recievedData.whatsappNum;
        var channelid = recievedData.channelID;
        var realName = recievedData.realName;
        var OPTVerify = recievedData.OPTVerify;
        var input_otp = view['state']['values']['otpBlock']['otp-action']['value'];
        var time = Date.now || function() {
            return +new Date;
        };
        let channelName = recievedData.channelName;
        console.log(`Input : ${input_otp} , Correct OTP : ${OPTVerify}`);
        if(input_otp==OPTVerify){

            //Insert the user entry to db
            const subscriber = await this.whatsAppService.register(body.user.username,whatsappNum,channelid,channelName,userID,realName);
            console.log('\x1b[36m%s\x1b[0m',`${realName}{${whatsappNum}} Subscribed for #${channelName} Whatsapp Alerts.`);
            
            //Update the modal to success
            modalUpdate = {
                "response_action": "update",
                view: {
                    type: 'modal',
                    // View identifier
                    callback_id: 'view_otp_modal_close',
                    title: {
                      type: 'plain_text',
                      text: 'Subscription Successful.'
                    },
                    "close": {
                        "type": "plain_text",
                        "text": "Close",
                        "emoji": true
                    },
                    blocks: [
                        {
                          type: 'section',
                          text: {
                            type: 'mrkdwn',
                            text: `Dear *${realName}*, \nYou have successfully subscribed for WhatsApp Alerts for, \n\nNumber : *+91${whatsappNum}* \nChannel : *#${channelName}*`
                          }
                        }
                      ]
                  }
            }

            // Notify User by Posting an Ephemeral
            var workspace = await this.workspaceService.findByTeamId(body.view.team_id);
            await this.slackService.postEphemeral(
                workspace.accessToken,
                channelid,
                `Your WhatsApp Subscription for channel *${channelName}* on Mobile Number *+91${whatsappNum}*`,
                userID,
                [
                    {
                        "color": "#36a64f",
                        "text": "*WhatsApp Subscription*",
                        "fields": [
                            {
                                "title": "For Channel",
                                "value": `#*${channelName}*`,
                                "short": true
                            },
                            {
                                "title": "On Number",
                                "value": `*+91${whatsappNum}*`,
                                "short": true
                            }
                        ],
                        "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
                        "ts": time()
                    }
                ],
                [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": "You have successfully subscribed for Whatsapp Alerts."
                        }
                    }
                ],
                'https://cdn4.iconfinder.com/data/icons/miu-square-flat-social/60/whatsapp-square-social-media-512.png'
            );        
        }
        else if(attemptsLeft==1){
            modalUpdate = {
                "response_action": "update",
                view: {
                    type: 'modal',
                    // View identifier
                    callback_id: 'view_otp_modal_incorrect',
                    title: {
                      type: 'plain_text',
                      text: 'ALL ATTEMPTS INVALID'
                    },
                    "close": {
                        "type": "plain_text",
                        "text": "Close",
                        "emoji": true
                    },
                    blocks: [
                        {
                          type: 'section',
                          text: {
                            type: 'mrkdwn',
                            text: `*${realName}*, \n Your User ID : *${userID}*\n Your Username : *${realName}*\n \nYou have been flagged from,  \nChannel : *#${channelName}*`
                          }
                        }
                      ]
                  }
            }
        }
        else{
            attemptsLeft-=1;
            console.log(`OTP SENT ${OPTVerify}, ATTEMPTS LEFT : ${attemptsLeft}`);
            this.messageService.whatsappOTPVerify(realName,whatsappNum,'#'+channelName,OPTVerify);
            modalUpdate = {
                "response_action": "errors",
                "errors": {
                "otpBlock": `Please enter the correct OTP.\n Attempts left : ${attemptsLeft}`
                }
            }
        }

        await ack(modalUpdate);
    };
}