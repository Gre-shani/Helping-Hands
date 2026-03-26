package com.helpinghands.backend.controller;

import com.helpinghands.backend.model.User;
import com.helpinghands.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
public Object register(@RequestBody User user) {
    try {
        return userService.registerUser(user);
    } catch (RuntimeException e) {
        // Returns the error message instead of crashing
        return String.format("{\"error\": \"%s\"}", e.getMessage());
    }
}

    @GetMapping("/all")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}