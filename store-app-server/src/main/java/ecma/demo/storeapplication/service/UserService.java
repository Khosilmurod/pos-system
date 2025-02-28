package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.Attachment;
import ecma.demo.storeapplication.entity.Role;
import ecma.demo.storeapplication.entity.User;
import ecma.demo.storeapplication.entity.enums.RoleName;
import ecma.demo.storeapplication.exception.ResourceNotFoundException;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqUser;
import ecma.demo.storeapplication.repository.AttachmentRepository;
import ecma.demo.storeapplication.repository.RoleRepository;
import ecma.demo.storeapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AttachmentRepository attachmentRepository;

    public HttpEntity<?> getAll(){
        List<User> all = userRepository.findAll();
        return ResponseEntity.ok(new ApiResponse("success", true, all));
    }





    public HttpEntity<?> save(ReqUser reqUser){
        Attachment attachment=null;
        try {
            Optional<User> username = userRepository.findByUsername(reqUser.getUsername());
            Optional<Role> optionalRole = roleRepository.findByRoleName(RoleName.valueOf(reqUser.getRoleName()));
            if(username.isPresent()||!optionalRole.isPresent()){
                return ResponseEntity.ok(new ApiResponse("failed", false));
            }
            List<Role> roles=new ArrayList<>();
            roles.add(optionalRole.get());

            if(reqUser.getAttachmentId()!=null){
                Optional<Attachment> optionalAttachment = attachmentRepository.findById(reqUser.getAttachmentId());
                if(optionalAttachment.isPresent()){
                    attachment=optionalAttachment.get();
                }
            }
            User save = userRepository.save(new User(
                    reqUser.getFirstName(),
                    reqUser.getLastName(),
                    reqUser.getPhoneNumber(),
                    reqUser.getPassportSerial(),
                    reqUser.getPassportNumber(),
                    reqUser.getUsername(),
                    passwordEncoder.encode(reqUser.getPassword()),
                    roles,
                    attachment
            ));
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> edit(ReqUser reqUser, UUID userId){
        try {
            User username = userRepository.findByUsername(reqUser.getUsername()).get();
            User user = userRepository.findById(userId).get();
            if(username.getId()!=user.getId()){
                return ResponseEntity.ok(new ApiResponse("failed", false));
            }
            List<Role> roles=new ArrayList<>();
            Optional<Role> optionalRole = roleRepository.findByRoleName(RoleName.valueOf(reqUser.getRoleName()));
            roles.add(optionalRole.get());

            user.setFirstName(reqUser.getFirstName());
            user.setLastName(reqUser.getLastName());
            user.setUsername(reqUser.getUsername());
            user.setPassportSerial(reqUser.getPassportSerial());
            user.setPassportNumber(reqUser.getPassportNumber());
            user.setRoles(roles);
            User save = userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> deleteUser(UUID id) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);
            if(optionalUser.isPresent()){
                User user = optionalUser.get();
                user.setEnabled(false);
                userRepository.save(user);
                return ResponseEntity.ok(new ApiResponse("success",true));
            }
            return ResponseEntity.ok(new ApiResponse("failed", false));
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
