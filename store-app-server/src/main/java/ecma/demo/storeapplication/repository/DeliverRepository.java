package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomDeliver;
import ecma.demo.storeapplication.custom.CustomShoppingDeliver;
import ecma.demo.storeapplication.custom.CustomShoppingDeliver1;
import ecma.demo.storeapplication.entity.Deliver;
import ecma.demo.storeapplication.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DeliverRepository extends JpaRepository<Deliver, UUID> {

    @Query(value = "select p.uuid, p.name, p.price, " +
            "(select c.name from category c where c.uuid = p.category_uuid), " +
            "((select sum(d.amount) from deliver d where d.product_uuid = p.uuid) - " +
            "(select sum(t.amount) from trade t where t.product_uuid = p.uuid)) " +
            "from product p where p.uuid = :productId or p.name like ('%'||:search||'%') " +
            "group by p.uuid, p.name", nativeQuery = true)
    Page<CustomDeliver> getAllDelivers(Pageable pageable, UUID productId, String search);

    @Query(value = "select ((select coalesce(sum(d.amount),0) from deliver d where d.product_uuid = p.uuid) - " +
            "(select coalesce(sum(t.amount),0) from trade t where t.product_uuid = p.uuid) - " +
            "(select coalesce(sum(w.amount),0) from waste w where w.deliver_uuid = " +
            "(select d2.uuid from deliver d2 where d2.product_uuid = p.uuid))) as total " +
            "from product p where p.uuid = :id", nativeQuery = true)
    Double productAmount(UUID id);

    @Query(value = "select get_parents_uz(cast(:productId as varchar(50)))", nativeQuery = true)
    String productParents(UUID productId);

    @Query(value="select uuid=:id from deliver order by created_at desc limit 1", nativeQuery = true)
    boolean isLast(UUID id);
    Page<CustomShoppingDeliver1> findAllByProductIdOrderByUpdatedAtDesc(UUID productId, Pageable pageable);

    @Query(value = "select *\n" +
            "from (select cast(d.uuid as varchar) as id,\n" +
            "             d.created_at as createdAt,\n" +
            "             d.updated_at as updatedAt,\n" +
            "             d.amount as amount,\n" +
            "             get_parents_uz(cast((select p.uuid from product p where p.uuid = d.product_uuid) as varchar(50))) as parents,\n" +
            "             d.price as price,\n" +
            "             d.usd as usd,\n" +
            "             d.currency_type as currencyType,\n" +
            "             d.custom_cost as customCost,\n" +
            "             d.fare_cost as fareCost,\n" +
            "             d.other_costs as otherCosts,\n" +
            "             d.juan\n" +
            "      from deliver d) t where lower(t.parents) like '%'||lower(:search)||'%' and cast(t.createdAt as date) in (SELECT * FROM generate_series(Cast(:starts AS TIMESTAMP), Cast(:ends AS TIMESTAMP), interval '1 day') AS a(createdAt))\n" +
            "order by t.updatedAt desc limit :size offset :size*:page", nativeQuery = true)
    List<CustomShoppingDeliver> findAllByOrderByUpdatedAtDesc(String search, String starts, String ends, int size, int page);

    @Query(value = "select *\n" +
            "from (select cast(d.uuid as varchar) as id,\n" +
            "             d.created_at as createdAt,\n" +
            "             d.updated_at as updatedAt,\n" +
            "             d.amount as amount,\n" +
            "             get_parents_uz(cast((select p.uuid from product p where p.uuid = d.product_uuid) as varchar(50))) as parents,\n" +
            "             d.price as price,\n" +
            "             d.usd as usd,\n" +
            "             d.currency_type as currencyType,\n" +
            "             d.custom_cost as customCost,\n" +
            "             d.fare_cost as fareCost,\n" +
            "             d.other_costs as otherCosts,\n" +
            "             d.juan\n" +
            "      from deliver d) t where lower(t.parents) like '%'||lower(:search)||'%'\n" +
            "order by t.updatedAt desc limit :size offset :size*:page", nativeQuery = true)
    List<CustomShoppingDeliver> findAllHistory(String search, int size, int page);



    @Query(value = "select count(*) \n" +
            "from (select cast(d.uuid as varchar) as id,\n" +
            "             d.created_at as createdAt,\n" +
            "             d.updated_at as updatedAt,\n" +
            "             d.amount as amount,\n" +
            "             get_parents_uz(cast((select p.uuid from product p where p.uuid = d.product_uuid) as varchar(50))) as parents,\n" +
            "             d.price as price,\n" +
            "             d.usd as usd,\n" +
            "             d.currency_type as currencyType,\n" +
            "             d.custom_cost as customCost,\n" +
            "             d.fare_cost as fareCost,\n" +
            "             d.other_costs as otherCosts,\n" +
            "             d.juan\n" +
            "      from deliver d) t where lower(t.parents) like '%'||lower(:search)||'%' and cast(t.createdAt as date) in (SELECT * FROM generate_series(Cast(:starts AS TIMESTAMP), Cast(:ends AS TIMESTAMP), interval '1 day') AS a(createdAt)) ", nativeQuery = true)
    Integer findAllByOrderByUpdatedAtDescCount(String search, String starts, String ends);
}
