"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Stethoscope,
  Clock,
  User,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Lock,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/navbar/Navbar";

export default function BookingPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Keep track of who is viewing the page
  const [userRole, setUserRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const watchDoctorId = watch("doctorId");
  const router = useRouter();

  // Check the user's role when the page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
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
        const scheduleForDay = selectedDoctor.availability.find(
          (a: any) => a.day === dayOfWeek,
        );
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
      const response = await fetch(
        "http://localhost:5000/api/appointments/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: data.doctorId,
            date: selectedDate,
            time: selectedSlot,
            patientName: data.name,
            phone: data.phone,
            reasonForVisit: data.reason,
          }),
        },
      );

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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9fa] via-[#e6f7f8] to-[#edf5f5] flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#a1e2e8]/50 flex flex-col lg:flex-row overflow-hidden min-h-[600px]">
          {/* LEFT SIDE: Info Panel */}
          <div className="lg:w-2/5 bg-gradient-to-br from-[#0f4c5c]/90 to-[#1b263b]/90 text-white p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-[#a1e2e8] rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>

            <button
              onClick={() => router.back()}
              className="flex items-center text-[#a1e2e8] hover:text-white transition-all duration-200 font-extrabold w-fit z-10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
            </button>

            <div className="mt-12 mb-8 z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#a1e2e8] to-slate-200">
                Fast, Secure & Easy Booking.
              </h2>
              <p className="text-[#a5c6ce] text-base font-medium leading-relaxed">
                Select your specialist, choose a date that works for you, and
                pick an available time slot. We will handle the rest.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl z-10 border border-[#a1e2e8]/30 shadow-lg">
              <div className="flex items-center text-[#a1e2e8] mb-3 font-extrabold">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[#a1e2e8]" />{" "}
                Verified Specialists
              </div>
              <div className="flex items-center text-[#a1e2e8] font-extrabold">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[#a1e2e8]" /> Instant
                Confirmation
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Booking Form OR Restricted Access Message */}
          <div className="lg:w-3/5 p-8 sm:p-12 relative bg-white/50 backdrop-blur-xl flex flex-col justify-center">
            {/* If userRole is still loading, show loading state */}
            {userRole === null ? (
              <div className="flex items-center justify-center h-full text-[#0f4c5c] font-black uppercase tracking-widest">
                Loading...
              </div>
            ) : userRole !== "patient" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center h-full px-6"
              >
                <div className="w-20 h-20 bg-[#a1e2e8]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#a1e2e8] shadow-md shadow-teal-500/5">
                  <Lock className="w-8 h-8 text-[#0f4c5c]" />
                </div>
                <h2 className="text-3xl font-black text-[#0f4c5c] mb-3">
                  Patient Access Only
                </h2>
                <p className="text-[#597e88] text-base font-semibold mb-8 max-w-sm">
                  {userRole === "guest"
                    ? "You need to log in to your patient account to book an appointment."
                    : "Doctors and Administrators cannot book appointments through this portal."}
                </p>
                <Link
                  href={
                    userRole === "guest"
                      ? "/login"
                      : userRole === "doctor"
                        ? "/doctor"
                        : "/admin"
                  }
                  className="bg-gradient-to-r from-[#0f4c5c] to-[#1b263b] text-white px-8 py-4 rounded-2xl font-black hover:brightness-110 transition-all shadow-xl shadow-teal-900/10 active:scale-98 flex items-center"
                >
                  {userRole === "guest"
                    ? "Log In as Patient"
                    : "Return to Dashboard"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            ) : (
              <AnimatePresence>
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-white/70 backdrop-blur-2xl z-20 flex flex-col items-center justify-center text-center p-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <CheckCircle2 className="w-24 h-24 text-teal-600 mb-6 drop-shadow-md" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-[#0f4c5c] mb-3">
                      Booking Confirmed!
                    </h2>
                    <p className="text-[#597e88] text-base font-semibold">
                      Your appointment has been successfully scheduled.
                    </p>
                    <p className="text-[#e58221] font-black mt-6 animate-pulse tracking-wider text-xs uppercase">
                      Redirecting to your dashboard...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col h-full justify-between"
                  >
                    <div>
                      <h1 className="text-2xl font-black text-[#0f4c5c] flex items-center mb-8 border-b border-[#a1e2e8]/30 pb-4 tracking-tight uppercase">
                        <Calendar className="w-7 h-7 mr-3 text-[#e58221]" />
                        Appointment Details
                      </h1>
                    </div>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6 flex-grow flex flex-col justify-between"
                    >
                      <div>
                        <label className="flex items-center text-sm font-black text-[#0f4c5c] mb-2 uppercase tracking-wider">
                          <Stethoscope className="w-4 h-4 mr-2 text-[#e58221]" />{" "}
                          Select Specialist
                        </label>
                        <select
                          {...register("doctorId", { required: true })}
                          className="w-full p-4 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#a1e2e8] focus:outline-none focus:ring-4 focus:ring-[#a1e2e8]/30 transition-all font-bold text-slate-700 shadow-sm"
                        >
                          <option value="">Choose a doctor...</option>
                          {doctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>
                              Dr. {doc.name} — {doc.specialization}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center text-sm font-black text-[#0f4c5c] mb-2 uppercase tracking-wider">
                            <Calendar className="w-4 h-4 mr-2 text-[#e58221]" />{" "}
                            Select Date
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            min={format(new Date(), "yyyy-MM-dd")}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                            className="w-full p-4 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#a1e2e8] focus:outline-none focus:ring-4 focus:ring-[#a1e2e8]/30 transition-all font-bold text-slate-700 shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-black text-[#0f4c5c] mb-2 uppercase tracking-wider">
                            <Clock className="w-4 h-4 mr-2 text-[#e58221]" />{" "}
                            Select Time
                          </label>
                          <div className="w-full">
                            {!watchDoctorId ? (
                              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-500 text-xs font-bold shadow-sm">
                                Select a doctor first.
                              </div>
                            ) : !selectedDate ? (
                              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 text-slate-500 text-xs font-bold shadow-sm">
                                Select a date to see times.
                              </div>
                            ) : availableTimes.length === 0 ? (
                              <div className="p-4 rounded-2xl bg-red-50/70 backdrop-blur-sm border border-red-100/60 text-red-600 text-xs font-black shadow-sm">
                                Not available on this date.
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                                {availableTimes.map((slot) => (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-3 px-2 rounded-xl text-xs font-black transition-all shadow-sm ${
                                      selectedSlot === slot
                                        ? "bg-gradient-to-r from-[#0f4c5c] to-[#1b263b] text-white shadow-lg scale-95"
                                        : "bg-white/80 backdrop-blur-sm text-[#0f4c5c] border border-slate-200/60 hover:bg-[#a1e2e8]/30 hover:border-[#a1e2e8]"
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

                      <div className="pt-4 border-t border-[#a1e2e8]/30">
                        <label className="flex items-center text-sm font-black text-[#0f4c5c] mb-4 uppercase tracking-wider">
                          <User className="w-4 h-4 mr-2 text-[#e58221]" />{" "}
                          Patient Information
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Full Name"
                            {...register("name", { required: true })}
                            className="w-full p-4 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#a1e2e8] focus:outline-none focus:ring-4 focus:ring-[#a1e2e8]/30 transition-all font-bold text-slate-700 shadow-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            {...register("phone", { required: true })}
                            className="w-full p-4 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#a1e2e8] focus:outline-none focus:ring-4 focus:ring-[#a1e2e8]/30 transition-all font-bold text-slate-700 shadow-sm"
                          />
                          <textarea
                            placeholder="Reason for visit (Optional)"
                            rows={2}
                            {...register("reason")}
                            className="w-full p-4 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm focus:bg-white focus:border-[#a1e2e8] focus:outline-none focus:ring-4 focus:ring-[#a1e2e8]/30 transition-all font-bold text-slate-700 md:col-span-2 resize-none shadow-sm"
                          ></textarea>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!selectedDate || !selectedSlot}
                        className="w-full flex items-center justify-center py-4 mt-2 rounded-2xl text-base font-black bg-gradient-to-r from-[#0f4c5c] to-[#1b263b] text-white disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all hover:brightness-110 hover:-translate-y-0.5 shadow-xl shadow-teal-900/10 disabled:hover:translate-y-0 disabled:shadow-none uppercase"
                      >
                        Confirm Appointment{" "}
                        <ArrowRight className="w-5 h-5 ml-2" />
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
