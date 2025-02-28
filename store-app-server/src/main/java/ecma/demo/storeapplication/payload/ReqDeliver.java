package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqDeliver {
    private Double price;
    private Double usd;
    private Double amount;
    private String currency;
    private UUID productId;
    private Double otherCosts;
    private Double fareCost;
    private Double customCost;
    private Double juan;
    private Double retailPrice;
    private Double discountPrice;
    private Double fullSalePrice;
}
