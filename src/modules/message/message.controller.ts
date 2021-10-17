import { Controller, Post, Request } from '@nestjs/common';

@Controller('message')
export class MessageController {
    @Post()
    async message(@Request() req) {
        //ForwardedFrom is actually returned as Forwardedfrom
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
        let OTP, amount, account, payee, card, utr, limitConsumed, availableLimit, ref, balance;
        let channel, channelID, workspace;
        console.log('sender: ' + sender);
        // console.log('sender: ' + typeof(sender));
        switch (sender) {
            case 'SBIINB':
                const regexSBICreditCaseOne = /a\/c.no. (?<account>.*?X\d+).*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*to (?<payee>.*  )/m;
                const regexSBINetBankingFundTransfer = /.*?OTP.*?Rs. (?<amount>(\d+(.*\,\d{0,})?)).*?(?<account>\d+)\s+to\s+(?<payee>.*?)\s+is\s(?<OTP>\d+)/m;
                const regexSBINetBankingLogin = /.*OTP.*(?<OTP>\d{8}).*/m;
                const regexSBIINBTransaction = /txn.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?A\/c.(?<account>X\d+).*?to.?(?<payee>.*?[.]).*Ref.(?<utr>.*? )/m;

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
                        groups: { amount, account, payee }
                    } = regexSBICreditCaseOne.exec(message));
                    notificationType = 'credit';
                } else if (regexSBIINBTransaction.test(message)) {
                    ({
                        groups: { amount, account, payee, utr }
                    } = regexSBIINBTransaction.exec(message));
                    notificationType = 'transaction';
                }

                console.log('notification type: ' + notificationType);
                switch (notificationType) {
                    case 'login':
                        channel = await this.channelRepository.findByType('login-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "SBI Netbanking Login"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (card === undefined) ? "*SBI Internet banking*\n(Personal)" : "*SBI Card:*\n Ending " + card
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n " + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'fundTransfer':
                        channel = await this.channelRepository.findByType('fund-transfer-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Fund transfer / (NEFT/IMPS)"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined) ? "*Credit Card:*\n SBI - XXXX" + card : "*Account:*\n SBI - XXXX" + account
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount:*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'credit':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Credit Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined) ? "*SBI Card:*\n Ending with " + card : "*Account:*\n SBI - " + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount Credited:*\n₹" + amount
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'transaction':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Transaction Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined && card === undefined) ? " " : ((account === undefined) ? "*SBI Card:*\n Ending with " + card : "*Account:*\n SBI - " + account)

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount debited:*\n₹" + amount
                                    },
                                    //Need to work on Date group
                                    // ,{
                                    //     "type": "mrkdwn",
                                    //     "text": "*Date:*\n" + date
                                    // }
                                    {
                                        "type": "mrkdwn",
                                        "text": (utr === undefined) ? " " : "*UTR / REF:*\n" + utr
                                    }
                                ]
                            }
                        ]
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
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
                const regexSBINEFTTransactionCaseTwo = /NEFT.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)/m;
                const regexSBICRDTransaction = /txn.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?A\/c.(?<account>X\d+).*?to.?(?<payee>.*?[.]).*Ref.(?<utr>.*? )/m;
                const regexSBICreditCaseTwo = /Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?ending.(?<card>XX\d+)/m;
                const regexSBICreditCaseThree = /Rs. (?<amount>(\d+(.*\,\d{0,})?)).*?credited.*?Card.(?<card>xxxx\d+).*?from.(?<payee>.*  )/m;
                const regexSBICardLimit = /consumed.*?(?<limitConsumed>\d.*?%).*?credit.*limit.*available.*?(?<availableLimit>(\d+(.*\,\d{0,})?))/m;
                const regexCardPINDelivery = /.*?PIN of your SBI Card.*?delivered/m;

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
                    if ((card == 65 || card == 89) && (cloudPayeeAWS || cloudPayeeIBM) && (amount == 2.00 || amount == 1.00)) {
                        notificationType = 'devopsCloud';
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
                        groups: { card, amount, payee }
                    } = regexSBICardTransaction.exec(message));
                    notificationType = 'transaction';
                } else if (regexSBINEFTTransaction.test(message)) {
                    ({
                        groups: { account, amount, payee, utr }
                    } = regexSBINEFTTransaction.exec(message));
                    notificationType = 'transaction';
                } else if (regexSBINEFTTransactionCaseTwo.test(message)) {
                    ({
                        groups: { amount, payee, utr }
                    } = regexSBINEFTTransactionCaseTwo.exec(message));
                    notificationType = 'transaction';
                } else if (regexSBICRDTransaction.test(message)) {
                    ({
                        groups: { amount, account, payee, utr }
                    } = regexSBICRDTransaction.exec(message));
                    notificationType = 'transaction';
                } else if (regexSBICreditCaseTwo.test(message)) {
                    ({
                        groups: { amount, card }
                    } = regexSBICreditCaseTwo.exec(message));
                    notificationType = 'credit';
                } else if (regexSBICreditCaseThree.test(message)) {
                    ({
                        groups: { amount, card, payee }
                    } = regexSBICreditCaseThree.exec(message));
                    notificationType = 'credit';
                } else if (regexSBICardLimit.test(message)) {
                    ({
                        groups: { limitConsumed, availableLimit }
                    } = regexSBICardLimit.exec(message));
                    notificationType = 'limit';
                } else if (regexSBICardTransactionCaseTwo.test(message)) {
                    ({
                        groups: { amount, card, payee }
                    } = regexSBICardTransactionCaseTwo.exec(message));
                    notificationType = 'transaction';
                } else if (regexSBICardTransactionCaseThree.test(message)) {
                    ({
                        groups: { amount, card, payee }
                    } = regexSBICardTransactionCaseThree.exec(message));
                    notificationType = 'transaction';
                } else if (regexCardPINDelivery.test(message)) {
                    notificationType = 'package-delivery';
                }

                //Custom Payee : Udemy to route to diff channel
                if (payee && payee.toLowerCase().includes('udemy') && OTP != undefined) {
                    notificationType = 'udemyOTP';
                }

                console.log('notification type: ' + notificationType);

                switch (notificationType) {
                    case 'login':
                        channel = await this.channelRepository.findByType('login-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "SBI Netbanking Login"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (card === undefined) ? "*SBI Internet banking*\n(Personal)" : "*SBI Card:*\n Ending " + card
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n " + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'cardLogin':
                        channel = await this.channelRepository.findByType('login-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "SBI Login"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (card === undefined) ? "*SBI Card *" : "*SBI Card:*\n Ending " + card
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n " + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'fundTransfer':
                        channel = await this.channelRepository.findByType('fund-transfer-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Fund transfer / (NEFT/IMPS)"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined) ? "*Credit Card:*\n SBI - XXXX" + card : "*Account:*\n SBI - XXXX" + account
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount:*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            }

                        ]
                        break;
                    case 'cardFundTransfer':
                        channel = await this.channelRepository.findByType('fund-transfer-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Fund transfer / (NEFT/IMPS)"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined) ? "*Credit Card:*\n SBI - XXXX" + card : "*Account:*\n SBI - XXXX" + account
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount:*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'credit':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Credit Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined) ? "*SBI Card:*\n Ending with " + card : "*Account:*\n SBI - " + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount Credited:*\n₹" + amount
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'devopsCloud':
                        channel = await this.channelRepository.findByType('DevopsAws');
                        channelID = channel.channelID;
                        if (cloudPayeeAWS) {
                            icon_url = 'https://res.cloudinary.com/wagon/image/upload/v1585091640/ntgefujscihnprq2a9bb.png';
                        } else if (cloudPayeeIBM) {
                            icon_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Ibkkrv62fZeInzvJP5WTRrKXXzWd0M9elnbVH0tG-gCsf5X8f0WOiEW1sJEgYN5xiS4&usqp=CAU';
                        }

                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": (cloudPayeeAWS) ? "AWS Account Sign-up" : "IBM Account Sign-up"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined) ? "*Credit Card:*\n SBI - XXXX" + card : "*Account:*\n SBI - XXXX" + account
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP : *\n" + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'transaction':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Transaction Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined && card === undefined) ? " " : ((account === undefined) ? "*SBI Card:*\n Ending with " + card : "*Account:*\n SBI - " + account)

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": amount.includes('USD') ? "*Amount debited:*\n$" + amount.split('USD')[1] : amount.includes('Rs.') ? "*Amount debited:*\n₹" + amount.split('Rs.')[1] : "*Amount debited:*\n₹" + amount
                                    },
                                    //Need to work on Date group
                                    // ,{
                                    //     "type": "mrkdwn",
                                    //     "text": "*Date:*\n" + date
                                    // }
                                    {
                                        "type": "mrkdwn",
                                        "text": (utr === undefined) ? " " : "*UTR / REF:*\n" + utr
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'limit':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Card Limit Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*SBI Card Limit Consumed :*\n " + limitConsumed

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Current available limit :*\n₹ " + availableLimit
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'udemyOTP':
                        channel = await this.channelRepository.findByType('udemy-new-course-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://media.glassdoor.com/sql/434871/udemy-squareLogo-1627922062697.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Udemy™"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount:*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'package-delivery':
                        channel = await this.channelRepository.findByType('Package-delivery');
                        channelID = channel.channelID;
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
                        break;
                }
                break;
            case 'ICICIB':
                const regexICICIBankingFundTransfer = /(?<OTP>\d+).?is.*?OTP.*INR.(?<amount>(\d+(.*\,\d{0,})?)).*?.(?<account>(Acct|Card).*?XX\d+).*?to.(?<payee>.*?[.])/m;
                const regexICICIBankingFundTransferCaseTwo = /(?<OTP>\d+).?is.*?OTP.*(?<account>(Acct|Card).*?XX\d+)/m;
                const regexICICIBankingFundTransferCaseThree = /(?<OTP>\d+).?is.*?OTP.*(Rs|INR).(?<amount>(\d+(.*\,\d{0,})?))/m;
                const regexICICIBankingCreditCaseOne = /(?<account>Account.*?\d+).*credited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*?Info:(?<ref>.*?[.]).*?Balance is.*?(?<balance>(\d+(\,\d.*[^.])))/m;
                const regexICICIBankingCreditCaseTwo = /Rs.*?(?<amount>(\d+(.*\,\d{0,})?)).*credited.*?account.(?<account>.*?\d+).*?Bal.*?Rs.(?<balance>(\d+(.*\,\d{0,})?))/m;
                const regexICICIBTransactionCaseOne = /(?<account>Acc.*?\d+).*debited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*?Info:(?<ref>.*?[.]).*?Balance is.*?(?<balance>(\d+(.*\,\d{0,})?))/m;
                const regexICICIBTransactionCaseTwo = /(?<account>Acct.*?\d+).*debited.*?INR.(?<amount>(\d+(.*\,\d{0,})?))/m;
                const regexICICIBTransactionCaseThree = /INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?debited.*?(?<account>(Acct|Card).*?XX\d+).*?Info:(?<ref>.*?[.]).*?Available Limit.*?(?<balance>(\d+(.*\,\d{0,})?))/m;
                const regexICICIBTransactionCaseFour = /(?<account>(Acct|Account).*?\d+).*debited.*?Rs.(?<amount>(\d+(.*\,\d{0,})?))/m;
                const regexICICIBTransactionCaseFive = /INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?done.*?(?<account>(Acc|Card).*?XX\d+).*?Info:(?<ref>.*?[.]).*?Available Balance.*?(?<balance>(\d+(.*\,\d{0,})?))/m;
                const regexICICIBankingCreditCaseThree = /Payment.*?INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?Account.*?(?<account>xxx.*?\d+)/m;
                const regexICICIBankingCreditCaseFour = /(?<account>Acct.*?\d+).*credited.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?by (?<ref>.*?\d+)/m;

                const regexICICIBCorpBanking = /(?<OTP>\d+).*?is.*?OTP.*?Corporate Internet Banking/m;
                if (regexICICIBankingFundTransfer.test(message)) {
                    ({
                        groups: { account, amount, payee, OTP }
                    } = regexICICIBankingFundTransfer.exec(message));
                    notificationType = 'fundTransfer';
                } else if (regexICICIBankingFundTransferCaseTwo.test(message)) {
                    ({
                        groups: { account, OTP }
                    } = regexICICIBankingFundTransferCaseTwo.exec(message));
                    notificationType = 'fundTransfer';
                } else if (regexICICIBankingFundTransferCaseThree.test(message)) {
                    ({
                        groups: { amount, OTP }
                    } = regexICICIBankingFundTransferCaseThree.exec(message));
                    notificationType = 'fundTransfer';
                } else if (regexICICIBankingCreditCaseOne.test(message)) {
                    ({
                        groups: { amount, account, ref, balance }
                    } = regexICICIBankingCreditCaseOne.exec(message));
                    notificationType = 'credit';
                } else if (regexICICIBankingCreditCaseTwo.test(message)) {
                    ({
                        groups: { amount, account, balance }
                    } = regexICICIBankingCreditCaseTwo.exec(message));
                    notificationType = 'credit';
                } else if (regexICICIBTransactionCaseOne.test(message)) {
                    ({
                        groups: { amount, account, balance, ref }
                    } = regexICICIBTransactionCaseOne.exec(message));
                    notificationType = 'transaction';
                } else if (regexICICIBTransactionCaseTwo.test(message)) {
                    ({
                        groups: { amount, account }
                    } = regexICICIBTransactionCaseTwo.exec(message));
                    notificationType = 'transaction';
                } else if (regexICICIBTransactionCaseThree.test(message)) {
                    ({
                        groups: { amount, account, ref, balance }
                    } = regexICICIBTransactionCaseThree.exec(message));
                    notificationType = 'transaction';
                } else if (regexICICIBCorpBanking.test(message)) {
                    ({
                        groups: { OTP }
                    } = regexICICIBCorpBanking.exec(message));
                    notificationType = 'CorpLogin';
                } else if (regexICICIBTransactionCaseFour.test(message)) {
                    ({
                        groups: { account, amount }
                    } = regexICICIBTransactionCaseFour.exec(message));
                    notificationType = 'transaction';
                } else if (regexICICIBTransactionCaseFive.test(message)) {
                    ({
                        groups: { amount, account, balance, ref }
                    } = regexICICIBTransactionCaseFive.exec(message));
                    notificationType = 'transaction';
                } else if (regexICICIBankingCreditCaseThree.test(message)) {
                    ({
                        groups: { amount, account }
                    } = regexICICIBankingCreditCaseThree.exec(message));
                    notificationType = 'credit';
                } else if (regexICICIBankingCreditCaseFour.test(message)) {
                    ({
                        groups: { amount, account, ref }
                    } = regexICICIBankingCreditCaseFour.exec(message));
                    notificationType = 'credit';
                }

                if (account != undefined && (account.slice(-4) == "7003" || account.slice(-3) == "431")) {
                    notificationType = "personalMessage";
                }

                console.log('notification type: ' + notificationType);

                switch (notificationType) {
                    case 'fundTransfer':
                        channel = await this.channelRepository.findByType('fund-transfer-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Fund transfer / (NEFT/IMPS)"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account == undefined) ? " " : "*ICICI Bank :*\n " + account
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (amount === undefined) ? " " : "*Amount:*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'credit':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Credit Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*ICICI Bank :*\n " + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (ref === undefined) ? " " : "*REF:*\n" + ref
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount Credited :*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (balance === undefined) ? " " : "*Available Balance :*\n₹" + balance
                                    },
                                ]
                            }
                        ]
                        break;
                    case 'transaction':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Transaction Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*ICICI Bank :*\n" + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount debited :*\n₹" + amount
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (ref === undefined) ? " " : "*Payee:*\n" + ref
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (balance === undefined) ? " " : "*Available Balance :*\n₹" + balance
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'personalMessage':
                        channel = await this.channelRepository.findByType('PersonalMessages');
                        channelID = channel.channelID;
                        icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": (message.includes('credited')) ? "Credit Alert" : "Transaction Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*ICICI Bank :*\n" + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (message.includes('credited')) ? (amount == undefined) ? " " : "*Amount Credited :*\n₹" + amount : (amount == undefined) ? " " : "*Amount debited :*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (OTP === undefined) ? " " : "*OTP:*\n" + OTP
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (ref === undefined) ? " " : "*Payee:*\n" + ref
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (balance === undefined) ? " " : "*Available Balance :*\n₹" + balance
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'CorpLogin':
                        channel = await this.channelRepository.findByType('login-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "ICICI Bank Corporate Internet Banking"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP :*\n" + OTP

                                    }
                                ]
                            }
                        ]
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
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
                        groups: { amount, account, ref, balance }
                    } = regexAxisBkCreditCaseOne.exec(message));
                    notificationType = 'credit';
                }
                else if (regexAxisBkTransactionCaseOne.test(message)) {
                    ({
                        groups: { amount, account, ref, balance }
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
                        channel = await this.channelRepository.findByType('fund-transfer-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Fund transfer / (NEFT/IMPS)"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Axis Bank :*\n " + account
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (amount === undefined) ? " " : "*Amount:*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'beneficiary':
                        channel = await this.channelRepository.findByType('payee-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Beneficiary"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Axis Beneficiary to Add :*\n " + account
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'credit':
                        if (account.slice(-4) == "2879") {
                            channel = await this.channelRepository.findByType('PersonalMessages');
                            channelID = channel.channelID;
                        } else {
                            channel = await this.channelRepository.findByType('service-alerts');
                            channelID = channel.channelID;
                        }

                        icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Credit Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Axis Bank :*\n " + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (ref === undefined) ? " " : "*REF:*\n" + ref
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount Credited :*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Available Balance :*\n₹" + balance
                                    },
                                ]
                            }
                        ]
                        break;
                    case 'transaction':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Transaction Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Axis Bank :*\n " + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (ref === undefined) ? " " : "*REF:*\n" + ref
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount Credited :*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Available Balance :*\n₹" + balance
                                    },
                                ]
                            }
                        ]
                        break;
                    case 'balance':
                        channel = await this.channelRepository.findByType('BalanceAlert');
                        channelID = channel.channelID;
                        icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Transaction Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Axis Bank :*\n " + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Available Balance :*\n₹" + balance
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'personalMessage':
                        channel = await this.channelRepository.findByType('PersonalMessages');
                        channelID = channel.channelID;
                        icon_url = 'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png';
                        // Yet to add any Block Message for personal Axis Card
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
                        break;
                }
                break;
            case 'SBIPSG':
                const regexSBIPSGCreditCaseOne = /INR.(?<amount>(\d+(.*\,\d{0,})?)).*credited.*?(?<account>A\/c.*?\d+).*?by (?<payee>.*,)/m;
                const regexSBIPSGTransaction = /A\/c.(?<account>XX\d+).*?debited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)/m;
                const regexSBIPSGTransactionCaseTwo = /NEFT.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)at/m;
                if (regexSBIPSGCreditCaseOne.test(message)) {
                    ({
                        groups: { amount, account, payee }
                    } = regexSBIPSGCreditCaseOne.exec(message));
                    notificationType = 'credit';
                } else if (regexSBIPSGTransaction.test(message)) {
                    ({
                        groups: { account, amount, payee, utr }
                    } = regexSBIPSGTransaction.exec(message));
                    notificationType = 'transaction';
                } else if (regexSBIPSGTransactionCaseTwo.test(message)) {
                    ({
                        groups: { amount, payee, utr }
                    } = regexSBIPSGTransactionCaseTwo.exec(message));
                    notificationType = 'transaction';
                }

                console.log('notification type: ' + notificationType);

                switch (notificationType) {
                    case 'credit':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Credit Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined) ? "*SBI Card:*\n Ending with " + card : "*Account:*\n SBI - " + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount Credited:*\n₹" + amount
                                    }
                                ]
                            }
                        ]
                        break;
                    case 'transaction':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Transaction Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined && card === undefined) ? " " : ((account === undefined) ? "*SBI Card:*\n Ending with " + card : "*Account:*\n SBI - " + account)

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": amount.includes('USD') ? "*Amount debited:*\n$" + amount.split('USD')[1] : amount.includes('Rs.') ? "*Amount debited:*\n₹" + amount.split('Rs.')[1] : "*Amount debited:*\n₹" + amount
                                    },
                                    //Need to work on Date group
                                    // ,{
                                    //     "type": "mrkdwn",
                                    //     "text": "*Date:*\n" + date
                                    // }
                                    {
                                        "type": "mrkdwn",
                                        "text": (utr === undefined) ? " " : "*UTR / REF:*\n" + utr
                                    }
                                ]
                            }
                        ]
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
                        break;
                }
                break;
            case 'CBSSBI':
                const regexCBSSBICreditCaseOne = /(?<account>A\/C.*?\d+).*credit.*?Rs (?<amount>(\d+(.*\,\d{0,})?)).*?Bal .*?(?<balance>(\d+(.*\,\d{0,})?))/m;
                if (regexCBSSBICreditCaseOne.test(message)) {
                    ({
                        groups: { amount, account, balance }
                    } = regexCBSSBICreditCaseOne.exec(message));
                    notificationType = 'credit';
                }

                console.log('notification type: ' + notificationType);

                switch (notificationType) {
                    case 'credit':
                        channel = await this.channelRepository.findByType('service-alerts');
                        channelID = channel.channelID;
                        icon_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Credit Alert"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": (account === undefined) ? "*SBI Card:*\n Ending with " + card : "*Account:*\n SBI - " + account

                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (payee === undefined) ? " " : "*Payee:*\n" + payee
                                    }
                                ]
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*Amount Credited:*\n₹" + amount
                                    },
                                    {
                                        "type": "mrkdwn",
                                        "text": (balance === undefined) ? " " : "*Available Balance :*\n₹" + balance
                                    }
                                ]
                            }
                        ]
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
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
                        channel = await this.channelRepository.findByType('fund-transfer-otp');
                        channelID = channel.channelID;
                        icon_url = 'https://media-exp1.licdn.com/dms/image/C560BAQHeKdeWlnZYRw/company-logo_200_200/0/1519882729303?e=2159024400&v=beta&t=9ztSYDXwdEN3djuaWApSyPafuPaxTDcVQQEOSR9XvjQ';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Worknhire"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
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
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
                        icon_url = 'https://www.fintechfutures.com/files/2016/03/payoneer.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Payoneer"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
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
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
                        icon_url = 'https://images.saasworthy.com/tr:w-150,h-0/cashfree_1995_logo_1597819642_ojxbr.png';
                        blocks = [
                            {
                                "type": "header",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Cashfree"
                                }
                            },
                            {
                                "type": "section",
                                "fields": [
                                    {
                                        "type": "mrkdwn",
                                        "text": "*OTP:*\n" + OTP
                                    }
                                ]
                            }
                        ]
                        break;
                    default:
                        channel = await this.channelRepository.findByType('Uncategorized');
                        channelID = channel.channelID;
                        break;
                }
                break;
            case 'TEST':
                channel = await this.channelRepository.findByType('Test');
                channelID = channel.channelID;
                console.log('notification type: ' + notificationType);
                break;
            default:
                channelID = uncategorizedChannel;
                if (sender.length > 9) {
                    //Undefined message
                    channel = await this.channelRepository.findByType('PersonalMessages');
                    channelID = channel.channelID;
                }
                console.log('notification type: ' + notificationType);
                break;
        }

        //represent as join
        if (channel && channel.workspaceId) {
            workspace = await this.workspaceRepository.findById(channel.workspaceId);
        } else {
            workspace = await this.workspaceRepository.findByTeamId(process.env.DEFAULT_WORKSPACE_ID);
        }

        try {

            //add a action block in blocks which will show a button to see the actual message modal
            var a = { sender, message }
            var btn = {
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
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Subscribe 📲",
                            "emoji": true
                        },
                        "style": "primary",
                        "value": 'blank',
                        "action_id": "whatsapp_sub_button"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Unsubscribe 📲",
                            "emoji": true
                        },
                        "style": "danger",
                        "value": 'blank',
                        "action_id": "whatsapp_unsub_button"
                    }
                ]
            }

            if (blocks == undefined) {
                blocks = [
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
            await this.slackService.postBlockMessage(
                workspace.accessToken,
                channelID,
                message,
                blocks,
                icon_url,
            );

            //Log Messages to Database
            let data = {
                sender,
                message,
                forwardedFrom,
                notificationType,
                channelID,
                blocks: JSON.stringify(blocks)
            }
            const text = await this.messageRepository.log(data);

            //CREATE A LIST OF SUBSCRIBERS FOR PREVIOUS CHANNEL IDS
            var activeSubscribers = await this.whatsAppRepository.channelSubscribers(channelID);

            //Post messages to whatsapp subscribers--------------------
            if (activeSubscribers.length > 0) {
                //Iterating over the list of subscribers for this channel
                for (let i = 0; i < activeSubscribers.length; i++) {
                    this.messageService.sendAlerts(
                        activeSubscribers[i]['fullname'],
                        activeSubscribers[i]['whatsappnum'],
                        activeSubscribers[i]['channelname'],
                        sender, card, account, OTP, amount,
                        payee, utr, limitConsumed, availableLimit,
                        balance, ref, notificationType
                    );

                    console.log('\x1b[36m%s\x1b[0m', `Posted alerts to Subscirber:${activeSubscribers[i]['fullname']} | To:${activeSubscribers[i]['whatsappnum']} | For:#${activeSubscribers[i]['channelname']}`);

                }

            } else {
                console.log(`No subscribers for ${channelID} channel.`);
            }

        }
        catch (error) {
            console.error(error);
        }
        res.send('yay!');
    }
}
