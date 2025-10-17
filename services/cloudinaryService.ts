const CLOUD_NAME = "dmav2hzzn";
// IMPORTANT: The user MUST create an UNSIGNED upload preset in their Cloudinary dashboard
// and name it 'schoolhub_uploads' for this to work.
const UPLOAD_PRESET = "schoolhub_uploads";

/**
 * Uploads an image file to Cloudinary using an unsigned upload preset.
 * @param file The image file to upload.
 * @returns A promise that resolves with the secure URL of the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });
        
        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            // Log the actual error from Cloudinary if available
            console.error("Cloudinary upload failed:", data.error?.message);
            throw new Error(data.error?.message || "Cloudinary upload failed. Check the browser console and ensure your upload preset is configured correctly.");
        }
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
};
