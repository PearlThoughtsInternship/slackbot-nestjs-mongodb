export function viewIcicibTransaction({account,payee,ref,balance,amount,paymentService,availableLimit}: any): any {
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
                    "text": "*ICICI Bank :*\n" +account
                    
                },
                {
                    "type": "mrkdwn",
                    "text": "*Amount debited :*\n" + amount
                },


            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (paymentService === undefined) ? " " :"*Payment Service :*\n" + paymentService
                    
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " :"*Payee :*\n" + payee
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (ref === undefined) ? " " : "*Payee:*\n" + ref
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n₹" + balance
                },
                {
                    "type": "mrkdwn",
                    "text": (availableLimit === undefined) ? " " : "*Available Credit limit :*\n₹" + availableLimit
                },
            ]
        }
    ];

    return blocks;
}