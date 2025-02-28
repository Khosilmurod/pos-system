package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqClient;
import ecma.demo.storeapplication.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    ClientService clientService;

    @GetMapping
    public HttpEntity<?> getAllClients(@RequestParam String search, @RequestParam Boolean debt, @RequestParam String sort, @RequestParam Integer page, @RequestParam Integer size){
        return clientService.getAllClients(search, debt, page, size, sort);
    }

//    not added
    @GetMapping("/search")
    public HttpEntity<?>getSearchedClient(@RequestParam String search){
        return clientService.getSearchedClient(search);
    }

    @PostMapping
    public HttpEntity<?> saveClient(@RequestBody ReqClient reqClient){
        return clientService.saveClient(reqClient);
    }

    @PutMapping("{id}")
    public HttpEntity<?> editClient(@RequestBody ReqClient reqClient, @PathVariable UUID id){
        return clientService.editClient(reqClient, id);
    }

    @DeleteMapping("{id}")
    public HttpEntity<?> deleteClient(@PathVariable UUID id){
        return clientService.deleteClient(id);
    }
}