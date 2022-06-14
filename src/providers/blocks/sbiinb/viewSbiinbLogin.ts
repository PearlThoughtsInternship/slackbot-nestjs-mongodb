export function viewSbiinbLogin({card,OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "SBI Netbanking Login"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (card === undefined) ? "*SBI Internet banking*\n(Personal)" : "*SBI Card:*\n Ending "+card
                },
                {
                    "type": "mrkdwn",
                    "text": "*OTP:*\n XXXXXX" 
                }
            ]
        }
    ];

    return blocks;
}
