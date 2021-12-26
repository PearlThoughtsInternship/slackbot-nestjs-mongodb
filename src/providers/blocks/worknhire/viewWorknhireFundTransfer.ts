export function viewWorknhireFundTransfer({OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Worknhire"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*OTP:*\n" + OTP
                }
            ]
        }
    ];

    return blocks;
}