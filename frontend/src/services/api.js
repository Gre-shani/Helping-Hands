import axios from 'axios';

const API_URL = "http://localhost:8081/api/users";
const PROFILE_API_URL = "http://localhost:8081/api/profiles";
const DOCUMENTS_API_URL = "http://localhost:8081/api/documents";

// ===== User Auth =====
export const registerUser = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = (userData) => {
    return axios.post(`${API_URL}/login`, userData);
};

// ===== Profile Management =====
export const getCompletionStatus = (userId) => {
    return axios.get(`${PROFILE_API_URL}/${userId}/completion-status`);
};

export const initializeProfile = (userId, role) => {
    return axios.post(`${PROFILE_API_URL}/${userId}/initialize`, { role });
};

export const updateProfileProgress = (userId, completionPercentage) => {
    return axios.post(`${PROFILE_API_URL}/${userId}/update-progress`, { completionPercentage });
};

export const markProfileComplete = (userId) => {
    return axios.post(`${PROFILE_API_URL}/${userId}/mark-complete`);
};

// ===== Document Upload =====
export const uploadDocument = (file, userId, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('documentType', documentType);

    return axios.post(`${DOCUMENTS_API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getDocuments = (userId) => {
    return axios.get(`${DOCUMENTS_API_URL}/${userId}`);
};

export const deleteDocument = (documentId) => {
    return axios.delete(`${DOCUMENTS_API_URL}/${documentId}`);
};