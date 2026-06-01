package com.helpinghands.backend.repository;

import com.helpinghands.backend.model.ProfileCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileCompletionRepository extends JpaRepository<ProfileCompletion, Long> {
    Optional<ProfileCompletion> findByUserId(Integer userId);
    Optional<ProfileCompletion> findByUserIdAndRole(Integer userId, String role);
}
