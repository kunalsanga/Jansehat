package com.sih.telemed.telemedbackend.dto.Auth;


import com.sih.telemed.telemedbackend.Enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private Role role;
}
