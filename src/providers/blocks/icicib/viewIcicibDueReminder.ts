export function viewIcicibDueReminder({account,amount,transactionType,dueDate}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Due Reminder"
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
                    "text": (amount === undefined) ? " " :  "*Amount:*\n" + (amount.includes('USD')?amount.replace('USD ','$'):amount.replace('INR','₹'))
                },
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (transactionType == undefined) ? " " : (transactionType == 'Amount Due') ? "*Notification Type :*\n " +  'Due Reminder' : "*Notification Type :*\n " +  transactionType
                },
                {
                    "type": "mrkdwn",
                    "text": (dueDate === undefined) ? " " :  "*Due Date:*\n" + dueDate
                },
            ]
        }
    ];

    return blocks;
}