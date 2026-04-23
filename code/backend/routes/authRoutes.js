import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import Appointment from "../models/appointment.js";

const router = express.Router();

// --- MULTER SETUP ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

// 1. ADMIN MIDDLEWARE (The Admin Bouncer)
const isAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admins only." });
    }
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// 2. GENERAL AUTH MIDDLEWARE (The General Bouncer)
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied. Please log in." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// PATIENT REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.json({ message: "Patient registered successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ADMIN: CREATE DOCTOR
router.post("/create-doctor", isAdmin, upload.single("image"), async (req, res) => {
  const { email, password, name, specialization, rating } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const doctor = new User({
      email, password: hashedPassword, role: "doctor", name, specialization, image: imagePath, rating
    });

    await doctor.save();
    res.json({ message: "Doctor created successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// DOCTOR: SET AVAILABILITY
router.post("/doctor/availability", authenticateToken, async (req, res) => {
  if (req.user.role !== "doctor") return res.status(403).json({ message: "Doctors only" });
  try {
    await User.findByIdAndUpdate(req.user.id, { availability: req.body.availability });
    res.json({ message: "Availability updated successfully!" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// ==========================================================
// 🔴 PUBLIC ROUTES (Removed authenticateToken!)
// ==========================================================

// EVERYONE: GET ALL DOCTORS (Public)
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("name specialization image rating availability");
    res.json(doctors);
  } catch (error) {
    res.status(500).json(error);
  }
});

// EVERYONE: GET A SINGLE DOCTOR BY ID (Public)
router.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select("-password");
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor details", error });
  }
});

// ==========================================================
// SECURE ROUTES (Require Login)
// ==========================================================

// PATIENT: BOOK AN APPOINTMENT
router.post("/appointments/book", authenticateToken, async (req, res) => {
  if (req.user.role !== "patient") return res.status(403).json({ message: "Only patients can book appointments." });
  const { doctorId, date, time, patientName, phone, reasonForVisit } = req.body;

  try {
    const newAppointment = new Appointment({
      patientId: req.user.id, doctorId, date, time, patientName, phone, reasonForVisit
    });
    await newAppointment.save();
    res.json({ message: "Appointment booked successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving appointment to database.", error });
  }
});

// EVERYONE: GET MY APPOINTMENTS
router.get("/appointments/my-appointments", authenticateToken, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctorId: req.user.id }).populate("patientId", "email");
    } else if (req.user.role === "patient") {
      appointments = await Appointment.find({ patientId: req.user.id }).populate("doctorId", "name specialization");
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
});

// DOCTOR: GET OWN PROFILE
router.get("/doctor/profile", authenticateToken, async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id).select("-password");
    res.json(doctor);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ADMIN: REMOVE DOCTOR
router.delete("/doctor/:id", isAdmin, async (req, res) => {
  try {
    const deletedDoctor = await User.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting doctor", error });
  }
});

// PATIENT/DOCTOR: CANCEL AN APPOINTMENT
router.delete("/appointments/:id", authenticateToken, async (req, res) => {
  try {
    const deletedAppt = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppt) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling appointment", error });
  }
});

export default router;