import { Module } from '@nestjs/common';
import { ReqParserService } from './reqparser.service';

@Module({

  providers: [ReqParserService]
})
export class ReqParserModule {}