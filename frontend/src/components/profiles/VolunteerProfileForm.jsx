import React, { useState } from 'react';

const VolunteerProfileForm = ({ userId, onSave }) => {
  const [formData, setFormData] = useState({
    availableDays: [],
    availableHours: 'FLEXIBLE',
    location: '',
    phone: '',
    vehicleType: 'NONE',
    cargoCapacity: '',
    experience: '',
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Delivery Volunteer Profile</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Your location/city"
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
        <label className="block text-sm font-medium text-gray-700 mb-3">Available Days</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {days.map(day => (
            <label key={day} className="flex items-center">
              <input
                type="checkbox"
                name="availableDays"
                value={day}
                checked={formData.availableDays.includes(day)}
                onChange={handleChange}
                className="rounded border-gray-300 w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700 text-sm">{day}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Available Hours</label>
        <select
          name="availableHours"
          value={formData.availableHours}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="FLEXIBLE">Flexible</option>
          <option value="MORNING">Morning (6AM - 12PM)</option>
          <option value="AFTERNOON">Afternoon (12PM - 6PM)</option>
          <option value="EVENING">Evening (6PM - 10PM)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="NONE">No vehicle</option>
          <option value="MOTORCYCLE">Motorcycle</option>
          <option value="CAR">Car</option>
          <option value="VAN">Van</option>
          <option value="TRUCK">Truck</option>
        </select>
      </div>

      {formData.vehicleType !== 'NONE' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Capacity (kg)</label>
          <input
            type="number"
            name="cargoCapacity"
            value={formData.cargoCapacity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Experience (Optional)</label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us about any delivery experience you have"
        />
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

export default VolunteerProfileForm;
