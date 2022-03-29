export function viewSbicrdLimit({limitConsumed,availableLimit,account,totDue,minDue}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Card Limit Alert"
            }
        },
        {
            "type": "section",
        "fields": 
            {
                "type": "mrkdwn",
                "text":  (account === undefined) ? " " :"*Card ending with:*\n " +account
            } 
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text":  (limitConsumed === undefined) ? " " :"*SBI Card Limit Consumed :*\n " +limitConsumed
                    
                },
                {
                    "type": "mrkdwn",
                    "text":  (availableLimit === undefined) ? " " :"*Current available limit :*\n₹ " + availableLimit
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (totDue === undefined) ? " " : "*Total Amt Due:*\n " +totDue
                    
                },
                {
                    "type": "mrkdwn",
                    "text":  (minDue === undefined) ? " " :"*Min Amt Due:*\n₹ " + minDue
                }
            ]
        }
    ];

    return blocks;
}