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
}

export default function TeamForm({
  isOpen,
  onClose,
  onSubmit,
  team,
  mode,
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
          const uploadedUrl = await uploadImage(avatarFile);
          if (uploadedUrl) {
            finalAvatarUrl = uploadedUrl;
          } else {
            console.warn('Failed to upload image. Team will be created without avatar.');
            // Don't set finalAvatarUrl, let it be undefined so it uses default
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continue without avatar - team will use default
        }
      }

      // Submit with or without avatarUrl
      onSubmit({
        ...formData,
        avatarUrl: finalAvatarUrl,
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Still try to submit without avatar
      onSubmit({
        ...formData,
        avatarUrl: undefined,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl w-full max-w-2xl p-8 z-10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">
            {mode === 'create' ? 'Create New Team' : 'Edit Team'}
          </h2>
          <p className="text-zinc-600">
            {mode === 'create'
              ? 'Add a new team to the system'
              : 'Update team information'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Enter team name"
              required
            />
          </div>

          {/* Captain Name */}
          <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
              Captain Name
            </label>
            <input
              type="text"
              value={formData.captainName}
              onChange={(e) =>
                setFormData({ ...formData, captainName: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Enter captain name"
              required
            />
          </div>

          {/* Captain Phone */}
          <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
              Captain Phone
            </label>
            <input
              type="tel"
              value={formData.captainPhone}
              onChange={(e) =>
                setFormData({ ...formData, captainPhone: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Enter captain phone number"
              required
            />
          </div>

          {/* Avatar Upload */}
          <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
              Team Avatar
            </label>
            <div className="space-y-3">
              {/* Preview */}
              <div className="flex items-center gap-4">
                {avatarPreview && (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Team avatar preview"
                      className="w-24 h-24 object-cover rounded-lg border border-zinc-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getDefaultAvatarUrl();
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
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
                    className="px-4 py-2 bg-zinc-200 border border-zinc-300 rounded-lg text-zinc-900 hover:bg-zinc-300 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-4 h-4" />
                    {avatarFile ? 'Change Image' : 'Upload Image'}
                  </button>
                    {avatarFile && (
                      <p className="mt-2 text-xs text-zinc-600">
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
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3 btn-gradient font-bold rounded-lg"
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
              className="flex-1 py-3 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
