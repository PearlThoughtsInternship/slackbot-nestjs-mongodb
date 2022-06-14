import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { ConfigService } from '../../shared/config.service';
import { MessageModel } from './message.model';
import { ViewOtpLogService } from '../view_otp_log/view_otp_log.service';
import { ViewOtpLogModule } from '../view_otp_log/view_otp_log.module';
import { WorkspaceService } from '../workspace/workspace.service';
import { WorkspaceModule } from '../workspace/workspace.module';


@Module({
  imports: [TypeOrmModule.forFeature([MessageModel]),ViewOtpLogModule,WorkspaceModule],
  controllers: [],
  providers: [MessageService, ConfigService,ViewOtpLogService,WorkspaceService],
  exports: [TypeOrmModule, MessageService]
})
export class MessageModule {}
