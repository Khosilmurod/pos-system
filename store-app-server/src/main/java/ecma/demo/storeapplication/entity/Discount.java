package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Discount extends AbsEntity {

    private Double amount;

    @OneToOne(fetch = FetchType.LAZY)
    private TradeAll tradeAll;

}
