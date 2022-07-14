import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkspaceModule } from '../workspace/workspace.module';
import { SlackController } from './slack.controller';
import { WorkspaceService } from '../workspace/workspace.service';
import { SlackApiService } from './slack.service';

@Module({
  imports:[WorkspaceModule],
  controllers: [SlackController],
  providers:[ConfigService, WorkspaceService, SlackApiService]
})
export class SlackApiModule {}
