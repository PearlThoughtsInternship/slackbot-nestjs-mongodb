export function viewSbicrdUdemyOtp({amount,OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Udemy™"
            }
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