import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthAccessDto } from '../slack/dto/OauthAccessDto';
import { WorkspaceModel } from './workspace.model';

@Injectable()
export class WorkspaceService {
    constructor(@InjectRepository(WorkspaceModel) private readonly _workspaceModel: Repository<WorkspaceModel>) {

    }
  
    async findByTeamId(teamId) {
        return this._workspaceModel.findOne({where:{'teamId': teamId}});
    }

    async findById(teamId) {
        return this._workspaceModel.findOne({where:{'id': teamId}});
    }

    async findOne(query): Promise<WorkspaceModel> {
        return this._workspaceModel.findOne(query);
    }

    async create(data: OauthAccessDto): Promise<WorkspaceModel> {
        return this._workspaceModel.save({
            teamId: data.team.id,
            name: data.team.name,
            userId: data.authed_user.id,
            accessToken: data.access_token,
        });
    }
}
