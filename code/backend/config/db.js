import mongoose from "mongoose";    

export const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
        console.error("MONGO_URI is not defined in .env file");
        process.exit(1);
    }
    
    await mongoose.connect(mongoURI)
    .then(() =>{
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    })
} 