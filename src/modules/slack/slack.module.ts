import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Module({
  imports: [WorkspaceModule, UserModule],
  controllers: [SlackController],
  providers: [ConfigService, SlackService],
})
export class SlackModule {}
