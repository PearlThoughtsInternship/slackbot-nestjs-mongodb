import {viewRzrpayFundTransfer} from 'src/providers/blocks';

export function getRazorPayMatchPatterns(){
    const matchPatterns = [
        {
          regexPattern:/(?<OTP>\d+).?is.*OTP.*INR.(?<amount>(\d+(.*\,\d{0,})?)).*from.*?account.*?(?<account>X*\d+)/m,
          patternName:"regexRZRPAYFundTransfer",
          channelType:"fund-transfer-otp",
          iconUrl:'https://imgr.search.brave.com/446wUCKeQiktuGH_F_Tb9oJaLyssn3S6TuSWLJKgsBY/fit/175/175/ce/1/aHR0cHM6Ly9pbnZv/aWNlLm5nL2Fzc2V0/cy9pbWFnZXMvbG9n/by9wYXJ0bmVycy9y/YXpvcnBheS5wbmc',
          groups:"amount,OTP,account",
          block:viewRzrpayFundTransfer,
          notificationType:"fundTransfer"  
        },
    ]    
   return matchPatterns;
}
