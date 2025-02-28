package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomShoppingDeliver;
import ecma.demo.storeapplication.custom.CustomShoppingDeliver1;
import ecma.demo.storeapplication.custom.CustomStoreProduct;
import ecma.demo.storeapplication.entity.Deliver;
import ecma.demo.storeapplication.entity.DeliverAll;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqDeliver;
import ecma.demo.storeapplication.payload.ReqDeliverAll;
import ecma.demo.storeapplication.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliverService {
    @Autowired
    DeliverRepository deliverRepository;
    @Autowired
    DeliverAllRepository deliverAllRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    TradeRepository tradeRepository;
    @Autowired
    SettingsRepository settingsRepository;

    public HttpEntity<?> save(ReqDeliverAll reqDeliverAll) {
        try {
            DeliverAll deliverAll = deliverAllRepository.save(new DeliverAll(reqDeliverAll.getDescription()));
            List<Deliver> delivers = new ArrayList<>();

            for (ReqDeliver reqDeliver : reqDeliverAll.getReqDelivers()) {
                Product product = productRepository.findById(reqDeliver.getProductId()).get();
//                if(optionalProduct.isPresent()){
                product.setCurrencyType(CurrencyType.valueOf(reqDeliver.getCurrency()));
                product.setPrice(reqDeliver.getPrice());
                product.setJuan(reqDeliver.getJuan());
                product.setRetailPrice(reqDeliver.getRetailPrice());
                product.setFullSalePrice(reqDeliver.getFullSalePrice());
                product.setCustomCost(reqDeliver.getCustomCost());
                product.setFareCost(reqDeliver.getFareCost());
                product.setOtherCosts(reqDeliver.getOtherCosts());
                Product save = productRepository.save(product);

                Deliver deliver = new Deliver(reqDeliver.getAmount(), save, deliverAll, reqDeliver.getPrice(), settingsRepository.findAll().get(0).getUsd(), CurrencyType.valueOf(reqDeliver.getCurrency()), reqDeliver.getCustomCost(), reqDeliver.getFareCost(), reqDeliver.getOtherCosts(), reqDeliver.getJuan());
                delivers.add(deliver);
//                }
            }
            List<Deliver> savedDelivers = deliverRepository.saveAll(delivers);
            return ResponseEntity.ok(new ApiResponse("success", true, savedDelivers));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> edit(ReqDeliver reqDeliver, UUID deliverId) {
        try {
                Optional<Deliver> optionalDeliver = deliverRepository.findById(deliverId);

            if(optionalDeliver.isPresent()){
                Deliver deliver=optionalDeliver.get();

                Product product = deliver.getProduct();
                CustomStoreProduct customStoreProduct = productRepository.findStoreProduct(product.getId()).get(0);

                if(deliverRepository.isLast(deliverId)){
                    product.setJuan(reqDeliver.getJuan());
                    product.setCurrencyType(CurrencyType.valueOf(reqDeliver.getCurrency()));
                    product.setCustomCost(reqDeliver.getCustomCost());
                    product.setFareCost(reqDeliver.getFareCost());
                    product.setOtherCosts(reqDeliver.getOtherCosts());
                    product.setRetailPrice(reqDeliver.getRetailPrice());
                    product.setFullSalePrice(reqDeliver.getFullSalePrice());
                    productRepository.save(product);
                }

                if(customStoreProduct.getEnding_amount()-(deliver.getAmount()-reqDeliver.getAmount())>=0&reqDeliver.getAmount()>=0){
                    deliver.setAmount(reqDeliver.getAmount());
                    deliver.setCurrencyType(CurrencyType.valueOf(reqDeliver.getCurrency()));
                    deliver.setCustomCost(reqDeliver.getCustomCost());
                    deliver.setFareCost(reqDeliver.getFareCost());
                    deliver.setJuan(reqDeliver.getJuan());
                    return ResponseEntity.ok(new ApiResponse("success", true, deliverRepository.save(deliver)));
                }
            }
            return ResponseEntity.ok(new ApiResponse("failed", false));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getProductHistory(UUID productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CustomShoppingDeliver1> delivers = deliverRepository.findAllByProductIdOrderByUpdatedAtDesc(productId, pageable);
        return ResponseEntity.ok(new ApiResponse("success", true, delivers));
    }
    public HttpEntity<?> getHistory(String search, String start, String end, int page, int size) {
        start=start.substring(0,11);
        end=end.substring(0,11);
        List<CustomShoppingDeliver> list = deliverRepository.findAllByOrderByUpdatedAtDesc(search, start, end, size, page);
        Page<CustomShoppingDeliver> all=new PageImpl<>(list, PageRequest.of(page, size), deliverRepository.findAllByOrderByUpdatedAtDescCount(search, start, end));
        return ResponseEntity.ok(new ApiResponse("success", true, all));
    }

    public HttpEntity<?> deleteDeliver(UUID id) {
        try {
            Deliver deliver = deliverRepository.findById(id).get();
            CustomStoreProduct customStoreProduct = productRepository.findStoreProduct(deliver.getProduct().getId()).get(0);
            Double amount = customStoreProduct.getDeliver_amount() - customStoreProduct.getTrade_amount() - customStoreProduct.getWaste_amount();
            if (deliver.getAmount() > amount) {
                return ResponseEntity.ok(new ApiResponse("failed", false, deliver));
            } else {
                deliverRepository.delete(deliver);
                return ResponseEntity.ok(new ApiResponse("success", true));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
