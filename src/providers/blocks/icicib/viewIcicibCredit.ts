export function viewIcicibCredit({account,ref,amount,balance,payee}: any): any {
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
                    "text": "*ICICI Bank :*\n " +account
                    
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
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n₹" + balance
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " : "*Payee :*\n₹" + payee
                }
            ]
        }
    ];

    return blocks;
}