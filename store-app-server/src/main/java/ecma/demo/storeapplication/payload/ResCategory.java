package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResCategory {

    private UUID id;
    private UUID parentId;
    private String label;
   
}
