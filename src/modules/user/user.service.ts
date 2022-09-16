import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private _userModel: Model<User>,
  ) {}

  async create(query): Promise<User> {
    return await this._userModel.create(query);
  }

  async findOne(query): Promise<User> {
    return await this._userModel.findOne(query);
  }

  async findByIdAndUpdate(id: string, query): Promise<User> {
    return await this._userModel.findByIdAndUpdate(id, query);
  }
}
