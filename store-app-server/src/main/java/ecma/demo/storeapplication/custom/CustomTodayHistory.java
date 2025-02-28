package ecma.demo.storeapplication.custom;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public interface CustomTodayHistory {
    UUID getId();
    Double getTotalSum();
    Double getLoanSum();
    Double getDiscountPrice();
    String getClient();
    LocalTime getCreatedAt();
    LocalDate getUpdatedAt();
}
