package com.helpinghands.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "children_homes", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id"}))
@Data
public class ChildrenHome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "home_name", nullable = false)
    private String homeName;

    @Column(name = "registration_number", nullable = false)
    private String registrationNumber;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "bank_account_details", nullable = false, columnDefinition = "TEXT")
    private String bankAccountDetails;

    @Column(name = "reg_certificate_url")
    private String regCertificateUrl;

    @Column(name = "created_at", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;
}
