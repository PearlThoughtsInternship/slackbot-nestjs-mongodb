import { view57575701Uncategorized } from 'src/providers/blocks';

export function getPayoneerMatchPatterns() {
  const matchPatterns = [
    {
      regexPattern: /(?<OTP>\d+).?is.*?verification.*? code/m,
      patternName: 'regexPayoneerFundTransfer',
      channelType: 'Uncategorized',
      iconUrl: 'https://www.fintechfutures.com/files/2016/03/payoneer.png',
      groups: 'OTP',
      block: view57575701Uncategorized,
      notificationType: 'Uncategorized',
    },
  ];
  return matchPatterns;
}