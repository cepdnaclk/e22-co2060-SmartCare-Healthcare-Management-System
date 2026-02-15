'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User as UserIcon } from 'lucide-react';

export default function PatientDashboard({ user }: { user: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch appointments
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error(err));
      
    // Fetch doctors for booking
    fetch('/api/doctors')
        .then(res => res.json())
        .then(data => setDoctors(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Health Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appointments Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="mr-2 text-blue-600" /> Upcoming Appointments
          </h3>
          {loading ? <p>Loading...</p> : appointments.length > 0 ? (
            <ul className="space-y-4">
              {appointments.map((appt: any) => (
                <li key={appt._id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{new Date(appt.date).toLocaleDateString()} at {new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <p className="text-gray-600">Dr. {appt.doctor?.name}</p>
                      <p className="text-sm text-gray-500">{appt.reason}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming appointments.</p>
          )}
        </div>

        {/* Quick Actions / New Appointment */}
        <div className="bg-white p-6 rounded-xl shadow-md">
           <h3 className="text-xl font-bold mb-4 flex items-center">
            <Clock className="mr-2 text-green-600" /> Book an Appointment
          </h3>
          <p className="mb-4 text-gray-600">Need to see a doctor? Schedule a visit now.</p>
          <a href="/doctors" className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition">
            Find a Doctor
          </a>
          
          <div className="mt-8">
             <h4 className="font-bold mb-2">Recent Medical Records</h4>
             <p className="text-sm text-gray-500">No records found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
