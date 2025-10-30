import React, { useState } from 'react';
import { MediaTable } from '../components/MediaTable';
import { MediaForm } from '../components/MediaForm';
import { SearchFilter } from '../components/SearchFilter';
import { StatsCards } from '../components/StatsCards';
import { useMedia } from '../hooks/useMedia';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { Media, MediaFormData } from '../types/media';
import { useAuth } from '../contexts/AuthContext';
import { Plus, LogOut, User, Film, Menu, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    media,
    loading,
    createMedia,
    updateMedia,
    deleteMedia,
    loadMore,
    // refresh,
    filters,
    setFilters //
    
  } = useMedia();

  const { user, logout } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  // const [filters, setFilters] = useState<SearchFilters>({
  //   search: '',
  //   type: ''
  // });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const observerRef = useInfiniteScroll(loadMore);

  // // Refresh media when filters change
  // React.useEffect(() => {
  //   refresh();
  // }, [filters]);

  const handleSubmit = async (data: MediaFormData) => {
    setFormLoading(true);
    try {
      if (editingMedia) {
        await updateMedia(editingMedia.id, data);
      } else {
        await createMedia(data);
      }
      setShowForm(false);
      setEditingMedia(null);
    } catch (error) {
      console.error('Failed to save media:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (mediaItem: Media) => {
    setEditingMedia(mediaItem);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMedia(null);
  };

  const handleLogout = () => {
    logout();
  };

  // Calculate stats
  const stats = {
    total: media.length,
    movies: media.filter(m => m.type === 'MOVIE').length,
    tvShows: media.filter(m => m.type === 'TV_SHOW').length,
    recent: media.filter(m => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(m.createdAt) > oneWeekAgo;
    }).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative bg-primary-600 rounded-xl p-2">
                    <Film className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    CineCollection
                  </h1>
                  <p className="text-white/60 text-sm">
                    Your personal media library
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-white/80 bg-white/5 rounded-xl px-4 py-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.name}</span>
              </div>
              
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">Add Media</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center space-x-2"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} loading={loading} />
        
        {/* Search and Filter */}
        <div className="mb-8 animate-slide-up">
          <SearchFilter
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Media Table */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <MediaTable
            media={media}
            onEdit={handleEdit}
            onDelete={deleteMedia}
            loading={loading && media.length === 0}
          />
        </div>

        {/* Loading indicator for infinite scroll */}
        {(loading && media.length > 0) && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-3 text-white/60">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
              <span>Loading more...</span>
            </div>
          </div>
        )}

        {/* Observer element for infinite scroll */}
        <div ref={observerRef} className="h-10" />

        {/* Empty State */}
        {!loading && media.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="glass-effect rounded-3xl p-8 border border-white/10">
                <Film className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No media found
                </h3>
                <p className="text-white/60 mb-6">
                  {filters.search || filters.type 
                    ? 'Try adjusting your search filters' 
                    : 'Get started by adding your first movie or TV show'
                  }
                </p>
                {!(filters.search || filters.type) && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Media
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <MediaForm
            media={editingMedia}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            loading={formLoading}
          />
        )}
      </div>
    </div>
    
  );
};