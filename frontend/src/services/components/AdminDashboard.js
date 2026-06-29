import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ totalAccounts: 0, awaitingReview: 0, registeredDonors: 0 });
  const [unverifiedQueue, setUnverifiedQueue] = useState([]);
  const [systemRegistry, setSystemRegistry] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardContent();
  }, []);

  const loadDashboardContent = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Metrics counts
      const metricsRes = await fetch('http://localhost:8081/api/admin/dashboard-summary');
      const metricsData = await metricsRes.json();
      setMetrics(metricsData);

      // 2. Fetch Pending Verification Queue Items
      const pendingRes = await fetch('http://localhost:8081/api/admin/pending-verifications');
      const pendingData = await pendingRes.json();
      setUnverifiedQueue(pendingData);

      // 3. Fetch System Registry records
      const registryRes = await fetch('http://localhost:8081/api/admin/all-users');
      const registryData = await registryRes.json();
      setSystemRegistry(registryData);

      setLoading(false);
    } catch (error) {
      console.error("Error synchronizing admin metrics:", error);
      setLoading(false);
    }
  };

  const handleVerifyClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`http://localhost:8081/api/admin/approve/${selectedUser.userId}?role=${selectedUser.role}`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        setShowModal(false);
        loadDashboardContent();
      } else {
        alert("Verification update rejected by server.");
      }
    } catch (error) {
      console.error("Network connection failure during approval:", error);
    }
  };

  const handlePurgeAccount = async (userId) => {
    if (!window.confirm(`Are you sure you want to permanently delete User ID: ${userId}?`)) return;
    try {
      const response = await fetch(`http://localhost:8081/api/admin/delete-user/${userId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        loadDashboardContent();
      }
    } catch (error) {
      console.error("Purge failure:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-500 font-semibold text-center mt-20">
        Refreshing system metrics center...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] p-8 font-sans">
      
      {/* Title Header Section */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#3b82f6] text-white p-2 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Operations & Verification Command Center</h1>
        </div>
        <button 
          onClick={loadDashboardContent}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dynamic Metric Count Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Accounts</p>
            <p className="text-4xl font-bold text-[#1e293b] mt-1">{metrics.totalAccounts}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Security Review</p>
            <p className="text-4xl font-bold text-amber-500 mt-1">{metrics.awaitingReview}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Donors</p>
            <p className="text-4xl font-bold text-emerald-600 mt-1">{metrics.registeredDonors}</p>
          </div>
        </div>

        {/* SECTION 1: Unverified Profile Approvals Queue */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            📋 Unverified Profile Approvals Queue
          </h2>
          
          {unverifiedQueue.length === 0 ? (
            <p className="text-sm text-slate-400 py-2">✓ No organization profiles currently awaiting administrative validation review.</p>
          ) : (
            <div className="space-y-4">
              {unverifiedQueue.map((item) => (
                <div key={item.userId} className="border border-slate-100 rounded-xl p-5 flex justify-between items-center bg-white hover:bg-slate-50/50 transition">
                  <div className="space-y-1">
                    <p className="text-base font-bold text-[#1e293b]">{item.businessName || "Individual Registration"}</p>
                    <p className="text-xs text-slate-500">
                      Representative: <span className="font-semibold text-slate-700">{item.fullName}</span> ({item.email})
                    </p>
                    <div className="pt-1">
                      <span className="bg-amber-50 text-amber-600 border border-amber-200/50 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {item.role}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleVerifyClick(item)}
                    className="bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-sm"
                  >
                    Verify Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: System Account Registry */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#1e293b] mb-4 flex items-center gap-2">
            👥 System Account Registry
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="p-4">User ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role Status</th>
                  <th className="p-4 text-right">Administrative Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {systemRegistry.map((user) => (
                  <tr key={user.userId} className="hover:bg-slate-50/30 transition">
                    <td className="p-4 font-semibold text-slate-400">{user.userId}</td>
                    <td className="p-4 font-bold text-slate-700">{user.fullName || "Test User"}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handlePurgeAccount(user.userId)}
                        className="bg-red-50 hover:bg-red-100/80 text-red-600 font-bold text-xs px-3 py-1.5 rounded-md transition border border-red-100"
                      >
                        Purge Account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Verification Modal Component Instance */}
      <AuditModal 
        isOpen={showModal} 
        user={selectedUser} 
        onClose={() => setShowModal(false)} 
        onApprove={handleConfirmApprove} 
      />
    </div>
  );
};

// Extracted Sub-Component for Clean Structure
const AuditModal = ({ isOpen, user, onClose, onApprove }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#111827] border border-slate-800 text-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        
        <div className="bg-[#0b0f17] p-6 border-b border-slate-800/80 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Document Audit Verification</h3>
            <p className="text-slate-400 text-xs mt-1">Review organization claims before live platform activation.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition font-bold text-lg">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Organization Name</label>
              <p className="text-lg font-bold mt-1 text-white">{user.businessName || "N/A (Individual)"}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Account Representative</label>
              <p className="text-base font-semibold mt-1 text-slate-200">{user.fullName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Email Contact</label>
              <p className="text-base font-medium mt-1 text-slate-300">{user.email}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Requested Access Role</label>
              <div className="mt-1.5">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-md uppercase">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Uploaded Document Certificate</label>
            {user.docUrl ? (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex justify-between items-center text-blue-400">
                <span className="text-xs font-mono truncate max-w-[400px]">{user.docUrl}</span>
                <a href={user.docUrl} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded font-semibold">View File</a>
              </div>
            ) : (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-300">
                <span className="text-sm mt-0.5">⚠️</span>
                <p className="text-xs leading-relaxed text-amber-200/90">
                  Operational Error: The registration setup wizard was submitted but no physical validation attachment files were detected on disk.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0b0f17]/40 px-6 py-4 border-t border-slate-800/80 flex justify-end items-center gap-4">
          <button onClick={onClose} className="text-sm font-semibold text-slate-400 hover:text-slate-200 transition">Cancel</button>
          <button 
            onClick={onApprove}
            className="bg-[#4fd1c5] hover:bg-[#3bc0b4] text-slate-900 font-extrabold text-sm px-5 py-2.5 rounded-xl transition shadow-md"
          >
            Confirm & Approve Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;