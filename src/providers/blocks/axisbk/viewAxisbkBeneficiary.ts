export function viewAxisbkBeneficiary({account,OTP}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Beneficiary"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Axis Beneficiary to Add :*\n " +account
                },
                {
                    "type": "mrkdwn",
                    "text": "*OTP:*\n XXXXXX"
                }
            ]
        }
    ];

    return blocks;
}