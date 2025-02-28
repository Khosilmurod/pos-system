package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqProduct;
import ecma.demo.storeapplication.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping("{id}")
    public HttpEntity<?> getById(@PathVariable String  id){
        return productService.getById(id);
    }

    @GetMapping("/search")
    public HttpEntity<?> getProductsBySearch(@RequestParam String search,Integer page, Integer size) {
        return productService.getBySearch(search, page, size);
    }

    @GetMapping("/store/{id}")
    public HttpEntity<?> getStoreProduct(@PathVariable UUID id){
        return productService.getStoreProduct(id);
    }

    @GetMapping("/sale/{id}")
    public HttpEntity<?> getSaleProduct(@PathVariable UUID id){
        return productService.getSaleProduct(id);
    }



    @GetMapping("/category")
    public HttpEntity<?> getProductsByCategory(@RequestParam String parentId,
                                               @RequestParam Integer page,
                                               @RequestParam Integer size) {

        return productService.getByCategory(parentId, page, size);
    }

    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqProduct reqProduct) {
        return productService.save(reqProduct);

    }

    @PatchMapping("{id}")
    public HttpEntity<?> update(@PathVariable UUID id, @RequestBody ReqProduct reqProduct) {
        return productService.edit(id,reqProduct);
    }

    @DeleteMapping("{id}")
    public HttpEntity<?> delete(@PathVariable UUID id){
        return productService.delete(id);
    }

    @GetMapping("/remain")
    public HttpEntity<?> getProductRemain(@RequestParam String search, @RequestParam String sort, @RequestParam Integer page, @RequestParam Integer size){
        return productService.getProductRemain(search, page, size, sort);
    }
}
