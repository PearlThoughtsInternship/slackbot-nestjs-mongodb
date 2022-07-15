import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ViewOtpLogModel } from "./view_otp_log.model";

@Injectable()
export class ViewOtpLogService {
    constructor(
        @InjectRepository(ViewOtpLogModel) private readonly viewOtpLogModel: Repository<ViewOtpLogModel>,
        private configService: ConfigService,
    ) {}
    
   async storeUserDetails(data) {
       return this.viewOtpLogModel.insert(data)   
   }

   async fetchUserDetails(msgId){
        return this.viewOtpLogModel.find({where:{text_id:msgId}});
   }
}