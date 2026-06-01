package com.helpinghands.backend.service;

import com.helpinghands.backend.model.Document;
import com.helpinghands.backend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Document uploadDocument(MultipartFile file, Integer userId, String documentType) throws IOException {
        String relativeFilePath = fileStorageService.storeFile(file, userId, documentType);

        Optional<Document> existingDoc = documentRepository.findByUserIdAndDocumentType(userId, documentType);

        Document document;
        if (existingDoc.isPresent()) {
            document = existingDoc.get();
            try {
                fileStorageService.deleteFile(document.getFilePath());
            } catch (IOException e) {
                // Log but don't fail if old file deletion fails
                System.err.println("Warning: Could not delete old file: " + document.getFilePath());
            }
        } else {
            document = new Document();
            document.setUserId(userId);
            document.setDocumentType(documentType);
        }

        document.setFileName(file.getOriginalFilename());
        document.setFileSize(file.getSize());
        document.setFilePath(relativeFilePath);
        document.setStatus("PENDING");

        return documentRepository.save(document);
    }

    public List<Document> getDocumentsByUser(Integer userId) {
        return documentRepository.findByUserId(userId);
    }

    public Optional<Document> getDocumentByUserAndType(Integer userId, String documentType) {
        return documentRepository.findByUserIdAndDocumentType(userId, documentType);
    }

    public void deleteDocument(Long documentId) throws IOException {
        Optional<Document> docOpt = documentRepository.findById(documentId);
        if (docOpt.isPresent()) {
            Document doc = docOpt.get();
            fileStorageService.deleteFile(doc.getFilePath());
            documentRepository.deleteById(documentId);
        }
    }
}
