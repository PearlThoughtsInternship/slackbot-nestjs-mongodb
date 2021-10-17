import { Controller, Post, Request, Get, Response, HttpStatus } from '@nestjs/common';
import { ConfigService } from '../../shared/config.service';
import { WorkspaceService } from './workspace.service';

@Controller('slack')
export class WorkspaceController {

    constructor(private configService: ConfigService, private workspaceService: WorkspaceService) {

    }

    @Get('install')
    async install(@Request() req, @Response() res) {
        const redirectUri = this.workspaceService.getAddRedirectUri();
        const params = {
            client_id: encodeURI(this.configService.get('SLACK_CLIENT_ID')),
            scope: encodeURI(this.configService.get('SLACK_BOT_SCOPES')),
            user_scope: encodeURI(this.configService.get('SLACK_USER_SCOPES')),
            redirect_uri: encodeURI(redirectUri),
            state:""
        };
        const url = `https://slack.com/oauth/v2/authorize?${queryString.stringify(params)}`;

        return res.status(HttpStatus.FOUND).redirect(url);
    }

    @Get('oauth_redirect')
    async add(@Request() req) {
        const { code } = req.query;
        const data = await this.slackService.oauthAccess(
            code,
            this.workspaceService.getAddRedirectUri(),
        );
        if (data.ok) {
            const { team, authed_user } = data;
            let workspace = await this.workspaceRepository.findByTeamId(team.id);
            
            if (!workspace) {
                workspace = await this.workspaceRepository.create(data);
                res.status(200).send(`Thanks!`);
            } else {
                res.status(200).send(`App was already installed!`);
            }
        } else {
            console.error(`Failed because of ${data.error}`)
            res.status(500).send(`Something went wrong! error: ${data.error}`);
        }
    }
}
