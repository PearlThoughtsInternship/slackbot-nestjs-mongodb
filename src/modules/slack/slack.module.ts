import { Module } from '@nestjs/common';
import { ConfigService } from 'src/shared/config.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { SlackController } from './slack.controller';
import { WorkspaceService } from '../workspace/workspace.service';
import { SlackService } from './slack.service';

@Module({
  imports:[WorkspaceModule],
  controllers: [SlackController],
  providers:[ConfigService, WorkspaceService, SlackService]
})
export class SlackModule {}
