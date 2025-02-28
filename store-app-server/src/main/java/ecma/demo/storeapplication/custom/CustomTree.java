package ecma.demo.storeapplication.custom;

import java.util.UUID;

public interface CustomTree {
    UUID getId();
    UUID getParent();
    String getLabel();
    boolean getBoolean();
}
