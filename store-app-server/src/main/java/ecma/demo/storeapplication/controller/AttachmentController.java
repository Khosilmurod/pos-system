package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.entity.Attachment;
import ecma.demo.storeapplication.repository.AttachmentContentRepository;
import ecma.demo.storeapplication.repository.AttachmentRepository;
import ecma.demo.storeapplication.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@RestController
@RequestMapping("/api/file")
public class AttachmentController {

    @Autowired
    AttachmentService attachmentService;
    @Autowired
    AttachmentContentRepository attachmentContentRepository;
    @Autowired
    AttachmentRepository attachmentRepository;

    @GetMapping("/get/{id}")
    public void getFile(HttpServletResponse response, @PathVariable UUID id) {
        attachmentService.getFile(response, id);
    }

//    @PreAuthorize(value = "hasRole('ROLE_DIRECTOR')")
    @PostMapping("/save")
    public Attachment save(MultipartHttpServletRequest request){
        return attachmentService.saveFile(request);
    }

    @DeleteMapping("{id}")
    public HttpEntity<?> delete(@PathVariable String id){
        return null;
    }

}
