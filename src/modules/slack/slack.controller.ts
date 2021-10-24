import { Controller, Post, Request, Get, Response, HttpStatus, Res } from '@nestjs/common';
import { ConfigService } from '../../shared/config.service';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { SlackService } from './slack.service';
import { stringify } from 'querystring';
import { OauthAccessDto } from './dto/OauthAccessDto';

@Controller('slack')
export class SlackController {

    constructor(private _configService: ConfigService, private _workspaceService: WorkspaceService, private _slackService: SlackService) {

    }

    @Get('install')
    async install(@Request() req, @Response() res) {
        const params = {
            client_id: encodeURI(this._configService.get('SLACK_CLIENT_ID')),
            scope: encodeURI(this._configService.get('SLACK_BOT_SCOPES')),
            user_scope: encodeURI(this._configService.get('SLACK_USER_SCOPES')),
            redirect_uri: encodeURI(`${this._configService.get('APP_URL')}/slack/oauth_redirect`),
            state:""
        };
        const url = `https://slack.com/oauth/v2/authorize?${stringify(params)}`;

        return res.status(HttpStatus.FOUND).redirect(url);
    }

    @Get('oauth_redirect')
    async add(@Request() req, @Res() res) {
        const { code } = req.query;
        const data = await this._slackService.oauthAccess(
            code,
            `${this._configService.get('APP_URL')}/slack/signin`,
        ) as OauthAccessDto;
        if (data.ok) {
            const { team, authed_user } = data;
            let workspace = await this._workspaceService.findOne({team_id: team.id});
            
            if (!workspace) {
                workspace = await this._workspaceService.create(data);
                res.status(HttpStatus.OK).send(`Thanks!`);
            } else {
                res.status(HttpStatus.OK).send(`App was already installed!`);
            }
        } else {
            console.error(`Failed because of ${data.error}`)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(`Something went wrong! error: ${data.error}`);
        }
    }
}
