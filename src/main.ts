import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { RollbarLogger } from 'nestjs-rollbar';
import { AllExceptionsFilter } from './exceptions/all.exception';
import { ConfigService } from '@nestjs/config';

const { ExpressReceiver } = require('@slack/bolt');

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const receiver = new ExpressReceiver({
    signingSecret: app.get(ConfigService).get('slack.signingSecret'),
    endpoints: {
      events: '/slack/events',
      interactive: '/slack/interactive',
      commands: '/slack/command',
      install: '/slack/add',
    },
  });

  const httpAdapter = app.get(HttpAdapterHost);

  const rollbarLogger = app.get(RollbarLogger);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, rollbarLogger));

  const appModule = app.get(AppModule);
  appModule.initSlackEvents(receiver);

  app.use(receiver.router);

  await app.listen(parseInt(app.get(ConfigService).get('port')));
};
bootstrap();
