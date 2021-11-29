import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthAccessDto } from '../slack/dto/OauthAccessDto';
import { WhatsappModel } from './whatsapp.model';

@Injectable()
export class WhatsappService {
    constructor(@InjectRepository(WhatsappModel) private readonly _whatsappModel: Repository<WhatsappModel>) {

    }

    async listOfSubscribersByUserID(userID,channelID): Promise<any> {
        return await this._whatsappModel.find({"userid": userID, "channelid": channelID});
        // return await this._whatsappModel.find({channelid: channelID});
        // return await Subscriber.query()
        //                         .select('whatsappnum')
        //                         .where('userid','=',userID)
        //                         .where('channelid','=',channelID);
    }

    async listOfSubscribersByNumber(whatsappNum,channelID): Promise<any> {
        return await this._whatsappModel.find({"whatsappnum": whatsappNum, "channelid": channelID});
        // return await Subscriber.query()
        //                         .select('fullname')
        //                         .where('whatsappnum','=',whatsappNum)
        //                         .where('channelid','=',channelID);
    }

    async register(username,whatsappNum,channelid,channelName,userID,realName) {
        var time = Date.now || function() {
            return +new Date;
        };
        return this._whatsappModel.save({
            username:username,
            whatsappnum: whatsappNum,
            channelid: channelid,
            userid: userID,
            timecreated:time(),
            fullname:realName,
            channelname:channelName
        });
    }

    async unRegister(whatsappNum,channelID,userID) {
        return await this._whatsappModel.delete({"whatsappnum": whatsappNum, "channelid": channelID, "userid": userID});
    }

    async channelSubscribers(channelID): Promise<any> {
        return await this._whatsappModel.find({channelid: channelID});
    }
}
