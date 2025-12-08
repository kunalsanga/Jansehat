package com.sih.telemed.telemedbackend.service;


import com.sih.telemed.telemedbackend.dto.Auth.RegisterRequest;
import com.sih.telemed.telemedbackend.dto.Auth.UserResponse;
import com.sih.telemed.telemedbackend.model.User;
import com.sih.telemed.telemedbackend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword()) // TODO: encode
                .role(request.getRole())
                .fullName(request.getFullName())
                .active(true)
                .build();

        User saved = userRepository.save(user);

        return UserResponse.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .fullName(saved.getFullName())
                .role(saved.getRole())
                .build();
    }
}
