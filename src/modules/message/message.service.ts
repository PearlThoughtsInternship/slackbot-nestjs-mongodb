import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthAccessDto } from '../slack/dto/OauthAccessDto';
import { MessageModel } from './message.model';
// import { MessageBird } from 'messagebird';
import { ConfigService } from '../../shared/config.service';
// import { messagebird } from 'messagebird'(messageBirdApiKey);

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageModel) private readonly _messageModel: Repository<MessageModel>,
        private configService: ConfigService,
    ) {

    }

    async findOne(query): Promise<MessageModel> {
        return this._messageModel.findOne(query);
    }

    async log(data): Promise<MessageModel> {
        let d = new Date()

        return this._messageModel.save({
            senderID: data.sender,
            message: data.message,
            receivedOn: new Date(d.getTime() + ( 5.5 * 60 * 60 * 1000 )).toLocaleString(),
            forwardedFrom:data.forwardedFrom,
            notificationType:data.notificationType,
            channelRouted:data.channelID,
            blocks:data.blocks
        });
    }

    async whatsappOTPVerify(username,whatsappnum,channel,otp) {
        var params = {
                            'to': '91'+whatsappnum,
                            'from': '48f8197b984a4698bb49c0a40b60905a',
                            type: 'hsm',
                            content: {
                                hsm: {
                                namespace: 'd3173422_e84c_406c_9b7c_55d274480d5c',
                                templateName: 'otp_verify',
                                language: {
                                    policy: 'deterministic',
                                    code: 'en',
                                },
                                params: [{ default: username }, { default: channel }, { default: otp }],
                                },
                            },
                            'reportUrl': 'https://c86a91731880.ngrok.io'
                            };
        const messagebird = require('messagebird')(this.configService.get('MESSAGE_BIRD_KEY'));
        // var messagebird = MessageBird(this.configService.get('MESSAGE_BIRD_KEY'));
        messagebird.conversations.send(params, function (err, response) {
            if (err) {
                return console.log(err);
            }
            console.log('\x1b[36m%s\x1b[0m',`Posted the OTP to Subscirber: ${username} For Number: ${whatsappnum}`);
            // console.log(response);
        });
    }

    async randomOTP() {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++ ) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    };

    async sendAlerts(username,whatsappnum,channelname,sender,card,account,OTP,amount,payee,utr,limitConsumed,availableLimit,balance,ref,notificationType){
        var userfwd = username;
        var msgBody;
        var senderFwd = `${sender} `;
        var channelnameFwd = `#${channelname} *|* `;
        var cardFwd = `_CARD_ : ${card} *|* `;
        var accountFwd = `_ACCOUNT_ : ${account} *|* `;
        var OTPFwd = `_OTP_ : *${OTP}* *|* `;
        var amountFwd = `_AMOUNT_ : *₹${amount}* *|* `;
        var payeeFwd = `_PAYEE_ : ${payee} *|* `;
        var utrFwd = `_UTR_ : ${utr} *|* `;
        var limitConsumedFwd = `_Card Limit Consumed_ : ${limitConsumed} *|* `;
        var availableLimitFwd = `_Current available limit_ : *${availableLimit}* *|* `;
        var balanceFwd = `_Available Balance_ : *₹${balance}* *|* `;
        var refFwd = `_REF_ : ${ref} *|* `;
    
        switch(notificationType){
            case 'cardLogin':
                msgBody = channelnameFwd + ((card===undefined) ? "" : cardFwd) + OTPFwd;
                break;
            case 'credit':
                msgBody = channelnameFwd + ((account===undefined)?cardFwd:accountFwd) + ((ref===undefined)?"":refFwd) + ((payee===undefined)?"":payeeFwd) + amountFwd + ((balance===undefined)?"":balanceFwd);
                break;
            case 'fundTransfer':
                msgBody = channelnameFwd + ((account===undefined)?cardFwd:accountFwd) + ((payee===undefined)?"":payeeFwd) + ((amount===undefined)?"":amountFwd) + OTPFwd;
                break;
            case 'cardFundTransfer':
                msgBody = channelnameFwd + ((account===undefined)?cardFwd:accountFwd) + ((payee===undefined)?"":payeeFwd) + ((amount===undefined)?"":amountFwd) + OTPFwd;
                break;
            case 'transaction':
                msgBody = channelnameFwd + ((account===undefined) ? ((card===undefined)?"":cardFwd) : accountFwd) + ((payee===undefined)?"":payeeFwd) + ((utr===undefined)?"":utrFwd) + "_Debited_ "+amountFwd + ((balance===undefined)?"":balanceFwd);
                break;
            case 'limit':
                msgBody = channelnameFwd + limitConsumedFwd + availableLimitFwd;
                break;
            case 'login':
                msgBody = channelnameFwd + ((card===undefined) ? "" : cardFwd) + OTPFwd;
                break;
            case 'balance':
                msgBody = channelnameFwd + accountFwd + balanceFwd;
                break;
            case 'beneficiary':
                msgBody = channelnameFwd + accountFwd + OTPFwd;
                break;
            default:
                // msgBody = channelnameFwd + message;
                break;
        }
        // console.log(msgBody);
        var params = {
        'to': '91'+whatsappnum,
        'from': '48f8197b984a4698bb49c0a40b60905a',
        type: 'hsm',
        content: {
            hsm: {
            namespace: 'd3173422_e84c_406c_9b7c_55d274480d5c',
            templateName: 'text_alert',
            language: {
                policy: 'deterministic',
                code: 'en',
            },
            params: [{ default: userfwd }, { default: senderFwd }, { default: msgBody }],
            },
        },
        'reportUrl': 'https://aade1ece34f9.ngrok.io'
        };
        
        const messagebird = require('messagebird')(this.configService.get('MESSAGE_BIRD_KEY'));
        messagebird.conversations.send(params, function (err, response) {
        if (err) {
            return console.log(err);
        }
        // console.log(response);
        });
    }
}
