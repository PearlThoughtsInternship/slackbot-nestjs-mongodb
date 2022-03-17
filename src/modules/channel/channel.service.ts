import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthAccessDto } from '../slack/dto/OauthAccessDto';
import { ChannelModel } from './channel.model';

@Injectable()
export class ChannelService {
    constructor(@InjectRepository(ChannelModel) private readonly _channelModel: Repository<ChannelModel>) {

    }
    async findByType(message): Promise<ChannelModel[]> {
        return this._channelModel.find({type: message});
    }
}
