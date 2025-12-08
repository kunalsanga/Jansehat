package com.sih.telemed.telemedbackend.dto.Auth;

import com.sih.telemed.telemedbackend.Enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private Role role;
}
