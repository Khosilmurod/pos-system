package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqCategory;
import ecma.demo.storeapplication.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @GetMapping
    public HttpEntity<?> getAllCategories(@RequestParam UUID parentId, @RequestParam Integer page, @RequestParam Integer size) {
        return categoryService.get(parentId, page, size);
    }

    @GetMapping("/tree")
    public HttpEntity<?> getTree(@RequestParam UUID id) {
        return categoryService.getTree(id);
    }

    @GetMapping("/searchedTree")
    public HttpEntity<?> getSearchedTree(@RequestParam UUID id) {
        return categoryService.getSearchedTree(id);
    }

    @GetMapping("/tree/search")
    public HttpEntity<?> getSearchCategory(@RequestParam String search) {
        return categoryService.getSearchOptions(search);
    }

    @GetMapping("/one/{id}")
    public HttpEntity<?> getOne(@PathVariable UUID id){
        return categoryService.getOne(id);
    }

    @GetMapping("/parent")
    public HttpEntity<?> getCategoryParent(@RequestParam(required = false) UUID id) {
        return categoryService.getCategoryParent(id);
    }

    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqCategory reqCategory) {
        return categoryService.save(reqCategory);
    }

    @PatchMapping("/{id}")
    public HttpEntity<?> update(@PathVariable UUID id, @RequestBody ReqCategory reqCategory) {
        return categoryService.edit(id, reqCategory);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return categoryService.delete(id);
    }
}
