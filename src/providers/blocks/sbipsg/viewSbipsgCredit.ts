export function viewSbipsgCredit({account,payee,amount,card}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Credit Alert"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (account === undefined) ? "*SBI Card:*\n Ending with " +card : "*Account:*\n SBI - " +account
                    
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " :"*Payee:*\n" + payee
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Amount Credited:*\n₹" + amount
                }
            ]
        }
    ];

    return blocks;
}