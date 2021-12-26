export function viewAxisbkCredit({account,ref,amount,balance}: any): any {
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
                    "text": "*Axis Bank :*\n " +account
                    
                },
                {
                    "type": "mrkdwn",
                    "text": (ref === undefined) ? " "  : "*REF:*\n" + ref
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Amount Credited :*\n₹" + amount
                },
                {
                    "type": "mrkdwn",
                    "text": "*Available Balance :*\n₹" + balance
                },
            ]
        }
    ];

    return blocks;
}