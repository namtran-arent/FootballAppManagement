import { supabase } from './supabase';

// Default avatar - using a data URL for a simple football emoji on dark background
const DEFAULT_AVATAR_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM3MzczNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQwIiBmaWxsPSIjYTNhM2EzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+RtDwvdGV4dD48L3N2Zz4=';

/**
 * Upload image to Supabase Storage
 * @param file - File to upload
 * @param folder - Folder path in storage (e.g., 'team-avatars')
 * @returns Public URL of uploaded file or null if error
 */
export async function uploadImage(
  file: File,
  folder: string = 'team-avatars'
): Promise<string | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    // Check if bucket exists by trying to list it
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Error checking buckets:', bucketError);
      return null;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'team-avatars');
    if (!bucketExists) {
      console.warn('Storage bucket "team-avatars" does not exist. Please create it in Supabase Dashboard > Storage.');
      return null;
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('team-avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      console.error('Upload error details:', JSON.stringify(uploadError, null, 2));
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('team-avatars').getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Exception in uploadImage:', error);
    console.error('Exception details:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

/**
 * Delete image from Supabase Storage
 * @param url - Public URL of the image to delete
 * @returns true if successful, false otherwise
 */
export async function deleteImage(url: string): Promise<boolean> {
  if (!supabase || !url) {
    return false;
  }

  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('team-avatars')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in deleteImage:', error);
    return false;
  }
}

/**
 * Get default avatar URL
 */
export function getDefaultAvatarUrl(): string {
  return DEFAULT_AVATAR_URL;
}
