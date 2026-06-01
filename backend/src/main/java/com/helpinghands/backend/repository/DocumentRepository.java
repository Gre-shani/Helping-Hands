package com.helpinghands.backend.repository;

import com.helpinghands.backend.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserId(Integer userId);
    Optional<Document> findByUserIdAndDocumentType(Integer userId, String documentType);
}
