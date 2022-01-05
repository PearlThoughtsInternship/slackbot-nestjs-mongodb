export function viewSbicrdCardLogin({card,OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "SBI Login"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (card === undefined) ? "*SBI Card *" : "*SBI Card:*\n Ending "+card
                },
                {
                    "type": "mrkdwn",
                    "text": "*OTP:*\n " + OTP
                }
            ]
        }
    ];

    return blocks;
}