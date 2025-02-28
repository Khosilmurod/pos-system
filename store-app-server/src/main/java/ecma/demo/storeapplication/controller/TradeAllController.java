package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.custom.CustomOneTradeAll;
import ecma.demo.storeapplication.payload.ReqEditTradeAll;
import ecma.demo.storeapplication.payload.ReqTradeAll;
import ecma.demo.storeapplication.service.TradeAllService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/tradeAll")
public class TradeAllController {
    @Autowired
    TradeAllService tradeAllService;
    
    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqTradeAll reqTradeAll){
        return tradeAllService.save(reqTradeAll);
    }

    @GetMapping("/history")
    public HttpEntity<?> shoppingHistory(@RequestParam UUID client, @RequestParam Integer size, @RequestParam Integer page){
        return tradeAllService.shoppingHistory(client, size, page);
    }

    @GetMapping("/allhistory")
    public HttpEntity<?> getHistory(@RequestParam Integer size, @RequestParam Integer page, @RequestParam String start, @RequestParam String end
//                                    @RequestParam String search
    ){
        System.out.println("hello");
        return tradeAllService.getHistory(start, end, page, size);
    }

    @GetMapping("/saleHistory")
    public HttpEntity<?> saleHistory(@RequestParam String date){
            return tradeAllService.saleHistory(date);
    }

    @GetMapping("/saleHistory/{id}")
    public HttpEntity<?> productSaleHistory(@RequestParam String start, @RequestParam String end, @PathVariable UUID id){
        return tradeAllService.productSaleHistory(start, end, id);
    }

    @GetMapping("/one/{id}")
    public HttpEntity<?> getOne(@PathVariable UUID id){
        return tradeAllService.getOne(id);
    }

    @PutMapping("/edit/{id}")
    public HttpEntity<?> edit(@PathVariable UUID id, @RequestBody ReqEditTradeAll reqEditTradeAll){
        return tradeAllService.edit(id, reqEditTradeAll);
    }
}
