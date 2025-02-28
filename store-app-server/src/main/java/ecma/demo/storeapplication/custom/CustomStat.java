package ecma.demo.storeapplication.custom;

import org.springframework.beans.factory.annotation.Value;

public interface CustomStat {

    @Value("#{target.created_at}")
    String getName();
    @Value("#{target.cash_sum}")
    Double getCash();
    Double getLoans();
    @Value("#{target.card_sum}")
    Double getCard();
    @Value("#{target.bank_sum}")
    Double getBank();
    @Value("#{target.income_sum}")
    Double getIncome();
    @Value("#{target.daily_money}")
    Double getDailyMoney();
}
