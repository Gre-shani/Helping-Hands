import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  submitChildrenHomeProfile,
  submitServiceProviderProfile,
  submitDeliveryVolunteerProfile,
} from '../services/api';

const initialChildrenHomeValues = {
  homeName: '',
  registrationNumber: '',
  capacity: '',
  regCertificateUrl: '', 
};

const initialServiceProviderValues = {
  serviceType: 'TRANSPORT',
  operationalRegion: '',
  policeClearanceUrl: '', 
};

const initialDeliveryVolunteerValues = {
  nicFrontImage: '',
  nicBackImage: '',
};

const ProfileSetupFlow = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Flexible role parser that matches both 'CHILDRENSHOME' and 'ROLE_CHILDRENSHOME'
  const rawRole = user?.role?.toString().trim().toUpperCase() || '';
  const isDonor = rawRole.includes('DONOR');
  const isChildrenHome = rawRole.includes('CHILDRENSHOME') || rawRole.includes('CHILDREN_HOME');
  const isServiceProvider = rawRole.includes('SERVICEPROVIDER') || rawRole.includes('SERVICE_PROVIDER');
  const isDeliveryVolunteer = rawRole.includes('DELIVERY_VOLUNTEER') || rawRole.includes('VOLUNTEER');

  // Multi-step management tracking
  const [currentStep, setCurrentStep] = useState(1);
  const [childrenHomeValues, setChildrenHomeValues] = useState(initialChildrenHomeValues);
  const [serviceProviderValues, setServiceProviderValues] = useState(initialServiceProviderValues);
  const [deliveryVolunteerValues, setDeliveryVolunteerValues] = useState(initialDeliveryVolunteerValues);
  
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isDonor) {
      navigate('/dashboard');
    }
  }, [navigate, user, isDonor]);

  // --- FRONTEND VALIDATIONS ---
  const validateChildrenHomeStep1 = () => {
    const nextErrors = {};
    if (!childrenHomeValues.homeName.trim()) nextErrors.homeName = 'Home name is required';
    if (!childrenHomeValues.registrationNumber.trim()) nextErrors.registrationNumber = 'Registration number is required';
    
    const capacityValue = Number(childrenHomeValues.capacity);
    if (!childrenHomeValues.capacity.toString().trim()) {
      nextErrors.capacity = 'Capacity is required';
    } else if (!Number.isInteger(capacityValue) || capacityValue <= 0) {
      nextErrors.capacity = 'Capacity must be a positive whole number';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateChildrenHomeStep2 = () => {
    const nextErrors = {};
    if (!childrenHomeValues.regCertificateUrl.trim()) {
      nextErrors.regCertificateUrl = 'You must upload your Registration Certificate for admin verification';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateServiceProviderStep1 = () => {
    const nextErrors = {};
    if (!serviceProviderValues.serviceType.trim()) nextErrors.serviceType = 'Service type is required';
    if (!serviceProviderValues.operationalRegion.trim()) nextErrors.operationalRegion = 'Operational region is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateServiceProviderStep2 = () => {
    const nextErrors = {};
    if (!serviceProviderValues.policeClearanceUrl.trim()) {
      nextErrors.policeClearanceUrl = 'You must upload your Police Clearance Certificate for admin verification';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateDeliveryVolunteerStep = () => {
    const nextErrors = {};
    if (!deliveryVolunteerValues.nicFrontImage.trim()) {
      nextErrors.nicFrontImage = 'You must upload the front of your NIC';
    }
    if (!deliveryVolunteerValues.nicBackImage.trim()) {
      nextErrors.nicBackImage = 'You must upload the back of your NIC';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // --- MOCK FILE UPLOAD HANDLER ---
  const handleFileChange = (e, targetField) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadedFileName(file.name);

    setTimeout(() => {
      const mockCloudUrl = `https://helpinghands-docs-storage.s3.amazonaws.com/verifications/${Date.now()}_${file.name}`;
      
      if (isChildrenHome) {
        setChildrenHomeValues(prev => ({ ...prev, [targetField]: mockCloudUrl }));
      } else if (isServiceProvider) {
        setServiceProviderValues(prev => ({ ...prev, [targetField]: mockCloudUrl }));
      } else if (isDeliveryVolunteer) {
        setDeliveryVolunteerValues(prev => ({ ...prev, [targetField]: mockCloudUrl }));
      }
      setUploading(false);
      setErrors({});
    }, 1200); 
  };

  // --- BACKEND API SUBMISSIONS ---
  const handleChildrensHomeSubmit = async () => {
    if (!validateChildrenHomeStep2()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        homeName: childrenHomeValues.homeName.trim(),
        registrationNumber: childrenHomeValues.registrationNumber.trim(),
        regCertificateUrl: childrenHomeValues.regCertificateUrl.trim(),
      };

      await submitChildrenHomeProfile(user.userId, payload);
      const updatedUser = { ...user, profileCompletionStatus: 'PENDING_APPROVAL' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission crash dump:', error);
      setSubmitError(error.response?.data?.message || error.response?.data?.error || 'Server rejected children home profile payload.');
      setIsSubmitting(false);
    }
  };

  const handleServiceProviderSubmit = async () => {
    if (!validateServiceProviderStep2()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        serviceType: serviceProviderValues.serviceType.trim(),
        operationalRegion: serviceProviderValues.operationalRegion.trim(),
      };

      await submitServiceProviderProfile(user.userId, payload);
      const updatedUser = { ...user, profileCompletionStatus: 'PENDING_APPROVAL' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission crash dump:', error);
      setSubmitError(error.response?.data?.message || error.response?.data?.error || 'Server rejected service provider profile payload.');
      setIsSubmitting(false);
    }
  };

  const handleDeliveryVolunteerSubmit = async () => {
    if (!validateDeliveryVolunteerStep()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        nicFrontImage: deliveryVolunteerValues.nicFrontImage.trim(),
        nicBackImage: deliveryVolunteerValues.nicBackImage.trim(),
      };

      await submitDeliveryVolunteerProfile(user.userId, payload);
      const updatedUser = { ...user, profileCompletionStatus: 'PENDING_APPROVAL' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission crash dump:', error);
      setSubmitError(error.response?.data?.message || error.response?.data?.error || 'Server rejected volunteer profile payload.');
      setIsSubmitting(false);
    }
  };

  // --- VIEWS RENDERING ---
  const renderChildrenHomeForm = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Children's Home Setup</h1>
          <p className="mt-2 text-sm text-slate-600">Complete institutional tracking details for admin review.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Step {currentStep} of 2</div>
      </div>
      
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Core Institutional Details</h2>
            <div className="grid gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Home Name *</span>
                <input type="text" value={childrenHomeValues.homeName} onChange={(e) => setChildrenHomeValues({ ...childrenHomeValues, homeName: e.target.value })} className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors.homeName ? 'border-red-500' : 'border-slate-300'}`} />
                {errors.homeName && <p className="mt-1 text-sm text-red-600">{errors.homeName}</p>}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Registration Number *</span>
                <input type="text" value={childrenHomeValues.registrationNumber} onChange={(e) => setChildrenHomeValues({ ...childrenHomeValues, registrationNumber: e.target.value })} className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors.registrationNumber ? 'border-red-500' : 'border-slate-300'}`} />
                {errors.registrationNumber && <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Children Capacity *</span>
                <input type="number" min="1" value={childrenHomeValues.capacity} onChange={(e) => setChildrenHomeValues({ ...childrenHomeValues, capacity: e.target.value })} className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors.capacity ? 'border-red-500' : 'border-slate-300'}`} placeholder="Number of children accommodated" />
                {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Upload Legal Documentation</h2>
            <p className="text-sm text-slate-600">Please upload a valid scan copy or registration certificate. Administrators review this document to crosscheck against fraud.</p>
            <div className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50">
              <input type="file" id="cert-upload" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileChange(e, 'regCertificateUrl')} />
              <label htmlFor="cert-upload" className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                Choose Certificate Document File
              </label>
              {uploading && <p className="mt-3 text-sm text-blue-600 animate-pulse">Uploading file securely...</p>}
              {childrenHomeValues.regCertificateUrl && !uploading && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 inline-block text-left">
                  <p className="text-xs text-emerald-800 font-medium">✓ System uploaded attachment:</p>
                  <p className="text-sm text-slate-700 truncate max-w-xs font-mono">{uploadedFileName || 'Certificate_Scan.pdf'}</p>
                </div>
              )}
              {errors.regCertificateUrl && <p className="mt-2 text-sm text-red-600">{errors.regCertificateUrl}</p>}
            </div>
          </div>
        )}
      </div>

      {submitError && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 font-mono">{submitError}</p>}

      <div className="flex justify-between">
        <button type="button" onClick={() => setCurrentStep(1)} disabled={currentStep === 1} className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">Back</button>
        {currentStep === 1 ? (
          <button type="button" onClick={() => { if (validateChildrenHomeStep1()) { setErrors({}); setCurrentStep(2); } }} className="inline-flex justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Continue to Verification</button>
        ) : (
          <button type="button" onClick={handleChildrensHomeSubmit} disabled={isSubmitting || uploading} className="inline-flex justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40">{isSubmitting ? 'Submitting Claims...' : 'Submit Profile'}</button>
        )}
      </div>
    </div>
  );

  const renderServiceProviderForm = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Service Provider Setup</h1>
          <p className="mt-2 text-sm text-slate-600">Provide operational scope parameters for system integration.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Step {currentStep} of 2</div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Service Scope</h2>
            <div className="grid gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Service Type *</span>
                <select value={serviceProviderValues.serviceType} onChange={(e) => setServiceProviderValues({ ...serviceProviderValues, serviceType: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none">
                  {['TRANSPORT', 'LOGISTICS', 'MEDICAL', 'EDUCATION', 'SECURITY'].map((option) => (<option key={option} value={option}>{option}</option>))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Operational Region *</span>
                <input type="text" value={serviceProviderValues.operationalRegion} onChange={(e) => setServiceProviderValues({ ...serviceProviderValues, operationalRegion: e.target.value })} className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none ${errors.operationalRegion ? 'border-red-500' : 'border-slate-300'}`} placeholder="e.g. Colombo, Western Province" />
                {errors.operationalRegion && <p className="mt-1 text-sm text-red-600">{errors.operationalRegion}</p>}
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Upload Verification Documentation</h2>
            <p className="text-sm text-slate-600">Provide valid documentation proof (like a background check or police clearance report) to enable approval.</p>
            <div className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50">
              <input type="file" id="police-upload" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileChange(e, 'policeClearanceUrl')} />
              <label htmlFor="police-upload" className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                Choose Clearance File
              </label>
              {uploading && <p className="mt-3 text-sm text-blue-600 animate-pulse">Uploading file securely...</p>}
              {serviceProviderValues.policeClearanceUrl && !uploading && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 inline-block text-left">
                  <p className="text-xs text-emerald-800 font-medium">✓ System uploaded attachment:</p>
                  <p className="text-sm text-slate-700 truncate max-w-xs font-mono">{uploadedFileName || 'Clearance_Paper.pdf'}</p>
                </div>
              )}
              {errors.policeClearanceUrl && <p className="mt-2 text-sm text-red-600">{errors.policeClearanceUrl}</p>}
            </div>
          </div>
        )}
      </div>

      {submitError && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 font-mono">{submitError}</p>}

      <div className="flex justify-between">
        <button type="button" onClick={() => setCurrentStep(1)} disabled={currentStep === 1} className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">Back</button>
        {currentStep === 1 ? (
          <button type="button" onClick={() => { if (validateServiceProviderStep1()) { setErrors({}); setCurrentStep(2); } }} className="inline-flex justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Continue to Verification</button>
        ) : (
          <button type="button" onClick={handleServiceProviderSubmit} disabled={isSubmitting || uploading} className="inline-flex justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40">{isSubmitting ? 'Submitting Claims...' : 'Submit Profile'}</button>
        )}
      </div>
    </div>
  );

  const renderDeliveryVolunteerForm = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Delivery Volunteer Setup</h1>
          <p className="mt-2 text-sm text-slate-600">Upload your NIC images so your account can be reviewed for approval.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Verification</div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Identity Verification</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
              <input type="file" id="nic-front-upload" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileChange(e, 'nicFrontImage')} />
              <label htmlFor="nic-front-upload" className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                Upload NIC Front
              </label>
              {uploading && <p className="mt-3 text-sm text-blue-600 animate-pulse">Uploading file securely...</p>}
              {deliveryVolunteerValues.nicFrontImage && !uploading && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 inline-block text-left">
                  <p className="text-xs text-emerald-800 font-medium">✓ Uploaded NIC front:</p>
                  <p className="text-sm text-slate-700 truncate max-w-xs font-mono">{uploadedFileName || 'nic-front.jpg'}</p>
                </div>
              )}
              {errors.nicFrontImage && <p className="mt-2 text-sm text-red-600">{errors.nicFrontImage}</p>}
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
              <input type="file" id="nic-back-upload" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileChange(e, 'nicBackImage')} />
              <label htmlFor="nic-back-upload" className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                Upload NIC Back
              </label>
              {uploading && <p className="mt-3 text-sm text-blue-600 animate-pulse">Uploading file securely...</p>}
              {deliveryVolunteerValues.nicBackImage && !uploading && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 inline-block text-left">
                  <p className="text-xs text-emerald-800 font-medium">✓ Uploaded NIC back:</p>
                  <p className="text-sm text-slate-700 truncate max-w-xs font-mono">{uploadedFileName || 'nic-back.jpg'}</p>
                </div>
              )}
              {errors.nicBackImage && <p className="mt-2 text-sm text-red-600">{errors.nicBackImage}</p>}
            </div>
          </div>
        </div>
      </div>

      {submitError && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 font-mono">{submitError}</p>}

      <div className="flex justify-end">
        <button type="button" onClick={handleDeliveryVolunteerSubmit} disabled={isSubmitting || uploading} className="inline-flex justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40">{isSubmitting ? 'Submitting Claims...' : 'Submit Profile'}</button>
      </div>
    </div>
  );

  if (!user) return null;

  if (isChildrenHome) {
    return <div className="min-h-screen bg-slate-50 py-10 px-4"><div className="mx-auto max-w-4xl">{renderChildrenHomeForm()}</div></div>;
  }
  if (isServiceProvider) {
    return <div className="min-h-screen bg-slate-50 py-10 px-4"><div className="mx-auto max-w-4xl">{renderServiceProviderForm()}</div></div>;
  }
  if (isDeliveryVolunteer) {
    return <div className="min-h-screen bg-slate-50 py-10 px-4"><div className="mx-auto max-w-4xl">{renderDeliveryVolunteerForm()}</div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Profile Setup Not Available</h1>
        <p className="mt-2 text-slate-600">Your specific profile role assignment format (<strong>{rawRole || 'UNKNOWN'}</strong>) is not mapped directly into onboarding processing flows.</p>
      </div>
    </div>
  );
};

export default ProfileSetupFlow;