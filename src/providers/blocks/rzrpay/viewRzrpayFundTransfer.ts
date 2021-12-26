export function viewRzrpayFundTransfer({account,card,payee,amount,OTP}: any): any {
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
                    "text": (account === undefined) ? "*Credit Card:*\n Razorpay - " +card : "*Account:*\n Razorpay - " +account
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
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
                    "text": "*OTP:*\n" + OTP
                }
            ]
        }
        
    ];

    return blocks;
}