package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {

    private String message;
    private Boolean success;
    private Object object;
    private Double productAmount;

    public ApiResponse(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }

    public ApiResponse(String message, Boolean success, Object object) {
        this.message = message;
        this.success = success;
        this.object = object;
    }
}
