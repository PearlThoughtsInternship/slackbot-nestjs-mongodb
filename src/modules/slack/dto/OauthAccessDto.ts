import { WebAPICallResult } from '@slack/web-api';

export interface OauthAccessDto extends WebAPICallResult {
    ok: boolean;
    app_id: string;
    authed_user: {
        id: string;
        access_token: any;
    };
    token_type: string;
    access_token: string;
    bot_user_id: string;
    team: {
        id: string;
        name: string;
    };
}
