import {
    viewSbiinbLogin, viewSbiinbFundTransfer, viewSbiinbCredit, viewSbiinbTransaction
} from 'src/providers/blocks'; 

export function getSbiIndMatchPatterns() {
    const matchpatterns=[
        {
        regexPattern:/a\/c.no. (?<account>.*?X\d+).*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*to (?<payee>.*  )/m,
        patternName:"regexSBICreditCaseOne",
        channelType:"service-alerts",
        iconUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png',
        groups:"amount,account, payee",      
        block:viewSbiinbCredit,
        notificationType:"credit"
        },
        {
        regexPattern: /.*?OTP.*?Rs. (?<amount>(\d+(.*\,\d{0,})?)).*?(?<account>\d+)\s+to\s+(?<payee>.*?)\s+is\s(?<OTP>\d+)/m,
        patternName:"regexSBINetBankingFundTransfer",
        channelType:"fund-transfer-otp",
        iconUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png',
        groups:"account, amount, payee, OTP",
        block:viewSbiinbFundTransfer,
        notificationType:"fundTransfer"
        },
        {
        regexPattern:/.*OTP.*(?<OTP>\d{8}).*/m,
        patternName:"regexSBINetBankingLogin",
        channelType:"login-otp",
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png',
        groups:"OTP",
        block:viewSbiinbLogin,
        notificationType:"login"
        },
        {
        regexPattern:/txn.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?A\/c.(?<account>X\d+).*?to.?(?<payee>.*?[.]).*Ref.(?<utr>.*? )/m,
        patternName:"regexSBIINBTransaction",
        channelType:"service-alerts",
        iconUrl:'https://store-images.s-microsoft.com/image/apps.44630.9007199267039834.05d8736a-dbe9-43f9-9deb-f91aec0eeef6.45f47847-50cc-4360-8915-0a7510b6cad0?mode=scale&q=90&h=300&w=300',
        groups:"amount,account, payee, utr",
        block:viewSbiinbTransaction,
        notificationType:"transaction"
        }
    ]    
    return matchpatterns;
}
