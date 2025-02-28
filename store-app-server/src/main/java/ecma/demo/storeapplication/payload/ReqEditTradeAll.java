package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReqEditTradeAll {
    private Double trade;
    private Double cash;
    private Double card;
    private Double bank;
    private Double discount;
}
