package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResTree {
    private UUID key;
    private UUID parent;
    private String title;
    private Boolean isLeaf;
    private List<ResTree> children;

}
