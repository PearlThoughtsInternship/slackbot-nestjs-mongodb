import {
    viewIcicibCorpLogin, viewIcicibCredit, viewIcicibFundTransfer, viewIcicibPersonalMessage, viewIcicibTransaction,
} from 'src/providers/blocks';
export function getIcicibMatchPatterns() {

    const matchPatterns = [
        {
          regexPattern:/(?<OTP>\d+).?is.*?OTP.*INR.(?<amount>(\d+(.*\,\d{0,})?)).?at.*?(?<payee>\w{1,}).*?(?<account>(Account|Acct|Card).*?XX\d+)/m,
          patternName:"regexICICIBankingFundTransfer",
          channelType:"fund-transfer-otp",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"account, amount, payee, OTP",
          block:viewIcicibFundTransfer,
          notificationType:"fundTransfer" 
        },
        {
          regexPattern:/(?<OTP>\d+).?is.*?OTP.*INR.(?<amount>(\d+(.*\,\d{0,})?)).*?.(?<account>(Account|Acct|Card).*?XX\d+).*?to.(?<payee>.*?[.])/m,
          patternName:"regexICICIBankingFundTransferCaseOne",
          channelType:"fund-transfer-otp",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"account, amount, payee, OTP",
          block:viewIcicibFundTransfer,
          notificationType:"fundTransfer"  
        },
        {
          regexPattern:/(?<OTP>\d+).?is.*?OTP.*(?<account>(Acct|Card).*?XX\d+)/m,
          patternName:"regexICICIBankingFundTransferCaseTwo",
          channelType:"fund-transfer-otp",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"account, OTP",
          block:viewIcicibFundTransfer,
          notificationType:"fundTransfer" 
        },
        {
          regexPattern:/(?<OTP>\d+).?is.*?OTP.*?to pay.*?(?<payee>.*?[,]).*?(Rs |INR |USD )(?<amount>(\d+(.*\,\d{0,})?))/m,
          patternName:"regexICICIBankingFundTransferCaseThree",
          channelType:"fund-transfer-otp",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount , OTP, payee",
          block:viewIcicibFundTransfer,
          notificationType:"fundTransfer" 
        },
        {
          regexPattern:/(?<account>Account.*?\d+).*credited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*?Info:(?<ref>.*?[.]).*?Balance is.*?(?<balance>(\d+(\,\d.*[^.])))/m,
          patternName:"regexICICIBankingCreditCaseOne",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account, ref , balance",
          block:viewIcicibCredit,
          notificationType:"credit"  
        },
        {
          regexPattern:/Rs.*?(?<amount>(\d+(.*\,\d{0,})?)).*credited.*?account.(?<account>.*?\d+).*?Bal.*?Rs.(?<balance>(\d+(.*\,\d{0,})?))/m,
          patternName:"regexICICIBankingCreditCaseTwo",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account, balance",
          block:viewIcicibCredit,
          notificationType:"credit"  
        },
        {
          regexPattern:/(?<account>Account.*?\d+).*credited.*?(?<amount>(INR |USD |Rs )(\d+(.*\,\d{0,})?)).*?(from |by )(?<payee>.*?[.]).*?Ref. no..*?.(?<ref>.*?[.])/m,
          patternName:"regexICICIBankingCreditCaseFive",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account,ref,payee",
          block:viewIcicibCredit,
          notificationType:"credit"  
        },
        {
          regexPattern:/(?<account>Acc.*?\d+).*debited.*?INR.(?<amount>(\d+(.*\,\d{0,})?)).*?Info:(?<ref>.*?[.]).*?Balance is.*?(?<balance>(\d+(.*\,\d{0,})?))/m,
          patternName:"regexICICIBTransactionCaseOne",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account, balance , ref ",
          block:viewIcicibTransaction,
          notificationType:"transaction"  
        },
        {
          regexPattern:/.*?(?<amount>(USD |INR )(\d+(.*\,\d{0,})?)(\.[0-9]+ |)).*?debited.*?(?<account>(Acct|Card).*?XX\d+).*?Info:(?<ref>.*?[.]).*?Available Limit.*?(?<balance>(\d+(.*\,\d{0,})?))/m,
          patternName:"regexICICIBTransactionCaseThree",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account, balance , ref ",
          block:viewIcicibTransaction,
          notificationType:"transaction" 
        },
        {
          regexPattern:/(?<account>(Acct|Account).*?\d+).*debited.*?.(?<amount>(Rs |USD |INR )(\d+(.*\,\d{0,})?))/m,
          patternName:"regexICICIBTransactionCaseFour",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"account , amount",
          block:viewIcicibTransaction,
          notificationType:"transaction"  
        },
        {
          regexPattern:/.*?(?<amount>(INR |USD )(\d+(.*\,\d{0,})?)).*?done.*?(?<account>(Acc|Card).*?XX\d+).*?Info:(?<ref>.*?[.]).*?Available Balance.*?(?<balance>(\d+(.*\,\d{0,})?))/m,
          patternName:"regexICICIBTransactionCaseFive",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account, balance , ref",
          block:viewIcicibTransaction,
          notificationType:"transaction"  
        },
        {
          regexPattern:/Payment.*?INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?Account.*?(?<account>xxx.*?\d+)/m,
          patternName:"regexICICIBankingCreditCaseThree",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account",
          block:viewIcicibCredit,
          notificationType:"credit"  
        },
        {
          regexPattern:/(?<account>Acct.*?\d+).*credited.*?Rs.(?<amount>(\d+(.*\,\d{0,})?)).*?by (?<ref>.*?\d+)/m,
          patternName:"regexICICIBankingCreditCaseFour",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account,ref",
          block:viewIcicibCredit,
          notificationType:"credit"    
        },
        {
          regexPattern:/Jio Mobility.*?ICICI Bank app/m,
          patternName:"regexICICIJioMobility",
          channelType:"PersonalMessages",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"",
          block:null,
          notificationType:"personalMessageNoBlock"  
        },
        {
          regexPattern:/(?<ref>\d+).*?Rs.*?(?<amount>(\d+(.*\,\d{0,})?)).*?credited.to.*?(?<account>\w.*account)/m,
          patternName:"regexICICIBankingCreditCaseSix",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account,ref",
          block:viewIcicibCredit,
          notificationType:"credit"   
        },
        {
          regexPattern:/(?<OTP>\d+).*?is.*?OTP.*?Corporate Internet Banking/m,
          patternName:"regexICICIBCorpBanking",
          channelType:"login-otp",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"OTP",
          block:viewIcicibCorpLogin,
          notificationType:"CorpLogin"  
        },
        {
          regexPattern:/(?<account>(Acct|Card).*?XX\d+).*?.\OTP is.*?(?<OTP>\d+)/,
          patternName:"regexICICIBFundTransfer1",
          channelType:"fund-transfer-otp",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"account, OTP",
          block:viewIcicibFundTransfer,
          notificationType:"fundTransfer" 
        },
        {
          regexPattern:/INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?(?<account>(Acct|Card).*?XX\d+).*?through.*?(?<payment_service>\w{1,}\s+.+?(?=on))/m,
          patternName:"regexICICIBTransaction1",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount , account , payment_service",
          block:viewIcicibTransaction,
          notificationType:"transaction" 
        },	
        {
          regexPattern:/INR.*?(?<amount>(\d+(.*\,\d{0,})?)).*?spent.*?(?<account>(Acct|Card).*?XX\d+).*?at.*?(?<payee>\w{1,}).*?Avl Lmt.*?INR.*?(?<balance>(\d+(.*\,\d{0,})[.]))/m,
          patternName:"regexICICIBTransaction2",
          channelType:"service-alerts",
          iconUrl:'https://d10pef68i4w9ia.cloudfront.net/companies/logos/10126/925004492s_thumb.jpg',
          groups:"amount,account, balance , payee",
          block:viewIcicibTransaction,
          notificationType:"transaction" 
        },
    ]

    return matchPatterns;  
}
