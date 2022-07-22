import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
const { App } = require('@slack/bolt');
import { ConfigService } from './shared/config.service';
import { SlackModule } from './modules/slack/slack.module';
import { SlackService } from './modules/slack/slack.service';
import { LoggerModule } from 'nestjs-rollbar';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      environment: process.env.ROLLBAR_ENVIRONMENT,
      captureUncaught: true,
      captureUnhandledRejections: true,
      ignoreDuplicateErrors: false,
    }),
    SlackModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    SlackService,
    SlackService,
  ],
})
export class AppModule {

  constructor(private slackService: SlackService) {

  }

  initSlack(receiver: any) {
    const boltApp = new App({
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      scopes: "",
      authorize: async () => {
        return {
            botToken: process.env.SLACK_ACCESS_TOKEN,
            botId: process.env.SLACK_BOT_ID
        }
      },
      receiver,
    });
    this.slackService.initSlackCommand(boltApp);
  }
}