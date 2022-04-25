import {
    viewSbicrdLogin,
    viewSbicrdFundTransfer,
    viewSbicrdCredit,
    viewSbicrdTransaction,
    viewSbicrdDevopsCloud,
    viewSbicrdLimit,
    viewSbicrdUdemyOtp,
    viewSbicrdCardFundTransfer,
    viewSbicrdCardLogin,
  } from 'src/providers/blocks';
  
  export function getSbiCrdMatchPatterns() {
    const matchpatterns = [
      {
        regexPattern:
          /.*?OTP.*?Rs. (?<amount>(\d+(\.\d{0,2})?)) .*?(?<account>\d+)\s+to\s+(?<payee>.*?)\s+is\s(?<OTP>\d+)/m,
        patternName: 'regexSBICardFundTransfer',
        channelType: 'fund-transfer-otp',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'account, amount, payee, OTP',
        block: viewSbicrdFundTransfer,
        notificationType: 'fundTransfer',
      },
      {
        regexPattern:
          /(?<OTP>\d+).?is.OTP.*Rs. (?<amount>(\d+(.*\,\d{0,})?)).*at (?<payee>.+?)with.*Card ending (?<card>\d+)/m,
        patternName: 'regexSBICreditCardTransfer',
        channelType: 'fund-transfer-otp',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'card, amount, payee, OTP ',
        block: viewSbicrdCardFundTransfer,
        notificationType: 'cardFundTransfer',
      },
      {
        regexPattern: /Card.*(?<card>XX\d+).*is.(?<OTP>\d{6,})/m,
        patternName: 'regexSBICardLogin',
        channelType: 'login-otp',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'card, OTP',
        block: viewSbicrdCardLogin,
        notificationType: 'cardLogin',
      },
      {
        regexPattern: /OTP.*?login.*?is.(?<OTP>\d{6,})/m,
        patternName: 'regexSBICardLoginCaseTwo',
        channelType: 'login-otp',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'OTP',
        block: viewSbicrdCardLogin,
        notificationType: 'cardLogin',
      },
      {
        regexPattern:
          /Rs.(?<amount>(\d+(.*\,\d{0,})?)).*with.(?<card>\d+).*?at (?<payee>.+?)on.(?<date>)/m,
        patternName: 'regexSBICardTransaction',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'card, amount, payee',
        block: viewSbicrdTransaction,
        notificationType: 'transaction',
      },
      {
        regexPattern:
          /Trxn.*?(?<amount>(Rs.|USD)(\d+(.*\,\d{0,})?)).*?SBI Card.*?(?<card>\d+).*at (?<payee>.+)( on)/m,
        patternName: 'regexSBICardTransactionCaseTwo',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'amount, card,payee',
        block: viewSbicrdTransaction,
        notificationType: 'transaction',
      },
      {
        regexPattern:
          /(?<amount>(Rs.|USD)(\d+(.*\,\d{0,})?)).*?spent.*?SBI Card.*?(?<card>\d+).*at (?<payee>.+)( on)/m,
        patternName: 'regexSBICardTransactionCaseThree',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'amount, card,payee',
        block: viewSbicrdTransaction,
        notificationType: 'transaction',
      },
      {
        regexPattern: /.*OTP.*(?<OTP>\d{8}).*/m,
        patternName: 'regexSBINEFTTransaction',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'account, amount, payee, utr ',
        block: viewSbicrdTransaction,
        notificationType: 'transaction',
      },
      {
        regexPattern:
          /NEFT.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)/m,
        patternName: 'regexSBINEFTTransactionCaseTwo',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'amount, payee, utr ',
        block: viewSbicrdTransaction,
        notificationType: 'transaction',
      },
      {
        regexPattern:
          /txn.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?A\/c.(?<account>X\d+).*?to.?(?<payee>.*?[.]).*Ref.(?<utr>.*? )/m,
        patternName: 'regexSBICRDTransaction',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'amount,account, payee, utr ',
        block: viewSbicrdTransaction,
        notificationType: 'transaction',
      },
      {
        regexPattern: /Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?ending.(?<card>XX\d+)/m,
        patternName: 'regexSBICreditCaseTwo',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'amount,card',
        block: viewSbicrdCredit,
        notificationType: 'credit',
      },
      {
        regexPattern:
          /Rs. (?<amount>(\d+(.*\,\d{0,})?)).*?credited.*?Card.(?<card>xxxx\d+).*?from.(?<payee>.*  )/m,
        patternName: 'regexSBICreditCaseThree',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'amount,card ,payee',
        block: viewSbicrdCredit,
        notificationType: 'credit',
      },
      {
        regexPattern:
          /consumed.*?(?<limitConsumed>\d.*?%).*?credit.*limit.*available.*?(?<availableLimit>(\d+(.*\,\d{0,})?))/m,
        patternName: 'regexSBICardLimit',
        channelType: 'service-alerts',
        iconUrl:
          'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups: 'limitConsumed, availableLimit',
        block: viewSbicrdLimit,
        notificationType: 'limit',
      },
      {
        regexPattern: /.*?PIN of your SBI Card.*?delivered/m,
        patternName: 'regexCardPINDelivery',
        channelType: 'Package-delivery',
        notificationType: "package-delivery';",
      },
    ];
    return matchpatterns;
  }