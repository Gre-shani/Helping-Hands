package com.helpinghands.backend.service;

import com.helpinghands.backend.model.User;
import com.helpinghands.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
            
    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- 1. REGISTER ---
    public User registerUser(User user) {
        // Check if email exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        
        // HASH THE PASSWORD
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword); 
        
        // Save the user (now with a scrambled password)
        return userRepository.save(user);
    }

    // --- 2. LOGIN (Add this part now) ---
    public User loginUser(String email, String password) {
        // Find the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        // Compare the plain text password with the hashed password in DB
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Error: Invalid email or password!");
        }

        return user;
    }

    // --- 3. GET ALL ---
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}