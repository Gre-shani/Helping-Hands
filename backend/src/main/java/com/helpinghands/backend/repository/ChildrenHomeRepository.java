package com.helpinghands.backend.repository;

import com.helpinghands.backend.model.ChildrenHome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChildrenHomeRepository extends JpaRepository<ChildrenHome, Long> {
    Optional<ChildrenHome> findByUserId(Integer userId);
}
