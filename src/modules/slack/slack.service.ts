import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/shared/config.service';
import { WebClient, WebAPICallResult, ErrorCode, Block } from '@slack/web-api';

@Injectable()
export class SlackApiService {
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
        console.log("datadatadatadata");
        console.log(data);
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
    
    async postBlockMessage(token, channel, text, blocks, icon_url): Promise<WebAPICallResult> {
        const data = { token, channel, text, blocks, unfurl_links: false, icon_url };
        console.log(data)
        let response;
        try {
            response = await this._webClient.chat.postMessage(data);
        } catch (error) {
            if (error.code === ErrorCode.PlatformError) {
                response = error.data;
            } else {
                throw new Error(error);
            }
        }
        console.log(response)
        return response;
    }

    async postEphemeral(token, channel, text, user, attachments, blocks, icon_url): Promise<WebAPICallResult> {
        const data = { token, channel, text, user, attachments, blocks, icon_url };
        let response;
        try {
            response = await this._webClient.chat.postEphemeral(data);
        } catch (error) {
            if (error.code === ErrorCode.PlatformError) {
                response = error.data;
            } else {
                throw new Error(error);
            }
        }
        return response;
    }
}
