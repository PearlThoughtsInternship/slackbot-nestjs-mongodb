export function viewIcicibAccessCibApp({OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Access CIB Application OTP"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*OTP :*\n XXXXXX"
                    
                }
            ]
        },
    ];

    return blocks;
}