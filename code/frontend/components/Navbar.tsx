import Link from "next/link";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#90E0EF] text-black  py-2 flex justify-between items-center px-30">
      <h1 className="text-[24px] font-bold">ABC Hospitals</h1>

      <div className="flex text-[20px] font-medium items-center  space-x-6">
        <Link href="/" className="hover:text-gray-400 transition">
          Home
        </Link>
        <Link href="/about" className="hover:text-gray-400 transition">
          Doctors
        </Link>
        <Link href="/contact" className="hover:text-gray-400 transition">
          Appointments
        </Link>
        <Link href="/" className="hover:text-gray-400 transition">
          Services
        </Link>
        {/* Login Button */}
        <Link
          href="/login"
          className="flex items-center gap-2 bg-[#CAF0F8] text-black px-4 py-2 rounded-xl hover:bg-gray-200 transition"
        >
          
          Login
          <User size={18} />
        </Link>
      </div>
    </nav>
  );
}
