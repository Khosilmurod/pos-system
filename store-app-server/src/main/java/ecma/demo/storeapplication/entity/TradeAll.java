package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeAll extends AbsEntity {

    private Double discount;

    @ManyToOne(fetch = FetchType.LAZY)
    private Client client;

    public TradeAll(Double discount) {
        this.discount = discount;
    }
}
