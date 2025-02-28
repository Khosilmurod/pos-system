package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqWaste {
    private UUID deliverId;
    private Double amount;
    private String desc;
}
