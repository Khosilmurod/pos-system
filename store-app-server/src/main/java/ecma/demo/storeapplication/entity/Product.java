package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.enums.CurrencyType;
import ecma.demo.storeapplication.entity.template.AbsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Optional;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product extends AbsEntity {

    @Column(nullable = false)
    private String name;

    private String enName;

    private String code;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    @OneToOne
    private ProductType productType;

    @Enumerated(EnumType.STRING)
    private CurrencyType currencyType;

    private Double price;
    private Double retailPrice;
    private Double fullSalePrice;
    private Double otherCosts;
    private Double discountPrice;
    private Double fareCost;
    private Double customCost;
    private Double juan;

    public Product(String name, String enName, String code, Attachment attachment, Category category, ProductType productType) {
        this.name = name;
        this.enName = enName;
        this.code = code;
        this.attachment = attachment;
        this.category = category;
        this.productType = productType;
    }
}
