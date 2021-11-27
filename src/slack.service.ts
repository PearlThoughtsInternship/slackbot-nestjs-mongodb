import { Injectable } from '@nestjs/common';
// import { orgBtn } from 'src/providers/blocks';
// import { orgBtn, subBtn, unSubBtn, subModal, otpModal, unsubModal } from 'src/providers/blocks';
import { orgBtn, subBtn } from 'src/providers/blocks';

import { ChannelService } from 'src/modules/channel/channel.service';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { MessageService } from 'src/modules/message/message.service';
import { WhatsappService } from 'src/modules/whatsapp/whatsapp.service';
import { SlackApiService } from 'src/modules/slack/slack.service';
import { ConfigService } from 'src/shared/config.service';

const actionMap = {
    'orignal_message_button': orgBtn
};
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
        private channelService: ChannelService,
        private workspaceService: WorkspaceService,
        private configService: ConfigService,
        private slackService: SlackApiService,
        private messageService: MessageService,
        private whatsAppService: WhatsappService,
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
        Object.keys(actionMap).forEach((action) => {
            boltApp.action(action, actionMap[action]);
        });
        boltApp.action("whatsapp_sub_button", async ({body,client, ack, say }) => {
            // Acknowledge action request
            await ack();
            console.log("dajshdjhsakdhkas");

            // Call the users.info method using the WebClient
            const profile = await client.users.info({
                user: body.user.id
            });
            var userProfile = profile.user.profile;
            var realName = userProfile.real_name;
            var userID = profile.user.id;
            var channelName = body.channel.name;
            var channelID = body.channel.id;
            var pData = {realName,userID,channelName};
            
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
        });

        boltApp.action("whatsapp_unsub_button", async ({body,client, ack, say }) => {
            // Acknowledge action request
            // console.log(body);
            // var orignalMessage = JSON.parse(body.actions[0].value);
            // Call the users.info method using the WebClient
            const profile = await client.users.info({
                user: body.user.id
            });
            var userProfile = profile.user.profile;
            var realName = userProfile.real_name;
            var userID = profile.user.id;
            var pData = {realName,userID};
            var channelName = body.channel.name;
            var channelID = body.channel.id;
            await ack();
          
            try {
                    //get an array of numbers that are subbed for current user
                    // var whatsAppRepository = new WhatsAppRepository();
                    var numsSubscribed =  await this.whatsAppService.listOfSubscribersByUserID(userID,channelID);
                    var numbersSubbed = JSON.stringify(numsSubscribed);
                    numbersSubbed = JSON.parse(numbersSubbed);
          
                    //generate a dynamic radio list from numbers subbed
                    var optionsGen = [];
                    // for (let i=0;i<numbersSubbed.length;i++) {
                    //     optionsGen.push({
                    //         "text": {
                    //             "type": "plain_text",
                    //             "text": numbersSubbed[i].whatsappnum,
                    //             "emoji": true
                    //         },
                    //         "value": numbersSubbed[i].whatsappnum
                    //     });
                    // }
          
                    //show a radio button list for numbers subbed to unsub if any
                    if(numbersSubbed.length>0){
                        // Call views.open with the built-in client
                        const result = await client.views.open({
                            // Pass a valid trigger_id within 3 seconds of receiving it
                            trigger_id: body.trigger_id,
                            // View payload
                            view:  {
                                "type": "modal",
                                callback_id: 'view_whatsapp_unsub_modal',
                                "title": {
                                    "type": "plain_text",
                                    "text": "WhatsApp Subscription"
                                },
                                "submit": {
                                    "type": "plain_text",
                                    "text": "Unsubscribe",
                                    "emoji": true
                                },
                                "close": {
                                    "type": "plain_text",
                                    "text": "Close",
                                    "emoji": true
                                },
                                "blocks": [
                                    {
                                        "type": "section",
                                        "block_id":"unSub_Nums_selected",
                                        "text": {
                                            "type": "mrkdwn",
                                            "text": "Your *Active* WhatsApp Subscriptions :"
                                        },
                                        "accessory":{
                                            "type":"radio_buttons",
                                            "action_id":"unSub_Nums_actionId",
                                            "initial_option":optionsGen[0],
                                            "options":optionsGen
                                         }
                                    },
                                ],
                                "private_metadata": JSON.stringify(pData),
                            }
                        });
                    }
                    else{
                        //redirect to sub modal if user wants to sub
                        const result = await client.views.open({
                            // Pass a valid trigger_id within 3 seconds of receiving it
                            trigger_id: body.trigger_id,
                            // View payload
                            view:  {
                                "type": "modal",
                                callback_id: 'view_whatsapp_sub_modal',
                                "title": {
                                    "type": "plain_text",
                                    "text": "WhatsApp Subscription"
                                },
                                "close": {
                                    "type": "plain_text",
                                    "text": "Close",
                                    "emoji": true
                                },
                                "blocks": [
                                    {
                                        "type": "section",
                                        "text": {
                                            "type": "mrkdwn",
                                            "text": `*Your Don't have any Active WhatsApp Subscriptions yet for*\n Channel : #${channelName}`
                                        }
                                    },
                                ],
                                "private_metadata": JSON.stringify(pData),
                            }
                        });
                    }
                    
                // console.log(result);
                }
                catch (error) {
                console.error(error);
                }
        });

        boltApp.action("whatsapp_unsub_button", async ({body,client, ack, say }) => {
            // Acknowledge action request
            // console.log(body);
            // var orignalMessage = JSON.parse(body.actions[0].value);
            // Call the users.info method using the WebClient
            const profile = await client.users.info({
                user: body.user.id
            });
            var userProfile = profile.user.profile;
            var realName = userProfile.real_name;
            var userID = profile.user.id;
            var pData = {realName,userID};
            var channelName = body.channel.name;
            var channelID = body.channel.id;
            await ack();
          
            try {
                    //get an array of numbers that are subbed for current user
                    // var whatsAppRepository = new WhatsAppRepository();
                    var numsSubscribed =  await this.whatsAppService.listOfSubscribersByUserID(userID,channelID);
                    var numbersSubbed = JSON.stringify(numsSubscribed);
                    numbersSubbed = JSON.parse(numbersSubbed);
          
                    //generate a dynamic radio list from numbers subbed
                    var optionsGen = [];
                    // for (let i=0;i<numbersSubbed.length;i++) {
                    //     optionsGen.push({
                    //         "text": {
                    //             "type": "plain_text",
                    //             "text": numbersSubbed[i].whatsappnum,
                    //             "emoji": true
                    //         },
                    //         "value": numbersSubbed[i].whatsappnum
                    //     });
                    // }
          
                    //show a radio button list for numbers subbed to unsub if any
                    if(numbersSubbed.length>0){
                        // Call views.open with the built-in client
                        const result = await client.views.open({
                            // Pass a valid trigger_id within 3 seconds of receiving it
                            trigger_id: body.trigger_id,
                            // View payload
                            view:  {
                                "type": "modal",
                                callback_id: 'view_whatsapp_unsub_modal',
                                "title": {
                                    "type": "plain_text",
                                    "text": "WhatsApp Subscription"
                                },
                                "submit": {
                                    "type": "plain_text",
                                    "text": "Unsubscribe",
                                    "emoji": true
                                },
                                "close": {
                                    "type": "plain_text",
                                    "text": "Close",
                                    "emoji": true
                                },
                                "blocks": [
                                    {
                                        "type": "section",
                                        "block_id":"unSub_Nums_selected",
                                        "text": {
                                            "type": "mrkdwn",
                                            "text": "Your *Active* WhatsApp Subscriptions :"
                                        },
                                        "accessory":{
                                            "type":"radio_buttons",
                                            "action_id":"unSub_Nums_actionId",
                                            "initial_option":optionsGen[0],
                                            "options":optionsGen
                                         }
                                    },
                                ],
                                "private_metadata": JSON.stringify(pData),
                            }
                        });
                    }
                    else{
                        //redirect to sub modal if user wants to sub
                        const result = await client.views.open({
                            // Pass a valid trigger_id within 3 seconds of receiving it
                            trigger_id: body.trigger_id,
                            // View payload
                            view:  {
                                "type": "modal",
                                callback_id: 'view_whatsapp_sub_modal',
                                "title": {
                                    "type": "plain_text",
                                    "text": "WhatsApp Subscription"
                                },
                                "close": {
                                    "type": "plain_text",
                                    "text": "Close",
                                    "emoji": true
                                },
                                "blocks": [
                                    {
                                        "type": "section",
                                        "text": {
                                            "type": "mrkdwn",
                                            "text": `*Your Don't have any Active WhatsApp Subscriptions yet for*\n Channel : #${channelName}`
                                        }
                                    },
                                ],
                                "private_metadata": JSON.stringify(pData),
                            }
                        });
                    }
                    
                // console.log(result);
                }
                catch (error) {
                console.error(error);
                }
        });

        var attemptsLeft=4;
        boltApp.view("view_whatsapp_sub_modal", async ({ ack, body, view, client }) => {
            var attemptsLeft=4;
            let recievedData = JSON.parse(body.view.private_metadata);
            let modalUpdate;
            let userID = recievedData.userID;
            let whatsappNum = view['state']['values']['whatsappNumBlock']['plain_text_input-action']['value'];
            let realName = recievedData.realName;
            let channelName = recievedData.channelName;
            let channelID = "";

            //check if user has already subbed with the input number
            // var whatsAppRepository = new WhatsAppRepository();
            var checkIfAlreadySubbed =  await this.whatsAppService.listOfSubscribersByNumber(whatsappNum,channelID);

            //if not subbed open up the modal to enter OTP
            if( (checkIfAlreadySubbed.length == 0) && (whatsappNum.length==10) && (/\d{10}/.test(whatsappNum))) {
                // let messageService = new MessageService();
                var OPTVerify = await this.messageService.randomOTP();
                console.log(`First OTP SENT ${OPTVerify}, ATTEMPTS LEFT : ${attemptsLeft}`);
                this.messageService.whatsappOTPVerify(realName,whatsappNum,'#'+channelName,OPTVerify);
                let subData = {userID,whatsappNum,channelID,realName,OPTVerify}
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
                let unsubData = {userID,whatsappNum,channelID,realName}
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
        });

        boltApp.view("view_otp_modal", async ({ ack, body, view, client}) => {
            let modalUpdate;
            var recievedData = JSON.parse(body.view.private_metadata);
            var userID = recievedData.userID;
            var whatsappNum = recievedData.whatsappNum;
            var channelid = recievedData.channelID;
            var realName = recievedData.realName;
            var OPTVerify = recievedData.OPTVerify;
            var input_otp = view['state']['values']['otpBlock']['otp-action']['value'];
            // var workspaceRepository = new WorkspaceRepository();
            // var whatsAppRepository = new WhatsAppRepository();
            // let messageService = new MessageService();
            // let slackService = new SlackService();
            var time = Date.now || function() {
                return +new Date;
            };
            let channelName = "";
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
        });
    
        boltApp.view("view_whatsapp_unsub_modal", async ({ ack, body, view, client}) => {
            await ack();
            let channelName = "";
            let channelID = "";
            let recievedData = JSON.parse(body.view.private_metadata);
            let userID = recievedData.userID;
            var whatsappNum = recievedData.whatsappNum;
            var time = Date.now || function() {
                return +new Date;
            };
            if(whatsappNum==undefined){
                whatsappNum = body.view['state']['values']['unSub_Nums_selected']['unSub_Nums_actionId']['selected_option']['value'];
            }
            let realName = recievedData.realName;

            try {
                //Delete the user entry from db
                var unSubscribe =  await this.whatsAppService.unRegister(whatsappNum,channelID,userID);

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
                      text: 'Subscription Cancelled.'
                    },
                    blocks: [
                      {
                        type: 'section',
                        text: {
                          type: 'mrkdwn',
                          text: `Dear *${realName}*, \nYou have succesfully Cancelled your WhatsApp Subscription from, \n\nNumber : *+91${whatsappNum}* \nChannel : *#${channelName}*`
                        }
                      }
                    ]
                  }
                });

                // Notify User by Posting an Ephemeral
                var workspace = await this.workspaceService.findByTeamId(body.view.team_id);
                await this.slackService.postEphemeral(
                    workspace.accessToken,
                    channelID,
                    `Your WhatsApp Subscription for channel *${channelName}* on Mobile Number *+91${whatsappNum}*`,
                    userID,
                    [
                        {
                            "color": "#a63636",
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
                                "text": "You have successfully Unsubscribed from Whatsapp Alerts."
                            }
                        }
                    ],
                    'https://cdn4.iconfinder.com/data/icons/miu-square-flat-social/60/whatsapp-square-social-media-512.png'
                ); 

                // console.log('\x1b[41m%s\x1b[0m',(unSubscribe==1)?(`${realName}{${whatsappNum}} has Unsubscribed from #${channelName} Whatsapp Alerts.`):'Something Went wrong unsubscribing.');
              }
              catch (error) {
                console.error(error);
              }
        });
    }
}