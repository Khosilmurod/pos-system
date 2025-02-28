package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.ProductType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProductTypeService {
    @Autowired
    ProductTypeRepository productTypeRepository;

    public HttpEntity<?> save(String name){
        try {
            ProductType save = productTypeRepository.save(new ProductType(name, false));
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    };

    public HttpEntity<?> editMain(UUID productTypeId){
        try {
            List<ProductType> all = productTypeRepository.findAll();
            List<ProductType> saveAll=new ArrayList<>();
            for (ProductType productType : all) {
                if(productType.isMain()){
                    productType.setMain(false);
                }
                if (productType.getId().equals(productTypeId)){
                    productType.setMain(true);
                }
                saveAll.add(productType);
            }
            List<ProductType> productTypes = productTypeRepository.saveAll(saveAll);
            List<ProductType> ordered = productTypeRepository.findAllByOrderByMainDesc();
            return ResponseEntity.ok(new ApiResponse("success", true, ordered));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    };

    public HttpEntity<?> delete(UUID productTypeId){
        try {
            productTypeRepository.deleteById(productTypeId);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getAll(){
        try {
            List<ProductType> all = productTypeRepository.findAllByOrderByMainDesc();
            return ResponseEntity.ok(new ApiResponse("success", true, all));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getOne(UUID productTypeId){
        try {
            return ResponseEntity.ok(new ApiResponse("success", true, productTypeRepository.findById(productTypeId)));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
