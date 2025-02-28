package ecma.demo.storeapplication.custom;

import ecma.demo.storeapplication.entity.DeliverAll;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.entity.enums.CurrencyType;
import org.springframework.beans.factory.annotation.Value;

import java.sql.Timestamp;
import java.util.UUID;

public interface CustomShoppingDeliver1 {
    UUID getId();
    Timestamp getCreatedAt();
    Timestamp getUpdatedAt();
    Double getAmount();
//    @Value("#{@deliverRepository.productParents(target.product.id)}")
//    @Value("#{target.parents")
//    String getParents();
    Product getProduct();
    DeliverAll getDeliverAll();
    Double getPrice();
    Double getUsd();
    CurrencyType getCurrencyType();
    Double getCustomCost();
    Double getFareCost();
    Double getOtherCosts();
    Double getJuan();
    @Value("#{@deliverRepository.isLast(target.id)}")
    boolean getIsLast();
}
