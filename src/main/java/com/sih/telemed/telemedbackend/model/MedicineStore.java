package com.sih.telemed.telemedbackend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicine_stores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineStore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;

    private String phone;
    private String email;

    private Double latitude;
    private Double longitude;

    private Long pharmacistUserId; // maps to your User table

    private String GenericName;
    private String MedicineType;
    private String MedicineName;
    private String MedicineDescription;
    private String MedicinePrice;
    private Boolean availablity;
    private Long Medicine_Quantity;

}
