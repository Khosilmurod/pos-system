package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Attachment;
import ecma.demo.storeapplication.entity.AttachmentContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface AttachmentContentRepository extends JpaRepository<AttachmentContent, UUID> {
AttachmentContent getByAttachment(Attachment attachment);

    @Modifying
    @Query(value = "delete from attachment_content ac where ac.attachment_id = :uuid", nativeQuery = true)
    void deleteByAttachment(UUID uuid);
}
