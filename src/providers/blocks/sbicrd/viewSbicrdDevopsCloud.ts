export function viewSbicrdDevopsCloud({account,card,cloudPayeeAWS,OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": (cloudPayeeAWS) ? "AWS Account Sign-up" : "IBM Account Sign-up" 
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (account === undefined) ? "*Credit Card:*\n SBI - XXXX" +card : "*Account:*\n SBI - XXXX" +account
                },
                {
                    "type": "mrkdwn",
                    "text": "*OTP : *\n" + OTP
                }
            ]
        }
    ];

    return blocks;
}