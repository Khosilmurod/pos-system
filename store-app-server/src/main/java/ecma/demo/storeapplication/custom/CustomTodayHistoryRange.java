package ecma.demo.storeapplication.custom;

import java.time.LocalDate;
import java.util.UUID;

public interface CustomTodayHistoryRange {
    UUID getId();
    Double getTotalSum();
    Double getLoanSum();
    Double getDiscountPrice();
    String getClient();
    LocalDate getCreatedAt();
    LocalDate getUpdatedAt();
}
