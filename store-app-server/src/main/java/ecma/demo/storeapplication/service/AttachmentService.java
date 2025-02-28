package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.Attachment;
import ecma.demo.storeapplication.entity.AttachmentContent;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.repository.AttachmentContentRepository;
import ecma.demo.storeapplication.repository.AttachmentRepository;
import ecma.demo.storeapplication.repository.ProductRepository;
import net.bytebuddy.asm.Advice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttachmentService {

    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    AttachmentContentRepository attachmentContentRepository;

    public void getFile(HttpServletResponse response, UUID id) {
            try {
                AttachmentContent file = attachmentContentRepository.getByAttachment(attachmentRepository.getOne(id));
                response.setContentType(file.getAttachment().getContentType());
//            response.setHeader("Content-disposition", "attachment; filename=\"" + file.getAttachment().getOriginalName() + "\"");
                FileCopyUtils.copy(file.getContent(), response.getOutputStream());
            } catch (IOException e) {
                e.printStackTrace();
            }
    }

    public Attachment saveFile(MultipartHttpServletRequest request) {
        Iterator<String> itr = request.getFileNames();
        MultipartFile mpf;
        Attachment image = new Attachment();

//        String oldAttachmentId = request.getParameter("oldAttachmentId")!=null?request.getParameter("oldAttachmentId"):"";

        while (itr.hasNext()) {
            try {
                mpf = request.getFile(itr.next());
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                image.setName(UUID.randomUUID().toString());
                image.setOriginalName(mpf.getOriginalFilename());
                image.setSize(mpf.getSize());
                image.setContentType(mpf.getContentType());
                outputStream.close();
                image = attachmentRepository.save(image);

                AttachmentContent content = new AttachmentContent();
                content.setContent(mpf.getBytes());
                content.setAttachment(image);
                attachmentContentRepository.save(content);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return image;
    }
}
