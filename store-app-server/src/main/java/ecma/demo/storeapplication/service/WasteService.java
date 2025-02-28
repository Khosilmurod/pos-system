package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomStoreProduct;
import ecma.demo.storeapplication.entity.Deliver;
import ecma.demo.storeapplication.entity.Waste;
import ecma.demo.storeapplication.entity.enums.WasteStatus;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqWaste;
import ecma.demo.storeapplication.repository.DeliverRepository;
import ecma.demo.storeapplication.repository.ProductRepository;
import ecma.demo.storeapplication.repository.WasteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WasteService {
    @Autowired
    WasteRepository wasteRepository;
    @Autowired
    DeliverRepository deliverRepository;
    @Autowired
    ProductRepository productRepository;

    public HttpEntity<?> save(ReqWaste reqWaste){
        try {
            Deliver deliver = deliverRepository.findById(reqWaste.getDeliverId()).get();
            CustomStoreProduct storeProduct = productRepository.findStoreProduct(deliver.getProduct().getId()).get(0);
            if(storeProduct.getEnding_amount()>=reqWaste.getAmount()&&deliver.getAmount()>=reqWaste.getAmount()){
                Waste save = wasteRepository.save(new Waste(reqWaste.getAmount(), reqWaste.getDesc(), deliver, WasteStatus.REQUESTED));
                return ResponseEntity.ok(new ApiResponse("success", true, save));
            }
            return ResponseEntity.ok(new ApiResponse("failed", false, deliver));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getAll(Integer page, Integer size, String wasteStatus){
        try {
            Pageable pageable= PageRequest.of(page, size);
            Page<Waste> all = wasteRepository.findAllByWasteStatus(WasteStatus.valueOf(wasteStatus), pageable);
            return ResponseEntity.ok(new ApiResponse("success", true, all));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> edit(UUID id){
        try {
            Waste waste = wasteRepository.findById(id).get();
            CustomStoreProduct storeProduct = productRepository.findStoreProduct(waste.getDeliver().getProduct().getId()).get(0);
            if(storeProduct.getEnding_amount()>=waste.getAmount()){
                waste.setWasteStatus(WasteStatus.ACCEPTED);
                wasteRepository.save(waste);
                return ResponseEntity.ok(new ApiResponse("success", true, waste));
            }
            return ResponseEntity.ok(new ApiResponse("failed", false));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> delete(UUID id){
        try {
            Waste waste = wasteRepository.findById(id).get();
            wasteRepository.delete(waste);
            return ResponseEntity.ok(new ApiResponse("success", true));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
