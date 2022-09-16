import {
  Controller,
  Request,
  Get,
  Response,
  HttpStatus,
  Res,
  HttpCode,
  Redirect,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SlackService } from './slack.service';
import { stringify } from 'querystring';
import {
  ConversationsOpenResponse,
  OauthV2AccessResponse,
  UsersInfoResponse,
} from '@slack/web-api';
import { WorkspaceService } from '../workspace/workspace.service';
import { UserService } from '../user/user.service';

@Controller('slack')
export class SlackController {
  constructor(
    private _configService: ConfigService,
    private _slackService: SlackService,
    private _workspaceService: WorkspaceService,
    private _userService: UserService,
  ) {}

  @Get('install')
  @Redirect()
  @HttpCode(302)
  async install(@Request() req, @Response() res) {
    const params = {
      client_id: encodeURI(this._configService.get('slack.clientId')),
      scope: encodeURI(this._configService.get('slack.botScopes')),
      user_scope: encodeURI(this._configService.get('slack.userScopes')),
      redirect_uri: encodeURI(
        `${this._configService.get('appUrl')}/slack/oauth_redirect`,
      ),
    };
    return {
      url: `https://slack.com/oauth/v2/authorize?${stringify(params)}`,
    };
  }

  @Get('add')
  @Redirect()
  async add(@Query() query: { code: string }) {
    const data = (await this._slackService.oauthAccess(
      query.code,
      `${this._configService.get('appUrl')}/slack/add`,
    )) as OauthV2AccessResponse;
    if (data.ok) {
      const { access_token, authed_user, bot_user_id, team } = data;
      let workspace = await this._workspaceService.findOne({ _id: team.id });
      const UserInfoRes = (await this._slackService.usersInfo(
        access_token,
        authed_user.id,
      )) as UsersInfoResponse;
      let workspaceData = {
        _id: team.id,
        teamName: team.name,
        botAccessToken: access_token,
        botId: bot_user_id,
      };

      let userData = {
        _id: UserInfoRes.user.id,
        name: UserInfoRes.user.real_name,
        workspace: team.id,
      };

      if (!workspace) {
        workspace = await this._workspaceService.create(workspaceData);
        let user = await this._userService.create(userData);
      } else {
        let workspaceResponse = await this._workspaceService.findOneAndUpdate(
          workspace.id,
          { botAccessToken: access_token },
        );
        console.log(workspaceResponse);
        workspace = await this._workspaceService.findOne({ _id: team.id });
        let user = await this._userService.findOne({
          _id: UserInfoRes.user.id,
        });
        if (!user) {
          await this._userService.create(userData);
        }
      }

      const conversations = (await this._slackService.conversationsOpen(
        workspace.botAccessToken,
        authed_user.id,
      )) as ConversationsOpenResponse;
      if (UserInfoRes.ok && conversations.ok) {
        const botConversationId = conversations.channel.id;
        this._slackService.postBlockMessage(
          workspace.botAccessToken,
          botConversationId,
          `Hi <@${UserInfoRes.user.id}>,Thanks for installing Hello World Bot`,
        );
      }

      const appId = this._configService.get('slack.appId');

      return {
        url: `https://slack.com/app_redirect?app=${appId}&team=${team.id}`,
      };
    }

    return { url: `https://app.slack.com/client` };
  }
}
