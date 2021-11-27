const {
    WhatsAppRepository
} = require('../../Repositories');

export const unSubBtn = async ({body,client, ack, say }) => {
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
            var whatsAppRepository = new WhatsAppRepository();
            var numsSubscribed =  await whatsAppRepository.listOfSubscribersByUserID(userID,channelID);
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
};

module.exports = unSubBtn;