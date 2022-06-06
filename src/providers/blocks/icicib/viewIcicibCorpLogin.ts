import { ACTION_SHOW_OTP } from "src/common/constants/action";

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
                    "text": "*OTP :*\n" +OTP
                    
                }
            ]
        },
        // {
        //     type: 'actions',
        //     elements: [
        //         {
        //             type: 'button',
        //             text: {
        //                 type: 'plain_text',
        //                 text: 'Show OTP',
        //                 emoji: true,
        //             },
        //             action_id: ACTION_SHOW_OTP,
        //         },
        //     ]
        //  },
    ];

    return blocks;
}