package ecma.demo.storeapplication.custom;

import java.sql.Timestamp;

public interface CustomDebt {

    Timestamp getCreated();
    Double getAmount();
    Double getSum();
    Boolean getLoan();

}