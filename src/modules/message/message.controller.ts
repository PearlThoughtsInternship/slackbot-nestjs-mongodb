import { Controller, Post, Request, Get, Response, HttpStatus, Res, Body } from '@nestjs/common';

import { ChannelService } from '../channel/channel.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { MessageService } from './message.service';
import { SlackApiService } from '../slack/slack.service';

import { ConfigService } from '../../shared/config.service';
import {
    viewSbiinbLogin, viewSbiinbFundTransfer, viewSbiinbCredit, viewSbiinbTransaction,
    viewSbicrdLogin, viewSbicrdFundTransfer, viewSbicrdCredit, viewSbicrdTransaction, viewSbicrdDevopsCloud, viewSbicrdLimit, viewSbicrdUdemyOtp, viewSbicrdCardFundTransfer, viewSbicrdCardLogin, 
    viewAxisbkBalance, viewAxisbkBeneficiary, viewAxisbkCredit, viewAxisbkFundTransfer, viewAxisbkTransaction,
    viewIcicibCorpLogin, viewIcicibCredit, viewIcicibFundTransfer, viewIcicibPersonalMessage, viewIcicibTransaction,
    viewSbipsgTransaction, viewSbipsgCredit,
    viewWorknhireFundTransfer,
    viewIpaytmPersonalMessage,
    viewRzrpayFundTransfer,
    viewCbssbiCredit,
    viewCshfreUncategorized,
    view57575701Uncategorized
} from 'src/providers/blocks';

@Controller('message')
export class MessageController {
    constructor(
        private channelService: ChannelService,
        private workspaceService: WorkspaceService,
        private configService: ConfigService,
        private slackService: SlackApiService,
        private messageService: MessageService,
    ) {}

    @Post('/')
    async message(@Body() body, @Request() req, @Response() res) {
            // ForwardedFrom is actually returned as Forwardedfrom
            var forwardedFrom = req.get('Forwardedfrom');
            /**
             * Dissecting Sender IDs in SMS
             * BZ-SBIINB
             * B - BSNL (Network Operator)
             * Z - Maharashtra (Location)
             * SBIINB - Brand or Company name - SBI INternet Banking
             * Source: https://qr.ae/pGGgFu
             */
            let regexSenderID = /[A-Za-z]{2}-[A-Za-z]{6}/m;
            var sender;
            if (regexSenderID.test(req.get('From'))) {
                sender = req.get('From').split('-')[1]; //Extracts the 6-char Org ID
            } else {
                sender = req.get('From'); // Take the mobile number as it is
            }
            var message = req.body.data;
            let blocks;
            let icon_url;
            let notificationType = 'uncategorized';
            let OTP, amount, account, payee,card ,utr ,limitConsumed, availableLimit , ref , balance,purpose,paymentService,type,status,totDue,minDue;
            let channel,channelID,workspace,subNotificationType,subChannels;
            console.log('sender: ' + sender);
            console.log('sender: ' + typeof(sender));
            switch (sender) {
                case 'SBIINB':
                    console.log("SBIINBSBIINBSBIINB");
                    const regexSBICreditCaseOne = /a\/c.no. (?<account>.*?X\d+).*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*to (?<payee>.*  )/m;
                    const regexSBINetBankingFundTransfer = /.*?OTP.*?Rs. (?<amount>(\d+(.*\,\d{0,})?)).*?(?<account>\d+)\s+to\s+(?<payee>.*?)\s+is\s(?<OTP>\d+)/m;
                    const regexSBINetBankingLogin = /.*OTP.*(?<OTP>\d{8}).*/m;
                    const regexSBIINBTransaction =/txn.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?A\/c.(?<account>X\d+).*?to.?(?<payee>.*?[.]).*Ref.(?<utr>.*? )/m;

                    console.log(regexSBINetBankingLogin.test(message));
                    if (regexSBINetBankingFundTransfer.test(message)) {
                        ({
                            groups: { account, amount, payee, OTP }
                        } = regexSBINetBankingFundTransfer.exec(message));
                        notificationType = 'fundTransfer';
                    } else if (regexSBINetBankingLogin.test(message)) {                
                        ({
                            groups: { OTP }
                        } = regexSBINetBankingLogin.exec(message));
                        notificationType = 'login';
                        
                    } else if (regexSBICreditCaseOne.test(message)) {
                        ({
                            groups: { amount,account, payee  }
                        } = regexSBICreditCaseOne.exec(message));
                        notificationType = 'credit';
                    } else if (regexSBIINBTransaction.test(message)) {
                        ({
                            groups: { amount,account, payee, utr  }
                        } = regexSBIINBTransaction.exec(message));
                        notificationType = 'transaction';
                    }
                    
                    console.log('notification type: ' + notificationType);
                    switch (notificationType) {
                        case 'login':
                            console.log("channelchannelchannelchannel1111");
                            channel = await this.channelService.findByType('login-otp');
                            console.log("channelchannelchannelchannel");
                            console.log('channel type: ' + channelID);
                            icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                            blocks = viewSbiinbLogin({ card,OTP });
                            console.log('blocksblocksblocksblocks: ' + JSON.stringify(blocks));
                            break;
                        case 'fundTransfer':
                            channel = await this.channelService.findByType('fund-transfer-otp');
                            icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                            blocks = viewSbiinbFundTransfer({ account,card,amount,payee,OTP });
                            break;
                        case 'credit':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                            blocks = viewSbiinbCredit({ account,card,payee,amount  });
                            break;
                        case 'transaction':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                            blocks = viewSbiinbTransaction({ account,card,utr,payee,amount  });
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'SBICRD':
                    const regexSBICardFundTransfer = /.*?OTP.*?Rs. (?<amount>(\d+(\.\d{0,2})?)) .*?(?<account>\d+)\s+to\s+(?<payee>.*?)\s+is\s(?<OTP>\d+)/m;
                    const regexSBICreditCardTransfer = /(?<OTP>\d+).?is.OTP.*Rs. (?<amount>(\d+(.*\,\d{0,})?)).*at (?<payee>.+?)with.*Card ending (?<card>\d+)/m;
                    const regexSBICardLogin = /Card.*(?<card>XX\d+).*is.(?<OTP>\d{6,})/m;
                    const regexSBICardLoginCaseTwo = /OTP.*?login.*?is.(?<OTP>\d{6,})/m;
                    const regexSBICardTransaction = /Rs.(?<amount>(\d+(.*\,\d{0,})?)).*with.(?<card>\d+).*?at (?<payee>.+?)on.(?<date>)/m; //Need to work on Date Group
                    const regexSBICardTransactionCaseTwo = /Trxn.*?(?<amount>(Rs.|USD)(\d+(.*\,\d{0,})?)).*?SBI Card.*?(?<card>\d+).*at (?<payee>.+)( on)/m;
                    const regexSBICardTransactionCaseThree = /(?<amount>(Rs.|USD)(\d+(.*\,\d{0,})?)).*?spent.*?SBI Card.*?(?<card>\d+).*at (?<payee>.+)( on)/m;
                    const regexSBINEFTTransaction = /A\/c.(?<account>XX\d+).*?debited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)/m;
                    const regexSBINEFTTransactionCaseTwo =  /NEFT.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)/m;
                    const regexSBICRDTransaction = /txn.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?A\/c.(?<account>X\d+).*?to.?(?<payee>.*?[.]).*Ref.(?<utr>.*? )/m;
                    const regexSBICreditCaseTwo = /Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?ending.(?<card>XX\d+)/m;
                    const regexSBICreditCaseThree = /Rs. (?<amount>(\d+(.*\,\d{0,})?)).*?credited.*?Card.(?<card>xxxx\d+).*?from.(?<payee>.*  )/m;
                    const regexSBICardLimit = /consumed.*?(?<limitConsumed>\d.*?%).*?credit.*limit.*available.*?(?<availableLimit>(\d+(.*\,\d{0,})?))/m;
                    const regexCardPINDelivery = /.*?PIN of your SBI Card.*?delivered/m;
                    const regexSBIEStatement = /(ending with)(?<card>.*?XX\d+).*?.Total Amt Due.*?(Rs |INR |USD )(?<totDue>(\d+(.*\,\d{0,})?)).*?.Min Amt Due.*?(Rs |INR |USD )(?<minDue>(\d+(.*\,\d{0,})?))/m; //E-Statement
                    const regexSBICardReversal =/request for.*?(?<type>\w{0,}.*?.+?(?=of Rs)).*?Rs.(?<amount>\d+(.*\,\d{0,})?).*?.ending.*?(?<card>.*?\d+).*?.has been(?<status>.*?\w{1,}[.])/m; //reversal request
                    const regexSBISI =/Trxn.*?(USD|INR|Rs)(?<amount>\d+(.*\.\d{1,})).*?.Card ending(?<card>.*?\d+).at(?<payee>.*?\w{0,}.*?.+?(?=on)).*?.has been(?<status>.*?\w{1,})/m; //SI-Standard Instruction

                    if (regexSBICardFundTransfer.test(message)) {
                        ({
                            groups: { account, amount, payee, OTP }
                        } = regexSBICardFundTransfer.exec(message));
                        notificationType = 'fundTransfer';
                    } else if (regexSBICreditCardTransfer.test(message)) {
                        ({
                            groups: { card, amount, payee, OTP }
                        } = regexSBICreditCardTransfer.exec(message));
                        notificationType = 'cardFundTransfer';
                        //Route the message to DevopsAWS Channel given the condition
                        var cloudPayeeAWS = payee.toLowerCase().includes('amazon');
                        var cloudPayeeIBM = payee.toLowerCase().includes('ibm');
                        //if cc used is ending with 65 or 89 for specif amounts
                        if ((card == 33) && ( cloudPayeeAWS || cloudPayeeIBM  ) && (amount==2.00 || amount==1.00) ){
                            subNotificationType = 'devopsCloud';
                        }
                    } else if (regexSBICardLogin.test(message)) {
                        ({
                            groups: { card, OTP }
                        } = regexSBICardLogin.exec(message));
                        notificationType = 'cardLogin';
                    } else if (regexSBICardLoginCaseTwo.test(message)) {
                        ({
                            groups: { OTP }
                        } = regexSBICardLoginCaseTwo.exec(message));
                        notificationType = 'cardLogin';
                    } else if (regexSBICardTransaction.test(message)) {
                        ({
                            groups: { card, amount, payee  }
                        } = regexSBICardTransaction.exec(message));
                        notificationType = 'transaction';
                    } else if (regexSBINEFTTransaction.test(message)) {
                        ({
                            groups: { account, amount, payee, utr  }
                        } = regexSBINEFTTransaction.exec(message));
                        notificationType = 'transaction';
                    } else if (regexSBINEFTTransactionCaseTwo.test(message)) {
                        ({
                            groups: { amount, payee, utr  }
                        } = regexSBINEFTTransactionCaseTwo.exec(message));
                        notificationType = 'transaction';
                    } else if (regexSBICRDTransaction.test(message)) {
                        ({
                            groups: { amount,account, payee, utr  }
                        } = regexSBICRDTransaction.exec(message));
                        notificationType = 'transaction';
                    } else if (regexSBICreditCaseTwo.test(message)) {
                        ({
                            groups: { amount,card  }
                        } = regexSBICreditCaseTwo.exec(message));
                        notificationType = 'credit';
                    } else if (regexSBICreditCaseThree.test(message)) {
                        ({
                            groups: { amount,card ,payee }
                        } = regexSBICreditCaseThree.exec(message));
                        notificationType = 'credit';
                    } else if (regexSBICardLimit.test(message)) {
                        ({
                            groups: { limitConsumed, availableLimit }
                        } = regexSBICardLimit.exec(message));
                        notificationType = 'limit';
                    }  else if (regexSBICardTransactionCaseTwo.test(message)) {
                        ({
                            groups: { amount, card,payee }
                        } = regexSBICardTransactionCaseTwo.exec(message));
                        notificationType = 'transaction';
                    }  else if (regexSBICardTransactionCaseThree.test(message)) {
                        ({
                            groups: { amount, card,payee }
                        } = regexSBICardTransactionCaseThree.exec(message));
                        notificationType = 'transaction';
                    } else if(regexCardPINDelivery.test(message)) {
                        notificationType = 'package-delivery';
                    } else if (regexSBIEStatement.test(message)){
                        ({
                            groups: {card,totDue,minDue}
                        } = regexSBIEStatement.exec(message));
                        notificationType = 'transaction';
                    } else if (regexSBICardReversal.test(message)){
                        ({
                            groups: {type ,amount,card,status}
                        } =regexSBICardReversal.exec(message));
                        notificationType = 'transaction';
                    } else if (regexSBISI.test(message)){
                        ({
                            groups: {amount,card , payee,status}
                        } =regexSBISI.exec(message));
                        notificationType = 'transaction';
                    }

                    //Custom Payee : Udemy to route to diff channel
                    if(payee && payee.toLowerCase().includes('udemy') && OTP!= undefined){
                        notificationType = 'udemyOTP';
                    }

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'login':
                            channel = await this.channelService.findByType('login-otp');
                            icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                            blocks = viewSbicrdLogin({ card,OTP });
                            break;
                        case 'cardLogin':
                            channel = await this.channelService.findByType('login-otp');
                            icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                            blocks = viewSbicrdCardLogin({ card,OTP });
                            break;
                        case 'fundTransfer':
                            channel = await this.channelService.findByType('fund-transfer-otp');
                            icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                            blocks = viewSbicrdFundTransfer({ account,card,payee,amount,OTP });
                            break;
                        case 'cardFundTransfer':
                            channel = await this.channelService.findByType('fund-transfer-otp');                          
                            if(subNotificationType == 'devopsCloud'){
                            subChannels= await this.channelService.findByType('DevopsAws');
                            }
                            channel = channel.concat(subChannels);
                            icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                            blocks = viewSbicrdCardFundTransfer({ account,card,payee,amount,OTP });
                            break;
                        case 'credit':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                            blocks = viewSbicrdCredit({ account,card,payee,amount });
                            break;
                        case 'transaction':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                            blocks = viewSbicrdTransaction({ account,card,payee,amount,utr,type,status,totDue,minDue });
                            break;
                        case 'limit':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                            blocks = viewSbicrdLimit({ limitConsumed, availableLimit });
                            break;
                        case 'udemyOTP':
                            channel = await this.channelService.findByType('udemy-new-course-otp');
                            icon_url = 'https://media.glassdoor.com/sql/434871/udemy-squareLogo-1627922062697.png';
                            blocks = viewSbicrdUdemyOtp({ amount, OTP });
                            break;
                        case 'package-delivery':
                            channel = await this.channelService.findByType('Package-delivery');
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'ICICIB':
                    const regexICICIBankingFundTransfer = /(?<OTP>\d+).?is.*?OTP.*INR.(?<amount>(\d+(.*\,\d{0,})?)).?at.*?(?<payee>\w{1,}).*?(?<account>(Account|Acct|Card).*?XX\d+)/m;
                    const regexICICIBankingFundTransferCaseOne = /(?<OTP>\d+).?is.*?OTP.*INR.(?<amount>(\d+(.*\,\d{0,})?)).*?.(?<account>(Account|Acct|Card).*?XX\d+).*?to.(?<payee>.*?[.])/m;
                    const regexICICIBankingFundTransferCaseTwo = /(?<OTP>\d+).?is.*?OTP.*(?<account>(Acct|Card).*?XX\d+)/m;
                    const regexICICIBankingFundTransferCaseThree = /(?<OTP>\d+).?is.*?OTP.*?to pay.*?(?<payee>.*?[,]).*?(Rs |INR |USD )(?<amount>(\d+(.*\,\d{0,})?))/m;
                    const regexICICIBankingCreditCaseOne = /(?<account>Account.*?\d+).*credited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*?Info:(?<ref>.*?[.]).*?Balance is.*?(?<balance>(\d+(\,\d.*[^.])))/m;
                    const regexICICIBankingCreditCaseTwo = /Rs.*?(?<amount>(\d+(.*\,\d{0,})?)).*credited.*?account.(?<account>.*?\d+).*?Bal.*?Rs.(?<balance>(\d+(.*\,\d{0,})?))/m;
                    const regexICICIBankingCreditCaseFive = /(?<account>Account.*?\d+).*credited.*?(?<amount>(INR |USD |Rs )(\d+(.*\,\d{0,})?)).*?(from |by )(?<payee>.*?[.]).*?Ref. no..*?.(?<ref>.*?[.])/m;
                    const regexICICIBTransactionCaseOne = /(?<account>Acc.*?\d+).*debited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*?Info:(?<ref>.*?[.]).*?Balance is.*?(?<balance>(\d+(.*\,\d{0,})?))/m;
                    const regexICICIBTransactionCaseThree = /.*?(?<amount>(USD |INR )(\d+(.*\,\d{0,})?)(\.[0-9]+ |)).*?debited.*?(?<account>(Acct|Card).*?XX\d+).*?Info:(?<ref>.*?[.]).*?Available Limit.*?(?<balance>(\d+(.*\,\d{0,})?))/m;
                    const regexICICIBTransactionCaseFour = /(?<account>(Acct|Account).*?\d+).*debited.*?.(?<amount>(Rs |USD |INR )(\d+(.*\,\d{0,})?))/m;
                    const regexICICIBTransactionCaseFive = /.*?(?<amount>(INR |USD )(\d+(.*\,\d{0,})?)).*?done.*?(?<account>(Acc|Card).*?XX\d+).*?Info:(?<ref>.*?[.]).*?Available Balance.*?(?<balance>(\d+(.*\,\d{0,})?))/m;
                    const regexICICIBankingCreditCaseThree = /Payment.*?INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?Account.*?(?<account>xxx.*?\d+)/m;
                    const regexICICIBankingCreditCaseFour = /(?<account>Acct.*?\d+).*credited.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?by (?<ref>.*?\d+)/m;
                    const regexICICIJioMobility = /Jio Mobility.*?ICICI Bank app/m;
                    const regexICICIBankingCreditCaseSix =/(?<ref>\d+).*?Rs.*?(?<amount>(\d+(.*\,\d{0,})?)).*?credited.to.*?(?<account>\w.*account)/m;
                    const regexICICIBCorpBanking = /(?<OTP>\d+).*?is.*?OTP.*?Corporate Internet Banking/m;
                    const regexICICIBFundTransfer1 = /(?<account>(Acct|Card).*?XX\d+).*?.\OTP is.*?(?<OTP>\d+)/m;
                    const regexICICIBTransaction1 =/INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?(?<account>(Acct|Card).*?XX\d+).*?through.*?(?<payment_service>\w{1,}\s+.+?(?=on))/m;
                    const regexICICIBTransaction2 =/INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?spent.*?(?<account>(Acct|Card).*?XX\d+).*?at.*?(?<payee>\w{1,}).*?Avl Lmt.*?INR.*?(?<balance>(\d+(.*\,\d{0,})[.]))/m;
                    const regexICICIBRefundCredit =/Customer,.*?(?<Type>.*?\w{0,}.*?.+?(?=of)).*?(?<amount>(INR |USD |Rs )(\d+(.*\,\d{0,})?)).*?(from |by )(?<payee>.*?\w{0,}.*?.+?(?=has)).*?(?<account>(Account|Acct|Card).*?XX\d+)/m;
                    if (regexICICIBankingFundTransfer.test(message)) {
                        ({
                            groups: { account, amount, payee, OTP }
                        } = regexICICIBankingFundTransfer.exec(message));
                        notificationType = 'fundTransfer';
                    } else if (regexICICIBankingFundTransferCaseOne.test(message)) {
                        ({
                            groups: { account, amount, payee, OTP }
                        } = regexICICIBankingFundTransferCaseOne.exec(message));
                        notificationType = 'fundTransfer';    
                    } else if (regexICICIBankingFundTransferCaseTwo.test(message)) {
                        ({
                            groups: { account, OTP }
                        } = regexICICIBankingFundTransferCaseTwo.exec(message));
                        notificationType = 'fundTransfer';
                    } else if(regexICICIBFundTransfer1.test(message)) {
                        ({
                            groups: { account, OTP }
                        } = regexICICIBFundTransfer1.exec(message));
                        notificationType = 'fundTransfer';
                    } else if (regexICICIBankingFundTransferCaseThree.test(message)) {
                        ({
                            groups: { amount , OTP, payee }
                        } = regexICICIBankingFundTransferCaseThree.exec(message));
                        notificationType = 'fundTransfer';
                    }  else if (regexICICIBankingCreditCaseOne.test(message)) {
                        ({
                            groups: { amount,account, ref , balance  }
                        } = regexICICIBankingCreditCaseOne.exec(message));
                        notificationType = 'credit';
                    } else if (regexICICIBankingCreditCaseTwo.test(message)) {
                        ({
                            groups: { amount,account, balance  }
                        } = regexICICIBankingCreditCaseTwo.exec(message));
                        notificationType = 'credit';
                    } else if (regexICICIBTransactionCaseOne.test(message)){
                        ({
                            groups: { amount,account, balance , ref }
                        } = regexICICIBTransactionCaseOne.exec(message));
                        notificationType = 'transaction';
                    } else if(regexICICIBTransaction2.test(message)) {
                            ({
                                groups: { amount,account, balance , payee }
                            } = regexICICIBTransaction2.exec(message));
                            notificationType = 'transaction';
                    } else if (regexICICIBTransactionCaseThree.test(message)) {
                        ({
                            groups: { amount,account, ref , balance}
                        } = regexICICIBTransactionCaseThree.exec(message));
                        notificationType = 'transaction';
                    } else if (regexICICIBCorpBanking.test(message)) {
                        ({
                            groups: { OTP }
                        } = regexICICIBCorpBanking.exec(message));
                        notificationType = 'CorpLogin';
                    } else if (regexICICIBTransactionCaseFour.test(message)) {
                        ({
                            groups: { account , amount }
                        } = regexICICIBTransactionCaseFour.exec(message));
                        notificationType = 'transaction';
                    } else if (regexICICIBTransactionCaseFive.test(message)) {
                        ({
                            groups: { amount,account, balance , ref }
                        } = regexICICIBTransactionCaseFive.exec(message));
                        notificationType = 'transaction';
                    } else if (regexICICIBankingCreditCaseThree.test(message)) {
                        ({
                            groups: { amount,account }
                        } = regexICICIBankingCreditCaseThree.exec(message));
                        notificationType = 'credit';
                    } else if (regexICICIBankingCreditCaseFour.test(message)) {
                        ({
                            groups: { amount,account,ref }
                        } = regexICICIBankingCreditCaseFour.exec(message));
                        notificationType = 'credit';
                    } else if (regexICICIBankingCreditCaseSix.test(message)) {
                        ({
                            groups: { amount,account,ref }
                        } = regexICICIBankingCreditCaseSix.exec(message));
                        notificationType = 'credit';
                    } else if (regexICICIBankingCreditCaseFive.test(message)) {
                        ({
                            groups: { amount,account,ref,payee }
                        } = regexICICIBankingCreditCaseFive.exec(message));
                        notificationType = 'credit';
                    } else if (regexICICIJioMobility.test(message)) {
                        notificationType = 'personalMessageNoBlock';
                    }else if (regexICICIBRefundCredit.test(message)) {
                        ({
                            groups: { type,amount,payee,account }
                        } = regexICICIBRefundCredit.exec(message));
                        notificationType = 'credit';
                    }else if (regexICICIBTransaction1.test(message)) {
                        ({
                            groups: { amount , account , paymentService }
                        } = regexICICIBTransaction1.exec(message));
                        notificationType = 'transaction';
                    } 
                   

                    if(account!=undefined && ( account.slice(-4) == "7003" || account.slice(-3) == "431" )  ){
                        notificationType = "personalMessage";
                    }

                    console.log('notification type: ' + notificationType);
                    
                    switch (notificationType) {
                        case 'fundTransfer':
                            channel = await this.channelService.findByType('fund-transfer-otp');
                            icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                            blocks = viewIcicibFundTransfer({account,payee,amount,OTP})
                            break;
                        case 'credit':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                            blocks = viewIcicibCredit({type,account,ref,amount,balance,payee});
                            break;
                        case 'transaction':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                            blocks = viewIcicibTransaction({account,payee,ref,balance,amount,paymentService});
                            break;
                        case 'personalMessage':
                            channel = await this.channelService.findByType('PersonalMessages');
                            icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                            blocks = viewIcicibPersonalMessage({account,payee,amount,OTP,message,ref,balance});
                            break;
                        case 'personalMessageNoBlock':
                            channel = await this.channelService.findByType('PersonalMessages');
                            icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                            break;
                        case 'CorpLogin':
                        channel = await this.channelService.findByType('login-otp');
                        icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                        blocks = viewIcicibCorpLogin({OTP});
                        break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'AxisBk':
                    const regexAxisBkFundTransfer = /(?<OTP>\d+).?is.*?OTP.*?.(?<account>(A\/c).*?XX\d+).*?to.*?(?<payee>(A\/c).*?XX\d+).*INR.(?<amount>(\d+(.*\,\d{0,})?))/m;
                    const regexAxisBkBeneficiary = /(?<OTP>\d+).?is.*?OTP.*?adding.(?<account>.*?).as/m;
                    const regexAxisBkCreditCaseOne = /INR.(?<amount>(\d+(.*\,\d{0,})?)).*?credited.*?(?<account>A\/c.*?\d+).*?Info(:|-) (?<ref>.*?[.]).*?Bal(:|-).*?INR.(?<balance>(\d+(.*\,\d{0,})?))/m;
                    const regexAxisBkTransactionCaseOne = /INR.(?<amount>(\d+(.*\,\d{0,})?)).*?debited.*?(?<account>A\/c.*?\d+).*?at.(?<ref>.*?[.]).*?Bal.*?INR.(?<balance>(\d+(.*\,\d{0,})?))/m;
                    const regexAxisBkBalance = /balance.*?(?<account>a\/c.*?\d+).*?Rs.(?<balance>(\d+(.*\,\d{0,})?))/m;
                    const regexAxisBkCardPersonal = /4489/m;
                    if (regexAxisBkFundTransfer.test(message)) {
                        ({
                            groups: { account, amount, payee, OTP }
                        } = regexAxisBkFundTransfer.exec(message));
                        notificationType = 'fundTransfer';
                    }
                    else if (regexAxisBkBeneficiary.test(message)) {
                        ({
                            groups: { account, OTP }
                        } = regexAxisBkBeneficiary.exec(message));
                        notificationType = 'beneficiary';
                    }  
                    else if (regexAxisBkCreditCaseOne.test(message)) {
                        ({
                            groups: { amount,account, ref , balance  }
                        } = regexAxisBkCreditCaseOne.exec(message));
                        notificationType = 'credit';
                    } 
                    else if (regexAxisBkTransactionCaseOne.test(message)) {
                        ({
                            groups: { amount,account,ref, balance  }
                        } = regexAxisBkTransactionCaseOne.exec(message));
                        notificationType = 'transaction';
                    } 
                    else if (regexAxisBkBalance.test(message)) {
                        ({
                            groups: { account, balance }
                        } = regexAxisBkBalance.exec(message));
                        notificationType = 'balance';
                    } else if (regexAxisBkCardPersonal.test(message)) {
                        notificationType = 'personalMessage';
                    } 

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'fundTransfer':
                            channel = await this.channelService.findByType('fund-transfer-otp');
                            icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                            blocks = viewAxisbkFundTransfer({account,payee,amount,OTP});
                            break;
                        case 'beneficiary':
                            channel = await this.channelService.findByType('payee-otp');
                            icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                            blocks = viewAxisbkBeneficiary({account,OTP});
                            break;
                        case 'credit':
                            if(account.slice(-4)=="2879"){
                                channel = await this.channelService.findByType('PersonalMessages');
                            } else{
                                channel = await this.channelService.findByType('service-alerts');
                            }
                            icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                            blocks = viewAxisbkCredit({account,ref,amount,balance});
                            break;
                        case 'transaction':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                            blocks = viewAxisbkTransaction({account,ref,amount,balance});
                            break;
                        case 'balance':
                            channel = await this.channelService.findByType('BalanceAlert');
                            icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                            blocks = viewAxisbkBalance({account,balance});
                            break;
                        case 'personalMessage':
                            channel = await this.channelService.findByType('PersonalMessages');
                            icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                            // Yet to add any Block Message for personal Axis Card
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'SBIPSG':
                    const regexSBIPSGCreditCaseOne = /INR.(?<amount>(\d+(.*\,\d{0,})?)).*credited.*?(?<account>A\/c.*?\d+).*?by (?<payee>.*,)/m;
                    const regexSBIPSGTransaction = /A\/c.(?<account>XX\d+).*?debited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)/m;
                    const regexSBIPSGTransactionCaseTwo =  /NEFT.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)at/m;
                    if (regexSBIPSGCreditCaseOne.test(message)) {
                        ({
                            groups: { amount,account, payee }
                        } = regexSBIPSGCreditCaseOne.exec(message));
                        notificationType = 'credit';
                    } else if (regexSBIPSGTransaction.test(message)) {
                        ({
                            groups: { account, amount, payee, utr  }
                        } = regexSBIPSGTransaction.exec(message));
                        notificationType = 'transaction';
                    } else if (regexSBIPSGTransactionCaseTwo.test(message)) {
                        ({
                            groups: { amount, payee, utr  }
                        } = regexSBIPSGTransactionCaseTwo.exec(message));
                        notificationType = 'transaction';
                    }

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'credit':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                            blocks = viewSbipsgCredit({account,payee,amount,card});
                            break;
                        case 'transaction':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                            blocks = viewSbipsgTransaction({account,card,payee,amount,utr});
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'CBSSBI':
                    const regexCBSSBICreditCaseOne = /(?<account>A\/C.*?\d+).*credit.*?Rs (?<amount>(\d+(.*\,\d{0,})?)).*?Bal .*?(?<balance>(\d+(.*\,\d{0,})?))/m;
                    if (regexCBSSBICreditCaseOne.test(message)) {
                        ({
                            groups: { amount,account, balance }
                        } = regexCBSSBICreditCaseOne.exec(message));
                        notificationType = 'credit';
                    } 

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'credit':
                            channel = await this.channelService.findByType('service-alerts');
                            icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                            blocks = viewCbssbiCredit({account,card,payee,amount,balance});
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'Worknhire':
                    const regexWorknhireFundTransfer = /(?<OTP>\d+).?is.*?OTP/m;
                    if (regexWorknhireFundTransfer.test(message)) {
                        ({
                            groups: { OTP }
                        } = regexWorknhireFundTransfer.exec(message));
                        notificationType = 'fundTransfer';
                    }

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'fundTransfer':
                            channel = await this.channelService.findByType('fund-transfer-otp');
                            icon_url = 'https://media-exp1.licdn.com/dms/image/C560BAQHeKdeWlnZYRw/company-logo_200_200/0/1519882729303?e=2159024400&v=beta&t=9ztSYDXwdEN3djuaWApSyPafuPaxTDcVQQEOSR9XvjQ';
                            blocks = viewWorknhireFundTransfer({OTP});
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case '57575701':
                    const regexPayoneerFundTransfer = /(?<OTP>\d+).?is.*?verification.*? code/m;
                    if (regexPayoneerFundTransfer.test(message)) {
                        ({
                            groups: { OTP }
                        } = regexPayoneerFundTransfer.exec(message));
                        notificationType = 'Uncategorized';
                    }

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'Uncategorized':
                            channel = await this.channelService.findByType('Uncategorized');
                            icon_url = 'https://www.fintechfutures.com/files/2016/03/payoneer.png';
                            blocks = view57575701Uncategorized({ OTP });
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'CSHFRE':
                    const regexCashfreeFundTransfer = /OTP.*?is.(?<OTP>\d+)/m;
                    if (regexCashfreeFundTransfer.test(message)) {
                        ({
                            groups: { OTP }
                        } = regexCashfreeFundTransfer.exec(message));
                        notificationType = 'Uncategorized';
                    }

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'Uncategorized':
                            channel = await this.channelService.findByType('Uncategorized');
                            icon_url = 'https://images.saasworthy.com/tr:w-150,h-0/cashfree_1995_logo_1597819642_ojxbr.png';
                            blocks = viewCshfreUncategorized({OTP});
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'iPaytm':
                    const regexiPaytmDebitCaseOne = /Paid.?.(?<amount>(Rs |INR |USD )(\d+(.*\,\d{0,})?)).*?.for.(?<purpose>.*?.+?(?=on)).*?.TxnId:(?<ref>.*?[.]).*?Bal.*?.(?<balance>(Rs |INR )(\d+(.*\,\d{0,})?))/m;
                    const regexiPaytmDebitCaseTwo = /Paid.(Rs.|INR).*?(?<amount>\d+(.*\,\d{0,})?).to.(?<payee>.+?(?=from))from.(?<paymentService>\w{0,}.*?[.]).*?Paytm Wallet-.(Rs|INR).*?(?<balance>\d+(.*\,\d{0,)?)/m;
                    if (regexiPaytmDebitCaseOne.test(message)) {
                        ({
                            groups: { amount,purpose,ref,balance }
                        } = regexiPaytmDebitCaseOne.exec(message));
                        notificationType = 'personalMessage';
                    } else   if (regexiPaytmDebitCaseTwo.test(message)) {
                        ({
                            groups: { amount,payee,paymentService,balance }
                        } = regexiPaytmDebitCaseTwo.exec(message));
                        notificationType = 'personalMessage';
                    }

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'personalMessage':
                            channel = await this.channelService.findByType('PersonalMessages');
                            icon_url = 'https://scontent.famd4-1.fna.fbcdn.net/v/t1.6435-9/54433583_2270713066327585_4370000988841443328_n.png?_nc_cat=1&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=W0Ieb692IT4AX8CUYbE&_nc_ht=scontent.famd4-1.fna&oh=a0a5238fee7f8df4e8a50a37d3b659e4&oe=6193612B';
                            blocks = viewIpaytmPersonalMessage({amount,purpose,payee,paymentService,ref,balance,message});
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                case 'RZRPAY':
                    const regexRZRPAYFundTransfer = /(?<OTP>\d+).?is.*OTP.*INR.(?<amount>(\d+(.*\,\d{0,})?)).*from.*?account.*?(?<account>X*\d+)/m;
                    if (regexRZRPAYFundTransfer.test(message)) {
                        ({
                            groups: { amount,OTP,account }
                        } = regexRZRPAYFundTransfer.exec(message));
                        notificationType = 'fundTransfer';
                    }

                    console.log('notification type: ' + notificationType);

                    switch (notificationType) {
                        case 'fundTransfer':
                            channel = await this.channelService.findByType('fund-transfer-otp');
                            icon_url = 'https://imgr.search.brave.com/446wUCKeQiktuGH_F_Tb9oJaLyssn3S6TuSWLJKgsBY/fit/175/175/ce/1/aHR0cHM6Ly9pbnZv/aWNlLm5nL2Fzc2V0/cy9pbWFnZXMvbG9n/by9wYXJ0bmVycy9y/YXpvcnBheS5wbmc';
                            blocks = viewRzrpayFundTransfer({account,card,payee,amount,OTP});
                            break;
                        default:
                            channel = await this.channelService.findByType('Uncategorized');
                            break;
                    }
                    break;
                    case 'ARAVND':  
                    channel = await this.channelService.findByType('PersonalMessages');          
                    break;
                    
                    case 'TEST':
                    channel = await this.channelService.findByType('Test');
                    console.log('notification type: ' + notificationType);
                    break;
                default:
                    channelID = process.env.CHANNEL_ID_UNCATEGORIZED;
                    if(sender.length > 9){
                        //Undefined message
                        channel = await this.channelService.findByType('PersonalMessages');
                    }
                    console.log('notification type: ' + notificationType);
                    break;
            }

            //represent as join
            console.log("workspaceIdworkspaceIdworkspaceIdworkspaceId");
           
                //add a action block in blocks which will show a button to see the actual message modal
                var a = {sender,message}
                var btn =   {
                    "type": "actions",
                    "block_id": "actionblock789",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Show Original Mesasge ✉"
                            },
                            "style": "danger",
                            "value": JSON.stringify(a),
                            "action_id": "orignal_message_button"
                        },
                    ]
                }

                if(blocks ==undefined){
                    blocks =    [
                                    {
                                        "type": "section",
                                        "text": {
                                            "type": "plain_text",
                                            "text": message,
                                            "emoji": true
                                        }
                                    }
                                ]
                }
                blocks.push(btn);

                
                //POST A/C to SENDER ID TO PREVIOUS CHANNELS CONFIGURED

            if(channel && channel.length > 0){
                for(let oneChannel of channel){
                    if(oneChannel.workspaceId) {
                        workspace = await this.workspaceService.findById(oneChannel.workspaceId);     
                    } else {
                         await this.workspaceService.findByTeamId(process.env.DEFAULT_WORKSPACE_ID);
                    }
                    await this.slackService.postBlockMessage(
                        workspace.accessToken,
                        oneChannel.channelID,
                        message,
                        blocks,
                        icon_url,
                    );
                    let data = {
                        sender,
                        message,
                        forwardedFrom,
                        notificationType,
                        channelID:oneChannel.channelID,
                        blocks:JSON.stringify(blocks)
                    }
                    const text = await this.messageService.log(data);
                }
            }else{
                console.log("Channel Array is empty");
            }
            res.send('yay!');
        }
}