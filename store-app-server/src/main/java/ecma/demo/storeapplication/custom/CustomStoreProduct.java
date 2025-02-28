package ecma.demo.storeapplication.custom;

import ecma.demo.storeapplication.entity.enums.CurrencyType;

import java.sql.Timestamp;
import java.util.UUID;

public interface CustomStoreProduct {
    String getId();
    String getName();
    String getPath();
    String getEn_name();
    String getCode();
    Timestamp getCreated_at();
    String getType_id();
    String getType();
    String getCategory_id();
    String getCategory_name();
    String getAttachment_id();
    Integer getSize();

    Double getDeliver_amount();
    Double getTrade_amount();
    Double getDiscountPrice();
    Double getWaste_amount();
    Double getEnding_amount();

    Double getPrice();
    CurrencyType getCurrency();
    Double getRetail_price();
    Double getFull_sale_price();
    Double getJuan();
    Double getCustom_cost();
    Double getFare_cost();
    Double getOther_costs();
}