import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
const { App } = require('@slack/bolt');
import { SlackModule } from './modules/slack/slack.module';
import { SlackService } from './modules/slack/slack.service';
import { LoggerModule } from 'nestjs-rollbar';
import environment from './environments/environment';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { WorkspaceService } from './modules/workspace/workspace.service';
import { ExpressReceiver } from '@slack/bolt';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environment],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accessToken: configService.get('rollbar.accessToken'),
        captureUncaught: true,
        captureUnhandledRejections: true,
        ignoreDuplicateErrors: false,
      }),
      inject: [ConfigService],
    }),
    SlackModule,
    UserModule,
    WorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, SlackService, SlackService],
})
export class AppModule {
  constructor(
    private _configService: ConfigService,
    private _workspaceService: WorkspaceService,
    private _slackService: SlackService,
  ) {}

  initSlackEvents(receiver: ExpressReceiver) {
    const boltApp = new App({
      signingSecret: this._configService.get('slack.signingSecret'),
      clientId: this._configService.get('slack.clientId'),
      clientSecret: this._configService.get('slack.clientSecret'),
      scopes: '',
      authorize: async ({ teamId, enterpriseId }) => {
        let data = await this._workspaceService.findOne({ _id: teamId });
        return {
          botToken: data.botAccessToken,
          botId: data.botId,
        };
      },
      receiver,
      installerOptions: {
        redirectUriPath: '/slack/add',
      },
    });
    this._slackService.initSlackCommand(boltApp);
  }
}
