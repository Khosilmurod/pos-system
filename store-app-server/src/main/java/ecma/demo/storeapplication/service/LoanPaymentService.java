package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomDebt;
import ecma.demo.storeapplication.entity.Loan;
import ecma.demo.storeapplication.entity.LoanPayment;
import ecma.demo.storeapplication.entity.enums.PayType;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqLoanPayment;
import ecma.demo.storeapplication.repository.ClientRepository;
import ecma.demo.storeapplication.repository.LoanPaymentRepository;
import ecma.demo.storeapplication.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LoanPaymentService {
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    LoanPaymentRepository loanPaymentRepository;
    @Autowired
    LoanRepository loanRepository;

    public HttpEntity<?> saveLoanPayment(ReqLoanPayment reqLoanPayment){
        try {
            if(reqLoanPayment.getAmount()>0){
                PayType payType = PayType.valueOf(reqLoanPayment.getType());
                LoanPayment loanPayment=new LoanPayment(reqLoanPayment.getAmount(), clientRepository.findById(reqLoanPayment.getClient()).get(), payType);

                return ResponseEntity.ok(new ApiResponse("success", true, loanPaymentRepository.save(loanPayment)));
            }
            if(reqLoanPayment.getAmount()<0){
                Loan save = loanRepository.save(new Loan(Math.abs(reqLoanPayment.getAmount()), "", clientRepository.findById(reqLoanPayment.getClient()).get(), null));
                return ResponseEntity.ok(new ApiResponse("success", true, save));
            }
            return ResponseEntity.ok(new ApiResponse("failed", false));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> getDebtHistory(UUID client, Integer size, Integer page){
        List<CustomDebt> debtHistory = loanPaymentRepository.getDebtHistory(client, size, page);

        Page<CustomDebt> returnCustomDebt=new PageImpl<>(debtHistory, PageRequest.of(page, size), loanPaymentRepository.getDebtHistoryCount(client));
        return ResponseEntity.ok(new ApiResponse("success", true, returnCustomDebt));
    }
}
