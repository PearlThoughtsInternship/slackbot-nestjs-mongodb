import { Injectable } from '@nestjs/common';

import { MessageService } from 'src/modules/message/message.service';
import { WhatsappService } from 'src/modules/whatsapp/whatsapp.service';
import { ConfigService } from 'src/shared/config.service';

@Injectable()
export class SubscriptionService {
    constructor(
        private configService: ConfigService,
        private messageService: MessageService,
        private whatsAppService: WhatsappService,
    ) {}

    async initSubBtn({body,client, ack, say}) {
        // Call the users.info method using the WebClient
        const profile = await client.users.info({
            user: body.user.id
        });
        var userProfile = profile.user.profile;
        var realName = userProfile.real_name;
        var userID = profile.user.id;
        var channelName = body.channel.name;
        var channelID = body.channel.id;
        var pData = {realName,userID,channelName,channelID};
        
        try {
            // Call views.open with the built-in client
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: body.trigger_id,
                // View payload
                view: {
                    type: 'modal',
                    // View identifier
                    callback_id: 'view_whatsapp_sub_modal',
                    title: {
                        type: 'plain_text',
                        text: 'Whatsapp Subscription'
                    },
                    "submit": {
                        "type": "plain_text",
                        "text": "Submit",
                        "emoji": true
                    },
                    "close": {
                        "type": "plain_text",
                        "text": "Cancel",
                        "emoji": true
                    },
                    blocks: [
                        {
                            "type": "section",
                            "text": {
                                "type": "plain_text",
                                "text": `Hello ${realName},`,
                                "emoji": true
                            }
                        },
                        {
                            "type": "input",
                            "block_id": "whatsappNumBlock",
                            "element": {
                                "type": "plain_text_input",
                                "action_id": "plain_text_input-action",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Enter your 10 digit Whatsapp Number"
                                }
                            },
                            "label": {
                                "type": "plain_text",
                                "text": "📱 Enter your WhatsApp Number excluding (+91) :",
                                "emoji": false
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                              "type": "mrkdwn",
                              "text": "\nSubscribing for #"+channelName+"\n<https://messagerouter.co|View App>"
                            }
                          } 
                    ],
                    "private_metadata" : JSON.stringify(pData)
                }
            });
            // console.log(result);
        }
        catch (error) {
            console.error(error);
        }
        // await say('Request approved 👍');
    };

    async initSubModal({ack, body, view, client}) {
        var attemptsLeft=4;
        let recievedData = JSON.parse(body.view.private_metadata);
        let modalUpdate;
        let userID = recievedData.userID;
        let whatsappNum = view['state']['values']['whatsappNumBlock']['plain_text_input-action']['value'];
        let realName = recievedData.realName;
        let channelName = recievedData.channelName;
        let channelID = recievedData.channelID;

        //check if user has already subbed with the input number
        var checkIfAlreadySubbed =  await this.whatsAppService.listOfSubscribersByNumber(whatsappNum,channelID);

        //if not subbed open up the modal to enter OTP
        if( (checkIfAlreadySubbed.length == 0) && (whatsappNum.length==10) && (/\d{10}/.test(whatsappNum))) {
            var OPTVerify = await this.messageService.randomOTP();
            console.log(`First OTP SENT ${OPTVerify}, ATTEMPTS LEFT : ${attemptsLeft}`);
            this.messageService.whatsappOTPVerify(realName,whatsappNum,'#'+channelName,OPTVerify);
            let subData = {userID,whatsappNum,channelID,realName,OPTVerify,channelName}
            modalUpdate = {
                "response_action": "update",
                "view": {
                  "type": "modal",
                  callback_id: 'view_otp_modal',
                  "title": {
                    "type": "plain_text",
                    "text": "WhatsApp Subscription",
                  },
                  "blocks":[
                    {
                       "type":"input",
                       "block_id":"otpBlock",
                       "element":{
                          "type":"plain_text_input",
                          "action_id":"otp-action",
                          "placeholder":{
                             "type":"plain_text",
                             "text":"4 digit OTP :"
                          }
                       },
                       "label":{
                          "type":"plain_text",
                          "text":`👤 Enter the OTP sent to +91${whatsappNum} :`,
                          "emoji":true
                       }
                    },
                    {
                       "type":"section",
                       "text":{
                          "type":"mrkdwn",
                          "text": "\nSubscribing for #"+channelName+"\n<https://messagerouter.co|View App>"
                       }
                    }
                 ],
                  "submit": {
                      "type": "plain_text",
                      "text": "Submit",
                      "emoji": true
                  },
                  "close": {
                      "type": "plain_text",
                      "text": "Close",
                      "emoji": true
                  },
                  "private_metadata": JSON.stringify(subData),
                }
            }
        }
        //number validation for whatsappNumBlock
        else if(whatsappNum.length!=10 || !(/\d{10}/.test(whatsappNum))){
            modalUpdate = {
                "response_action": "errors",
                "errors": {
                "whatsappNumBlock": "Please enter a valid number."
                }
            }
            console.log('\x1b[33m%s\x1b[0m',`${realName}{${whatsappNum}} has Entered Wrong Number.`);
        }
        //if the user is already subbed offer him call to open a modal to unsub
        else{
            let unsubData = {userID,whatsappNum,channelID,realName,channelName}
            modalUpdate = {
                "response_action": "update",
                "view": {
                  "type": "modal",
                  callback_id: 'view_whatsapp_unsub_modal',
                  "title": {
                    "type": "plain_text",
                    "text": "WhatsApp Subscription",
                  },
                  "blocks": [
                    {
                      "type": "section",
                      "text": {
                        "type": "mrkdwn",
                        "text": `You are already Subscribed for WhatsApp alerts on *+91${whatsappNum}*.\n\n Do you wish to *Unsubscribe* ?`
                        },
                    },
                    {
                        "type": "section",
                        "text": {
                        "type": "mrkdwn",
                        "text": "\n<slack://channel?|*#"+channelName+"*>"
                    }
                    }
                  ],
                  "submit": {
                      "type": "plain_text",
                      "text": "Yes",
                      "emoji": true
                  },
                  "close": {
                      "type": "plain_text",
                      "text": "No",
                      "emoji": true
                  },
                  "private_metadata": JSON.stringify(unsubData),
                }
            }
            //console.log('\x1b[41m%s\x1b[0m',`${input_name}{${input_num}} has already Subscribed for Whatsapp Alerts.`);
        }

         await ack(modalUpdate);
        // console.log(view);
    };
}