package ecma.demo.storeapplication.custom;

import ecma.demo.storeapplication.entity.enums.CurrencyType;

import java.sql.Timestamp;

public interface CustomSaleProduct {
    String getId();
    String getName();
    String getPath();
    String getType_id();
    String getType();
    String getCategory_id();
    String getCategory_name();
    String getAttachment_id();
    Integer getSize();

    Double getEnding_amount();

    CurrencyType getCurrency();
    Double getRetail_price();
    Double getFull_sale_price();
}