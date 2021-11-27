// import { WhatsappService } from '../../modules/whatsapp/whatsapp.service';
// import { WorkspaceService } from '../../modules/workspace/workspace.service';
// import { SlackService } from '../../modules/slack/slack.service';

// export const unsubModal = async ({ ack, body, view, client}) => {
//     await ack();
//     let channelName = "";
//     let channelID = "";
//     let recievedData = JSON.parse(body.view.private_metadata);
//     let userID = recievedData.userID;
//     var whatsappNum = recievedData.whatsappNum;
//     var time = Date.now || function() {
//         return +new Date;
//     };
//     if(whatsappNum==undefined){
//         whatsappNum = body.view['state']['values']['unSub_Nums_selected']['unSub_Nums_actionId']['selected_option']['value'];
//     }
//     let realName = recievedData.realName;

//     try {
//         //Delete the user entry from db
//         var unSubscribe =  await this.whatsAppService.unRegister(whatsappNum,channelID,userID);

//         // Call views.open with the built-in client
//         const result = await client.views.open({
//           // Pass a valid trigger_id within 3 seconds of receiving it
//           trigger_id: body.trigger_id,
//           // View payload
//           view: {
//             type: 'modal',
//             // View identifier
//             callback_id: 'view_1',
//             title: {
//               type: 'plain_text',
//               text: 'Subscription Cancelled.'
//             },
//             blocks: [
//               {
//                 type: 'section',
//                 text: {
//                   type: 'mrkdwn',
//                   text: `Dear *${realName}*, \nYou have succesfully Cancelled your WhatsApp Subscription from, \n\nNumber : *+91${whatsappNum}* \nChannel : *#${channelName}*`
//                 }
//               }
//             ]
//           }
//         });

//         // Notify User by Posting an Ephemeral
//         var workspace = await this.workspaceService.findByTeamId(body.view.team_id);
//         await this.slackService.postEphemeral(
//             workspace.accessToken,
//             channelID,
//             `Your WhatsApp Subscription for channel *${channelName}* on Mobile Number *+91${whatsappNum}*`,
//             userID,
//             [
//                 {
//                     "color": "#a63636",
//                     "text": "*WhatsApp Subscription*",
//                     "fields": [
//                         {
//                             "title": "For Channel",
//                             "value": `#*${channelName}*`,
//                             "short": true
//                         },
//                         {
//                             "title": "On Number",
//                             "value": `*+91${whatsappNum}*`,
//                             "short": true
//                         }
//                     ],
//                     "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
//                     "ts": time()
//                 }
//             ],
//             [
//                 {
//                     "type": "header",
//                     "text": {
//                         "type": "plain_text",
//                         "text": "You have successfully Unsubscribed from Whatsapp Alerts."
//                     }
//                 }
//             ],
//             'https://cdn4.iconfinder.com/data/icons/miu-square-flat-social/60/whatsapp-square-social-media-512.png'
//         ); 

//         console.log('\x1b[41m%s\x1b[0m',(unSubscribe==1)?(`${realName}{${whatsappNum}} has Unsubscribed from #${channelName} Whatsapp Alerts.`):'Something Went wrong unsubscribing.');
//       }
//       catch (error) {
//         console.error(error);
//       }
// };