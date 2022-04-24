import { Module } from "@nestjs/common";
import { SmsParserService } from "./smsparser.service";

@Module({
    providers : [SmsParserService]
})

export class SmsParserModule{}