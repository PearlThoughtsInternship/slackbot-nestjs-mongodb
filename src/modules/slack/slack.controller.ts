import { Controller, Post, Request, Get, Response, HttpStatus, Res } from '@nestjs/common';
import { ConfigService } from '../../shared/config.service';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { SlackApiService } from './slack.service';
import { stringify } from 'querystring';
import { OauthAccessDto } from './dto/OauthAccessDto';

@Controller('slack')
export class SlackController {

    constructor(private _configService: ConfigService, private _workspaceService: WorkspaceService, private _slackService: SlackApiService) {

    }

    @Get('signin')
    async signin(@Request() req, @Response() res) {
        res.status(HttpStatus.OK).send(`Thanks!`);
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
        console.log("paramsparamsparams");
        console.log(params);
        const url = `https://slack.com/oauth/v2/authorize?${stringify(params)}`;
        console.log(url);
        return res.status(HttpStatus.FOUND).redirect(url);
    }

    @Get('oauth_redirect')
    async add(@Request() req, @Res() res) {
        console.log("mndmasnmdamns");
        const { code } = req.query;
        console.log(req.query);
        const data = await this._slackService.oauthAccess(
            code,
            `${this._configService.get('APP_URL')}/slack/oauth_redirect`,
        ) as OauthAccessDto;
        console.log("datadatadatadata");
        console.log(data);
        if (data.ok) {
            const { team, authed_user } = data;
            let workspace = await this._workspaceService.findOne({teamId: team.id});
            
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
