"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, UserPlus, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "../navbar/Navbar";
 // Ensure this path is correct for your project!

interface RegisterResponse {
  message: string;
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false); // Only stop loading if there is an error, otherwise keep it spinning until redirect
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* --- SMART NAVBAR --- */}
      <Navbar/>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <UserPlus className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 mt-2 font-medium text-sm">
              Join our platform to book and manage appointments.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 font-bold text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-100 p-4 text-sm text-green-700 font-bold text-center flex flex-col items-center">
              <span className="text-lg mb-1">🎉</span>
              Account created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* EMAIL INPUT */}
            <div className="relative">
              <label className="mb-1 block text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || success}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-11 py-3 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="relative">
              <label className="mb-1 block text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || success}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-11 py-3 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD INPUT */}
            <div className="relative">
              <label className="mb-1 block text-sm font-bold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading || success}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-11 py-3 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex items-center justify-center rounded-xl bg-slate-800 px-4 py-4 font-bold text-white transition-all hover:bg-blue-600 hover:-translate-y-1 shadow-md disabled:bg-slate-400 disabled:hover:translate-y-0 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Account...
                </>
              ) : success ? (
                "Success!"
              ) : (
                <>
                  Register <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="mt-8 text-center text-sm font-medium text-slate-500 border-t border-slate-100 pt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
              Log in here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}