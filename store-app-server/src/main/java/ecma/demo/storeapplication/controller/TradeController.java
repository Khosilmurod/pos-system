package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqTrade;
import ecma.demo.storeapplication.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/trade")
public class TradeController {
    @Autowired
    TradeService tradeService;

    @GetMapping("/history")
    public HttpEntity<?> getTrade(@RequestParam UUID tradeall){
        return tradeService.getTrade(tradeall);
    }

//    @PostMapping
//    public HttpEntity<?> save(@RequestBody ReqTrade reqTrade){
//        return tradeService.save(reqTrade);
//    }

    @GetMapping("/income")
    public HttpEntity<?> getIncomeData(){
        return tradeService.getIncomeData();
    }

    @GetMapping("/stat")
    public HttpEntity<?> getStat(@RequestParam String start, @RequestParam String end){
        return tradeService.getStat(start ,end);
    }

    @DeleteMapping("/delete/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id){
        return tradeService.delete(id);
    }

    @PutMapping("/edit/{id}")
    public HttpEntity<?> edit(@PathVariable UUID id, @RequestBody ReqTrade reqTrade){
        return tradeService.edit(id, reqTrade);
    }
}
