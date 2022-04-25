import {viewCshfreUncategorized} from 'src/providers/blocks';

export function getCashfreeMatchPatterns(){
    const matchPatterns = [
       {
         regexPattern:/OTP.*?is.(?<OTP>\d+)/m,
         patternName:"regexCashfreeFundTransfer",
         channelType:"Uncategorized",
         iconUrl:'https://images.saasworthy.com/tr:w-150,h-0/cashfree_1995_logo_1597819642_ojxbr.png',
         groups:"OTP",
         block:viewCshfreUncategorized,
         notificationType:"Uncategorized"  
       },
   ]
   return matchPatterns;
}