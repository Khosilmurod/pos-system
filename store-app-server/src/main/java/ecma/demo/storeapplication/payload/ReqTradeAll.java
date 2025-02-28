package ecma.demo.storeapplication.payload;


import ecma.demo.storeapplication.entity.Client;
import ecma.demo.storeapplication.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqTradeAll {

    private Double totalSum;
    private Double discount;
    private UUID clientId;
    private Double card;
    private Double cash;
    private Double bank;
    private Double debt;
    private Double receivedSum;
    private List<ReqData> data;

}
