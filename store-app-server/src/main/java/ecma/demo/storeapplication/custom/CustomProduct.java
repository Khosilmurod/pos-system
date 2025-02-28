package ecma.demo.storeapplication.custom;

import java.util.UUID;

public interface CustomProduct {

    UUID getId();

    String getName();

    UUID getAttachmentId();

    Double getRetailPrice();
}
