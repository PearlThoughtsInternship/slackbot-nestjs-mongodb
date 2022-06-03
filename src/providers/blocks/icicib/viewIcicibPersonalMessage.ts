export function viewIcicibPersonalMessage({account,payee,amount,OTP,message,ref,balance,upiId,availableLimit,transactionType}: any): any {

    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": (message.includes('credited'&&'debited')) ? "Fund transfer":(message.includes('credited')) ? "Credit Alert" : (message.includes("OTP")) ? "Fund Transfer OTP" : "Transaction Alert"
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
                    "text": (amount === undefined) ? " " : "*Transaction Value :*\n" + (amount.includes('USD') ? amount.replace('USD ','$'):amount.includes('Rs') ? amount.replace('Rs','₹') : amount.replace('INR','₹'))  
                },
                {
                    "type": "mrkdwn",
                    "text": (transactionType === undefined) ? " " : ((transactionType === "spent") || (transactionType === "debited") || (transactionType === "transcation") ) ? "*Transaction Type :*\n" + "Debit" : "*Transaction Type :*\n" + transactionType
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                },
                {
                    "type": "mrkdwn",
                    "text": (OTP===undefined) ? " " : "*OTP:*\n" + OTP
                },{
                    "type": "mrkdwn",
                    "text": (upiId==undefined) ? " " :"*UPI-ID:*\n" + upiId
                },
                {
                    "type": "mrkdwn",
                    "text": (ref === undefined) ? " " : "*Ref:*\n" + ref
                },
                {
                    "type": "mrkdwn",
                    "text": (availableLimit === undefined) ? " " : "*Available Credit Limit :*\n" + (availableLimit.includes('USD')?availableLimit.replace('USD ','$'):availableLimit.replace('INR','₹'))
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n" + (balance.includes('USD')?balance.replace('USD ','$'):balance.replace('INR','₹'))
                },
            ]
        },
       
    ];

    return blocks;
}