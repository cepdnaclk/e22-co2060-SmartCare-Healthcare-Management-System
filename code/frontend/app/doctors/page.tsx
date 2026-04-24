"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, User, ChevronRight, AlertCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Navbar from "../navbar/Navbar";

// --- ANIMATION SETTINGS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

export default function DoctorsListingPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // PUBLIC FETCH LOGIC
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors");

        if (res.ok) {
          setDoctors(await res.json());
        } else {
          // 🔴 This will now tell you the EXACT status code causing the crash
          setErrorMessage(`Server rejected request with status: ${res.status}`);
        }
      } catch (error) {
        setErrorMessage("Server connection error. Is your backend running?");
      }
    };
    
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <Navbar/>

      <div className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
        
        {/* HEADER ANIMATION */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 border-b-2 border-slate-200 pb-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">Our Specialists</h1>
          <p className="text-slate-500 mt-3 text-lg">Find and book the perfect doctor for your needs.</p>
        </motion.div>

        {/* 🔴 DIAGNOSTIC ERROR MESSAGE DISPLAY */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-8 flex flex-col items-center justify-center text-center font-bold mb-8 shadow-sm">
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
            <p className="text-2xl mb-2">{errorMessage}</p>
            
            {/* Auto-tips based on what the server is responding with */}
            {errorMessage.includes("401") && (
              <p className="text-sm font-medium text-red-500 max-w-lg">
                Tip: Status 401 means you still have the "authenticateToken" middleware on your backend route! Remove it and restart your Express server.
              </p>
            )}
            {errorMessage.includes("500") && (
              <p className="text-sm font-medium text-red-500 max-w-lg">
                Tip: Status 500 means your backend code crashed. Check your Express terminal to see the MongoDB error!
              </p>
            )}
          </div>
        )}

        {/* --- ANIMATED GRID --- */}
        {!errorMessage && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {doctors.map((doc) => (
              <motion.div 
                key={doc._id} 
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0px 15px 30px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-none p-0 shadow-sm border border-slate-200 transition-all flex flex-col items-center text-center group overflow-hidden" 
              >
                
                <div className="w-full h-56 bg-slate-100 flex items-center justify-center border-b border-slate-100 overflow-hidden relative">
                  {doc.image ? (
                    <img 
                      src={`http://localhost:5000${doc.image}`} 
                      alt={doc.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <User className="w-16 h-16 text-slate-300" />
                  )}
                  
                  <div className="absolute top-4 right-4 flex items-center justify-center bg-white/90 backdrop-blur-sm text-yellow-600 px-3 py-1 rounded-none shadow-sm text-sm font-bold border border-yellow-100">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {doc.rating || "New"}
                  </div>
                </div>

                <div className="p-8 w-full flex flex-col items-center flex-grow">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">{doc.name}</h2>
                  <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-6">{doc.specialization}</p>
                  
                  <Link 
                    href={`/doctors/${doc._id}`} 
                    className="w-full mt-auto flex items-center justify-center bg-slate-800 text-white py-4 rounded-none font-bold group-hover:bg-blue-600 transition-colors"
                  >
                    View Full Profile
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                </div>
                
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* LOADING STATE */}
        {!errorMessage && doctors.length === 0 && (
          <div className="text-center py-20 text-slate-500 text-xl font-bold animate-pulse flex flex-col items-center">
            <User className="w-12 h-12 mb-4 text-slate-300" />
            Loading specialists...
          </div>
        )}

      </div>
    </div>
  );
}