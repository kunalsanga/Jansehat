package com.sih.telemed.telemedbackend.controller;


import com.sih.telemed.telemedbackend.model.User;
import com.sih.telemed.telemedbackend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // -------------------------
    // CREATE USER (REGISTER)
    // -------------------------
    @PostMapping("/register")
    public User register(@RequestBody User request) {

        // ensure username isn't duplicated
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        request.setActive(true);
        request.setCreatedAt(LocalDateTime.now());

        return userRepository.save(request);
    }

    // -------------------------
    // GET A USER
    // -------------------------
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // -------------------------
    // LIST ALL USERS (optional)
    // -------------------------
    @GetMapping
    public List<User> listUsers() {
        return userRepository.findAll();
    }
}
