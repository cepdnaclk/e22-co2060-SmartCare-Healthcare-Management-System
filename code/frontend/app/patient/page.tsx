"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, PlusCircle, Trash2, CalendarDays, Clock, User, Stethoscope, Activity } from "lucide-react";
import Navbar from "@/app/navbar/Navbar"; // Adjust this path if your Navbar is somewhere else!

export default function PatientDashboard() {
  const [myAppointments, setMyAppointments] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/appointments/my-appointments", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setMyAppointments(await res.json());
      } else {
        setError("Failed to load your appointments.");
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle Cancelling Appointment
  const handleCancelAppointment = async (apptId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${apptId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        // Instantly remove the appointment from the screen with a smooth animation!
        setMyAppointments(prevAppointments => prevAppointments.filter(appt => appt._id !== apptId));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to cancel appointment.");
      }
    } catch (error) {
      alert("An error occurred while trying to cancel.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* 1. SMART NAVBAR */}
      <Navbar />

      {/* 2. MAIN CONTENT */}
      <div className="flex-grow max-w-6xl mx-auto w-full p-4 sm:p-8">
        
        {/* HEADER AREA */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 mt-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center">
              <Activity className="w-8 h-8 mr-3 text-blue-600" /> My Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-2">Manage your health and upcoming visits.</p>
          </div>
          
          <Link 
            href="/patient/book" 
            className="flex items-center bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md hover:-translate-y-1"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Book New Appointment
          </Link>
        </motion.div>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bold mb-8 text-center">
            {error}
          </div>
        )}

        {/* APPOINTMENTS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100"
        >
          <h2 className="text-2xl font-extrabold mb-8 text-slate-800 flex items-center border-b border-slate-100 pb-4">
            <CalendarDays className="w-7 h-7 mr-3 text-blue-600" />
            Upcoming Appointments
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 font-bold animate-pulse">
              Loading your schedule...
            </div>
          ) : myAppointments.length === 0 ? (
            /* EMPTY STATE */
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center">
              <Calendar className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-700 font-bold text-xl mb-2">You are all caught up!</p>
              <p className="text-slate-500 font-medium mb-6">You have no upcoming appointments scheduled.</p>
              <Link href="/patient/book" className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center bg-blue-50 px-6 py-2 rounded-lg">
                Find a Specialist
              </Link>
            </div>
          ) : (
            /* LIST OF APPOINTMENTS */
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {myAppointments.map((appt) => (
                  <motion.div 
                    key={appt._id} 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, padding: 0, overflow: "hidden" }} // Smooth deletion animation
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow gap-6 group"
                  >
                    
                    {/* Doctor Details */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                        <Stethoscope className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-800 mb-1">Dr. {appt.doctorId?.name || "Unknown Doctor"}</p>
                        <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{appt.doctorId?.specialization}</p>
                      </div>
                    </div>
                    
                    {/* Time and Cancel Button */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t border-slate-200 md:border-t-0 pt-4 md:pt-0">
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
                        <div className="flex items-center text-slate-700 font-bold">
                          <CalendarDays className="w-4 h-4 mr-2 text-blue-500" /> {appt.date}
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
                        <div className="flex items-center text-slate-700 font-bold">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" /> {appt.time}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleCancelAppointment(appt._id)}
                        className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                        title="Cancel Appointment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}