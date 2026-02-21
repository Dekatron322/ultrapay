// Cloudinary Configuration
import { Cloudinary } from "@cloudinary/url-gen"

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dexzc1qcd",
  },
})

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dexzc1qcd",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ultrapay_uploads",
  folder: "identity_documents",
  apiUrl: (cloudName: string) => `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  cldInstance: cld,
}

// Type definition for Cloudinary upload response
interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  format: string
  resource_type: string
  created_at: string
  bytes: number
  etag: string
  url: string
  version: number
  signature: string
  [key: string]: any
}

// Helper function to upload to Cloudinary
export const uploadToCloudinary = async (file: File, folder?: string): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset)
  formData.append("folder", folder || CLOUDINARY_CONFIG.folder)

  const response = await fetch(CLOUDINARY_CONFIG.apiUrl(CLOUDINARY_CONFIG.cloudName), {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = (await response.json()) as { error?: { message?: string } }
    throw new Error(error.error?.message || "Upload failed")
  }

  return response.json() as Promise<CloudinaryUploadResponse>
}
