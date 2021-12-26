export function viewSbicrdTransaction({account,card,payee,amount,utr}: any): any {
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
                    "text": amount.includes('USD') ? "*Amount debited:*\n$" + amount.split('USD')[1] : amount.includes('Rs.') ? "*Amount debited:*\n₹" + amount.split('Rs.')[1] : "*Amount debited:*\n₹" + amount 
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