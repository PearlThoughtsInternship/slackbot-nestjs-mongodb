import { ReqParserService } from "./reqparser.service";
var httpMocks = require('node-mocks-http');

describe('SmsParserServiceTests', () => {
    let reqParserService:ReqParserService;
    var method = 'POST';
    var url ='/message';
    var host ='msg-rtr.visaga.plts.dev';
    var forwardedFrom = "8056176073";
    var serviceProvider = "ICICIB";
    var personalSender = '8790675900';
    var message = "ICICI BANK NEFT Transaction with reference number 274552152 for Rs. 1000.00 has been credited to the beneficiary account on 07-12-2021 at 11:32:14";

    beforeEach(()=>{
      reqParserService = new ReqParserService();
      method = 'POST';
      url ='/message';
      host ='msg-rtr.visaga.plts.dev';
      forwardedFrom = "8056176073";
      serviceProvider = "ICICIB";
      message = "ICICI BANK NEFT Transaction with reference number 274552152 for Rs. 1000.00 has been credited to the beneficiary account on 07-12-2021 at 11:32:14";
    })

    describe("Parse_withMatchingPattern",()=>{
      it('Check with Matching Regex Pattern',async()=>{

        const result = {forwardedFrom:forwardedFrom,sender:serviceProvider,message:message};
        var httpRequest  = httpMocks.createRequest(
          {
          method: method,
          url: url,
          Host: host,
          body: {"data" : message},
          });

          httpRequest.headers['forwardedfrom'] = forwardedFrom;
          httpRequest.headers['from'] = 'DM-'+ serviceProvider;

        expect(await reqParserService.parse(httpRequest)).toMatchObject(result);
      })
    })

    describe("Parse_withoutMatchingPattern",()=>{
      it('Check with Matching Regex Pattern',async()=>{

        const result = {forwardedFrom:forwardedFrom,sender:personalSender,message:message};
        var httpRequest  = httpMocks.createRequest(
          {
          method: method,
          url: url,
          Host: host,
          body: {"data" : message},
          });

          httpRequest.headers['forwardedfrom'] = forwardedFrom;
          httpRequest.headers['from'] = personalSender;

        expect(await reqParserService.parse(httpRequest)).toMatchObject(result);
      })

    })
  }) 