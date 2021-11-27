export const subBtn = async ({body,client, ack, say }) => {
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
};

module.exports = subBtn;