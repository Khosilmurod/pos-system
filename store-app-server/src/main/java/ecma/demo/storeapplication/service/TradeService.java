package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomStat;
import ecma.demo.storeapplication.custom.CustomStoreProduct;
import ecma.demo.storeapplication.entity.*;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqTrade;
import ecma.demo.storeapplication.repository.ProductRepository;
import ecma.demo.storeapplication.repository.TradeAllRepository;
import ecma.demo.storeapplication.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.xml.ws.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TradeService {
    @Autowired
    TradeRepository tradeRepository;
    @Autowired
    TradeAllRepository tradeAllRepository;
    @Autowired
    ProductRepository productRepository;

    public HttpEntity<?> getTrade(UUID tradeAllId){
        return ResponseEntity.ok(new ApiResponse("success", true, tradeRepository.getTrade(tradeAllId)));
    }

    public HttpEntity<?> delete(UUID tradeId){
        try {
            tradeRepository.deleteById(tradeId);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> edit(UUID id, ReqTrade reqTrade){
        try {
            Trade trade = tradeRepository.findById(id).get();
            CustomStoreProduct storeProduct = productRepository.findStoreProduct(trade.getProduct().getId()).get(0);
            if(storeProduct.getEnding_amount()+trade.getAmount()-reqTrade.getAmount()>=0){
                trade.setAmount(reqTrade.getAmount());
                trade.setDiscountPrice(reqTrade.getDiscount());
                tradeRepository.save(trade);
                return ResponseEntity.ok(new ApiResponse("success" ,true, trade));
            }
            return ResponseEntity.ok(new ApiResponse("failed" ,false));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error" ,false));
        }
    }

    public HttpEntity<?> getIncomeData(){
        try {
            return ResponseEntity.ok(new ApiResponse("success", true, tradeRepository.getIncomeData()));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getStat(String start, String end){
        try {
            List<CustomStat> stat = tradeRepository.getStat(start, end);
            return ResponseEntity.ok(new ApiResponse("success", true, stat));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
