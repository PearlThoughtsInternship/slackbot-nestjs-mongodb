import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from 'src/shared/config.service';
import { Repository } from 'typeorm';

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
        return this.viewOtpLogModel.find({text_id:msgId});
   }
}