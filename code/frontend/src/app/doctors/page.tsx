'use client';

import { useState, useEffect } from 'react';
import { Search, HeartPulse } from 'lucide-react';
import Link from 'next/link';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredDoctors = doctors.filter((doc: any) => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Specialist</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our list of highly qualified doctors and specialists. Filter by name or specialization to find the right care for you.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-10 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor: any) => (
            <div key={doctor._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100">
              <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                  <HeartPulse className="w-16 h-16 text-blue-200" />
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium text-sm">{doctor.specialization || 'General Practitioner'}</p>
                  </div>
                </div>
                
                <div className="mt-4 mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Availability</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.availability && doctor.availability.length > 0 ? (
                      doctor.availability.map((slot: string, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {slot}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">By Appointment</span>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <Link href={`/book/${doctor._id}`} className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-lg transition duration-300">
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <HeartPulse className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No doctors found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
