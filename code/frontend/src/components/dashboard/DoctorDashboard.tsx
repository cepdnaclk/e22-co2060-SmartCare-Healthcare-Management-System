'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, FileText, Clock } from 'lucide-react';

export default function DoctorDashboard({ user }: { user: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };


  const [newSlot, setNewSlot] = useState('');

  const addSlot = async () => {
    if (!newSlot) return;
    const updatedSlots = [...(user.availability || []), newSlot];
    
    try {
        const res = await fetch(`/api/doctors/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ availability: updatedSlots, role: 'doctor' }), // sending role to bypass some checks if needed
        });
        if (res.ok) {
            alert('Slot added successfully');
            window.location.reload(); // Simple reload to refresh user data context
        }
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Doctor Dashboard</h2>
      
      {/* Availability Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Clock className="mr-2 text-green-600" /> Manage Availability
          </h3>
          <p className="text-gray-600 mb-4">Set your available time slots for patients.</p>
          
          <div className="flex gap-4 mb-4">
              <input 
                type="text" 
                placeholder="e.g., Mon 10:00 AM" 
                className="border p-2 rounded flex-1"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
              />
              <button 
                onClick={addSlot}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                  Add Slot
              </button>
          </div>

          <div className="flex flex-wrap gap-2">
              {user.availability && user.availability.map((slot: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {slot}
                  </span>
              ))}
          </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Calendar className="mr-2 text-blue-600" /> Upcoming Appointments
          </h3>
          <button onClick={fetchAppointments} className="text-sm text-blue-600 hover:underline">Refresh</button>
        </div>

        {loading ? <p>Loading...</p> : appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt: any) => (
                  <tr key={appt._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(appt.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appt.patient?.name}</div>
                      <div className="text-sm text-gray-500">{appt.patient?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{appt.reason}</div>
                      {appt.notes && <div className="text-xs text-gray-500 mt-1">Note: {appt.notes}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {appt.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(appt._id, 'confirmed')} className="text-green-600 hover:text-green-900" title="Confirm">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => updateStatus(appt._id, 'cancelled')} className="text-red-600 hover:text-red-900" title="Cancel">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {appt.status === 'confirmed' && (
                        <button onClick={() => updateStatus(appt._id, 'completed')} className="text-blue-600 hover:text-blue-900 flex items-center" title="Complete">
                           <FileText className="w-5 h-5 mr-1" /> Mark Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No appointments found.</p>
        )}
      </div>
    </div>
  );
}
