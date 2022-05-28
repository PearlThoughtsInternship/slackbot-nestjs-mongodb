export function viewIcicibTransaction({account,payee,ref,balance,amount,paymentService,availableLimit,transactionType}: any): any {
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
                    "text": (amount === undefined) ? " " : ("*Transaction Value :*\n" + (amount.includes('USD')?amount.replace('USD ','$'):amount.replace('INR','₹')))
                },
                {
                    "type": "mrkdwn",
                    "text": (transactionType === undefined) ? " " : ((transactionType === "debited") ? "*Transaction Type :*\n" + "Debit" : transactionType )
                }

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
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n" + (balance.includes('USD')?balance.replace('USD ','$'):balance.replace('INR','₹'))
                },
                {
                    "type": "mrkdwn",
                    "text": (availableLimit === undefined) ? " " : "*Available Credit limit :*\n" + (availableLimit.includes('USD')?availableLimit.replace('USD ','$'):availableLimit.replace('INR','₹'))
                },
            ]
        }
    ];

    return blocks;
}