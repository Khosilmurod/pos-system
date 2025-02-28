package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.entity.Settings;
import ecma.demo.storeapplication.payload.ApiResponse;
import ecma.demo.storeapplication.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.xml.ws.Response;

@Service
public class SettingsService {
    @Autowired
    SettingsRepository settingsRepository;


    public HttpEntity<?> editUsd(Double usd){
        try {
            Settings settings = settingsRepository.findAll().get(0);
            settings.setUsd(usd);
            Settings save = settingsRepository.save(settings);
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
    public HttpEntity<?> editShowWaste(boolean showWaste){
        try {
            Settings settings = settingsRepository.findAll().get(0);
            settings.setShowWaste(showWaste);
            Settings save = settingsRepository.save(settings);
            return ResponseEntity.ok(new ApiResponse("success", true, save));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getOne(){
        try {
            return ResponseEntity.ok(new ApiResponse("success", true, settingsRepository.findAll().get(0)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
