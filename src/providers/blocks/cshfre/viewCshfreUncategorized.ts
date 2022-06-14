export function viewCshfreUncategorized({OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Cashfree"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*OTP:*\n XXXXXX"
                }
            ]
        }
    ];

    return blocks;
}