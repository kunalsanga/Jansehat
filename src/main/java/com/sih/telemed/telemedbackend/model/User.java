    package com.sih.telemed.telemedbackend.model;

    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import com.sih.telemed.telemedbackend.Enums.Role;
    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDateTime;
    import java.util.List;

    @Entity
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Table(name = "`users`")
    @Getter
    public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true, length = 80)
        private String username;

        @Column(nullable = false)
        private String password;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 32)
        private Role role;

        @Column(nullable = false)
        private boolean active = true;

        @Column(length = 80)
        private String fullName;

        private LocalDateTime createdAt = LocalDateTime.now();

        @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
        @JsonManagedReference
        private List<Patient> patients;

    }
