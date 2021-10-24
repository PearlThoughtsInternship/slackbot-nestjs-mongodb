import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/shared/config.service';
import { WebClient, WebAPICallResult, ErrorCode, Block } from '@slack/web-api';

@Injectable()
export class SlackService {
    private _clientId: string;
    private _clientSecret: string;
    private _webClient: WebClient;

    constructor(private _configService: ConfigService) {
        this._webClient = new WebClient();
        this._clientId = this._configService.get('SLACK_CLIENT_ID');
        this._clientSecret = this._configService.get('SLACK_CLIENT_SECRET');
    }

    async oauthAccess(
        code: string,
        redirectUri: string,
    ): Promise<WebAPICallResult> {
        const data = {
            code: code,
            client_id: this._clientId,
            client_secret: this._clientSecret,
            redirect_uri: redirectUri,
        };
        let response;
        try {
            response = await this._webClient.oauth.v2.access(data);
        } catch (error) {
            console.log(error);
            if (error.code === ErrorCode.PlatformError) {
                response = error.data;
            } else {
                throw new Error(error);
            }
        }

        return response;
    }

    async usersInfo(token: string, user: string): Promise<WebAPICallResult> {
        const data = {
            token: token,
            user: user,
        };
        let response;
        try {
            response = await this._webClient.users.info(data);
        } catch (error) {
            console.log(error);
            if (error.code === ErrorCode.PlatformError) {
                response = error.data;
            } else {
                throw new Error(error);
            }
        }

        return response;
    }
}
