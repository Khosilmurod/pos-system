package ecma.demo.storeapplication.controller;


import ecma.demo.storeapplication.payload.JwtAuthenticationResponse;
import ecma.demo.storeapplication.payload.ReqLogin;
import ecma.demo.storeapplication.repository.UserRepository;
import ecma.demo.storeapplication.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @PostMapping
    public HttpEntity<?> loginUser(@RequestBody ReqLogin reqLogin){
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(reqLogin.getUsername(), reqLogin.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authenticate);
        String generateToken = jwtTokenProvider.generateToken(authenticate);
        return ResponseEntity.ok(new JwtAuthenticationResponse(generateToken));
    }

}
