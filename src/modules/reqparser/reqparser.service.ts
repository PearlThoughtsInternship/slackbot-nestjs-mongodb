import { Injectable } from '@nestjs/common';

@Injectable()
export class ReqParserService {

   //ForwardedFrom is actually returned as Forwardedfrom
    forwardedFromField = 'forwardedfrom';
    fromField = 'from';

     async parse(req){
       let forwardedFrom = req.get(this.forwardedFromField);
        let regexSenderID = /[A-Za-z]{2}-[A-Za-z]{6}/m;
        var sender = req.get(this.fromField);
        if (regexSenderID.test(sender)) {
            sender = this.extractSenderId(sender); 
        } 
        var message = req.body.data;
        return {forwardedFrom:forwardedFrom,sender:sender,message:message};
     }

    private extractSenderId(sender: any): any {
        /**
         * Dissecting Sender IDs in SMS
         * BZ-SBIINB
         * B - BSNL (Network Operator)
         * Z - Maharashtra (Location)
         * SBIINB - Brand or Company name - SBI INternet Banking
         * Source: https://qr.ae/pGGgFu
         */
        return sender.split('-')[1];
    }


}