# Cloudinary Setup for UltraPay

This document explains how to set up Cloudinary for image uploads in the UltraPay application.

## Your Cloudinary Credentials

- **Cloud Name**: `dexzc1qcd`
- **API Key**: `748931615191286`
- **API Secret**: `jXa4LjgzHNT1mLHxMNUhFe2dGWk`
- **Environment Variable**: `CLOUDINARY_URL=cloudinary://748931615191286:jXa4LjgzHNT1mLHxMNUhFe2dGWk@dexzc1qcd`

## Setup Steps

### 1. Create Your `.env.local` File

Create a `.env.local` file in your project root with your actual credentials:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dexzc1qcd
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ultrapay_uploads

# Server-side Cloudinary URL (for server-side operations if needed)
CLOUDINARY_URL=cloudinary://748931615191286:jXa4LjgzHNT1mLHxMNUhFe2dGWk@dexzc1qcd
```

### 2. Create Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Name**: `ultrapay_uploads`
   - **Signing mode**: Unsigned
   - **Allowed formats**: Images only (jpg, png, gif, webp)
   - **Folder**: `identity_documents` (optional)
5. Click **Save**

### 3. Dependencies

The project already has `next-cloudinary` installed. If you need to reinstall:

```bash
yarn add next-cloudinary
```

### 4. Upload Behavior

The application now:

1. **Uploads images directly to Cloudinary** when users select identity documents
2. **Stores the Cloudinary URL** instead of the file
3. **Sends the URL to the API** when submitting identity verification
4. **Shows upload progress** during the upload process
5. **Handles errors gracefully** if upload fails

### 5. Supported Identity Types

- **NIN & BVN**: Only ID number required (no document upload)
- **Passport, Driver's License, Voter's Card**: Both ID number and document upload required

### 6. File Organization

- Uploaded files are stored in the `identity_documents` folder in Cloudinary
- Files are automatically optimized and served via CDN
- All image transformations are handled by Cloudinary

## Security Notes

- Upload preset is unsigned for simplicity in development
- Consider using signed uploads in production
- File size and type restrictions are enforced by Cloudinary
- All uploads go directly from client to Cloudinary (not through your server)

## Testing

1. Create your `.env.local` file with the credentials above
2. Restart your development server
3. Navigate to the account setup page
4. Complete steps 1-2 (personal info and phone verification)
5. In step 3, select an identity type that requires document upload
6. Upload an image and verify it appears correctly
7. Submit the form and check the network tab for the Cloudinary URL

## Troubleshooting

### Upload Failed Error

- Verify your cloud name is set to `dexzc1qcd`
- Check that the upload preset `ultrapay_uploads` exists and is unsigned
- Ensure your environment variables are properly set in `.env.local`

### Image Not Displaying

- Check the browser console for CORS errors
- Verify the Cloudinary URL is correctly formatted
- Ensure the image was successfully uploaded

### Environment Variables Not Working

- Restart your development server after creating `.env.local`
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Check that `.env.local` is in your `.gitignore` file

## Next Steps

1. Create the upload preset in your Cloudinary dashboard
2. Create the `.env.local` file with your credentials
3. Test the upload functionality
4. Consider implementing signed uploads for production
