package com.helpinghands.backend.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Matches your frontend port
public class AdminController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/pending-verifications")
    public ResponseEntity<?> getPendingVerifications() {
        try {
            // Native SQL Union combining pending Children's Homes and Service Providers
            String sql = "SELECT u.user_id AS userId, ch.home_name AS businessName, u.full_name AS fullName, u.email AS email, u.role AS role, ch.reg_certificate_url AS docUrl " +
                         "FROM users u JOIN childrens_homes ch ON u.user_id = ch.user_id WHERE ch.verified = FALSE " +
                         "UNION " +
                         "SELECT u.user_id AS userId, u.full_name AS businessName, u.full_name AS fullName, u.email AS email, u.role AS role, sp.police_clearance_url AS docUrl " +
                         "FROM users u JOIN service_providers sp ON u.user_id = sp.user_id WHERE sp.verification_status = 'Pending'";

            List<Object[]> rows = entityManager.createNativeQuery(sql).getResultList();
            List<Map<String, Object>> result = new ArrayList<>();

            for (Object[] row : rows) {
                result.add(Map.of(
                    "userId", row[0] != null ? row[0] : "",
                    "businessName", row[1] != null ? row[1] : "",
                    "fullName", row[2] != null ? row[2] : "",
                    "email", row[3] != null ? row[3] : "",
                    "role", row[4] != null ? row[4] : "",
                    "docUrl", row[5] != null ? row[5] : ""
                ));
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Pending fetch failed: " + e.getMessage()));
        }
    }

    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        try {
            String sql = "SELECT user_id, full_name, email, role FROM users";
            List<Object[]> rows = entityManager.createNativeQuery(sql).getResultList();
            List<Map<String, Object>> result = new ArrayList<>();

            for (Object[] row : rows) {
                result.add(Map.of(
                    "userId", row[0] != null ? row[0] : "",
                    "fullName", row[1] != null ? row[1] : "",
                    "email", row[2] != null ? row[2] : "",
                    "role", row[3] != null ? row[3] : ""
                ));
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "User registry fetch failed: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete-user/{userId}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        try {
            // Handled via ON DELETE CASCADE in your foreign keys
            entityManager.createNativeQuery("DELETE FROM users WHERE user_id = ?")
                    .setParameter(1, userId)
                    .executeUpdate();
                    
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Deletion failed: " + e.getMessage()));
        }
    }

    @PutMapping("/approve/{userId}")
    @Transactional
    public ResponseEntity<?> approveUser(@PathVariable int userId, @RequestParam String role) {
        try {
            if ("Childrens_Home".equalsIgnoreCase(role.trim())) {
                // Update the specialized profile table flag
                entityManager.createNativeQuery(
                    "UPDATE childrens_homes SET verified = TRUE WHERE user_id = ?")
                    .setParameter(1, userId)
                    .executeUpdate();
            } else if ("Service_Provider".equalsIgnoreCase(role.trim())) {
                // Update the specialized provider status enum
                entityManager.createNativeQuery(
                    "UPDATE service_providers SET verification_status = 'Approved' WHERE user_id = ?")
                    .setParameter(1, userId)
                    .executeUpdate();
            }

            // Optional: You can also update profile_completion_status to 'COMPLETED' here if desired
            entityManager.createNativeQuery(
                "UPDATE users SET profile_completion_status = 'COMPLETED' WHERE user_id = ?")
                .setParameter(1, userId)
                .executeUpdate();

            return ResponseEntity.ok(Map.of("success", true, "message", "User successfully verified and activated."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Verification execution failed: " + e.getMessage()));
        }
    }
}

