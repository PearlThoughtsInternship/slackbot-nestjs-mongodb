import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { RollbarLogger } from 'nestjs-rollbar';
import { AllExceptionsFilter } from './exceptions/all.exception';
import { ConfigService } from '@nestjs/config';

const { ExpressReceiver } = require('@slack/bolt');

const bootstrap = async() => {
  const receiver = new ExpressReceiver({ 
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: { events: '/slack/events', interactive: '/slack/interactive' , commands: '/slack/command' },
  });

  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  const rollbarLogger = app.get(RollbarLogger);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, rollbarLogger));
  
  const appModule = app.get(AppModule);
  const configService = app.get(ConfigService);
  appModule.initSlack(receiver);
  app.use(receiver.router);
  const PORT = parseInt(configService.get('PORT'))
  await app.listen(PORT);
}
bootstrap();