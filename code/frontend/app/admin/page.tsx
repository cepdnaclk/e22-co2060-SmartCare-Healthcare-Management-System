"use client";

import { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar"; // Make sure this path points to your actual Navbar file!
import { ShieldCheck, UserPlus, Trash2, Mail, Lock, Briefcase, Star, Image as ImageIcon, User } from "lucide-react";

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", specialization: "", rating: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);

  // Fetch all doctors when the page loads
  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/doctors", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error("Failed to fetch doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("email", formData.email);
    dataToSend.append("password", formData.password);
    dataToSend.append("specialization", formData.specialization);
    dataToSend.append("rating", formData.rating);
    if (imageFile) dataToSend.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:5000/api/create-doctor", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: dataToSend,
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setFormData({ name: "", email: "", password: "", specialization: "", rating: "" });
        setImageFile(null);
        (document.getElementById("imageInput") as HTMLInputElement).value = "";
        fetchDoctors(); // Refresh the list
      }
    } catch (err) {
      setMessage("Error creating doctor.");
    }
  };

  const handleRemoveDoctor = async (doctorId: string, doctorName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove Dr. ${doctorName}?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/doctor/${doctorId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server crashed or the backend delete route is missing! Check your Express terminal.");
      }

      const data = await response.json();

      if (response.ok) {
        setDoctors(doctors.filter((doc) => doc._id !== doctorId));
        alert("✅ Doctor removed successfully.");
      } else {
        alert("❌ " + (data.message || "Failed to remove doctor."));
      }
    } catch (error: any) {
      console.error("Full error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* OUR SMART NAVBAR GOES RIGHT AT THE TOP */}
      <Navbar />

      <div className="p-8 max-w-6xl mx-auto mt-6">
        
        {/* HEADER */}
        <div className="flex items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-14 h-14 bg-slate-800 text-white rounded-full flex items-center justify-center mr-6 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Control Panel</h1>
            <p className="text-slate-500 font-medium">Manage hospital staff and doctor profiles</p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 1. ADD NEW DOCTOR FORM (Left Side) */}
          <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center border-b pb-4">
              <UserPlus className="w-6 h-6 mr-3 text-blue-600" /> 
              Add New Doctor
            </h2>
            
            {message && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl font-bold text-sm">
                {message}
              </div>
            )}
            
            <form onSubmit={handleAddDoctor} className="flex flex-col gap-4">
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
                <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-12 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>

              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
                <input type="email" placeholder="Login Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>

              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
                <input type="password" placeholder="Temporary Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>

              <div className="relative">
                <Briefcase className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
                <input type="text" placeholder="Specialization" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full pl-12 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>

              <div className="relative">
                <Star className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
                <input type="number" step="0.1" placeholder="Rating (0-5)" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full pl-12 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              
              <div className="relative mt-2">
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" /> Profile Image
                </label>
                <input id="imageInput" type="file" accept="image/png, image/jpeg, image/jpg" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
              </div>
              
              <button type="submit" className="w-full bg-slate-800 text-white p-4 rounded-xl hover:bg-slate-900 font-bold mt-4 shadow-md transition-all hover:-translate-y-1">
                Create Doctor Profile
              </button>
            </form>
          </div>

          {/* 2. DOCTORS DIRECTORY (Right Side) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">
              🩺 Active Doctors Directory
            </h2>
            
            {doctors.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium text-lg">No doctors in the system.</p>
                <p className="text-slate-400 text-sm">Use the form on the left to add your first doctor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow group">
                    
                    <div className="flex items-center gap-4">
                      {/* Small Avatar circle */}
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm overflow-hidden">
                        {doc.image ? (
                           <img src={`http://localhost:5000${doc.image}`} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                           doc.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-slate-800">{doc.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{doc.specialization}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRemoveDoctor(doc._id, doc.name)}
                      className="p-3 bg-white text-red-500 rounded-xl border border-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100"
                      title="Remove Doctor"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}