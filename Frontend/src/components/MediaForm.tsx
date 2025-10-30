import React, { useState, useEffect } from 'react';
import type { Media, MediaFormData } from '../types/media';
import { X, Upload, Image as ImageIcon, Film, Tv } from 'lucide-react';

interface MediaFormProps {
  media?: Media | null;
  onSubmit: (data: MediaFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const MediaForm: React.FC<MediaFormProps> = ({
  media,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<MediaFormData>({
    title: '',
    type: 'MOVIE',
    director: '',
    budget: '',
    location: '',
    duration: '',
    year: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MediaFormData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (media) {
      setFormData({
        title: media.title,
        type: media.type,
        director: media.director,
        budget: media.budget,
        location: media.location,
        duration: media.duration,
        year: media.year,
        imageUrl: media.imageUrl || ''
      });
      if (media.imageUrl) {
        setImagePreview(media.imageUrl);
      }
    }
  }, [media]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MediaFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.director.trim()) newErrors.director = 'Director is required';
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.year.trim()) newErrors.year = 'Year/Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof MediaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleImageUrlBlur = () => {
    if (formData.imageUrl && !formData.imageUrl.startsWith('http')) {
      setFormData(prev => ({ ...prev, imageUrl: `https://${prev.imageUrl}` }));
      setImagePreview(`https://${formData.imageUrl}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {media ? 'Edit Media' : 'Add New Media'}
            </h2>
            <p className="text-white/60 mt-1">
              {media ? 'Update your media details' : 'Add a new movie or TV show to your collection'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Preview */}
          <div className="flex justify-center">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-24 object-cover rounded-xl shadow-lg"
                  onError={() => setImagePreview('')}
                />
              ) : (
                <div className="h-32 w-24 bg-white/10 rounded-xl flex items-center justify-center border-2 border-dashed border-white/20">
                  <ImageIcon className="h-8 w-8 text-white/40" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2">
                {formData.type === 'MOVIE' ? (
                  <div className="bg-blue-500 rounded-full p-2">
                    <Film className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="bg-green-500 rounded-full p-2">
                    <Tv className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.title 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/50'
                }`}
                placeholder="Enter title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('type', 'MOVIE')}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    formData.type === 'MOVIE'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/25'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Film className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Movie</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('type', 'TV_SHOW')}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    formData.type === 'TV_SHOW'
                      ? 'bg-green-500/20 border-green-500 text-green-300 shadow-lg shadow-green-500/25'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Tv className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">TV Show</span>
                </button>
              </div>
            </div>

            {/* Director */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Director *
              </label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => handleChange('director', e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.director 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/50'
                }`}
                placeholder="Enter director name"
              />
              {errors.director && (
                <p className="text-red-400 text-sm mt-1">{errors.director}</p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Budget *
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.budget 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/50'
                }`}
                placeholder="e.g., $160M"
              />
              {errors.budget && (
                <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.location 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/50'
                }`}
                placeholder="e.g., LA, Paris"
              />
              {errors.location && (
                <p className="text-red-400 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duration *
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.duration 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/50'
                }`}
                placeholder="e.g., 148 min or 49 min/ep"
              />
              {errors.duration && (
                <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Year/Time *
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.year 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-white/10 focus:border-primary-500 focus:ring-primary-500/50'
                }`}
                placeholder="e.g., 2010 or 2008-2013"
              />
              {errors.year && (
                <p className="text-red-400 text-sm mt-1">{errors.year}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                onBlur={handleImageUrlBlur}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/50 transition-all duration-300"
                placeholder="https://example.com/poster.jpg"
              />
              <p className="text-white/40 text-xs mt-1">
                Enter a valid image URL for the movie/TV show poster
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-white/70 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{media ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <span>{media ? 'Update Media' : 'Create Media'}</span>
                  <Upload className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};