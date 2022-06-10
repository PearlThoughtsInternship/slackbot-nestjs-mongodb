export function viewSbicrdFundTransfer({
    account,
    card,
    payee,
    amount,
    OTP
}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Fund transfer / (NEFT/IMPS)"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (account === undefined) ? "*Credit Card:*\n SBI - XXXX" +card : "*Account:*\n SBI - XXXX" +account
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
                    "text": "*Amount:*\n₹" + amount
                },
                {
                    "type": "mrkdwn",
                    "text": "*OTP:*\n XXXXXX"
                }
            ]
        }
        
    ];

    return blocks;
}