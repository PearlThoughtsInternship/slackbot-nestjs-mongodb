import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import * as Rollbar from 'rollbar';

@Injectable()
export class RollbarService {
    private rollbarLogger: Rollbar;

    constructor(private configService: ConfigService) {
        this.rollbarLogger = new Rollbar({
            accessToken: this.configService.get('ROLLBAR_ACCESS_TOKEN'),
            environment: this.configService.get('ROLLBAR_ENVIRONMENT'),
            captureUncaught: true,
            captureUnhandledRejections: true,
        });
    }

    async error(...data) {
        this.rollbarLogger.error(...data);
    }

    async info(...data) {
        this.rollbarLogger.info(...data);
    }
}