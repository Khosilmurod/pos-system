package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.Payment;
import ecma.demo.storeapplication.entity.enums.PayType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.repository.ClientRepository;
import ecma.demo.storeapplication.repository.PaymentRepository;
import ecma.demo.storeapplication.repository.TradeAllRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    TradeAllRepository tradeAllRepository;
    @Autowired
    ClientRepository clientRepository;
//
//    public HttpEntity<?> get(@RequestParam)

//    public HttpEntity<?> save(ReqPayment reqPayment) {
//
//        List<Payment> payments = new ArrayList<>();
////        Client clientById = clientRepository.getClientById(reqPayment.getClientId());
//
//        if (reqPayment.getReceivedSum()>0){
//
//            if (reqPayment.getCash()>0){
//                Payment cash = paymentRepository.save(new Payment(reqPayment.getCash(), PayType.CASH));
//                payments.add(cash);
//            }
//            if (reqPayment.getCard()>0){
//                Payment card = paymentRepository.save(new Payment(reqPayment.getCard(), PayType.CARD));
//                payments.add(card);
//            }
//            if (reqPayment.getBank()>0){
//                Payment bank = paymentRepository.save(new Payment(reqPayment.getBank(), PayType.BANK));
//                payments.add(bank);
//
//            }
//            List<Payment> paymentList = paymentRepository.saveAll(payments);
//            return ResponseEntity.ok(new ApiResponse("success",true, paymentList));
//        }
//        return ResponseEntity.ok(new ApiResponse("error",false));
//
//    }
}
