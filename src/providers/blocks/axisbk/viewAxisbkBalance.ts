export function viewAxisbkBalance({account,balance}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Transaction Alert"
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
                    "text": "*Available Balance :*\n₹" + balance
                }
            ]
        }
    ];

    return blocks;
}