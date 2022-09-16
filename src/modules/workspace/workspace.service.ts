import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace } from './workspace.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel('Workspace')
    private _workspaceModel: Model<Workspace>,
  ) {}

  async findOne(query): Promise<Workspace> {
    return this._workspaceModel.findOne(query);
  }

  async findall(query): Promise<Workspace[]> {
    return this._workspaceModel.find(query);
  }
  async create(query): Promise<Workspace> {
    return this._workspaceModel.create(query);
  }

  async findOneAndUpdate(id: string, data): Promise<Workspace> {
    return this._workspaceModel.findByIdAndUpdate(id, data);
  }
}
