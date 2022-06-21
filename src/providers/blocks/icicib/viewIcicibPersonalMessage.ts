export function viewIcicibPersonalMessage({commitmentType,account,payee,amount,OTP,msg,ref,balance,upiId,availableLimit,transactionType,dueDate}: any): any {

    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": (commitmentType == 'Standing Instruction') ? 'Standing Instruction' : (msg.includes('credited'&&'debited')) ? "Fund transfer":(msg.includes('credited')) ? "Credit Alert" : (msg.includes("OTP")) ? "Fund Transfer OTP" : (msg.includes("Amount Due")) ? "Due Reminder" : "Transaction Alert"
            }
        },
        {
            "type": "section",
            "fields":[
                {
                    "type": "mrkdwn",
                    "text": "*ICICI Bank :*\n" +account
                    
                },
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (amount === undefined) ? " " : (msg.includes('due')) ? "*Due Amount:*\n" + (amount.includes('Rs') ? amount.replace('Rs ','₹') : amount.replace('INR ','₹')) : "*Transaction Value :*\n" + (amount.includes('USD') ? amount.replace('USD ','$'):amount.includes('Rs') ? amount.replace('Rs ','₹') : amount.replace('INR ','₹'))  
                },
                {
                    "type": "mrkdwn",
                    "text": (transactionType === undefined) ? " " : ((transactionType === "spent") || (transactionType === "debited") || (transactionType === "transcation") ) ? "*Transaction Type :*\n" + "Debit" : (transactionType == "Amount Due") ? "*Transaction Type :*\n" + "Due Reminder":"*Transaction Type :*\n" + transactionType
                },
                {
                    "type": "mrkdwn",
                    "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                },
                {
                    "type": "mrkdwn",
                    "text": (OTP===undefined) ? " " : "*OTP:*\n XXXXXX" 
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
                    "text": (availableLimit === undefined) ? " " : "*Available Credit Limit :*\n" + (availableLimit.includes('USD')?availableLimit.replace('USD ','$'):availableLimit.replace('INR ','₹'))
                },
                {
                    "type": "mrkdwn",
                    "text": (balance === undefined) ? " " : "*Available Balance :*\n" + (balance.includes('USD')?balance.replace('USD ','$'):balance.replace('INR ','₹'))
                },

                {
                    "type": "mrkdwn",
                    "text": (dueDate === undefined) ? " " : "*Due Date :*\n" + dueDate
                },
                {
                    "type": "mrkdwn",
                    "text": (commitmentType == undefined) ? " " : "*Commitment Type :*\n " +  commitmentType
                },
            ],
        },
    ];

    return blocks;
}