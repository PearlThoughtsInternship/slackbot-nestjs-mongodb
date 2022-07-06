export function viewAxisBkSecurityAlerts({action,transactionMode,status,retryLeft,OTP,purpose,info}: any): any {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "AXIS Bank Security Alerts"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (OTP != undefined) ? ("*OTP :*\n" + 'XXXXXX') : " "
                },
                {
                    "type": "mrkdwn",
                    "text": (purpose != undefined) ? ("*Purpose :*\n" + purpose) : " "
                },
                {
                    "type": "mrkdwn",
                    "text": (action != undefined) ? "*Action :*\n" + ((action == 'log') ? "Login" : action) : " "
                },
                {
                    "type": "mrkdwn",
                    "text": (transactionMode != undefined) ? "*Login Mode:*\n" + transactionMode : " "
                },
                {
                    "type": "mrkdwn",
                    "text": (info != undefined) ? "*Info:*\n" + info : " "
                },

            ]
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": (status === undefined) ? " " : "*Status:*\n" + status
                },
                {
                    "type": "mrkdwn",
                    "text": (retryLeft === undefined) ? " " : "*Retry Attempt Remaining:*\n" + retryLeft
                }
            ]
        }
    ];

    return blocks;
}