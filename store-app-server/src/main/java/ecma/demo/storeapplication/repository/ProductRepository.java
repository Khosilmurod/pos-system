package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomProduct;
import ecma.demo.storeapplication.custom.CustomProductRemain;
import ecma.demo.storeapplication.custom.CustomSaleProduct;
import ecma.demo.storeapplication.custom.CustomStoreProduct;
import ecma.demo.storeapplication.entity.Category;
import ecma.demo.storeapplication.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Query(value = "select * from product p where lower (p.name) like '%'||lower(:search)||'%'", nativeQuery = true)
    Page<Product> findBySearch(String search, Pageable pageable);

    List<Product> findByCategoryId(UUID parentId);

    @Query(value = "select * from product p where p.category_uuid=:parent_uuid", nativeQuery = true)
    Page<Product> findByParentId(UUID parent_uuid, Pageable pageable);

    @Query(value = "select (select deliver_amount(cast(p.uuid as varchar(50)))-trade_amount(cast(p.uuid as varchar(50)))-waste_amount(cast(p.uuid as varchar(50)))) as ending_amount," +
            "cast(p.uuid as varchar) as id, p.name as name, get_parents_uz(cast(p.uuid as varchar(50))) as path, p.en_name as en_name, p.code as code, p.created_at as created_at, " +
            "cast((select pt.uuid from product_type pt where pt.uuid=p.product_type_uuid) as varchar) as type_id, " +
            "(select pt.name from product_type pt where pt.uuid=p.product_type_uuid) as type, cast(p.category_uuid as varchar) as category_id, " +
            "c.name as category_name, cast(p.attachment_uuid as varchar) as attachment_id, a.size as size, " +
            "(select deliver_amount(cast(p.uuid as varchar(50)))) as deliver_amount, " +
            "(select trade_amount(cast(p.uuid as varchar(50)))) as trade_amount, " +
            " (select coalesce(sum(t.discount_price),0) from trade t where t.product_uuid=p.uuid) as discountPrice," +
            "(select waste_amount(cast(p.uuid as varchar(50)))) as waste_amount, p.price as price, p.currency_type as currency, " +
            "p.retail_price as retail_price, p.full_sale_price as full_sale_price, p.juan as juan, p.custom_cost as custom_cost, " +
            "p.fare_cost as fare_cost, p.other_costs as other_costs from product p left join attachment a on p.attachment_uuid = a.uuid left join category c on p.category_uuid = c.uuid where p.uuid = :id", nativeQuery = true)
    List<CustomStoreProduct> findStoreProduct(UUID id);

    @Query(value = "select (select deliver_amount(cast(p.uuid as varchar(50)))-trade_amount(cast(p.uuid as varchar(50)))-waste_amount(cast(p.uuid as varchar(50)))) as ending_amount, " +
            "cast(p.uuid as varchar) as id, p.name as name, get_parents_uz(cast(p.uuid as varchar(50))) as path, p.created_at as created_at, " +
            "cast((select pt.uuid from product_type pt where pt.uuid=p.product_type_uuid) as varchar) as type_id, " +
            "(select pt.name from product_type pt where pt.uuid=p.product_type_uuid) as type, cast(p.category_uuid as varchar) as category_id, " +
            "c.name as category_name, cast(p.attachment_uuid as varchar) as attachment_id, a.size as size, " +
            "(select deliver_amount(cast(p.uuid as varchar(50)))) as deliver_amount, " +
            "(select trade_amount(cast(p.uuid as varchar(50)))) as trade_amount, " +
            " (select coalesce(sum(t.discount_price),0) from trade t where t.product_uuid=p.uuid) as discountPrice," +
            "(select waste_amount(cast(p.uuid as varchar(50)))) as waste_amount, p.price as price, p.currency_type as currency, " +
            "p.retail_price as retail_price, p.full_sale_price as full_sale_price, p.juan as juan, p.custom_cost as custom_cost, " +
            "p.fare_cost as fare_cost, p.other_costs as other_costs from product p left join attachment a on p.attachment_uuid = a.uuid left join category c on p.category_uuid = c.uuid where p.uuid = :id", nativeQuery = true)
    List<CustomSaleProduct> findSaleProduct(UUID id);

    @Query(value = "select cast(p.uuid as varchar(50)) as id, get_parents_uz(cast(p.uuid as varchar(50))) as path, p.name as name, p.retail_price as salePrice, " +
            "cast(p.attachment_uuid as varchar(50)) as attachmentId " +
            " from product p where p.uuid=:uuid", nativeQuery = true)
    CustomProduct findByProductId(UUID uuid);

    @Query(value = "select * from (select p.currency_type as currency,  cast(p.uuid as varchar) as id,  (select ac.content from attachment_content ac where ac.attachment_id=p.attachment_uuid),  alphabet(cast(p.uuid as varchar(50))) as alphabet, get_parents_uz(cast(p.uuid as varchar(50))) as uz_name, get_parents_en(cast(p.uuid as varchar(50))) as en_name, p.code as code,  (coalesce(deliver_amount(cast(p.uuid as varchar(50))),0)-coalesce(trade_amount(cast(p.uuid as varchar(50))),0)-coalesce(waste_amount(cast(p.uuid as varchar(50))),0)) as amount,  (coalesce(p.custom_cost,0)+coalesce(p.fare_cost,0)+coalesce(p.other_costs,0)+coalesce(p.price,0)) as ending_price,  (coalesce(p.custom_cost,0)+coalesce(p.fare_cost,0)+coalesce(p.other_costs,0)+coalesce(p.price,0))*(coalesce(deliver_amount(cast(p.uuid as varchar(50))),0)-coalesce(trade_amount(cast(p.uuid as varchar(50))),0)-coalesce(waste_amount(cast(p.uuid as varchar(50))),0)) as amount_ending_price,  coalesce(p.juan,0) as juan,  coalesce(p.price,0) as price,  coalesce(p.custom_cost,0) as custom_cost,  coalesce(p.fare_cost,0) as fare_cost,  coalesce(p.other_costs,0) as other_costs,  coalesce(p.retail_price,0) as retail_price, coalesce(p.full_sale_price,0) as full_sale_price,  coalesce (p.retail_price, 0 )*(coalesce(deliver_amount(cast(p.uuid as varchar(50))),0)-coalesce(trade_amount(cast(p.uuid as varchar(50))),0)-coalesce(waste_amount(cast(p.uuid as varchar(50))),0)) as amount_retail_price from product p) pr where lower (pr.uz_name) like '%'||lower(:search)||'%' or lower (pr.en_name) like '%'||lower(:search)||'%' order by pr.alphabet limit :size offset :size*:page", nativeQuery = true)
    List<CustomProductRemain> getProductRemain(String search ,Integer page, Integer size);

    @Query(value = "select count(*) from product", nativeQuery = true)
    Integer getCount();

}