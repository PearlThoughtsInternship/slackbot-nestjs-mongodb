import {
    viewAxisbkBalance,
    viewAxisbkBeneficiary,
    viewAxisbkCredit,
    viewAxisbkFundTransfer,
    viewAxisbkTransaction,
  } from 'src/providers/blocks';
  
  export function getAxisBkMatchPatterns() {
    const matchPatterns = [
      {
        regexPattern:
          /(?<OTP>\d+).?is.*?OTP.*?.(?<account>(A\/c).*?XX\d+).*?to.*?(?<payee>(A\/c).*?XX\d+).*INR.(?<amount>(\d+(.*\,\d{0,})?))/m,
        patternName: 'regexAxisBkFundTransfer',
        channelType: 'fund-transfer-otp',
        iconUrl:
          'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png',
        groups: 'account,amount,payee,OTP',
        block: viewAxisbkFundTransfer,
        notificationType: 'fundTransfer',
      },
      {
        regexPattern: /(?<OTP>\d+).?is.*?OTP.*?adding.(?<account>.*?).as/m,
        patternName: 'regexAxisBkBeneficiary',
        channelType: 'payee-otp',
        iconUrl:
          'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png',
        groups: 'account, OTP',
        block: viewAxisbkBeneficiary,
        notificationType: 'beneficiary',
      },
      {
        regexPattern:
          /INR.(?<amount>(\d+(.*\,\d{0,})?)).*?credited.*?(?<account>A\/c.*?\d+).*?Info(:|-) (?<ref>.*?[.]).*?Bal(:|-).*?INR.(?<balance>(\d+(.*\,\d{0,})?))/m,
        patternName: 'regexAxisBkCreditCaseOne',
        channelType: ['PersonalMessages', 'service-alerts'],
        iconUrl:
          'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png',
        groups: 'amount,account, ref , balance',
        block: viewAxisbkCredit,
        notificationType: 'credit',
      },
      {
        regexPattern:
          /INR.(?<amount>(\d+(.*\,\d{0,})?)).*?debited.*?(?<account>A\/c.*?\d+).*?at.(?<ref>.*?[.]).*?Bal.*?INR.(?<balance>(\d+(.*\,\d{0,})?))/m,
        patternName: 'regexAxisBkTransactionCaseOne',
        channelType: 'service-alert',
        iconUrl:
          'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png',
        groups: 'amount,account,ref, balance',
        block: viewAxisbkTransaction,
        notificationType: 'transaction',
      },
      {
        regexPattern:
          /balance.*?(?<account>a\/c.*?\d+).*?Rs.(?<balance>(\d+(.*\,\d{0,})?))/m,
        patternName: 'regexAxisBkBalance',
        channelType: 'BalanceAlert',
        iconUrl:
          'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png',
        groups: 'account, balance',
        block: viewAxisbkBalance,
        notificationType: 'balance',
      },
      {
        regexPattern: /4489/m,
        patternName: 'regexAxisBkCardPersonal',
        channelType: 'PersonalMessages',
        iconUrl:
          'https://www.searchpng.com/wp-content/uploads/2019/01/Axis-Bank-PNG-Logo--715x715.png',
        groups: '',
        block: null,
        notificationType: 'personalMessage',
      },
    ];
    return matchPatterns;
  }