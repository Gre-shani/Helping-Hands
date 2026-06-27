import React from 'react';
import { useNavigate } from 'react-router-dom';

const IncompleteProfileBanner = ({ status }) => {
  const navigate = useNavigate();

  // If the profile is already completed, do not render the banner at all
  if (status === 'COMPLETED') return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Warning Icon */}
          <svg 
            className="h-6 w-6 text-amber-500 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          
          {/* Alert Message */}
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Your Profile is Incomplete!
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Please complete your role-specific profile setup and upload the required verification documents to unlock all platform features.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/profile/setup/intro')}
          className="w-full sm:w-auto bg-brand-blue hover:bg-blue-900 text-white text-xs font-bold py-2 px-4 rounded transition-all duration-150 whitespace-nowrap shadow-sm"
        >
          Complete Profile &rarr;
        </button>
      </div>
    </div>
  );
};

export default IncompleteProfileBanner;