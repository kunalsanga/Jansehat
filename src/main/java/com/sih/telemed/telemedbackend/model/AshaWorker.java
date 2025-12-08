package com.sih.telemed.telemedbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "AshaWorkers")
public class AshaWorker {
    @Id
    private Long id;
    @NotNull
    private Long chwId;;
    @NotNull
    private String name;

    private String phone;
    private String area;


}
