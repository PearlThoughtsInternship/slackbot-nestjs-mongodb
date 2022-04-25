import {viewIpaytmPersonalMessage} from 'src/providers/blocks';

export function getIPaytmMatchPatterns(){
    const matchPatterns = [
       {
         regexPattern:/Paid.?.(?<amount>(Rs |INR |USD )(\d+(.*\,\d{0,})?)).*?.for.(?<purpose>.*?.+?(?=on)).*?.TxnId:(?<ref>.*?[.]).*?Bal.*?.(?<balance>(Rs |INR )(\d+(.*\,\d{0,})?))/m,
         patternName:"regexiPaytmDebitCaseOne",
         channelType:"PersonalMessages",
         iconUrl:'https://scontent.famd4-1.fna.fbcdn.net/v/t1.6435-9/54433583_2270713066327585_4370000988841443328_n.png?_nc_cat=1&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=W0Ieb692IT4AX8CUYbE&_nc_ht=scontent.famd4-1.fna&oh=a0a5238fee7f8df4e8a50a37d3b659e4&oe=6193612B',
         groups:"amount,purpose,ref,balance,message",
         block:viewIpaytmPersonalMessage,
         notificationType:"personalMessage"  
       },
   ]
   return matchPatterns;
}
