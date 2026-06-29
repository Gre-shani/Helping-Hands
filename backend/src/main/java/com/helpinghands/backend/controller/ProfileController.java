package com.helpinghands.backend.controller;

import com.helpinghands.backend.model.ChildrenHome;
import com.helpinghands.backend.model.ProfileCompletion;
import com.helpinghands.backend.model.ServiceProvider;
import java.util.HashMap;
import com.helpinghands.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/profiles")
@Validated
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

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

    @PostMapping("/children-home")
    public ResponseEntity<?> submitChildrenHomeProfile(
            @RequestHeader(value = "X-User-Id", required = false) Integer userId,
            @Valid @RequestBody ChildrenHomeProfileRequest request,
            BindingResult bindingResult) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing X-User-Id header"));
        }
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(Map.of("error", bindingResult.getAllErrors().get(0).getDefaultMessage()));
        }

        try {
            ChildrenHome savedHome = profileService.saveChildrenHomeProfile(userId, request);
            return ResponseEntity.ok(Map.of("status", "SUBMITTED", "childrenHome", savedHome));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/service-provider")
    public ResponseEntity<?> submitServiceProviderProfile(
            @RequestHeader(value = "X-User-Id", required = false) Integer userId,
            @Valid @RequestBody ServiceProviderProfileRequest request,
            BindingResult bindingResult) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing X-User-Id header"));
        }
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(Map.of("error", bindingResult.getAllErrors().get(0).getDefaultMessage()));
        }

        try {
            ServiceProvider savedProvider = profileService.saveServiceProviderProfile(userId, request);
            return ResponseEntity.ok(Map.of("status", "SUBMITTED", "serviceProvider", savedProvider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/delivery-volunteer", consumes = "application/json")
    public ResponseEntity<?> submitDeliveryVolunteerProfile(
            @RequestHeader(value = "X-User-Id", required = false) Integer userId,
            @Valid @RequestBody DeliveryVolunteerProfileRequest request,
            BindingResult bindingResult) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing X-User-Id header"));
        }
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(Map.of("error", bindingResult.getAllErrors().get(0).getDefaultMessage()));
        }

        try {
            Map<String, Object> response = profileService.saveDeliveryVolunteerProfile(userId, request);
            return ResponseEntity.ok(response);
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
