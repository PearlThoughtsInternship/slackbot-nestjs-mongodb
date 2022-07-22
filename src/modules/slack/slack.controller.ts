import { Controller, Request, Get, Response, HttpStatus, Res} from '@nestjs/common';
import { ConfigService } from '../../shared/config.service';
import { SlackService } from './slack.service';
import { stringify } from 'querystring';

@Controller('slack')
export class SlackController {

    constructor(
        private _configService: ConfigService, 
        private _slackService: SlackService) 
        {}

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
        const url = `https://slack.com/oauth/v2/authorize?${stringify(params)}`;
        return res.status(HttpStatus.FOUND).redirect(url);
    }

    @Get('oauth_redirect')
    async add(@Request() req, @Res() res) {
        const { code } = req.query;
        console.log(req.query);
        const data = await this._slackService.oauthAccess(
            code,
            `${this._configService.get('APP_URL')}/slack/oauth_redirect`,
        );
        if (data.ok) {
                res.status(HttpStatus.OK).send(`Thanks!`);
            } else {
                res.status(HttpStatus.OK).send(`App was already installed!`);
            }
    }

}
