import { Injectable } from '@nestjs/common';

import { ChannelService } from 'src/modules/channel/channel.service';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { MessageService } from 'src/modules/message/message.service';
import { WhatsappService } from 'src/modules/whatsapp/whatsapp.service';
import { SlackApiService } from 'src/modules/slack/slack.service';
import { ConfigService } from 'src/shared/config.service';

@Injectable()
export class UnsubscriptionService {
    constructor(
        private channelService: ChannelService,
        private workspaceService: WorkspaceService,
        private configService: ConfigService,
        private slackService: SlackApiService,
        private messageService: MessageService,
        private whatsAppService: WhatsappService,
    ) {}

    async initUnsubBtn({body,client, ack, say}) {
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
                var numsSubscribed =  await this.whatsAppService.listOfSubscribersByUserID(userID,channelID);
                // var numbersSubbed = JSON.stringify(numsSubscribed);
                var numbersSubbed = JSON.parse(numbersSubbed);
      
                //generate a dynamic radio list from numbers subbed
                var optionsGen = [];
                for (let i=0;i<numbersSubbed.length;i++) {
                    optionsGen.push({
                        "text": {
                            "type": "plain_text",
                            "text": numbersSubbed[i].whatsappnum,
                            "emoji": true
                        },
                        "value": numbersSubbed[i].whatsappnum
                    });
                }
      
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
    };

    async initUnsubModal({ack, body, view, client}) {
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
    };
}