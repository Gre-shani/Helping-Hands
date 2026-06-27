import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompletionStatus, initializeProfile, markProfileComplete, updateProfileProgress } from '../services/api';
import OrphanageProfileForm from './profiles/OrphanageProfileForm';
import DonorProfileForm from './profiles/DonorProfileForm';
import ServiceProviderProfileForm from './profiles/ServiceProviderProfileForm';
import VolunteerProfileForm from './profiles/VolunteerProfileForm';
import AdminProfileForm from './profiles/AdminProfileForm';
import DocumentUploadStep from './DocumentUploadStep';

const ProfileSetupFlow = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [error, setError] = useState('');

  const steps = ['Intro', 'Profile Details', 'Documents', 'Confirm'];

  const roleConfigs = {
    DONOR: {
      formComponent: DonorProfileForm,
      requiredDocuments: [
        { type: 'ID_COPY', label: 'Identity Document', description: 'Upload a copy of your ID' }
      ]
    },
    SERVICE_PROVIDER: {
      formComponent: ServiceProviderProfileForm,
      requiredDocuments: [
        { type: 'ID_COPY', label: 'Identity Document', description: 'Upload a copy of your ID' },
        { type: 'REFERENCE', label: 'Reference Letter', description: 'Optional reference from previous work' }
      ]
    },
    CHILDREN_S_HOME: {
      formComponent: OrphanageProfileForm,
      requiredDocuments: [
        { type: 'REGISTRATION_PROOF', label: 'Registration Certificate', description: 'Official registration document' },
        { type: 'POLICE_CLEARANCE', label: 'Police Clearance', description: 'Latest police clearance certificate' }
      ]
    },
    DELIVERY_VOLUNTEER: {
      formComponent: VolunteerProfileForm,
      requiredDocuments: [
        { type: 'ID_COPY', label: 'Identity Document', description: 'Upload a copy of your ID' }
      ]
    },
    ADMIN: {
      formComponent: AdminProfileForm,
      requiredDocuments: []
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    initializeProfile(user.userId, user.role);
  }, [user, navigate]);

  const handleProfileDataSave = (data) => {
    setProfileData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
    updateProfileProgress(user.userId, 66);
  };

  const handleDocumentUpload = (docType) => {
    setUploadedDocs(prev => [...prev, docType]);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await markProfileComplete(user.userId);

      const updatedUser = { ...user, profileCompletionStatus: 'COMPLETED' };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete profile');
      setLoading(false);
    }
  };

  const roleConfig = roleConfigs[user.role] || roleConfigs.DONOR;
  const FormComponent = roleConfig.formComponent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8">Welcome, {user?.fullName}! Let's get your profile set up.</p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex-1 text-center py-2 px-1 mx-1 rounded ${
                    idx + 1 <= currentStep
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName}!</h2>
                <p className="text-gray-600">
                  You're signing up as a <strong>{user?.role.replace(/_/g, ' ')}</strong>.
                </p>
                <p className="text-gray-600">
                  This profile will help us verify your identity and match you with the right opportunities on Helping Hands.
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">What you'll provide:</h3>
                  <ul className="space-y-2 text-blue-800">
                    {roleConfig.requiredDocuments.length > 0 ? (
                      roleConfig.requiredDocuments.map((doc, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          {doc.label}
                        </li>
                      ))
                    ) : (
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        Profile information
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 2 && FormComponent && (
              <FormComponent userId={user?.userId} onSave={handleProfileDataSave} />
            )}

            {currentStep === 3 && roleConfig.requiredDocuments.length > 0 && (
              <DocumentUploadStep
                userId={user?.userId}
                requiredDocuments={roleConfig.requiredDocuments}
                onDocumentUpload={handleDocumentUpload}
              />
            )}

            {currentStep === 3 && roleConfig.requiredDocuments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No documents required for your role. Click "Confirm" to finish.</p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Confirm & Complete</h2>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    ✓ Your profile information is ready to submit. Once you confirm, you'll have full access to all features.
                  </p>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Profile Summary:</h3>
                  <dl className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <dt>Role:</dt>
                      <dd className="font-medium">{user?.role.replace(/_/g, ' ')}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Documents Uploaded:</dt>
                      <dd className="font-medium">{uploadedDocs.length} / {roleConfig.requiredDocuments.length}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (currentStep === 2 && !FormComponent) {
                    setCurrentStep(3);
                  } else if (currentStep === 3 && roleConfig.requiredDocuments.length === 0) {
                    setCurrentStep(4);
                  } else if (currentStep < 3) {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Completing...' : 'Confirm & Complete'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupFlow;
