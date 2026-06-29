package com.helpinghands.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.helpinghands.backend.controller.ChildrenHomeProfileRequest;
import com.helpinghands.backend.controller.DeliveryVolunteerProfileRequest;
import com.helpinghands.backend.controller.ServiceProviderProfileRequest;
import com.helpinghands.backend.model.ChildrenHome;
import com.helpinghands.backend.model.ProfileCompletion;
import com.helpinghands.backend.model.ServiceProvider;
import com.helpinghands.backend.repository.ChildrenHomeRepository;
import com.helpinghands.backend.repository.ProfileCompletionRepository;
import com.helpinghands.backend.repository.ServiceProviderRepository;
import com.helpinghands.backend.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileCompletionRepository profileCompletionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChildrenHomeRepository childrenHomeRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @PersistenceContext
    private EntityManager entityManager;

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

    @Transactional
    public ChildrenHome saveChildrenHomeProfile(Integer userId, ChildrenHomeProfileRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));

        var childrenHome = childrenHomeRepository.findByUserId(userId)
                .orElse(new ChildrenHome());

        childrenHome.setUserId(userId);
        childrenHome.setHomeName(request.getHomeName());
        childrenHome.setRegistrationNumber(request.getRegistrationNumber());
        childrenHome.setCapacity(request.getCapacity());
        childrenHome.setBankAccountDetails(request.getBankAccountDetails());
        childrenHome.setRegCertificateUrl(request.getRegCertificateUrl());

        var savedHome = childrenHomeRepository.save(childrenHome);
        user.setProfileCompletionStatus("SUBMITTED");
        userRepository.save(user);

        return savedHome;
    }

    @Transactional
    public ServiceProvider saveServiceProviderProfile(Integer userId, ServiceProviderProfileRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));

        var provider = serviceProviderRepository.findByUserId(userId)
                .orElse(new ServiceProvider());

        provider.setUserId(userId);
        provider.setServiceType(request.getServiceType());
        provider.setOperationalRegion(request.getOperationalRegion());
        provider.setPoliceClearanceUrl(request.getPoliceClearanceUrl());

        var savedProvider = serviceProviderRepository.save(provider);
        user.setProfileCompletionStatus("SUBMITTED");
        userRepository.save(user);

        return savedProvider;
    }

    public Map<String, Object> saveDeliveryVolunteerProfile(Integer userId, DeliveryVolunteerProfileRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));

        user.setProfileCompletionStatus("SUBMITTED");
        userRepository.save(user);

        return Map.of(
                "status", "SUBMITTED",
                "deliveryVolunteer", Map.of(
                        "nicFrontImage", request.getNicFrontImage(),
                        "nicBackImage", request.getNicBackImage()
                )
        );
    }

    public ProfileCompletion updateProfileCompletion(Integer userId, Integer completionPercentage) {
        return updateProfileCompletion(userId, completionPercentage, null);
    }

    public ProfileCompletion updateProfileCompletion(Integer userId, Integer completionPercentage, Object profileData) {
        Optional<ProfileCompletion> profileOpt = profileCompletionRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found for user: " + userId);
        }

        ProfileCompletion profile = profileOpt.get();
        profile.setCompletionPercentage(completionPercentage);
        if (profileData != null) {
            try {
                profile.setProfileData(new ObjectMapper().writeValueAsString(profileData));
            } catch (Exception e) {
                throw new RuntimeException("Failed to serialize profile data", e);
            }
        }
        return profileCompletionRepository.save(profile);
    }

    @Transactional
    public ProfileCompletion markProfileComplete(Integer userId) {
        Optional<ProfileCompletion> profileOpt = profileCompletionRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found for user: " + userId);
        }

        ProfileCompletion profile = profileOpt.get();
        profile.setIsCompleted(true);
        profile.setCompletionPercentage(100);
        ProfileCompletion saved = profileCompletionRepository.save(profile);

        String phoneVal = null;
        String addressVal = null;

        if (profile.getProfileData() != null) {
            try {
                Map<String, Object> parsed = new ObjectMapper().readValue(profile.getProfileData(), Map.class);
                if (parsed.containsKey("phone") && parsed.get("phone") != null) {
                    phoneVal = parsed.get("phone").toString();
                }
                if (parsed.containsKey("address") && parsed.get("address") != null) {
                    addressVal = parsed.get("address").toString();
                }
            } catch (Exception e) {
                System.out.println("Warning: Could not parse wizard data string: " + e.getMessage());
            }
        }

        try {
            String sql = "UPDATE users SET profile_completion_status = 'COMPLETED', phone = :phone, address = :address WHERE user_id = :userId";
            entityManager.createNativeQuery(sql)
                         .setParameter("phone", phoneVal)
                         .setParameter("address", addressVal)
                         .setParameter("userId", userId)
                         .executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException("Direct database update failed", e);
        }

        return saved;
    }
}