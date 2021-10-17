import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const { ExpressReceiver } = require('@slack/bolt');

const bootstrap = async() => {
  const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });
  const app = await NestFactory.create(AppModule);
  const appModule = app.get(AppModule);
  appModule.initSlack(receiver);
  app.use(receiver.router);
  await app.listen(process.env.PORT);
}
bootstrap();