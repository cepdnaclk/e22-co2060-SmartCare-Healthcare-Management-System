'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User as UserIcon, CheckCircle } from 'lucide-react';

import { use } from 'react';

export default function BookingPage({ params }: { params: Promise<{ doctorId: string }> }) {
  const router = useRouter();
  const { doctorId } = use(params);
  
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  // Parse availability strings to time slots for a given date
  const getSlotsForDate = (dateStr: string, availability: string[]) => {
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
      
      // Simple parsing: check if availability string contains the day name
      // e.g., "Mon 10:00" -> match "Mon" -> extract "10:00"
      // Also support generic time-only slots if no day specified? Let's assume day is required for now provided by doctor
      // Or just valid times.
      
      const slots: string[] = [];
      availability.forEach(slotStr => {
          if (slotStr.includes(dayName)) {
              // Extract time... rough parsing
              const timeMatch = slotStr.match(/\d{1,2}:\d{2}/);
              if (timeMatch) slots.push(timeMatch[0]);
          } else if (!slotStr.match(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/)) {
            // Assume daily if no day specified?
             const timeMatch = slotStr.match(/\d{1,2}:\d{2}/);
             if (timeMatch) slots.push(timeMatch[0]);
          }
      });
      return slots.sort();
  };

  useEffect(() => {
    // Fetch Doctor Details
    fetch(`/api/doctors/${doctorId}`)
      .then(res => res.json())
      .then(data => {
          setDoctor(data);
          // Fetch existing appointments for this doctor to calculate capacity
          // Note: In a real app we'd filter by date on server, here we fetch all for prototype simplicity
          return fetch(`/api/appointments`);
      })
      .then(res => res.json())
      // server returns all appointments? Wait, API GET returns based on user role.
      // If patient, they only see their own.
      // We need a public endpoint or logic to see "booked slots" counts.
      // ACTUALLY, the current GET /api/appointments is restricted by role.
      // Patients cannot see other patients' appointments.
      // So we can't count them client-side securely. 
      // WE NEED A NEW ENDPOINT: GET /api/appointments/availability?doctor=ID&date=DATE
      // OR trusted client-side logic is moot.
      // FOR NOW: Let's assume we can only see our own, so "Capacity" visual might be inaccurate for patients.
      // FIX: We need to update existing GET /api/appointments/route.ts or make a new one.
      // Let's implement without visual capacity first, relying on backend error "Slot Full".
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleBook = async (time: string) => {
      if (!selectedDate || !reason) {
          alert('Please select a date and enter a reason');
          return;
      }
      setBooking(true);

      // Construct ISO Date
      const dateTime = new Date(`${selectedDate}T${time}`);
      
      try {
          const res = await fetch('/api/appointments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  doctorId,
                  date: dateTime.toISOString(),
                  reason
              })
          });
          
          const data = await res.json();
          if (res.ok) {
              alert('Appointment booked successfully!');
              router.push('/dashboard');
          } else {
              alert(`Booking failed: ${data.message}`);
          }
      } catch (err) {
          console.error(err);
          alert('An error occurred');
      } finally {
          setBooking(false);
      }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!doctor) return <div className="p-10 text-center">Doctor not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Book Appointment</h1>
        <p className="text-gray-600 mb-6">with Dr. {doctor.name} ({doctor.specialization})</p>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input 
                type="date" 
                className="w-full border p-3 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (doctor.availability) {
                        setAvailableSlots(getSlotsForDate(e.target.value, doctor.availability));
                    }
                }}
            />
        </div>

        {selectedDate && (
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
                {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {availableSlots.map(slot => (
                            <button
                                key={slot}
                                onClick={() => handleBook(slot)}
                                disabled={booking}
                                className="border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition font-medium focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No slots available for this day (Doctor's Schedule: {doctor.availability?.join(', ') || 'None'})</p>
                )}
            </div>
        )}

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
            <textarea 
                className="w-full border p-3 rounded-lg h-24"
                placeholder="Briefly describe your symptoms or reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            ></textarea>
        </div>

      </div>
    </div>
  );
}
