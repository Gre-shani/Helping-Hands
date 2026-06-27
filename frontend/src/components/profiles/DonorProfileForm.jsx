import React, { useState } from 'react';

const DonorProfileForm = ({ userId, onSave }) => {
  const [formData, setFormData] = useState({
    donationPreferences: ['GOODS'],
    location: '',
    phone: '',
    deliveryAvailability: 'FLEXIBLE',
    organizationName: '',
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.donationPreferences.length === 0) newErrors.donationPreferences = 'Select at least one preference';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Donor Profile</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">What would you like to donate? *</label>
        <div className="space-y-2">
          {['GOODS', 'SERVICES', 'FUNDS'].map(pref => (
            <label key={pref} className="flex items-center">
              <input
                type="checkbox"
                name="donationPreferences"
                value={pref}
                checked={formData.donationPreferences.includes(pref)}
                onChange={handleChange}
                className="rounded border-gray-300 w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">
                {pref === 'GOODS' && 'Physical Items'}
                {pref === 'SERVICES' && 'Skills/Services'}
                {pref === 'FUNDS' && 'Financial Support'}
              </span>
            </label>
          ))}
        </div>
        {errors.donationPreferences && <p className="text-red-500 text-sm mt-1">{errors.donationPreferences}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Organization/Company (Optional)</label>
        <input
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="If donating on behalf of an organization"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location/City *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Your location"
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+94..."
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Availability</label>
        <select
          name="deliveryAvailability"
          value={formData.deliveryAvailability}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="FLEXIBLE">Flexible</option>
          <option value="WEEKDAYS">Weekdays only</option>
          <option value="WEEKENDS">Weekends only</option>
          <option value="EVENINGS">Evenings only</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude (Optional)</label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="0.0001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude (Optional)</label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="0.0001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Save & Continue
      </button>
    </form>
  );
};

export default DonorProfileForm;
