package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.custom.CustomIncome;
import ecma.demo.storeapplication.custom.CustomStat;
import ecma.demo.storeapplication.custom.CustomTrade;
import ecma.demo.storeapplication.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TradeRepository extends JpaRepository<Trade, UUID> {
    @Query(value = "select (select p.name from product p where p.uuid = t.product_uuid)         as product,\n" +
            "       (select get_parents_uz(cast(p.uuid as varchar(50))) from product p where p.uuid = t.product_uuid)         as path,\n" +
            "       (select p.retail_price from product p where p.uuid = t.product_uuid) as price,\n" +
            "       cast(t.uuid as varchar)                                              as id,\n" +
            "       cast(t.trade_all_uuid as varchar)                                              as trade_all,\n" +
            "       t.amount                                                             as amount,\n" +
            "       t.usd                                                                as usd,\n" +
            "       t.currency_type                                                      as currencyType,\n" +
            "       (select (select pt.name from product_type pt where pt.uuid = p.product_type_uuid)\n" +
            "        from product p\n" +
            "        where p.uuid = t.product_uuid)                                      as type,\n" +
            "       coalesce(t.discount_price, 0)                                        as discountPrice\n" +
            "from trade t\n" +
            "where t.trade_all_uuid = :tradeAllId", nativeQuery = true)
    List<CustomTrade> getTrade(UUID tradeAllId);

    @Query(value = "select (select p.name from product p where p.uuid = t.product_uuid)         as product,\n" +
            "       (select get_parents_uz(cast(p.uuid as varchar(50))) from product p where p.uuid = t.product_uuid)         as path,\n" +
            "       (select p.retail_price from product p where p.uuid = t.product_uuid) as price,\n" +
            "       cast(t.uuid as varchar)                                              as id,\n" +
            "       cast(t.trade_all_uuid as varchar)                                              as trade_all,\n" +
            "       t.amount                                                             as amount,\n" +
            "       t.usd                                                                as usd,\n" +
            "       t.currency_type                                                      as currencyType,\n" +
            "       (select (select pt.name from product_type pt where pt.uuid = p.product_type_uuid)\n" +
            "        from product p\n" +
            "        where p.uuid = t.product_uuid)                                      as type,\n" +
            "       coalesce(t.discount_price, 0)                                        as discountPrice\n" +
            "from trade t\n" +
            "where t.trade_all_uuid = :tradeAllId", nativeQuery = true)
    List<CustomTrade> getHistory(UUID tradeAllId);

    List<Trade> findAllByProductId(UUID id);

    @Query(value = "select(select coalesce(sum(l.loan_sum), 0) from loan l) as loan,(select coalesce(sum(lp.amount), 0) from loan_payment lp) as loan_payment, (select coalesce(sum(w.amount * (select d.price from deliver d where d.uuid = w.deliver_uuid)), 0) from waste w where w.waste_status = 'ACCEPTED' and (select d.currency_type from deliver d where d.uuid = w.deliver_uuid) = 'UZS') + (select coalesce(sum(w.amount * (select d.price * d.usd from deliver d where d.uuid = w.deliver_uuid)), 0) from waste w where w.waste_status = 'ACCEPTED' and (select d.currency_type from deliver d where d.uuid = w.deliver_uuid) = 'USD') as waste, (select coalesce(sum(t.discount_price * t.amount), 0) from trade t) + (select coalesce(sum(all_discount_day.amount), 0) from discount all_discount_day) as discount, (select coalesce(sum(t.amount * t.retail_price), 0) from trade t where t.currency_type = 'UZS') + (select coalesce(sum(t.amount * t.retail_price * t.usd), 0) from trade t where t.currency_type = 'USD') as trade, (select coalesce(sum(d.price * d.amount), 0) from deliver d where d.currency_type = 'UZS') + (select coalesce(sum(d.price * d.amount * d.usd), 0) from deliver d where d.currency_type = 'USD') as deliver, ((select coalesce(sum(d.custom_cost * d.amount), 0) from deliver d where d.currency_type = 'UZS') + (select coalesce(sum(d.custom_cost * d.usd * d.amount), 0) from deliver d where d.currency_type = 'USD')) as custom_cost, ((select coalesce(sum(d.fare_cost * d.amount), 0) from deliver d where d.currency_type = 'UZS') + (select coalesce(sum(d.fare_cost * d.usd * d.amount), 0) from deliver d where d.currency_type = 'USD')) as fare_cost, ((select coalesce(sum(d.other_costs * d.amount), 0) from deliver d where d.currency_type = 'UZS') + (select coalesce(sum(d.other_costs * d.usd * d.amount), 0) from deliver d where d.currency_type = 'USD')) as other_costs, (select coalesce(sum(sum), 0) from expense) as cost, (((select coalesce(sum(t.amount * t.retail_price), 0) from trade t where t.currency_type = 'UZS') + (select coalesce(sum(t.amount * t.retail_price * t.usd), 0) from trade t where t.currency_type = 'USD')) - ((select coalesce(sum(t.discount_price * t.amount), 0) from trade t) + (select coalesce(sum(all_discount_day.amount), 0) from discount all_discount_day)) - ((select coalesce(sum(d.price * d.amount), 0) from deliver d where d.currency_type = 'UZS') + (select coalesce(sum(d.price * d.amount * d.usd), 0) from deliver d where d.currency_type = 'USD') + ((select coalesce(sum(d.other_costs * d.amount), 0) from deliver d where d.currency_type = 'UZS') + (select coalesce(sum(d.other_costs * d.usd * d.amount), 0) from deliver d where d.currency_type = 'USD')) + ((select coalesce(sum(d.fare_cost * d.amount), 0) from deliver d where d.currency_type = 'UZS') + (select coalesce(sum(d.fare_cost * d.usd * d.amount), 0) from deliver d where d.currency_type = 'USD')) + ((select coalesce(sum(d.custom_cost * d.amount), 0) from deliver d where d.currency_type = 'UZS') + (select coalesce(sum(d.custom_cost * d.usd * d.amount), 0) from deliver d where d.currency_type = 'USD'))) / coalesce((select ((select sum(d.amount) from deliver d))), 1) * (select coalesce(sum(t.amount), 0) from trade t)-(select coalesce(sum(sum), 0) from expense)) as real_income", nativeQuery = true)
    CustomIncome getIncomeData();

    @Query(value = "SELECT DISTINCT To_char(dates.created_at, 'yyyy-mm-dd') AS created_at,( - (SELECT COALESCE(Sum(expense_day.price * expense_day.amount), 0) FROM deliver expense_day WHERE expense_day.currency_type = 'UZS') - (SELECT COALESCE(Sum(expense_day.price * expense_day.amount * expense_day.usd), 0) FROM deliver expense_day WHERE expense_day.currency_type = 'USD' ) - (SELECT COALESCE(Sum(custom_cost_day.custom_cost * custom_cost_day.amount), 0) FROM deliver custom_cost_day WHERE custom_cost_day.currency_type = 'UZS') - (SELECT COALESCE( Sum(custom_cost_day.custom_cost * custom_cost_day.usd * custom_cost_day.amount), 0) FROM deliver custom_cost_day WHERE custom_cost_day.currency_type = 'USD') - (SELECT COALESCE(Sum(fare_cost_day.fare_cost * fare_cost_day.amount), 0) FROM deliver fare_cost_day WHERE fare_cost_day.currency_type = 'UZS') - (SELECT COALESCE(Sum(fare_cost_day.fare_cost * fare_cost_day.usd * fare_cost_day.amount), 0) FROM deliver fare_cost_day WHERE fare_cost_day.currency_type = 'USD') - (SELECT COALESCE(Sum(other_costs_day.other_costs * other_costs_day.amount), 0) FROM deliver other_costs_day WHERE other_costs_day.currency_type = 'UZS') - (SELECT COALESCE( Sum(other_costs_day.other_costs * other_costs_day.usd * other_costs_day.amount), 0) FROM deliver other_costs_day WHERE other_costs_day.currency_type = 'USD')) / coalesce((select ((select sum(d.amount) from deliver d ))), 1) * (select coalesce(sum(t.amount), 0) from trade t where To_char(t.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) - (SELECT COALESCE(Sum(discount_day.discount_price * discount_day.amount), 0) FROM trade discount_day WHERE To_char(discount_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) - (select COALESCE(sum(all_discount_day.amount), 0) from discount all_discount_day WHERE To_char(all_discount_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) - (select coalesce(sum(e.sum), 0) from expense e where To_char(e.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) + (SELECT COALESCE(Sum(income_day.amount * income_day.retail_price), 0) FROM trade income_day WHERE income_day.currency_type = 'UZS' and To_char(income_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) + (SELECT COALESCE(Sum(income_day.amount * income_day.retail_price * income_day.usd), 0) FROM trade income_day WHERE income_day.currency_type = 'USD' and To_char(income_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) as daily_money, (SELECT COALESCE(Sum(cash_day.received_sum), 0) FROM payment cash_day WHERE To_char(cash_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') and cash_day.pay_type = 'CASH') + (SELECT COALESCE(Sum(loan_payment_day.amount), 0) FROM loan_payment loan_payment_day WHERE loan_payment_day.pay_type = 'CASH' and To_char(loan_payment_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) AS cash_sum, (SELECT COALESCE(Sum(card_day.received_sum), 0) FROM payment card_day WHERE To_char(card_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') and card_day.pay_type = 'CARD') + (SELECT COALESCE(Sum(loan_payment_day.amount), 0) FROM loan_payment loan_payment_day WHERE loan_payment_day.pay_type = 'CARD' and To_char(loan_payment_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) AS card_sum, (SELECT COALESCE(Sum(bank_day.received_sum), 0) FROM payment bank_day WHERE To_char(bank_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd') and bank_day.pay_type = 'BANK') + (SELECT COALESCE(Sum(loan_payment_day.amount), 0) FROM loan_payment loan_payment_day WHERE loan_payment_day.pay_type = 'BANK' and To_char(loan_payment_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) AS bank_sum, (SELECT COALESCE(Sum(income_day.amount * income_day.retail_price), 0) FROM trade income_day WHERE income_day.currency_type = 'UZS' and To_char(income_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) + (SELECT COALESCE(Sum(income_day.amount * income_day.retail_price * income_day.usd), 0) FROM trade income_day WHERE income_day.currency_type = 'USD' and To_char(income_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) - (SELECT COALESCE(Sum(discount_day.discount_price * discount_day.amount), 0) FROM trade discount_day WHERE To_char(discount_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) - (select COALESCE(sum(all_discount_day.amount), 0) from discount all_discount_day WHERE To_char(all_discount_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd')) AS income_sum, ((SELECT COALESCE(Sum(loan_day.loan_sum), 0) FROM loan loan_day WHERE To_char(loan_day.created_at, 'yyyy-mm-dd') = To_char(dates.created_at, 'yyyy-mm-dd'))) as loans FROM (SELECT * FROM generate_series(Cast(:starts AS TIMESTAMP), Cast(:ends AS TIMESTAMP), interval '1 day') AS t(created_at)) AS dates", nativeQuery = true)
    List<CustomStat> getStat(String starts, String ends);
}
