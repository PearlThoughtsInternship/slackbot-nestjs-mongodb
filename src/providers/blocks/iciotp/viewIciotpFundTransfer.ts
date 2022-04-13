export function viewIciotpFundTransfer({OTP,amount,account,payee}: any): any {
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
                    "text": (account==undefined) ? " " : "*ICICI Bank :*\n " +  account
                },
                {
                    "type": "mrkdwn",
                    "text": (OTP==undefined) ? " " :"*OTP:*\n" + OTP
                }
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (amount === undefined) ? " " : "*Amount:*\n₹" + amount
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                }
            ]
        }
    ];
   return blocks;
}