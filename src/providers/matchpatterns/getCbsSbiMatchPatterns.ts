import { viewCbssbiCredit } from 'src/providers/blocks';

export function getCbsSbiMatchPatterns() {
  const matchPatterns = [
    {
      regexPattern:
        /(?<account>A\/C.*?\d+).*credit.*?Rs (?<amount>(\d+(.*\,\d{0,})?)).*?Bal .*?(?<balance>(\d+(.*\,\d{0,})?))/m,
      patternName: 'regexCBSSBICreditCaseOne',
      channelType: 'service-alerts',
      iconUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png',
      groups: 'amount,account, balance',
      block: viewCbssbiCredit,
      notificationType: 'credit',
    },
  ];
}