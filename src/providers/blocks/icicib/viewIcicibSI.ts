export function viewIcicibSI({account,amount,commitmentType,dueDate}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Standing Instruction"
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
                    "text": (amount === undefined) ? " " :  "*Amount:*\n" + (amount.includes('USD') ? amount.replace('USD ','$'):(amount.includes('Rs ') ? amount.replace('Rs ','₹'): amount.replace('INR ','₹')))
                },
            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (commitmentType == undefined) ? " " : "*Commitment Type :*\n " +  commitmentType
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