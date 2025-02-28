package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomOneTradeAll;
import ecma.demo.storeapplication.custom.CustomShoppingHistory;
import ecma.demo.storeapplication.custom.CustomTodayHistory;
import ecma.demo.storeapplication.custom.CustomTodayHistoryRange;
import ecma.demo.storeapplication.entity.TradeAll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

public interface TradeAllRepository extends JpaRepository<TradeAll, UUID> {
    List<TradeAll> findAllByClientId(UUID clientId);

    @Query(value = "select cast(ta.uuid as varchar)                                                                as id,\n" +
            "                   (coalesce ((select coalesce (sum(t.amount*t.retail_price),0) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='UZS'),0)+coalesce ((select coalesce (sum(t.amount*t.retail_price*t.usd),0) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='USD'),0))                                                                                   as total,\n" +
            "                   (select concat(u.first_name, ' ', u.last_name) from users u where u.uuid = ta.created_by_uuid) as salesman,\n" +
            "                   ta.created_at                                                                                  as created,\n" +
            "                   coalesce ((select COALESCE(sum(l.loan_sum), 0) from loan l where trade_all_uuid = ta.uuid),0)               as loan,\n" +
            "                   coalesce((select coalesce((select sum(ds.amount) from discount ds where trade_all_uuid = ta.uuid),0)+(select coalesce (sum(discount_price*t.amount), 0) from trade t where t.trade_all_uuid=ta.uuid)),0)           as discount\n" +
            "            from trade_all ta\n" +
            "            where client_uuid = :client\n" +
            "            order by ta.created_at desc limit :size offset :size*:page\n" +
            "\n"
            , nativeQuery = true)
    List<CustomShoppingHistory> shoppingHistory(UUID client, Integer size, Integer page);


    @Query(value = "select cast(ta.uuid as varchar)  as id,\n" +
            "                   (coalesce ((select coalesce (sum(t.amount*t.retail_price),0) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='UZS'),0)+coalesce ((select coalesce (sum(t.amount*t.retail_price*t.usd),0) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='USD'),0))         as total,\n" +
            "                   (select concat(u.first_name, ' ', u.last_name) from users u where u.uuid = ta.created_by_uuid) as salesman,\n" +
            "                   ta.created_at                                                                                  as created,\n" +
            "                   c.first_name || ' ' || c.last_name                                               as client,\n" +
            "                   coalesce ((select COALESCE(sum(l.loan_sum), 0) from loan l where trade_all_uuid = ta.uuid),0)               as loan,\n" +
            "                   coalesce((select coalesce((select sum(ds.amount) from discount ds where trade_all_uuid = ta.uuid),0)+(select coalesce (sum(discount_price*t.amount), 0) from trade t where t.trade_all_uuid=ta.uuid)),0)           as discount\n" +
            "            from trade_all ta left join client c on ta.client_uuid = c.uuid \n" +
            "            where cast(ta.created_at as date) in (SELECT * FROM generate_series(Cast(:starts AS TIMESTAMP), Cast(:ends AS TIMESTAMP), interval '1 day') AS a(createdAt))" +
            "            order by ta.created_at desc limit :size offset :size*:page\n" +
            "\n"
            , nativeQuery = true)
    List<CustomShoppingHistory> getHistory(String starts, String ends, int size, int page);

    @Query(value = "select count(*) from (select cast(ta.uuid as varchar) as id, ta.created_at as created_at, " +

            "                   (coalesce ((select coalesce (sum(t.amount*t.retail_price),0) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='UZS'),0)+coalesce ((select coalesce (sum(t.amount*t.retail_price*t.usd),0) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='USD'),0))                                                                                   as total,\n" +
            "                   (select concat(u.first_name, ' ', u.last_name) from users u where u.uuid = ta.created_by_uuid) as salesman,\n" +
            "                   ta.created_at                                                                                  as created,\n" +
            "                   coalesce ((select COALESCE(sum(l.loan_sum), 0) from loan l where trade_all_uuid = ta.uuid),0)               as loan,\n" +
            "                   coalesce((select coalesce((select sum(ds.amount) from discount ds where trade_all_uuid = ta.uuid),0)+(select coalesce (sum(discount_price*t.amount), 0) from trade t where t.trade_all_uuid=ta.uuid)),0)           as discount\n" +
            "            from trade_all ta) t \n" +
            "            where cast(t.created_at as date) in (SELECT * FROM generate_series(Cast(:starts AS TIMESTAMP), Cast(:ends AS TIMESTAMP), interval '1 day') AS a(createdAt))"
            , nativeQuery = true)
    Integer getHistoryCount(String starts, String ends);


    @Query(value = "select count(*) from trade_all ta where client_uuid = :client", nativeQuery = true)
    Integer getShoppingHistoryCount(UUID client);

    @Query(value = "select *\n" +
            "                        from (select cast(ta.uuid as varchar) as id,\n" +
            "                                     (coalesce((select sum(t.amount*t.retail_price) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='UZS'),0)+coalesce((select sum(t.amount*t.retail_price*t.usd) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='USD'),0)) as totalSum,\n" +
            "                                     coalesce((select sum(t.amount * t.discount_price) from trade t where t.trade_all_uuid = ta.uuid), 0) +\n" +
            "                                     coalesce((select amount from discount d where d.trade_all_uuid = ta.uuid), 0)    as discountPrice,\n" +
            "                                     coalesce((select loan_sum from loan l where l.trade_all_uuid = ta.uuid), 0)      as loanSum,\n" +
            "                                     c.first_name || ' ' || c.last_name                                               as client,\n" +
            "                                     cast(ta.created_at as time)                                                                    as createdAt,\n" +
            "                                     cast(ta.updated_at as date)                                                                    as updatedAt\n" +
            "                              from trade_all ta\n" +
            "                                       left join client c on ta.client_uuid = c.uuid\n" +
            "                              where cast(ta.created_at as date) = (SELECT CAST(:date AS Date))) r\n" +
            "                        order by r.createdAt desc\n" +
            "\n" +
            "-- select * from trade", nativeQuery = true)
    List<CustomTodayHistory> getTodayHistory(LocalDate date);

    @Query(value = "select *\n" +
            "                        from (select cast(ta.uuid as varchar) as id,\n" +
            "                                     (coalesce((select sum(t.amount*t.retail_price) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='UZS'),0)+coalesce((select sum(t.amount*t.retail_price*t.usd) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='USD'),0)) as totalSum,\n" +
            "                                     coalesce((select sum(t.amount * t.discount_price) from trade t where t.trade_all_uuid = ta.uuid), 0) +\n" +
            "                                     coalesce((select amount from discount d where d.trade_all_uuid = ta.uuid), 0)    as discountPrice,\n" +
            "                                     coalesce((select loan_sum from loan l where l.trade_all_uuid = ta.uuid), 0)      as loanSum,\n" +
            "                                     c.first_name || ' ' || c.last_name                                               as client,\n" +
            "                                     cast(ta.created_at as time)                                                                    as createdAt,\n" +
            "                                     cast(ta.updated_at as date)                                                                    as updatedAt\n" +
            "                              from trade_all ta\n" +
            "                                       left join client c on ta.client_uuid = c.uuid \n" +
            "                              where ta.uuid in (select distinct t1.trade_all_uuid from trade t1 where t1.product_uuid=:product) and cast(ta.created_at as date) = (SELECT CAST(:date AS Date))) r\n" +
            "                        order by r.createdAt desc\n", nativeQuery = true)
    List<CustomTodayHistory> getTodayProductHistory(String date, UUID product);

    @Query(value = "select *\n" +
            "from\n" +
            "     (select cast(ta.uuid as varchar)                                                      as id,\n" +
            "\n" +
            "             (coalesce((select t.amount * t.retail_price\n" +
            "                        from trade t\n" +
            "                        where t.trade_all_uuid = ta.uuid\n" +
            "                          and t.currency_type = 'UZS'\n" +
            "                          and t.product_uuid=:product\n" +
            "                 ), 0) + coalesce(\n" +
            "                      (select t.amount * t.retail_price * t.usd\n" +
            "                       from trade t\n" +
            "                       where t.trade_all_uuid = ta.uuid\n" +
            "                         and t.currency_type = 'USD'\n" +
            "                         and t.product_uuid=:product\n" +
            "                          ), 0))                                 as totalSum,\n" +
            "\n" +
            "             (select t.currency_type from trade t where t.trade_all_uuid = ta.uuid and t.product_uuid=:product)        as currency,\n" +
            "\n" +
            "             coalesce((select t.amount * t.discount_price from trade t where t.trade_all_uuid = ta.uuid and t.product_uuid=:product), 0) +\n" +
            "             coalesce((select amount from discount d where d.trade_all_uuid = ta.uuid ), 0) as discountPrice,\n" +
            "\n" +
            "             coalesce((select loan_sum from loan l where l.trade_all_uuid = ta.uuid), 0)   as loanSum,\n" +
            "             c.first_name || ' ' || c.last_name                                            as client,\n" +
            "             cast(ta.created_at as date)                                                   as createdAt,\n" +
            "             cast(ta.updated_at as date)                                                   as updatedAt\n" +
            "      from trade_all ta\n" +
            "               left join client c on ta.client_uuid = c.uuid\n" +
            "      where ta.uuid in (select distinct t1.trade_all_uuid\n" +
            "                        from trade t1\n" +
            "                        where t1.product_uuid = :product) and cast(ta.created_at as date) in (SELECT * FROM generate_series(Cast(:starts AS TIMESTAMP), Cast(:ends AS TIMESTAMP), interval '1 day') AS a(createdAt))) r order by r.createdAt desc",
            nativeQuery = true)
    List<CustomTodayHistoryRange> getTodayProductHistoryRange(String starts, String ends, UUID product);

    @Query(value = "select cast(ta.uuid as varchar) as id, \n" +
            "       coalesce((select sum(t.amount*t.retail_price-t.discount_price) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='UZS'),0)+coalesce((select sum(t.amount*t.retail_price*t.usd-t.discount_price) from trade t where t.trade_all_uuid=ta.uuid and t.currency_type='USD'),0) as trade,\n" +
            "                   coalesce((select p.received_sum from payment p where p.trade_all_uuid=ta.uuid and p.pay_type='CASH'),0) as cash,\n" +
            "                   coalesce((select p.received_sum from payment p where p.trade_all_uuid=ta.uuid and p.pay_type='CARD'),0) as card,\n" +
            "                   coalesce((select p.received_sum from payment p where p.trade_all_uuid=ta.uuid and p.pay_type='BANK'),0) as bank,\n" +
            "                   coalesce((select d.amount from discount d where d.trade_all_uuid=ta.uuid),0) as discount\n" +
            "            from trade_all ta where ta.uuid=:id", nativeQuery = true)
    List<CustomOneTradeAll> getOneTradeAll(UUID id);
}

//--#pageable

