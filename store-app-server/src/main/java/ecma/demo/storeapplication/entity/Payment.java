package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.enums.PayType;
import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.persistence.Column;
import javax.persistence.Entity;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment extends AbsEntity {
    @Column(nullable = false)
    private Double receivedSum;

    @Enumerated(EnumType.STRING)
    private PayType payType;

    @ManyToOne(fetch = FetchType.LAZY)
    private TradeAll tradeAll;




}
