package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Trade extends AbsEntity {

    @Column(nullable = false)
    private Double amount;
    @Column(nullable = false)
    private Double retailPrice;

    private Double discountPrice;
    private Double usd;

    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private TradeAll tradeAll;



}
