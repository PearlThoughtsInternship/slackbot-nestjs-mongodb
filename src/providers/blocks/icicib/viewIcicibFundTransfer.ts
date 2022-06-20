export function viewIcicibFundTransfer({account,payee,amount,OTP,upiId}: any): any {
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
                    "text": (OTP==undefined) ? " " :"*OTP:*\n XXXXXX"
                },
                {
                    "type": "mrkdwn",
                    "text": (upiId==undefined) ? " " :"*UPI-ID:*\n" + upiId
                },
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (amount === undefined) ? " " :  "*Amount:*\n" + (amount.includes('USD')?amount.replace('USD ','$'):amount.replace('INR ','₹'))
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