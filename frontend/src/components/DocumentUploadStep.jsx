import React, { useState } from 'react';
import { uploadDocument } from '../services/api';

const DocumentUploadStep = ({ userId, requiredDocuments, onDocumentUpload }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [errors, setErrors] = useState({});

  const handleFileSelect = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress(prev => ({ ...prev, [docType]: 'uploading' }));
    setErrors(prev => ({ ...prev, [docType]: null }));

    try {
      const response = await uploadDocument(file, userId, docType);
      setUploadedDocs(prev => ({
        ...prev,
        [docType]: {
          fileName: response.data.fileName,
          filePath: response.data.filePath,
          uploadedAt: response.data.uploadedAt
        }
      }));
      setUploadProgress(prev => ({ ...prev, [docType]: 'complete' }));
      if (onDocumentUpload) onDocumentUpload(docType, response.data);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [docType]: error.response?.data?.error || 'Upload failed'
      }));
      setUploadProgress(prev => ({ ...prev, [docType]: null }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Upload Required Documents</h2>
      <p className="text-gray-600">Please upload the following documents for verification.</p>

      <div className="space-y-4">
        {requiredDocuments.map(doc => (
          <div key={doc.type} className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{doc.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
              </div>

              {uploadProgress[doc.type] === 'complete' ? (
                <div className="text-green-600 font-medium">
                  <svg className="h-6 w-6 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Uploaded
                </div>
              ) : uploadProgress[doc.type] === 'uploading' ? (
                <div className="text-blue-600 font-medium">
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Uploading...
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => handleFileSelect(e, doc.type)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Choose File
                  </span>
                </label>
              )}
            </div>

            {errors[doc.type] && (
              <div className="mt-3 text-red-600 text-sm">{errors[doc.type]}</div>
            )}
            {uploadedDocs[doc.type] && (
              <div className="mt-3 text-green-600 text-sm">✓ {uploadedDocs[doc.type].fileName}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUploadStep;
