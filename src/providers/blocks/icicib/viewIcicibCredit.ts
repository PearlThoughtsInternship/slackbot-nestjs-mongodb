export function viewIcicibCredit({type,account,ref,amount,balance,payee,payerAccount}: any): any {
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
                    "text": (type === undefined) ? " "  :"*Type:*\n " + type
                    
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " : "*Payee :*\n" + payee
                },
                {
                    "type": "mrkdwn",
                    "text": (payerAccount === undefined) ? " " : "*Payer Account :*\n" + payerAccount
                },

            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (amount == undefined) ? " ": "*Amount Credited :*\n" + ((amount.includes('USD')?amount.replace('USD ','$'):amount.replace('INR ','₹') ? amount.replace('Rs ','₹'): amount))
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n" + ((balance.includes('USD')?balance.replace('USD ','$'):balance.replace('INR ','₹')))
                },
                {
                    "type": "mrkdwn",
                    "text": (ref === undefined) ? " "  : "*REF:*\n" + ref
                }
            ]
        }
    ];

    return blocks;
}