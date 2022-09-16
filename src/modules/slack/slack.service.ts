import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient, WebAPICallResult, ErrorCode, Block } from '@slack/web-api';
import { RollbarHandler, RollbarLogger } from 'nestjs-rollbar';

@Injectable()
export class SlackService {
  private _clientId: string;
  private _clientSecret: string;
  private _webClient: WebClient;

  constructor(
    private _configService: ConfigService,
    private _rollbarLogger: RollbarLogger,
  ) {
    this._webClient = new WebClient();
    this._clientId = this._configService.get('slack.clientId');
    this._clientSecret = this._configService.get('slack.clientSecret');
  }

  @RollbarHandler()
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
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - oauthAccess`,
          JSON.stringify({ clientId: this._clientId, redirectUri }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async postBlockMessage(
    token: string,
    channel: string,
    text: string,
    blocks?: Block[],
  ): Promise<WebAPICallResult> {
    const data = { token, channel, text, blocks, unfurl_links: false };
    let response;
    try {
      response = await this._webClient.chat.postMessage(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - postBlockMessage`,
          JSON.stringify({ channel, text, blocks }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async usersInfo(token: string, user: string): Promise<WebAPICallResult> {
    const data = { token, user };
    let response;
    try {
      response = await this._webClient.users.info(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - usersInfo`,
          JSON.stringify({ user }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  async conversationsOpen(
    token: string,
    users: string,
  ): Promise<WebAPICallResult> {
    const data = { token, users };
    let response;
    try {
      response = await this._webClient.conversations.open(data);
    } catch (error) {
      if (error.code === ErrorCode.PlatformError) {
        response = error.data;
        this._rollbarLogger.error(
          `${this.constructor.name} - conversationsOpen`,
          JSON.stringify({ users }),
          error,
        );
      } else {
        throw new Error(error);
      }
    }

    return response;
  }

  initSlackCommand(boltApp: any): void {
    boltApp.command('/helloworld', async ({ ack, respond }) => {
      await ack();
      await respond('Hello World!');
    });
  }
}
