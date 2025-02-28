package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqWaste;
import ecma.demo.storeapplication.service.WasteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/waste")
public class WasteController {
    @Autowired
    WasteService wasteService;

    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqWaste reqWaste){
        return wasteService.save(reqWaste);
    }

    @PutMapping("/{id}")
    HttpEntity<?> edit(@PathVariable UUID id){
        return wasteService.edit(id);
    }

    @DeleteMapping("/{id}")
    HttpEntity<?> delete(@PathVariable UUID id){
        return wasteService.delete(id);
    }

    @GetMapping
    public HttpEntity<?> getAll(@RequestParam Integer page, @RequestParam Integer size, @RequestParam String wasteStatus){
        return wasteService.getAll(page, size, wasteStatus);
    }
}
