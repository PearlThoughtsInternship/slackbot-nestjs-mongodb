import { viewSbipsgTransaction, viewSbipsgCredit } from 'src/providers/blocks';

export function getSbiPsgMatchPatterns() {
  const matchPatterns = [
    {
      regexPattern:
        /INR.(?<amount>(\d+(.*\,\d{0,})?)).*credited.*?(?<account>A\/c.*?\d+).*?by (?<payee>.*,)/m,
      patternName: 'regexSBIPSGCreditCaseOne',
      channelType: 'service-alerts',
      iconUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png',
      groups: 'amount,account, payee',
      block: viewSbipsgCredit,
      notificationType: 'credit',
    },
    {
      regexPattern:
        /A\/c.(?<account>XX\d+).*?debited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)/m,
      patternName: 'regexSBIPSGTransaction',
      channelType: "'service-alerts'",
      iconUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png',
      groups: 'account, amount, payee, utr',
      block: viewSbipsgTransaction,
      notificationType: 'transaction',
    },
    {
      regexPattern:
        /NEFT.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*UTR.(?<utr>.*? ).*?to.?(?<payee>.*)at/m,
      patternName: 'regexSBIPSGTransactionCaseTwo',
      channelType: "'service-alerts'",
      iconUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png',
      groups: 'amount, payee, utr',
      block: viewSbipsgTransaction,
      notificationType: 'transaction',
    },
  ];
  return matchPatterns;
}
