package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.repository.SettingsRepository;
import ecma.demo.storeapplication.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/settings")
public class SettingsController {
    @Autowired
    SettingsService settingsService;

    @PutMapping
    public HttpEntity<?> saveUsd(@RequestParam Double usd){
        return settingsService.editUsd(usd);
    }

    @PutMapping("/waste")
    public HttpEntity<?> saveShowWaste(@RequestParam boolean showWaste){
        return settingsService.editShowWaste(showWaste);
    }

    @GetMapping
    public HttpEntity<?> getOne(){
        return settingsService.getOne();
    }
}
