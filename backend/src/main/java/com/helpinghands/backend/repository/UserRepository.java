package com.helpinghands.backend.repository;

import com.helpinghands.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This magic line tells Spring to create: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}