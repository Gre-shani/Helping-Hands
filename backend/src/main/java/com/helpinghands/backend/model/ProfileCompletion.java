package com.helpinghands.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "profile_completions", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "role"}))
@Data
public class ProfileCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private String role;

    @Column(name = "completion_percentage")
    private Integer completionPercentage = 0;

    @Column(name = "profile_data", columnDefinition = "TEXT")
    private String profileData;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "last_updated_at", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime lastUpdatedAt;

    @Column(name = "created_at", insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}
