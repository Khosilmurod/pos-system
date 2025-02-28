package ecma.demo.storeapplication.custom;


import java.sql.Timestamp;
import java.util.UUID;

public interface CustomClient {

    String getId();
    String getName();
    String getSurname();
    String getNumber();
    String getDescription();
    Timestamp getRegistered();
    Double getLoan();

}
