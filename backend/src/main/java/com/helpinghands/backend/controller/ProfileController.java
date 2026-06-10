package com.helpinghands.backend.controller;

import com.helpinghands.backend.model.ProfileCompletion;
import com.helpinghands.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/{userId}/completion-status")
    public ResponseEntity<?> getCompletionStatus(@PathVariable Integer userId) {
        try {
            ProfileCompletion profile = profileService.getProfileCompletion(userId);
            if (profile == null) {
                return ResponseEntity.ok(Map.of(
                    "userId", userId,
                    "isCompleted", false,
                    "completionPercentage", 0
                ));
            }
            return ResponseEntity.ok(Map.of(
                "userId", userId,
                "isCompleted", profile.getIsCompleted(),
                "completionPercentage", profile.getCompletionPercentage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{userId}/initialize")
    public ResponseEntity<?> initializeProfile(@PathVariable Integer userId, @RequestBody Map<String, String> request) {
        try {
            String role = request.get("role");
            ProfileCompletion profile = profileService.initializeProfileCompletion(userId, role);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{userId}/update-progress")
    public ResponseEntity<?> updateProgress(@PathVariable Integer userId, @RequestBody Map<String, Object> request) {
        try {
            Number completionNumber = (Number) request.get("completionPercentage");
            Integer completionPercentage = completionNumber != null ? completionNumber.intValue() : null;
            Object profileData = request.get("profileData");
            ProfileCompletion profile = profileService.updateProfileCompletion(userId, completionPercentage, profileData);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{userId}/mark-complete")
    public ResponseEntity<?> markComplete(@PathVariable Integer userId) {
        try {
            ProfileCompletion profile = profileService.markProfileComplete(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
