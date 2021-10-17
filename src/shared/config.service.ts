import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
    constructor() {
        dotenv.config();
    }

    public get(key: string): string {
        return process.env[key];
    }

    public getNumber(key: string): number {
        return Number(this.get(key));
    }

    get appEnv(): string {
        return this.get('APP_ENV') || 'development';
    }

    get isDevelopment(): boolean {
        return this.appEnv === 'development';
    }

    get isProduction(): boolean {
        return this.appEnv === 'production';
    }
}
