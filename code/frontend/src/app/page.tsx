import Link from 'next/link';
import Image from 'next/image';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { ShieldCheck, HeartPulse, Clock, MessageSquare } from 'lucide-react';

async function getDoctors() {
  await connectToDatabase();
  const doctors = await User.find({ role: 'doctor' }).limit(3).lean();
  return JSON.parse(JSON.stringify(doctors));
}

export default async function Home() {
  const doctors = await getDoctors();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Book appointments with top specialists, manage your health records, and get instant assistance with our AI health companion.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/doctors" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 text-center">
                Find a Doctor
              </Link>
              <Link href="/register" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition duration-300 text-center">
                Join Now
              </Link>
            </div>
          </div>
          {/* Illustration would go here - using text placeholder or simple shape for now */}
          <div className="md:w-1/2 flex justify-center">
             <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                <HeartPulse className="w-32 h-32 text-white opacity-80" />
             </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose SmartCare?</h2>
            <p className="text-gray-600 mt-2">Comprehensive healthcare services at your fingertips.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition duration-300 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Records</h3>
              <p className="text-gray-600">Your medical history is safe and easily accessible only to you and your doctors.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition duration-300 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
              <p className="text-gray-600">Schedule appointments in seconds. No more waiting on hold.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition duration-300 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Health Assistant</h3>
              <p className="text-gray-600">Get 24/7 answers to your health queries with our intelligent chatbot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Meet Our Top Specialists</h2>
            <p className="text-gray-600 mt-2">Highly qualified doctors ready to help you.</p>
          </div>
          
          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {doctors.map((doctor: any) => (
                <div key={doctor._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {/* Placeholder for doctor image */}
                    {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                        <HeartPulse className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{doctor.specialization || 'General Practitioner'}</p>
                    <div className="text-gray-500 text-sm mb-4">
                      <p>Availability:</p>
                      <ul className="list-disc list-inside">
                        {doctor.availability?.slice(0, 2).map((slot: string, idx: number) => (
                          <li key={idx}>{slot}</li>
                        )) || <li>By Appointment</li>}
                      </ul>
                    </div>
                    <Link href={`/doctors/${doctor._id}`} className="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition duration-300">
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No doctors available at the moment. Please check back later.</p>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/doctors" className="inline-block border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 font-medium transition duration-300">
              View All Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
