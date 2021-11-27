import { Injectable } from '@nestjs/common';
import { WorkspaceService } from './workspace/workspace.service';
import { MessageService } from './message/message.service';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { SlackApiService } from './slack/slack.service';

@Injectable()
export class UtilsService {
	constructor(
        private workspaceService: WorkspaceService,
        private slackService: SlackApiService,
        private messageService: MessageService,
        private whatsAppService: WhatsappService,
    ) {}
}