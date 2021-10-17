import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceService {
    getAddRedirectUri = () => {
        return `${apiUrl}/slack/oauth_redirect`;
    };
    
    getSigninRedirectUri = () => {
        return `${apiUrl}/slack/signin`;
    };
    
    getTeamRoute = ({ teamId, teamName }, userId) => {
        return `${apiUrl}/team/${teamId}/${userId}/${teamName}`;
    };
}
