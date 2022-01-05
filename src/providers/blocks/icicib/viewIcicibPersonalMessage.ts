export function viewIcicibPersonalMessage({account,payee,amount,OTP,message,ref,balance}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": (message.includes('credited')) ? "Credit Alert" : "Transaction Alert"
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
                    "text": ((message.includes('debited'))&&(message.includes('credited')))  ?  (amount==undefined)?" ":"*Amount debited :*\n" + (amount.includes('USD')?amount.replace('USD ','$'):amount.replace('INR','₹'))  :  (amount==undefined)?" ":"*Amount Credited :*\n" + (amount.includes('USD')?amount.replace('USD ','$'):amount.replace('INR','₹'))
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                },
                {
                    "type": "mrkdwn",
                    "text": (OTP===undefined) ? " " : "*OTP:*\n" + OTP
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (ref === undefined) ? " " : "*Ref:*\n" + ref
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n₹" + balance
                }
            ]
        }
    ];

    return blocks;
}