package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.entity.User;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqUser;
import ecma.demo.storeapplication.security.CurrentUser;
import ecma.demo.storeapplication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/me")
    public HttpEntity<?> getUser(@CurrentUser User user) {
        if (user == null) {
            return ResponseEntity.ok(new ApiResponse("error",false));
        } else {
            return ResponseEntity.ok(new ApiResponse("success", true, user));
        }
    }

    @GetMapping("/all")
    public HttpEntity<?> getAll(){
        return userService.getAll();
    }


    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqUser reqUser){
        return userService.save(reqUser);
    }


    @DeleteMapping("{id}")
    public HttpEntity<?> deleteUser(@PathVariable UUID id){
        return userService.deleteUser(id);
    }
//    @PutMapping
//    public HttpEntity<?> edit(@RequestBody ReqUser reqUser, @RequestParam UUID userId){
//        return userService.edit(reqUser, userId);
//    }
}
