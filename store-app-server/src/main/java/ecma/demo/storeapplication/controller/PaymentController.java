package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

//    @PostMapping
//    public HttpEntity<?> save(@RequestBody ReqPayment reqPayment){
//        return paymentService.save(reqPayment);
//    }
}
