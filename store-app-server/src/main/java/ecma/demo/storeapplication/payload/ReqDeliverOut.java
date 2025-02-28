package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqDeliverOut {
    private Double amount;
    private UUID productId;
    private UUID storeId;
    private Double price;
    private Double usd;
    private String currency;
}
