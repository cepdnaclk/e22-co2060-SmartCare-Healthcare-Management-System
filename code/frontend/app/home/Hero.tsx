"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Activity, ArrowRight, Star } from "lucide-react";
import Navbar from "../navbar/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  // States
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Doctors
        const resDocs = await fetch("http://localhost:5000/api/doctors");
        if (resDocs.ok) {
          const data = await resDocs.json();
          setDoctors(data.slice(0, 3));
        }

        // Fetch Services
        const resServs = await fetch("http://localhost:5000/api/services");
        if (resServs.ok) {
          const servData = await resServs.json();
          setServices(servData.slice(0, 3)); // Display first 3 services
        }

        // Fetch Testimonials
        const resTestimonials = await fetch(
          "http://localhost:5000/api/testimonials",
        );
        if (resTestimonials.ok) {
          const testData = await resTestimonials.json();
          setTestimonials(testData);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchData();
  }, []);

  // Helper to render stars based on rating number
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-slate-300"
        }`}
      />
    ));
  };

  // Default mockup data for fallback if the API doesn't return data yet
  const defaultServices = [
    {
      _id: "default_1",
      name: "Cardiology",
      description:
        "Advanced heart care diagnostics and treatment with state-of-the-art facilities.",
      image: "",
    },
    {
      _id: "default_2",
      name: "Neurology",
      description:
        "Comprehensive neurological evaluations and personalized treatment plans.",
      image: "",
    },
    {
      _id: "default_3",
      name: "Pediatrics",
      description:
        "Dedicated and compassionate healthcare services for infants, children, and teens.",
      image: "",
    },
  ];

  const displayServices =
    services && services.length > 0 ? services : defaultServices;

  // Helper function to resolve image URL
  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-14 md:py-20 gap-10 max-w-7xl mx-auto w-full overflow-hidden">
        {/* TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-black">
            Your Health,
            <span className="text-[#A1E2E8] relative left-5 md:left-25">
              {" "}
              Our Priority.
            </span>
          </h1>
          <p className="text-2xl font-semibold mb-8 text-black">
            Premium Healthcare At Your Fingertips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={(e) => {
                e.preventDefault();
                const token =
                  typeof window !== "undefined"
                    ? localStorage.getItem("token")
                    : null;

                if (!token) {
                  alert("Please log in to book an appointment.");
                  router.push("/login");
                } else {
                  router.push("/patient/book");
                }
              }}
              className="bg-[#A1E2E8] text-black px-6 py-3 text-xl rounded-sm font-semibold hover:bg-[#86c9cf] transition-all shadow-md cursor-pointer"
            >
              Appointments
            </button>
            <Link
              href="/doctors"
              className="bg-[#A1E2E8] text-black px-6 py-3 text-xl rounded-sm font-semibold hover:bg-[#86c9cf] transition-all shadow-md text-center"
            >
              Doctors
            </Link>
          </div>
        </motion.div>

        {/* IMAGE CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex-1 w-full max-w-xl relative h-[400px]"
        >
          <Image
            src="/hero.png"
            alt="Healthcare Hero"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </motion.div>
      </section>

      {/* 2. OUR SERVICES */}
      <section
        id="services"
        className="relative bg-gradient-to-br from-[#86C9CF]/20 via-transparent to-white py-24 px-6 md:px-16 lg:px-24 overflow-hidden border-y border-slate-200"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 max-w-7xl mx-auto">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
              Clinical Expertise
            </h2>
            <p className="text-[#597e88] font-bold tracking-wider text-xs uppercase mt-1">
              Advanced medical services
            </p>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-2 bg-[#0f4c5c] text-white text-sm font-black uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-[#1b263b] transition duration-300 shadow-md"
          >
            More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayServices.map((service) => (
            <div
              key={service._id}
              className="group flex flex-col h-[460px] cursor-pointer border border-white/40 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-500"
            >
              {/* Image Block */}
              <div className="h-[45%] relative overflow-hidden bg-[#e6f7f8]">
                {service.image ? (
                  getImageUrl(service.image)?.startsWith("http://localhost:5000") ? (
                    <img
                      src={getImageUrl(service.image)!}
                      alt={service.name}
                      className="object-cover group-hover:scale-105 transition-all duration-700 w-full h-full"
                    />
                  ) : (
                    <Image
                      src={getImageUrl(service.image)!}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-all duration-700"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#0f4c5c]">
                    <Activity size={50} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>

              {/* Text Block */}
              <div className="h-[55%] p-6 flex flex-col justify-between bg-white/70 backdrop-blur-lg flex-1">
                <div>
                  <h3 className="text-xl font-black uppercase mb-2 text-slate-900 leading-tight tracking-tight line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="font-medium text-slate-600 text-sm line-clamp-3 mb-4">
                    {service.description}
                  </p>
                </div>

                <Link
                  href="/services"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SCHEDULE SECTION */}
      <section className="relative py-28 px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden bg-gradient-to-tr from-[#A1E2E8]/20 to-transparent border-b border-slate-200">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#86C9CF]/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#597e88]/10 rounded-full blur-2xl -z-10" />

        <div className="flex-1 z-10 max-w-xl">
          <span className="text-[#597e88] font-black uppercase tracking-widest text-xs mb-3 block">
            Book Fast & Secure
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-8 text-slate-900">
            Schedule Your Visit <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f4c5c] to-[#597e88]">
              in Seconds.
            </span>
          </h2>
          <p className="text-slate-600 text-lg mb-10 max-w-md">
            Skip the long queues. Choose your specialty, find a time that works
            best, and securely book with qualified professionals in just a few
            clicks.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/patient/book"
              className="inline-flex items-center bg-slate-900 text-white px-8 py-4 text-lg font-bold gap-3 shadow-lg hover:bg-slate-800 active:scale-98 transition duration-300 rounded-2xl"
            >
              Appointments <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center bg-white border border-slate-200 text-slate-800 px-8 py-4 text-lg font-bold shadow-sm hover:bg-slate-50 transition duration-300 rounded-2xl"
            >
              Our Services
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md md:max-w-lg z-10">
          <div className="relative bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-3xl p-8 flex flex-col items-center">
            <div className="w-full h-[320px] md:h-[360px] relative rounded-2xl overflow-hidden shadow-inner mb-6">
              <Image
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop"
                alt="Doctor Schedule Consultation"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex justify-between w-full items-center px-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-900 text-sm">
                  4.9/5 Trust Rating
                </span>
              </div>
              <span className="text-xs uppercase tracking-widest text-[#597e88] font-bold bg-[#86C9CF]/30 px-3 py-1 rounded-full">
                Available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR DOCTORS */}
      <section className="bg-slate-50/50 py-24 px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 max-w-6xl mx-auto gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
              Our Doctors
            </h2>
            <p className="text-[#597e88] font-bold tracking-wider text-xs uppercase mt-1">
              Meet our team of experts
            </p>
          </div>
          <Link
            href="/doctors"
            className="flex items-center gap-2 bg-[#0f4c5c] text-white text-sm font-black uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-[#1b263b] transition duration-300 shadow-md"
          >
            More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {doctors.length > 0
            ? doctors.map((doc) => (
                <div
                  key={doc._id}
                  className="group relative bg-white/70 backdrop-blur-xl border border-white/60 p-6 flex flex-col items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl hover:shadow-[0_20px_50px_rgba(8,112,184,0.12)] hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-full aspect-square bg-slate-100 border border-slate-100/50 overflow-hidden mb-6 relative rounded-2xl">
                    {doc.image ? (
                      getImageUrl(doc.image)?.startsWith("http://localhost:5000") ? (
                        <img
                          src={getImageUrl(doc.image)!}
                          alt={doc.name}
                          className="object-cover group-hover:scale-105 transition-all duration-500 w-full h-full"
                        />
                      ) : (
                        <Image
                          src={getImageUrl(doc.image)!}
                          alt={doc.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-all duration-500"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-white">
                        <User size={64} />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm rounded-full z-10">
                      Specialist
                    </span>
                  </div>

                  <div className="text-center w-full">
                    <span className="text-xs font-bold text-[#597e88] uppercase tracking-widest mb-1 block">
                      {doc.specialization || "Physician"}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                      Dr. {doc.name || "Doctor"}
                    </h3>
                    <Link
                      href={`/doctors/${doc._id}`}
                      className="inline-flex items-center text-xs font-black uppercase tracking-widest border border-slate-200 bg-white/80 backdrop-blur px-5 py-3 hover:bg-slate-900 hover:text-white transition-all shadow-sm rounded-xl"
                    >
                      View Profile <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-lg border border-white/60 p-6 flex flex-col items-center rounded-2xl shadow-sm h-[400px] animate-pulse"
                />
              ))}
        </div>
      </section>

      {/* 5. VOICES OF TRUST */}
      <section className="bg-gradient-to-br from-[#A1E2E8]/10 via-slate-50/50 to-white py-24 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="text-center mb-20 relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold inline-block border-b-4 border-slate-900 pb-3">
            Voices of Trust
          </h2>
          <p className="text-[#597e88] font-bold tracking-wider text-xs uppercase mt-3">
            Updated directly by the admin
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {loadingTestimonials ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/60 animate-pulse flex flex-col items-center h-[400px]"
                />
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: index * 0.4,
                  }}
                  className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 flex flex-col items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(8,112,184,0.1)] h-full"
                >
                  {/* Avatar - Top Center */}
                  <div className="w-24 h-24 bg-white shadow-sm shrink-0 overflow-hidden flex items-center justify-center relative rounded-full border-4 border-white mb-8">
                    {getImageUrl(testimonial.image)?.startsWith("http://localhost:5000") ? (
                      <img
                        src={getImageUrl(testimonial.image)!}
                        alt={testimonial.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Image
                        src={getImageUrl(testimonial.image)!}
                        alt={testimonial.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-xl text-slate-700 italic leading-relaxed text-center mb-8 flex-grow">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Name & Role */}
                  <div className="text-center mb-6">
                    <h4 className="font-extrabold text-2xl text-slate-950 tracking-tight">
                      {testimonial.name}
                    </h4>
                    <span className="text-sm font-semibold tracking-wide text-[#597e88] mt-1 block">
                      {testimonial.role || "Patient"}
                    </span>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mt-auto">
                    {renderStars(testimonial.rating)}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center p-16 bg-white/50 border border-slate-200 rounded-2xl backdrop-blur-sm max-w-2xl mx-auto">
              <p className="text-slate-500 font-semibold text-xl">
                No testimonials have been added by the admin yet.
              </p>
            </div>
          )}
        </div>

        {/* Optional decorative background blobs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#A1E2E8]/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl -z-10" />
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white px-6 md:px-16 lg:px-24 py-16 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-slate-100">
        <div className="text-4xl font-black tracking-tighter mb-8 md:mb-0 text-slate-900">
          LOGO
        </div>
        <div className="flex flex-col text-2xl font-bold gap-2 text-right">
          <Link href="/" className="hover:text-sky-500">
            Home
          </Link>
          <Link href="/doctors" className="hover:text-sky-500">
            Doctors
          </Link>
          <Link href="/patient/book" className="hover:text-sky-500">
            Appointments
          </Link>
          <Link href="#services" className="hover:text-sky-500">
            Services
          </Link>
        </div>
      </footer>
    </div>
  );
}
