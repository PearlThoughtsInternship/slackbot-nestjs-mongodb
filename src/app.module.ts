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
import { ChannelModule } from './modules/channel/channel.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { ConfigService } from './shared/config.service';
import { SlackModule } from './modules/slack/slack.module';
import { WorkspaceModel } from './modules/workspace/workspace.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [WorkspaceModel],
      synchronize: false,
    }),
    UserModule,
    WorkspaceModule,
    MessageModule,
    ChannelModule,
    WhatsappModule,
    SlackModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, SlackService],
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
      authorize: async ({ teamId, enterpriseId }) => {
        // const data = await this.workspaceRepository.findByTeamId(teamId);
        // return {
        //     botToken: data.accessToken,
        //     botId: data.userId
        // };
      },
      receiver,
    });
    this.slackService.initSlackCommand(boltApp);
  }
}