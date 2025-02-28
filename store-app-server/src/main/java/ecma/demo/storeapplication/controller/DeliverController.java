package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqDeliver;
import ecma.demo.storeapplication.payload.ReqDeliverAll;
import ecma.demo.storeapplication.service.DeliverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/deliver")
public class DeliverController {
    @Autowired
    DeliverService deliverService;

    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqDeliverAll reqDeliverAll){
        return deliverService.save(reqDeliverAll);
    }

    @PutMapping("/{id}")
    public HttpEntity<?> edit(@RequestBody ReqDeliver deliver, @PathVariable UUID id){
        return deliverService.edit(deliver, id);
    }

    @GetMapping("/history/{id}")
    public HttpEntity<?> getProductHistory(@PathVariable UUID id, @RequestParam Integer size, @RequestParam Integer page){
        return deliverService.getProductHistory(id, page, size);
    }

    @GetMapping("/history")
    public HttpEntity<?> getHistory(@RequestParam Integer size, @RequestParam Integer page, @RequestParam String start, @RequestParam String end, @RequestParam String search){
        return deliverService.getHistory(search, start, end, page, size);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> deleteDeliver(@PathVariable UUID id){
        return deliverService.deleteDeliver(id);
    }
}
