import React, { useState } from 'react';

const AdminProfileForm = ({ userId, onSave }) => {
  const [formData, setFormData] = useState({
    adminLevel: 'MODERATOR',
    department: '',
    responsibilities: '',
    phone: '',
    location: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.department.trim()) newErrors.department = 'Department is required';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Administrator Profile</h2>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-900 text-sm">
          As an administrator, you'll have elevated access to manage users, verify documents, and oversee platform operations.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Level</label>
        <select
          name="adminLevel"
          value={formData.adminLevel}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="MODERATOR">Moderator</option>
          <option value="ADMIN">Full Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.department ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Verification, Operations, Support"
        />
        {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Responsibilities</label>
        <textarea
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your main responsibilities (e.g., verifying orphanage documents, managing user reports, etc.)"
        />
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Office location or base city"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional information"
        />
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

export default AdminProfileForm;
