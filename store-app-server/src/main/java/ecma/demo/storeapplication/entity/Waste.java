package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.enums.WasteStatus;
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
public class Waste extends AbsEntity {

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    private Deliver deliver;

    @Enumerated(EnumType.STRING)
    private WasteStatus wasteStatus;

}
