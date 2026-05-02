"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/navbar/Navbar"; // Adjust if your Navbar is saved elsewhere!
import { motion } from "framer-motion";
import { CalendarDays, Clock, Phone, User, Save, CheckCircle2, Stethoscope, Users } from "lucide-react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"];

export default function DoctorDashboard() {
  const [profile, setProfile] = useState<any>(null); 
  const [appointments, setAppointments] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  // This object holds the grid data
  const [schedule, setSchedule] = useState<Record<string, string[]>>({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch Profile
    const profRes = await fetch("http://localhost:5000/api/doctor/profile", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (profRes.ok) {
      const data = await profRes.json();
      setProfile(data);
      
      // Load existing availability
      if (data.availability) {
        const loadedSchedule: Record<string, string[]> = {
          Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
        };
        data.availability.forEach((item: any) => {
          loadedSchedule[item.day] = item.times;
        });
        setSchedule(loadedSchedule);
      }
    }

    // Fetch Booked Appointments
    const apptRes = await fetch("http://localhost:5000/api/appointments/my-appointments", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (apptRes.ok) setAppointments(await apptRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle a specific time slot
  const toggleTimeSlot = (day: string, slot: string) => {
    setSchedule(prev => {
      const daySlots = prev[day];
      if (daySlots.includes(slot)) {
        return { ...prev, [day]: daySlots.filter(s => s !== slot) };
      } else {
        return { ...prev, [day]: [...daySlots, slot] };
      }
    });
  };

  const handleSetAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formattedAvailability = Object.keys(schedule)
      .filter(day => schedule[day].length > 0)
      .map(day => ({
        day,
        times: schedule[day]
      }));

    try {
      const response = await fetch("http://localhost:5000/api/doctor/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ availability: formattedAvailability }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Availability saved successfully!");
        setTimeout(() => setMessage(""), 3000); 
      } else {
        setMessage("Error: " + data.message);
      }
    } catch (error) {
      setMessage("Error saving availability.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* 1. SMART NAVBAR */}
      <Navbar />

      {/* 2. MAIN CONTENT */}
      <div className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Doctor Control Panel</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your schedule and view upcoming patients.</p>
        </motion.div>

        {/* PROFILE CARD - Rebuilt without absolute positioning */}
        {profile && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="w-32 h-32 bg-slate-100 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md relative z-10">
              {profile.image ? (
                <img src={`http://localhost:5000${profile.image}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left relative z-10 mt-2">
              <h2 className="text-3xl font-extrabold text-slate-800">Dr. {profile.name}</h2>
              <div className="flex items-center justify-center sm:justify-start mt-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full w-fit mx-auto sm:mx-0 font-bold text-sm">
                <Stethoscope className="w-4 h-4 mr-2" />
                {profile.specialization}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MANAGE SCHEDULE GRID */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-slate-100 gap-4">
              <h2 className="text-2xl font-extrabold text-slate-800 flex items-center">
                <CalendarDays className="w-6 h-6 mr-3 text-blue-600" /> Manage Schedule
              </h2>
              {message && (
                <div className="flex items-center font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl text-sm border border-emerald-100 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> {message}
                </div>
              )}
            </div>

            <form onSubmit={handleSetAvailability}>
              <div className="flex flex-col gap-4 mb-8">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="w-32 font-bold text-slate-700 flex items-center">
                      {day}
                    </div>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {TIME_SLOTS.map(slot => {
                        const isSelected = schedule[day].includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleTimeSlot(day, slot)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 ${
                              isSelected 
                                ? "bg-slate-800 text-white shadow-md border-transparent" 
                                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <button type="submit" className="w-full flex items-center justify-center bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all text-lg shadow-md hover:-translate-y-1">
                <Save className="w-5 h-5 mr-2" /> Save My Schedule
              </button>
            </form>
          </motion.div>

          {/* MY PATIENTS LIST */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-800 flex items-center border-b border-slate-100 pb-4">
              <Users className="w-6 h-6 mr-3 text-blue-600" /> Upcoming Visits
            </h2>
            
            {appointments.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No appointments booked yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {appointments.map((appt) => (
                  <div key={appt._id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow">
                    <h3 className="font-extrabold text-slate-800 text-lg mb-1">{appt.patientName}</h3>
                    <p className="text-sm font-medium text-slate-500 flex items-center mb-4">
                      <Phone className="w-4 h-4 mr-2" /> {appt.phone}
                    </p>
                    <div className="flex items-center justify-between bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl shadow-sm">
                      <div className="flex items-center text-sm font-bold">
                        <CalendarDays className="w-4 h-4 mr-2 text-blue-500" /> {appt.date}
                      </div>
                      <div className="flex items-center text-sm font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                        <Clock className="w-4 h-4 mr-1" /> {appt.time.split(" - ")[0]} {/* Simplifies time display slightly */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}