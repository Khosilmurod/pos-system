package ecma.demo.storeapplication.payload;

import ecma.demo.storeapplication.entity.Attachment;
import ecma.demo.storeapplication.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqProduct {
    private String name;
    private String enName;
    private String code;
    private UUID attachmentId;
    private UUID categoryId;
    private UUID productTypeId;
}
