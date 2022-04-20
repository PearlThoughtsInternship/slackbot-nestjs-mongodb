import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlackService } from './slack.service';
import { ConfigModule } from '@nestjs/config';
const { App } = require('@slack/bolt');
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { MessageModule } from './modules/message/message.module';
// import { MessageModule } from './modules/message/message.module';
// import { ChannelModule } from './modules/channel/channel.module';
import { ConfigService } from './shared/config.service';
import { SlackApiModule } from './modules/slack/slack.module';
import { WorkspaceModel } from './modules/workspace/workspace.model';
import { MessageModel } from './modules/message/message.model';
import { ChannelModel } from './modules/channel/channel.model';
import { ChannelModule } from './modules/channel/channel.module';
import { MessageController } from './modules/message/message.controller';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { ChannelService } from 'src/modules/channel/channel.service';
import { SlackApiService } from './modules/slack/slack.service';
import { OriginalButtonService } from 'src/providers/orgBtn.service';
import { LoggerModule } from 'nestjs-rollbar';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    LoggerModule.forRoot({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
      ignoreDuplicateErrors: false,
    }),
    UserModule,
    WorkspaceModule,
    MessageModule,
    ChannelModule,
    SlackApiModule
  ],
  controllers: [AppController, MessageController],
  providers: [
    AppService,
    ConfigService,
    SlackService,
    ChannelService,
    SlackApiService,
    OriginalButtonService
  ],
})
export class AppModule {

  constructor(private slackService: SlackService, private _workspaceService: WorkspaceService) {

  }

  initSlack(receiver: any) {
    const boltApp = new App({
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      scopes: "",
      authorize: async ({ teamId, enterpriseId }) => {
        let data = await this._workspaceService.findOne({teamId: teamId});
        return {
            botToken: data.accessToken,
            botId: data.userId
        };
      },
      receiver,
    });
    this.slackService.initSlackCommand(boltApp);
    this.slackService.initSlackInteractive(boltApp);
    this.slackService.initAppHome(boltApp);
  }
}