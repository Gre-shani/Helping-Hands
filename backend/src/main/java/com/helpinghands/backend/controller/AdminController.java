package com.helpinghands.backend.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") 
public class AdminController {

    @PersistenceContext
    private EntityManager entityManager;

    // NEW ENDPOINT: Aggregates metrics from your live tables for the top summary cards
    @GetMapping("/dashboard-summary")
    public ResponseEntity<?> getDashboardSummary() {
        try {
            Map<String, Object> summary = new HashMap<>();

            // 1. Get total users count
            long totalAccounts = ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM users").getSingleResult()).longValue();

            // 2. Calculate awaiting security review (sum of pending profiles)
            long pendingHomes = ((Number) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM users u JOIN childrens_homes ch ON u.user_id = ch.user_id WHERE u.role = 'CHILDRENS_HOME' AND (ch.verified = FALSE OR ch.verified IS NULL)"
            ).getSingleResult()).longValue();

            long pendingProviders = ((Number) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM users u JOIN service_providers sp ON u.user_id = sp.user_id WHERE u.role = 'SERVICE_PROVIDER' AND (sp.verification_status = 'Pending' OR sp.verification_status IS NULL)"
            ).getSingleResult()).longValue();

            long awaitingReview = pendingHomes + pendingProviders;

            // 3. Count approved platforms users (Donors or verified entities)
            long registeredDonors = ((Number) entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM users WHERE role = 'DONOR' OR profile_completion_status = 'COMPLETED'"
            ).getSingleResult()).longValue();

            summary.put("totalAccounts", totalAccounts);
            summary.put("awaitingReview", awaitingReview);
            summary.put("registeredDonors", registeredDonors);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to compute dashboard metrics: " + e.getMessage()));
        }
    }

    @GetMapping("/pending-verifications")
    public ResponseEntity<?> getPendingVerifications() {
        try {
            String sql = "SELECT u.user_id AS userId, COALESCE(ch.home_name, 'Name Not Provided') AS businessName, u.full_name AS fullName, u.email AS email, u.role AS role, COALESCE(ch.reg_certificate_url, '') AS docUrl " +
                         "FROM users u LEFT JOIN childrens_homes ch ON u.user_id = ch.user_id " +
                         "WHERE u.role = 'CHILDRENS_HOME' AND (ch.verified = FALSE OR ch.verified IS NULL) " +
                         "UNION " +
                         "SELECT u.user_id AS userId, u.full_name AS businessName, u.full_name AS fullName, u.email AS email, u.role AS role, COALESCE(sp.police_clearance_url, '') AS docUrl " +
                         "FROM users u LEFT JOIN service_providers sp ON u.user_id = sp.user_id " +
                         "WHERE u.role = 'SERVICE_PROVIDER' AND (sp.verification_status = 'Pending' OR sp.verification_status IS NULL)";
             
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
            entityManager.createNativeQuery("DELETE FROM users WHERE user_id = ?")
                    .setParameter(1, userId)
                    .executeUpdate();
                    
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Deletion failed: " + e.getMessage()));
        }
    }

    // CHANGED: Shifted @RequestParam to a clean object request wrapper or simple payload processing to match frontend fetch calls cleanly
    @PutMapping("/approve/{userId}")
    @Transactional
    public ResponseEntity<?> approveUser(@PathVariable int userId, @RequestBody Map<String, String> payload) {
        try {
            String role = payload.get("role");
            if (role == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Role type descriptor is mandatory"));
            }

            if ("Childrens_Home".equalsIgnoreCase(role.trim()) || "CHILDRENS_HOME".equalsIgnoreCase(role.trim())) {
                entityManager.createNativeQuery(
                    "UPDATE childrens_homes SET verified = TRUE WHERE user_id = ?")
                    .setParameter(1, userId)
                    .executeUpdate();
            } else if ("Service_Provider".equalsIgnoreCase(role.trim()) || "SERVICE_PROVIDER".equalsIgnoreCase(role.trim())) {
                entityManager.createNativeQuery(
                    "UPDATE service_providers SET verification_status = 'Approved' WHERE user_id = ?")
                    .setParameter(1, userId)
                    .executeUpdate();
            }

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