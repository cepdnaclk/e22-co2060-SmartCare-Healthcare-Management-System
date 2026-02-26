import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// uoload image to cloudinary

export async function uploadToCloudinary( filePath , folder="Doctor" ) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "image",
        });
        // delete the local file after upload
       fs.unlinkSync(filePath);
       return result; 
}
catch (err) {
  console.error("Cloudinary upload error:", err);
  throw err;
}
}

// to delete image from cloudinary
export async function deleteFromCloudinary(publicId) {
    try{
        if(!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    }
    catch (err) {
       console.error("Cloudinary deletion error:", err);    
         throw err;
    }
}


export default cloudinary;