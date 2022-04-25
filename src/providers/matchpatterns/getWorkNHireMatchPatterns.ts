import {viewWorknhireFundTransfer} from 'src/providers/blocks';

export function getWorkNHireMatchPatterns(){
    const matchPatterns =[
       {
         regexPattern:/(?<OTP>\d+).?is.*?OTP/m,
         patternName:"regexWorknhireFundTransfer",
         channelType:"fund-transfer-otp",
         iconUrl:'https://media-exp1.licdn.com/dms/image/C560BAQHeKdeWlnZYRw/company-logo_200_200/0/1519882729303?e=2159024400&v=beta&t=9ztSYDXwdEN3djuaWApSyPafuPaxTDcVQQEOSR9XvjQ',
         groups:"OTP",
         block:viewWorknhireFundTransfer,
         notificationType:"fundTransfer"  
       },
   ]
   return matchPatterns;
} 
