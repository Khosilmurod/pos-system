package ecma.demo.storeapplication.custom;

import java.util.UUID;

public interface CustomCategory {

    UUID getId();
    UUID getParentId();
    String getLabel();

}
