import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthAccessDto } from '../slack/dto/OauthAccessDto';
import { MessageModel } from './message.model';

@Injectable()
export class MessageService {
    constructor(@InjectRepository(MessageModel) private readonly _messageModel: Repository<MessageModel>) {

    }

    async findOne(query): Promise<MessageModel> {
        return this._messageModel.findOne(query);
    }

    async create(data): Promise<MessageModel> {
        let d = new Date()

        return this._messageModel.save({
            senderID: data.sender,
            message: data.message,
            receivedOn: new Date(d.getTime() + ( 5.5 * 60 * 60 * 1000 )).toLocaleString(),
            forwardedFrom:data.forwardedFrom,
            notificationType:data.notificationType,
            channelRouted:data.channelID,
            blocks:data.blocks
        });
    }
}
