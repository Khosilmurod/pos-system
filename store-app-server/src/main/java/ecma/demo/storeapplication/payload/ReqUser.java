package ecma.demo.storeapplication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqUser {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String passportSerial;
    private String passportNumber;
    private String phoneNumber;
    private String roleName;
    private UUID attachmentId;

}
