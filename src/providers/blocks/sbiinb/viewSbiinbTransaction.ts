export function viewSbiinbTransaction({account,card,utr,payee,amount}: any): any {
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
                    "text": (account === undefined && card === undefined) ? " " : ((account === undefined) ? "*SBI Card:*\n Ending with " +card : "*Account:*\n SBI - " +account)
                    
                },
                {
                    "type": "mrkdwn",
                    "text": "*Payee:*\n" + payee
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Amount debited:*\n₹" + amount
                },
                //Need to work on Date group
                // ,{
                //     "type": "mrkdwn",
                //     "text": "*Date:*\n" + date
                // }
                {
                    "type": "mrkdwn",
                    "text": (utr === undefined) ? " " : "*UTR / REF:*\n" + utr
                }
            ]
        }
    ];

    return blocks;
}