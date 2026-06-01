package com.helpinghands.backend.service;

import com.helpinghands.backend.model.ProfileCompletion;
import com.helpinghands.backend.model.User;
import com.helpinghands.backend.repository.ProfileCompletionRepository;
import com.helpinghands.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileCompletionRepository profileCompletionRepository;

    @Autowired
    private UserRepository userRepository;

    public ProfileCompletion getProfileCompletion(Integer userId) {
        Optional<ProfileCompletion> profile = profileCompletionRepository.findByUserId(userId);
        return profile.orElse(null);
    }

    public ProfileCompletion initializeProfileCompletion(Integer userId, String role) {
        Optional<ProfileCompletion> existing = profileCompletionRepository.findByUserIdAndRole(userId, role);
        if (existing.isPresent()) {
            return existing.get();
        }

        ProfileCompletion profile = new ProfileCompletion();
        profile.setUserId(userId);
        profile.setRole(role);
        profile.setCompletionPercentage(0);
        profile.setIsCompleted(false);
        return profileCompletionRepository.save(profile);
    }

    public ProfileCompletion updateProfileCompletion(Integer userId, Integer completionPercentage) {
        Optional<ProfileCompletion> profileOpt = profileCompletionRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found for user: " + userId);
        }

        ProfileCompletion profile = profileOpt.get();
        profile.setCompletionPercentage(completionPercentage);
        return profileCompletionRepository.save(profile);
    }

    public ProfileCompletion markProfileComplete(Integer userId) {
        Optional<ProfileCompletion> profileOpt = profileCompletionRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found for user: " + userId);
        }

        ProfileCompletion profile = profileOpt.get();
        profile.setIsCompleted(true);
        profile.setCompletionPercentage(100);
        ProfileCompletion saved = profileCompletionRepository.save(profile);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfileCompletionStatus("COMPLETED");
        userRepository.save(user);

        return saved;
    }
}
