export function viewIcicibTransaction({account,payee,ref,balance,amount,paymentService,availableLimit,transactionType,transactionDate,status,referenceNumber}: any): any {
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
                    "text": (amount === undefined) ? " " : ("*Transaction Value :*\n" + (amount.includes('USD')?amount.replace('USD ','$'):amount.includes('INR') ? amount.replace('INR ','₹'): amount.replace('Rs ','₹')))
                },
                {
                    "type": "mrkdwn",
                    "text": (transactionType === undefined) ? " " : ((transactionType === "debited") ? "*Transaction Type :*\n" + "Debit" : transactionType )
                },
                {
                    "type": "mrkdwn",
                    "text": (ref === undefined) ? " " : "*Payee:*\n" + ref
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
                    "text": (status === undefined) ? " " :"*Status :*\n" + status
                },
                {
                    "type": "mrkdwn",
                    "text": (referenceNumber === undefined) ? " " : "*Reference Number:*\n" + referenceNumber
                },

            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (transactionDate === undefined) ? " " : "*Transaction Date:*\n" + transactionDate
                },
                {
                    "type": "mrkdwn",
                    "text": (ref === undefined) ? " " : "*Payee:*\n" + ref
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n" + (balance.includes('USD')?balance.replace('USD ','$'):balance.replace('INR ','₹'))
                },
                {
                    "type": "mrkdwn",
                    "text": (availableLimit === undefined) ? " " : "*Available Credit limit :*\n" + (availableLimit.includes('USD')?availableLimit.replace('USD ','$'):availableLimit.replace('INR ','₹'))
                },
            ]
        }
    ];

    return blocks;
}