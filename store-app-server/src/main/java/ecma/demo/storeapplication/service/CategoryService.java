package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomTree;
import ecma.demo.storeapplication.entity.Category;
import ecma.demo.storeapplication.entity.Product;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.payload.ReqCategory;
import ecma.demo.storeapplication.payload.ResPath;
import ecma.demo.storeapplication.payload.ResTree;
import ecma.demo.storeapplication.repository.CategoryRepository;
import ecma.demo.storeapplication.repository.ProductRepository;
import org.apache.commons.collections4.list.TreeList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    public HttpEntity<?> getTree(UUID parentId) {
        List<CustomTree> all = categoryRepository.getAll();
        List<Category> categories = categoryRepository.findByParentId(parentId);
        List<Product> products = productRepository.findByCategoryId(parentId);
        if(categories.size()==0&&products.size()==0){
            return ResponseEntity.ok(new ApiResponse("failed", false));
        }
        List<ResTree> Tree = toTree(all, parentId);
        return ResponseEntity.ok(new ApiResponse("success", true, Tree));
    }

    public HttpEntity<?> getOne(UUID id){
        try {
            return ResponseEntity.ok(new ApiResponse("success", true, categoryRepository.findById(id)));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> get(UUID patentId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page-1, size);
        Page<Category> allCategories = categoryRepository.findCategoriesByParent(patentId, pageable);
        return ResponseEntity.ok(new ApiResponse("success",true, allCategories));
    }

    public HttpEntity<?> save(ReqCategory reqCategory) {
        Category category=null;
        try {
            if(reqCategory.getParentId()!=null){
                Optional<Category> optionalCategory = categoryRepository.findById(reqCategory.getParentId());
                if(optionalCategory.isPresent()){
                    category=optionalCategory.get();
                }
            }

            Category save = categoryRepository.save(new Category(reqCategory.getName().substring(0, 1).toUpperCase() + reqCategory.getName().substring(1), reqCategory.getEnName(), category));
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> edit(UUID categoryId, ReqCategory reqCategory) {
        Category category=null;
        try {
            if(reqCategory.getParentId()!=null){
                Optional<Category> optionalCategory = categoryRepository.findById(reqCategory.getParentId());
                if(optionalCategory.isPresent()){
                    category=optionalCategory.get();
                }
            }
            Category editCategory = categoryRepository.findById(categoryId).get();
            editCategory.setName(reqCategory.getName().substring(0,1).toUpperCase()+reqCategory.getName().substring(1));
            editCategory.setParent(category);
            editCategory.setEnName(reqCategory.getEnName());
            categoryRepository.save(editCategory);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> delete(UUID categoryId) {
        try {
            categoryRepository.deleteById(categoryId);
            return ResponseEntity.ok(new ApiResponse("success",true));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getSearchedTree(UUID id){
        UUID parentId=id;
        List<CustomTree> all = categoryRepository.getAll();
        List<ResTree> Tree=new ArrayList<>();

        Optional<Product> optionalProduct = productRepository.findById(id);
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if(optionalProduct.isPresent()){
            if(optionalProduct.get().getCategory()==null){
                parentId=null;
            }else {
                parentId=optionalProduct.get().getCategory().getId();
            }
        }
        if(optionalCategory.isPresent()){
            if(optionalCategory.get().getParent()==null){
                parentId=null;
            }else {
                parentId=optionalCategory.get().getParent().getId();
            }
        }
        List<ResTree> tree = toTree(all, parentId);

        return ResponseEntity.ok(new ApiResponse("success",true, tree));
    }

    public HttpEntity<?> getSearchOptions(String search){
        List<CustomTree> searched = categoryRepository.getSearched(search.toLowerCase());
        List<ResPath> paths=new ArrayList<>();
        for (CustomTree tree : searched) {
            String path = path(tree, "");
            paths.add(new ResPath(tree.getId(), path, tree.getBoolean()));
        }
        return ResponseEntity.ok(new ApiResponse("success", true, paths));
    }

    public HttpEntity<?> getCategoryParent(UUID id){
        try {
            if(id==null){
                return ResponseEntity.ok(new ApiResponse("success", true, new ResPath(null, "/", false)));
            }
            CustomTree customTree=categoryRepository.getCategoryParent(id);
            String path = path(customTree, "");
            ResPath resPath=new ResPath(id, path, false);
            return ResponseEntity.ok(new ApiResponse("success", true, resPath));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    //functions
    public String path(CustomTree customs, String path){
        String secondPath=customs.getLabel()+"/"+path;
        if(customs.getParent()!=null){
            CustomTree parent = categoryRepository.getParent(customs.getParent()).get(0);
            secondPath = path(parent, secondPath);
        }
        return secondPath;
    }
    public List<ResTree> toTree(List<CustomTree> customs, UUID parentId){
        List<ResTree> Tree=new ArrayList<>();
        for (CustomTree custom : customs) {
            if(custom.getParent()==null){
                if(custom.getParent()==parentId){
                    List<ResTree> nodes=null;
//                    List<ResTree> nodes = toTree(customs, custom.getId());
                    Tree.add(new ResTree(custom.getId(),custom.getParent(), custom.getLabel(), custom.getBoolean(),nodes));
                }
            }else if(custom.getParent().equals(parentId)){
                List<ResTree> nodes=null;
//                List<ResTree> nodes = toTree(customs, custom.getId());
                Tree.add(new ResTree(custom.getId(),custom.getParent(), custom.getLabel(), custom.getBoolean(),nodes));
            }
        }
        return Tree;
    }
}
