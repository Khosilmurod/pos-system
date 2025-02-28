package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/productType")
public class ProductTypeController {
    @Autowired
    ProductTypeService productTypeService;
    @GetMapping("/{id}")
    public HttpEntity<?> getOne(@PathVariable UUID id){
        return productTypeService.getOne(id);
    }

    @GetMapping("/all")
    public HttpEntity<?> getAll(){
        return productTypeService.getAll();
    }

    @PostMapping
    public HttpEntity<?> save(@RequestParam String name){
        return productTypeService.save(name);
    }

    @DeleteMapping("/delete/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id){
        return productTypeService.delete(id);
    }

    @PutMapping("/main/{id}")
    public HttpEntity<?> editMain(@PathVariable UUID id){
        return productTypeService.editMain(id);
    }

}
