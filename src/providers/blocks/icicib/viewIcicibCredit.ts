<<<<<<< HEAD
export function viewIcicibCredit({type,account,ref,amount,balance,payee}: any): any {
=======
export function viewIcicibCredit({Type,account,ref,amount,balance,payee}: any): any {
>>>>>>> 1c077aef8c161b68d84039bf1bd373ffac15ea69
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
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Amount Credited :*\n" + amount
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n" + balance
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