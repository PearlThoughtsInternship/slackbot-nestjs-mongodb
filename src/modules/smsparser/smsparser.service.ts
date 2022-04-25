import { Injectable } from "@nestjs/common";
import { getAxisBkMatchPatterns } from "src/providers/matchpatterns/getAxisBkMatchPatterns";
import { getCashfreeMatchPatterns } from "src/providers/matchpatterns/getCashfreeMatchPatterns";
import { getCbsSbiMatchPatterns } from "src/providers/matchpatterns/getCbsSbiMatchPatterns";
import { getIcicibMatchPatterns } from "src/providers/matchpatterns/getIcicibMatchPatterns";
import { getIPaytmMatchPatterns } from "src/providers/matchpatterns/getIPaytmMatchPatterns";
import { getPayoneerMatchPatterns } from "src/providers/matchpatterns/getPayoneerMatchPatterns";
import { getRazorPayMatchPatterns } from "src/providers/matchpatterns/getRazorPayMatchPatterns";
import { getSbiCrdMatchPatterns } from "src/providers/matchpatterns/getSbiCrdMatchPatterns";
import { getSbiIndMatchPatterns } from "src/providers/matchpatterns/getSbiIndMatchPatterns";
import { getSbiPsgMatchPatterns } from "src/providers/matchpatterns/getSbiPsgMatchPatterns";


@Injectable()
export class SmsParserService{

    
    async senderIdCategorizer(parsedResult){
      let sender = parsedResult.sender;
      if(sender.length > 9){
        await this.personalSmsParser(parsedResult);
      }else{
        await this.txnSmsParser(parsedResult);
      }
    }
   
    async txnSmsParser(parsedResult: any) {
      {
        let senderIdMatchLookUp = [
          { sender: 'ICICIB', getList: getIcicibMatchPatterns() },
          { sender: 'SBIINB', getList: getSbiIndMatchPatterns() },
          { sender: 'SBICRD', getList: getSbiCrdMatchPatterns() },
          { sender: 'AxisBk', getList: getAxisBkMatchPatterns() },
          { sender: 'SBIPSG', getList: getSbiPsgMatchPatterns() },
          { sender: 'CBSSBI', getList: getCbsSbiMatchPatterns() },
          { sender: '57575701', getList: getPayoneerMatchPatterns() },
          { sender: 'CSHFRE', getList: getCashfreeMatchPatterns() },
          { sender: 'iPaytm', getList: getIPaytmMatchPatterns() },
          { sender: 'RZRPAY', getList: getRazorPayMatchPatterns() },
        ];

        for(let senderIdMatch of senderIdMatchLookUp){
          if(senderIdMatch.sender === parsedResult.sender){
            let matchedResult = {matchPatterns:senderIdMatch.getList,parsedResult}
            await this.categorizedTxnSmsParser(matchedResult);
          }else{
            await this.uncategorizedTxnSmsParser(parsedResult);
          }
        }
      }


  }
  uncategorizedTxnSmsParser(parsedResult: any) {
    let slackMessage = {sender:parsedResult.sender,channelType:"Uncategorized",notificationType:"Uncategorized",icon_url:""}

  }

  categorizedTxnSmsParser(matchedResult) {
    let matchPatterns = matchedResult.matchPatterns;
    let message = matchedResult.message;
    for(let matchPattern of matchPatterns){
      if (matchPattern.test(message)) {
        let extractedDetails = ({
            groups: { }
        } = matchPattern.exec(message));
        let slackMessage = {parsedResult:matchedResult.parsedResult,group:extractedDetails}
        
    }else{
      this.uncategorizedTxnSmsParser(matchedResult.parsedResult)
    }
  }
}

async personalSmsParser(parsedResult: any) {

  let slackMessage = {sender:parsedResult.sender,channelType:"PersonalMessages",notificationType:"PersonalMessageNoBlock",icon_url:""};
  
}
 
}
