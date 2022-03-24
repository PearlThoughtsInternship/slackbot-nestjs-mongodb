export function viewIpaytmPersonalMessage({amount,purpose,OTP,ref,balance,message}: any): any {
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
                    "text": message.includes('Paid')  ?  (amount==undefined)?" ":"*Amount debited :*\n" + (amount.includes('USD')?amount.replace('USD ','$'):amount.replace('Rs','₹'))  :  (amount==undefined)?" ":"*Amount Credited :*\n₹" + amount
                },
                {
                    "type": "mrkdwn",
                    "text": (purpose===undefined) ? " " : "*Purpose:*\n" + purpose
                    
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
                    "text": (ref === undefined) ? " " : "*TxnId:*\n" + ref
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n" + (balance.includes('USD')?balance.replace('USD ','$'):balance.replace('Rs','₹'))
                }
            ]
        }
    ];

    return blocks;
}