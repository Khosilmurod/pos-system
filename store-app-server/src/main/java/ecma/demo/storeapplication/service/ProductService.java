package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.*;
import ecma.demo.storeapplication.entity.Attachment;
import ecma.demo.storeapplication.entity.Category;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.entity.ProductType;
import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqProduct;
import ecma.demo.storeapplication.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;
    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    DeliverRepository deliverRepository;
    @Autowired ProductTypeRepository productTypeRepository;

    public HttpEntity<?> getById(String id) {
        CustomProduct product = productRepository.findByProductId(UUID.fromString(id));
        Double productAmount = deliverRepository.productAmount(UUID.fromString(id));
        return ResponseEntity.ok(new ApiResponse("success", true, product, productAmount));
    }

    public HttpEntity<?> getBySearch(String search, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Product> productBySearch = productRepository.findBySearch(search, pageable);

        return ResponseEntity.ok(new ApiResponse("success", true, productBySearch));
    }

    public HttpEntity<?> getByCategory(String parentId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        UUID parent_uuid = UUID.fromString(parentId);
        Page<Product> productByParentId = productRepository.findByParentId(parent_uuid, pageable);

        return ResponseEntity.ok(new ApiResponse("success", true, productByParentId));
    }

    public HttpEntity<?> getStoreProduct(UUID uuid) {
        try {
            List<CustomStoreProduct> storeProduct = productRepository.findStoreProduct(uuid);
            return ResponseEntity.ok(new ApiResponse("success", true, storeProduct.get(0)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }


    }

    public HttpEntity<?> getSaleProduct(UUID uuid) {
        try {
            List<CustomSaleProduct> saleProduct = productRepository.findSaleProduct(uuid);
            System.out.println(saleProduct.get(0).getEnding_amount());
            return ResponseEntity.ok(new ApiResponse("success", true, saleProduct.get(0)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }


    }

    public HttpEntity<?> save(ReqProduct reqProduct) {
        Category parent=null;
        Attachment attachment=null;
        ProductType productType=null;
        try {
            if(reqProduct.getCategoryId()!=null){
                Optional<Category> optionalParent = categoryRepository.findById(reqProduct.getCategoryId());
                if(optionalParent.isPresent()){
                    parent=optionalParent.get();
                }
            }
            if(reqProduct.getAttachmentId()!=null){
                Optional<Attachment> optionalAttachment = attachmentRepository.findById(reqProduct.getAttachmentId());
                if(optionalAttachment.isPresent()){
                    attachment=optionalAttachment.get();
                }
            }
            if(reqProduct.getProductTypeId()!=null){
                Optional<ProductType> optionalProductType = productTypeRepository.findById(reqProduct.getProductTypeId());
                if(optionalProductType.isPresent()){
                    productType=optionalProductType.get();
                }
            }
            Product save = productRepository.save(new Product(reqProduct.getName().substring(0, 1).toUpperCase() + reqProduct.getName().substring(1), reqProduct.getEnName(), reqProduct.getCode(), attachment, parent, productType, CurrencyType.USD, (double) 0, (double) 0, (double) 0, (double) 0, (double) 0, (double) 0, (double) 0, (double) 0));
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> edit(UUID id, ReqProduct reqProduct) {

        Product product = productRepository.findById(id).get();

        Category parent=null;
        Attachment attachment=null;
        ProductType productType=null;
        try {
            if(reqProduct.getCategoryId()!=null){
                Optional<Category> optionalParent = categoryRepository.findById(reqProduct.getCategoryId());
                if(optionalParent.isPresent()){
                    parent=optionalParent.get();
                }
            }
            if(reqProduct.getAttachmentId()!=null){
                Optional<Attachment> optionalAttachment = attachmentRepository.findById(reqProduct.getAttachmentId());
                if(optionalAttachment.isPresent()){
                    attachment=optionalAttachment.get();
                }
            }
            if(reqProduct.getProductTypeId()!=null){
                Optional<ProductType> optionalProductType = productTypeRepository.findById(reqProduct.getProductTypeId());
                if(optionalProductType.isPresent()){
                    productType=optionalProductType.get();
                }
            }

            product.setAttachment(attachment);
            product.setEnName(reqProduct.getEnName());
            product.setName(reqProduct.getName().substring(0,1).toUpperCase()+reqProduct.getName().substring(1));
            product.setCategory(parent);
            product.setProductType(productType);
            product.setCode(reqProduct.getCode());
            productRepository.save(product);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> delete(UUID id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getProductRemain(String search, Integer page, Integer size, String sort){
        Pageable pageable=PageRequest.of(page,10);
        List<CustomProductRemain> productRemain = productRepository.getProductRemain(search, page, size);
        Page<CustomProductRemain> responsePage= new PageImpl<CustomProductRemain>(productRemain, PageRequest.of(page, size), productRepository.getCount());
        return ResponseEntity.ok(new ApiResponse("success", true, responsePage));
    }



}
