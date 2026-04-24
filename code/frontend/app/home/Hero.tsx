"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import Navbar from "../navbar/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors");
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-14 md:py-20 bg-white gap-10 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* TEXT CONTENT - Slides up first */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} // Starts invisible and 50px down
          whileInView={{ opacity: 1, y: 0 }} // Animates to visible and original position
          viewport={{ once: true, amount: 0.3 }} // Triggers when 30% of it is on screen, only happens once
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-black">
            Your Health,
            <span className="text-[#A1E2E8] relative left-25"> Our Priority.</span>
          </h1>
          <p className="text-2xl font-semibold mb-8 text-black">
            Premium Healthcare At Your Fingertips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={(e) => {
                e.preventDefault();
                const token = localStorage.getItem("token");

                if (!token) {
                  alert("Please log in to book an appointment.");
                  router.push("/login");
                } else {
                  router.push("/patient/book");
                }
              }}
              className="bg-[#A1E2E8] text-black px-6 py-2 h-full text-xl rounded-sm font-semibold hover:bg-[#86c9cf] transition-all"
            >
              Appointments
            </button>
            <Link
              href="/doctors"
              className="bg-[#A1E2E8] text-black px-6 py-2 h-full text-xl rounded-sm font-semibold hover:bg-[#86c9cf] transition-all"
            >
              Doctors
            </Link>
          </div>
        </motion.div>

        {/* IMAGE CONTENT - Slides up right after the text */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // 0.2s delay creates the staggered effect
          className="flex-1 w-full max-w-xl"
        >
          <Image
            src="/hero.png"
            alt="Healthcare Hero"
            width={1000}
            height={1000}
            className="w-full h-auto object-contain"
            priority
          />
        </motion.div>

      </section>
      {/* 2. OUR SERVICES */}
      <section
        id="services"
        className="bg-[#A1E2E8] py-20 px-6 md:px-16 lg:px-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold inline-block border-b-4 border-slate-900 pb-3">
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-[#BBEDF2] aspect-[4/5] shadow-none border-none rounded-none"></div>
          <div className="bg-[#BBEDF2] aspect-[4/5] shadow-none border-none rounded-none"></div>
          <div className="bg-[#BBEDF2] aspect-[4/5] shadow-none border-none rounded-none"></div>
        </div>
      </section>

      {/* 3. SCHEDULE SECTION */}
      <section className="relative py-24 px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-1/2 md:w-3/4 md:h-full bg-[#A1E2E8] -z-10 rounded-none"></div>

        <div className="flex-1">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-10 text-slate-900">
            Schedule Your Visit
            <br /> in Seconds.
          </h2>
          <Link
            href="/patient/book"
            className="inline-block bg-white text-slate-900 px-10 py-4 text-2xl rounded-none font-bold shadow-sm hover:bg-slate-50 transition-all border border-slate-100"
          >
            Appointments
          </Link>
        </div>

        <div className="flex-1 w-full flex justify-center md:justify-end">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop"
            alt="Doctors"
            className="w-full max-w-md md:max-w-lg rounded-none shadow-xl border-none object-cover"
          />
        </div>
      </section>

      {/* 4. OUR DOCTORS */}
      <section className="bg-white py-24 px-6 md:px-16 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold inline-block border-b-4 border-slate-900 pb-3">
            Our Doctors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {doctors.length > 0
            ? doctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-[#CBF4F8] p-6 flex flex-col items-center shadow-none rounded-none"
                >
                  <div className="w-full aspect-square bg-white overflow-hidden rounded-none mb-4">
                    {doc.image ? (
                      <img
                        src={`http://localhost:5000${doc.image}`}
                        alt={doc.name}
                        className="w-full h-full object-cover rounded-none"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User size={64} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-extrabold text-2xl text-slate-800">
                    Doctor
                  </h3>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#CBF4F8] p-6 flex flex-col items-center rounded-none"
                >
                  <div className="w-full aspect-square bg-white rounded-none mb-4"></div>
                  <h3 className="font-extrabold text-2xl text-slate-800">
                    Doctor
                  </h3>
                </div>
              ))}
        </div>

        <div className="flex justify-end mt-8 max-w-6xl mx-auto">
          <Link
            href="/doctors"
            className="bg-[#80D7E0] text-slate-900 px-8 py-3 text-2xl rounded-none font-bold hover:bg-[#6bc3cc] transition-all"
          >
            More
          </Link>
        </div>
      </section>

      {/* 5. VOICES OF TRUST */}
      <section className="bg-[#A1E2E8] py-24 px-6 md:px-16 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold inline-block border-b-4 border-slate-900 pb-3">
            Voices of Trust
          </h2>
        </div>

        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 md:w-3/4 self-start rounded-none flex gap-4 shadow-sm items-start">
            <div className="w-20 h-20 bg-[#A1E2E8] shrink-0 overflow-hidden">
              <img
                src="https://i.pravatar.cc/100?img=11"
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-2xl">Sarah Fernando</h4>
              <p className="text-2xl text-slate-600 mt-2 leading-relaxed italic">
                "Managing patient data used to be stressful. Now everything is
                centralized, secure, and easy to access. It saves us hours every
                day."
              </p>
            </div>
          </div>

          <div className="bg-white p-6 md:w-3/4 self-end rounded-none flex gap-4 shadow-sm items-start">
            <div className="w-20 h-20 bg-[#A1E2E8] shrink-0 overflow-hidden">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-2xl">Sarah Fernando</h4>
              <p className="text-2xl text-slate-600 mt-2 leading-relaxed italic">
                "Managing patient data used to be stressful. Now everything is
                centralized, secure, and easy to access. It saves us hours every
                day."
              </p>
            </div>
          </div>

          <div className="bg-white p-6 md:w-3/4 self-start rounded-none flex gap-4 shadow-sm items-start">
            <div className="w-20 h-20 bg-[#A1E2E8] shrink-0 overflow-hidden">
              <img
                src="https://i.pravatar.cc/100?img=5"
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-2xl">Sarah Fernando</h4>
              <p className="text-2xl text-slate-600 mt-2 leading-relaxed italic">
                "Managing patient data used to be stressful. Now everything is
                centralized, secure, and easy to access. It saves us hours every
                day."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white px-6 md:px-16 lg:px-24 py-16 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-slate-100">
        <div className="text-4xl font-black tracking-tighter mb-8 md:mb-0 text-slate-900">
          LOGO
        </div>
        <div className="flex flex-col text-2xl font-bold gap-2 text-right">
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="/doctors" className="hover:text-blue-500">
            Doctors
          </Link>
          <Link href="/patient/book" className="hover:text-blue-500">
            Appointments
          </Link>
          <Link href="#services" className="hover:text-blue-500">
            Services
          </Link>
        </div>
      </footer>
    </div>
  );
}
