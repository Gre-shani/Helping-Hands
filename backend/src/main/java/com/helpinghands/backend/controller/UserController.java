package com.helpinghands.backend.controller;

import com.helpinghands.backend.model.User;
import com.helpinghands.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser); // Returns the User object with ID
        } catch (RuntimeException e) {
            // Returns 400 Bad Request if email exists
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");
            User user = userService.loginUser(email, password);
            return ResponseEntity.ok(user); // Returns User object if credentials match
        } catch (RuntimeException e) {
            // Returns 401 Unauthorized if password/email is wrong
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // --- GET ALL (For Testing) ---
    @GetMapping("/all")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}