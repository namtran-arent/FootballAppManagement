'use client';

import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Team } from '@/lib/teamService';
import { uploadImage, getDefaultAvatarUrl } from '@/lib/storageService';

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => void;
  team?: Team | null;
  mode: 'create' | 'edit';
  onError?: (message: string) => void;
}

export default function TeamForm({
  isOpen,
  onClose,
  onSubmit,
  team,
  mode,
  onError,
}: TeamFormProps) {
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    captainPhone: '',
    avatarUrl: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (team && mode === 'edit') {
      setFormData({
        teamName: team.teamName,
        captainName: team.captainName,
        captainPhone: team.captainPhone,
        avatarUrl: team.avatarUrl || '',
      });
      // Use actual avatar URL if exists, otherwise show default for preview
      setAvatarPreview(team.avatarUrl || getDefaultAvatarUrl());
      setAvatarFile(null);
    } else {
      setFormData({
        teamName: '',
        captainName: '',
        captainPhone: '',
        avatarUrl: '',
      });
      setAvatarPreview(getDefaultAvatarUrl());
      setAvatarFile(null);
    }
  }, [team, mode, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalAvatarUrl: string | undefined = undefined;

      // Upload new file if selected
      if (avatarFile) {
        try {
          console.log('Uploading image file:', avatarFile.name, 'Size:', avatarFile.size);
          const uploadedUrl = await uploadImage(avatarFile);
          console.log('Uploaded URL result:', uploadedUrl);
          console.log('Uploaded URL type:', typeof uploadedUrl);
          console.log('Uploaded URL is truthy?', !!uploadedUrl);
          
          if (uploadedUrl && uploadedUrl.trim() !== '') {
            finalAvatarUrl = uploadedUrl.trim();
            console.log('Successfully set finalAvatarUrl to:', finalAvatarUrl);
          } else {
            console.warn('Upload returned empty or invalid URL. Upload may have failed.');
            const errorMessage = 'Failed to upload avatar. Please check that the "team-avatars" storage bucket exists in Supabase Dashboard > Storage.';
            if (onError) {
              onError(errorMessage);
            } else {
              alert(errorMessage);
            }
            // Don't set finalAvatarUrl, let it be undefined so it uses default
            // But in edit mode, we should keep existing avatar if upload fails
            if (mode === 'edit' && team) {
              finalAvatarUrl = team.avatarUrl;
              console.log('Upload failed, keeping existing avatar URL:', finalAvatarUrl);
            }
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          const errorMessage = 'Error uploading avatar. Please check that the "team-avatars" storage bucket exists in Supabase Dashboard > Storage.';
          if (onError) {
            onError(errorMessage);
          } else {
            alert(errorMessage);
          }
          // In edit mode, keep existing avatar if upload fails
          if (mode === 'edit' && team) {
            finalAvatarUrl = team.avatarUrl;
            console.log('Upload error, keeping existing avatar URL:', finalAvatarUrl);
          }
        }
      } else if (mode === 'edit' && team) {
        // If editing and no new file selected, keep the existing avatar URL
        // Even if it's undefined (no avatar), we need to explicitly pass it
        // so updateTeam knows to keep the current state (not set to null)
        console.log('Edit mode - keeping existing avatar URL:', team.avatarUrl);
        finalAvatarUrl = team.avatarUrl; // This can be undefined if no avatar exists
      }

      // Submit with or without avatarUrl
      const submitData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
      };
      
      // Always include avatarUrl in submit data
      // For edit mode: include even if undefined (to preserve existing state)
      // For create mode: include if we have a value, otherwise undefined (uses default)
      submitData.avatarUrl = finalAvatarUrl;
      
      console.log('=== SUBMIT DATA ===');
      console.log('Mode:', mode);
      console.log('finalAvatarUrl:', finalAvatarUrl);
      console.log('submitData.avatarUrl:', submitData.avatarUrl);
      console.log('Full submitData:', JSON.stringify(submitData, null, 2));
      console.log('==================');

      onSubmit(submitData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Still try to submit - for edit mode, keep existing avatar
      const submitData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
      };
      if (mode === 'edit' && team) {
        submitData.avatarUrl = team.avatarUrl;
      }
      onSubmit(submitData);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative glass-card rounded-lg shadow-2xl w-full max-w-2xl p-4 md:p-6 lg:p-8 z-10 max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-zinc-600 hover:text-zinc-900 transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Header */}
        <div className="mb-4 md:mb-6 pr-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-900 mb-1 md:mb-2">
            {mode === 'create' ? 'Create New Team' : 'Update Team Information'}
          </h2>
          <p className="text-sm md:text-base text-zinc-600">
            {mode === 'create'
              ? 'Add a new team to the system'
              : 'Update team information'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
              placeholder="Enter team name"
              required
            />
          </div>

          {/* Captain Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
              Captain Name
            </label>
            <input
              type="text"
              value={formData.captainName}
              onChange={(e) =>
                setFormData({ ...formData, captainName: e.target.value })
              }
              className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
              placeholder="Enter captain name"
              required
            />
          </div>

          {/* Captain Phone */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
              Captain Phone
            </label>
            <input
              type="tel"
              value={formData.captainPhone}
              onChange={(e) =>
                setFormData({ ...formData, captainPhone: e.target.value })
              }
              className="w-full px-3 md:px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors text-sm md:text-base"
              placeholder="Enter captain phone number"
              required
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1 md:mb-2">
              Team Avatar
            </label>
            <div className="space-y-2 md:space-y-3">
              {/* Preview */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                {avatarPreview && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={avatarPreview}
                      alt="Team avatar preview"
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-zinc-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full sm:w-auto px-3 md:px-4 py-2 bg-zinc-200 border border-zinc-300 rounded-lg text-zinc-900 hover:bg-zinc-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    <Upload className="w-4 h-4" />
                    {avatarFile ? 'Change Image' : 'Upload Image'}
                  </button>
                  {avatarFile && (
                    <p className="mt-2 text-xs text-zinc-600 break-words">
                      Selected: {avatarFile.name}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-500">
                    Leave empty to use default avatar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-2 md:py-3 btn-gradient font-bold rounded-lg text-sm md:text-base"
            >
              {uploading
                ? 'Uploading...'
                : mode === 'create'
                ? 'Create Team'
                : 'Update Team'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 md:py-3 bg-zinc-200 text-zinc-900 font-bold rounded-lg hover:bg-zinc-300 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
