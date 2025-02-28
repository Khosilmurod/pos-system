package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqExpense;
import ecma.demo.storeapplication.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/expense")
public class ExpenseController {
    @Autowired
    ExpenseService expenseService;

    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqExpense reqExpense){
        return expenseService.save(reqExpense);
    }

    @GetMapping
    public HttpEntity<?> getAll(@RequestParam int size, @RequestParam int page){
        return expenseService.getAll(size, page);
    }

    @PutMapping("/{id}")
    public HttpEntity<?> edit(@RequestBody ReqExpense reqExpense, @PathVariable UUID id){
        return expenseService.edit(reqExpense, id);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id){
        return expenseService.delete(id);
    }
}
