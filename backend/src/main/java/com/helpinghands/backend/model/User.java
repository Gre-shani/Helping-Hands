package com.helpinghands.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // Matches your SQL 'user_id'
    private Integer userId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    private BigDecimal latitude;
    private BigDecimal longitude;

    // We use String here to match the ENUM in your SQL
    @Column(nullable = false)
    private String role; 

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_public_profile")
    private Boolean isPublicProfile = false;

    @Column(name = "profile_completion_status", columnDefinition = "ENUM('INCOMPLETE', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'INCOMPLETE'")
    private String profileCompletionStatus = "INCOMPLETE";
}