package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqLoanPayment;
import ecma.demo.storeapplication.service.LoanPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/loanPayment")
public class LoanPaymentController {
    @Autowired
    LoanPaymentService loanPaymentService;

    @PostMapping
    public HttpEntity<?> saveLoanPayment(@RequestBody ReqLoanPayment reqLoanPayment){
        return loanPaymentService.saveLoanPayment(reqLoanPayment);
    }
    @GetMapping("/debt")
    public HttpEntity<?> getDebtHistory(@RequestParam UUID client, @RequestParam Integer size, @RequestParam Integer page){
        return loanPaymentService.getDebtHistory(client, size, page);
    }
}
