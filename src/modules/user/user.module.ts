import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlackModule } from '../slack/slack.module';
import { SlackService } from '../slack/slack.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'User',
      },
    ]),
    WorkspaceModule,
  ],
  providers: [UserService, SlackService],
  exports: [UserService],
})
export class UserModule {}
