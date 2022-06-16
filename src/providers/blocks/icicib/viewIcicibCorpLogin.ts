export function viewIcicibCorpLogin({OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "ICICI Bank Corporate Internet Banking"
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