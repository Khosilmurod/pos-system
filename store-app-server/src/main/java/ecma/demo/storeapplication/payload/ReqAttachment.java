package ecma.demo.storeapplication.payload;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NegativeOrZero;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqAttachment {
    private Long size;

    private String name;

    private String originalName;

    private String contentType;
}
