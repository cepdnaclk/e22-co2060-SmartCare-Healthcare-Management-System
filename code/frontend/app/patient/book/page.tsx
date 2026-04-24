"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Stethoscope, Clock, User, CheckCircle2, ArrowLeft, ArrowRight, Lock } from "lucide-react"; // 🔴 ADDED Lock icon
import { format, parseISO } from "date-fns"; 
import { useRouter } from "next/navigation";
import Link from "next/link"; // 🔴 ADDED Link for the redirect button
import Navbar from "@/app/navbar/Navbar"; 

export default function BookingPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // 🔴 NEW STATE: Keep track of who is viewing the page
  const [userRole, setUserRole] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const watchDoctorId = watch("doctorId");
  const router = useRouter();

  // 🔴 NEW LOGIC: Check the user's role when the page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // If role is missing, assume it's a patient (based on your default setup)
        setUserRole(payload.role || localStorage.getItem("role") || "patient");
      } catch (e) {
        setUserRole(localStorage.getItem("role") || "patient");
      }
    } else {
      setUserRole("guest"); // No token = not logged in
    }
  }, []);

  // Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setDoctors(await res.json());
      } catch (error) {
        console.error("Failed to fetch doctors");
      }
    };
    // Only fetch doctors if they are actually a patient
    if (userRole === "patient") {
      fetchDoctors();
    }
  }, [userRole]);

  // SMART TIME LOGIC
  useEffect(() => {
    if (watchDoctorId && selectedDate) {
      const dayOfWeek = format(parseISO(selectedDate), "EEEE");
      const selectedDoctor = doctors.find((doc) => doc._id === watchDoctorId);

      if (selectedDoctor && selectedDoctor.availability) {
        const scheduleForDay = selectedDoctor.availability.find((a: any) => a.day === dayOfWeek);
        if (scheduleForDay) {
          setAvailableTimes(scheduleForDay.times);
        } else {
          setAvailableTimes([]);
        }
      }
      setSelectedSlot("");
    } else {
      setAvailableTimes([]);
    }
  }, [watchDoctorId, selectedDate, doctors]);

  // Submit the Booking
  const onSubmit = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          doctorId: data.doctorId,
          date: selectedDate,
          time: selectedSlot,
          patientName: data.name,
          phone: data.phone,
          reasonForVisit: data.reason,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/patient");
        }, 3000);
      } else {
        const errData = await response.json();
        alert("Failed to book appointment: " + errData.message);
      }
    } catch (error) {
      alert("Server Error. Could not connect.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col lg:flex-row overflow-hidden min-h-[600px]">
          
          {/* LEFT SIDE: Info Panel */}
          <div className="lg:w-2/5 bg-slate-800 text-white p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            <button 
              onClick={() => router.back()} 
              className="flex items-center text-slate-300 hover:text-white transition font-medium w-fit z-10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
            </button>

            <div className="mt-12 mb-8 z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Fast, Secure & Easy Booking.
              </h2>
              <p className="text-slate-300 text-lg font-medium leading-relaxed">
                Select your specialist, choose a date that works for you, and pick an available time slot. We will handle the rest.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm z-10 border border-white/20">
              <div className="flex items-center text-blue-200 mb-2 font-bold">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Verified Specialists
              </div>
              <div className="flex items-center text-blue-200 font-bold">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Instant Confirmation
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Booking Form OR Restricted Access Message */}
          <div className="lg:w-3/5 p-8 sm:p-12 relative bg-white flex flex-col justify-center">
            
            {/* If userRole is still loading, show nothing / loading state */}
            {userRole === null ? (
               <div className="flex items-center justify-center h-full text-slate-400 font-bold">Loading...</div>
            ) 
            /* 🔴 NEW: If they are NOT a patient, block access and show a beautiful message */
            : userRole !== "patient" ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full px-6">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border-8 border-amber-100/50">
                  <Lock className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Patient Access Only</h2>
                <p className="text-slate-500 text-lg font-medium mb-8 max-w-sm">
                  {userRole === "guest" 
                    ? "You need to log in to your patient account to book an appointment." 
                    : "Doctors and Administrators cannot book appointments through this portal."}
                </p>
                <Link 
                  href={userRole === "guest" ? "/login" : userRole === "doctor" ? "/doctor" : "/admin"} 
                  className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md hover:-translate-y-1 flex items-center"
                >
                  {userRole === "guest" ? "Log In as Patient" : "Return to Dashboard"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            ) 
            /* 🔴 ORIGINAL FORM: Only shows if userRole === "patient" */
            : (
              <AnimatePresence>
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                      <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Booking Confirmed!</h2>
                    <p className="text-slate-500 text-lg font-medium">Your appointment has been successfully scheduled.</p>
                    <p className="text-blue-600 font-bold mt-6 animate-pulse">Redirecting to your dashboard...</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full">
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center mb-8 border-b border-slate-100 pb-4">
                      <Calendar className="w-7 h-7 mr-3 text-blue-600" />
                      Appointment Details
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-grow flex flex-col justify-between">
                      <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                          <Stethoscope className="w-4 h-4 mr-2 text-slate-400" /> Select Specialist
                        </label>
                        <select
                          {...register("doctorId", { required: true })}
                          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium text-slate-700"
                        >
                          <option value="">Choose a doctor...</option>
                          {doctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>Dr. {doc.name} — {doc.specialization}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Select Date
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            min={format(new Date(), "yyyy-MM-dd")}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium text-slate-700"
                          />
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" /> Select Time
                          </label>
                          <div className="w-full">
                            {!watchDoctorId ? (
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm font-medium">Select a doctor first.</div>
                            ) : !selectedDate ? (
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm font-medium">Select a date to see times.</div>
                            ) : availableTimes.length === 0 ? (
                              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">Not available on this date.</div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2">
                                {availableTimes.map((slot) => (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-3 px-2 rounded-xl text-sm font-bold transition-all ${
                                      selectedSlot === slot ? "bg-blue-600 text-white shadow-md scale-95" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-4">
                          <User className="w-4 h-4 mr-2 text-slate-400" /> Patient Information
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="Full Name" {...register("name", { required: true })} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium text-slate-700" />
                          <input type="tel" placeholder="Phone Number" {...register("phone", { required: true })} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium text-slate-700" />
                          <textarea placeholder="Reason for visit (Optional)" rows={2} {...register("reason")} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium text-slate-700 md:col-span-2 resize-none" ></textarea>
                        </div>
                      </div>

                      <button type="submit" disabled={!selectedDate || !selectedSlot} className="w-full flex items-center justify-center py-4 mt-4 rounded-xl text-lg font-bold bg-slate-800 text-white disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all hover:bg-blue-600 hover:-translate-y-1 shadow-md disabled:hover:translate-y-0 disabled:shadow-none">
                        Confirm Appointment <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}