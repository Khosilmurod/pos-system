package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqData {
    private String name;
    private Double retailPrice;
    private Double amount;
    private Double discountPrice;
    private UUID productId;
}
