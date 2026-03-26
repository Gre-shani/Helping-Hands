package com.helpinghands.backend.service;

import com.helpinghands.backend.model.User;
import com.helpinghands.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
private PasswordEncoder passwordEncoder;

public User registerUser(User user) {
    // 1. Check if email exists
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
        throw new RuntimeException("Error: Email is already in use!");
    }
    
    // 2. HASH THE PASSWORD
    String encodedPassword = passwordEncoder.encode(user.getPassword());
    user.setPassword(encodedPassword); 
    
    // 3. Save the user (now with a scrambled password)
    return userRepository.save(user);
}

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}