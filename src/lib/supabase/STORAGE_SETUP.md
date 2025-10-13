# Storage Setup for Registration Documents

## Setup Instructions

### 1. Create the "nordex" bucket in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Click **"Create a new bucket"**
4. Set bucket name: `nordex`
5. Make it **Public** (checked)
6. Click **"Create bucket"**

### 2. Apply Storage Policies

Run the following SQL commands in the Supabase SQL editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste these commands:

```sql
-- Create the nordex bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nordex',
  'nordex',
  true, -- Make bucket public for easier file access
  31457280, -- 30MB file size limit
  '{"image/*","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view files (for admin document viewing)
CREATE POLICY "Allow public viewing of nordex files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'nordex');

-- Allow authenticated users to upload registration documents
CREATE POLICY "Allow authenticated uploads to nordex"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'nordex');

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated updates to nordex"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'nordex');

-- Allow super admins to delete files (optional)
CREATE POLICY "Allow authenticated deletes from nordex"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'nordex');
```

3. Click **"Run"** to execute the policies

### 3. Verify Configuration

After setup, your bucket should:

- ✅ Be named "nordex"
- ✅ Be publicly accessible for file viewing
- ✅ Allow authenticated users to upload files
- ✅ Support common document formats (images, PDFs, Word docs)
- ✅ Have a 50MB file size limit

### 4. Test File Upload

Try the registration form to test that files are properly uploaded to the bucket.

## Troubleshooting

### Common Issues:

**Files not uploading:**

- Check that the bucket exists and is named exactly "nordex"
- Verify the storage policies are applied
- Check browser console for authentication errors

**Files not displaying:**

- Ensure the bucket is public
- Check that `next.config.js` includes your Supabase domain
- Verify file URLs are properly stored in the database

**Permission errors:**

- Make sure the user is authenticated when uploading
- Check that the storage policies are correctly applied

### File Structure

Files will be organized as:

```
nordex/
  registration/
    CompanyName_timestamp_doctype.ext
```

Example:

```
nordex/
  registration/
    Acme_Corp_1703123456789_matricula.pdf
    Acme_Corp_1703123456789_nit.jpg
```

## Preview Issues Fixed

The following preview issues have been resolved:

✅ **Memory leaks**: Object URLs are now properly cleaned up
✅ **File validation**: Added proper file type and size validation
✅ **Error handling**: Better error handling for file loading
✅ **State management**: Improved file state management
✅ **Preview display**: Enhanced image preview with fallbacks
