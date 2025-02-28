package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.Expense;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqExpense;
import ecma.demo.storeapplication.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ExpenseService {
    @Autowired
    ExpenseRepository expenseRepository;

    public HttpEntity<?> save(ReqExpense reqExpense){
        try {
            Expense save = expenseRepository.save(new Expense(reqExpense.getSum(), reqExpense.getDescription()));
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> getAll(int size, int page){
        try {
            Pageable pageable=PageRequest.of(page, size);
            Page<Expense> all = expenseRepository.findAllByOrderByUpdatedAtDesc(pageable);
            return ResponseEntity.ok(new ApiResponse("success", true, all));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> edit(ReqExpense reqExpense, UUID uuid){
        try {
            Expense expense = expenseRepository.findById(uuid).get();
            expense.setSum(reqExpense.getSum());
            expense.setDescription(reqExpense.getDescription());
            Expense save = expenseRepository.save(expense);
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> delete(UUID uuid){
        try {
            expenseRepository.deleteById(uuid);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
