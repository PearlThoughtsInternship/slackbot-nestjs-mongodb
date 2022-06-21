export function viewIpaytmPersonalMessage({amount,purpose,payee,paymentService,ref,balance,message}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": message.includes('Paid') ? "Transaction Alert" :  "Credit Alert"
            }
        },
        {   "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*iPaytm *\n"
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": message.includes('Paid')  ?  (amount==undefined)?" ":"*Amount debited :*\n" + (amount.includes('USD')?amount.replace('USD ','$'):amount.replace('Rs ','₹'))  :  (amount==undefined)?" ":"*Amount Credited :*\n₹" + amount
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n" + (balance.includes('USD')?balance.replace('USD ','$'):balance.replace('Rs ','₹'))
                }
            ]
        },
        {       "type": "section",
        "fields": [
                {
                    "type": "mrkdwn",
                    "text": (payee===undefined) ? " " : "*Payee:*\n" + payee
                },
                {
                    "type": "mrkdwn",
                    "text": (paymentService===undefined) ? " " : "*PaymentService:*\n" + paymentService
                },
                {
                    "type": "mrkdwn",
                    "text": (ref === undefined) ? " " : "*TxnId:*\n" + ref
                },
                {
                    "type": "mrkdwn",
                    "text": (purpose===undefined) ? " " : "*Purpose:*\n" + purpose
                }
           ]
        },
    ];

    return blocks;
}