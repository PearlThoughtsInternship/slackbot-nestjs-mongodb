import { Injectable } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @RollbarHandler()
  getException():string {
    throw new Error("Intentional Exception to verify Rollbar functionality");  
  }
}
