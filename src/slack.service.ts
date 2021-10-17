import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackService {

    initSlackCommand(boltApp: any): void {
        console.info("slack command");
        boltApp.command('/who_are_you', ({ ack }) => {
            ack({
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hello, i am *Edhuku Indha Bot:*. "
                        }
                    }
                ]
            });
        });
    }
}