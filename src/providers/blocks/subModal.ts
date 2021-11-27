const {
    WhatsAppRepository
} = require('../../Repositories');
const {
    MessageService
} = require('../../Services');

export const subModal = async ({ ack, body, view, client }) => {
    var attemptsLeft=4;
    let recievedData = JSON.parse(body.view.private_metadata);
    let modalUpdate;
    let userID = recievedData.userID;
    let whatsappNum = view['state']['values']['whatsappNumBlock']['plain_text_input-action']['value'];
    let realName = recievedData.realName;
    let channelName = recievedData.channelName;
    let channelID = "";

    //check if user has already subbed with the input number
    var whatsAppRepository = new WhatsAppRepository();
    var checkIfAlreadySubbed =  await whatsAppRepository.listOfSubscribersByNumber(whatsappNum,channelID);

    //if not subbed open up the modal to enter OTP
    if( (checkIfAlreadySubbed.length == 0) && (whatsappNum.length==10) && (/\d{10}/.test(whatsappNum))) {
        let messageService = new MessageService();
        var OPTVerify = await messageService.randomOTP();
        console.log(`First OTP SENT ${OPTVerify}, ATTEMPTS LEFT : ${attemptsLeft}`);
        messageService.whatsappOTPVerify(realName,whatsappNum,'#'+channelName,OPTVerify);
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
};

module.exports = subModal;