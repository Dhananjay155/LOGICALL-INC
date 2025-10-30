import { useState, useEffect, useCallback } from 'react';
import type { Media, MediaFormData, PaginationInfo, SearchFilters } from '../types/media';
import { mediaApi } from '../services/api';

export const useMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    type: ''
  });

  const loadMedia = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      const response = await mediaApi.getAll(pageNum, 10, filters);
      
      if (append) {
        setMedia(prev => [...prev, ...response.media]);
      } else {
        setMedia(response.media);
      }
      
      setPagination(response.pagination);
      setPage(response.pagination.currentPage);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]); 

  const createMedia = async (data: MediaFormData): Promise<Media> => {
    const newMedia = await mediaApi.create(data);
    setMedia(prev => [newMedia, ...prev]);
    return newMedia;
  };

  const updateMedia = async (id: string, data: MediaFormData): Promise<Media> => {
    const updatedMedia = await mediaApi.update(id, data);
    setMedia(prev => prev.map(item => item.id === id ? updatedMedia : item));
    return updatedMedia;
  };

  const deleteMedia = async (id: string): Promise<void> => {
    await mediaApi.delete(id);
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  const loadMore = () => {
    if (pagination?.hasNext && !loading) {
      loadMedia(page + 1, true);
    }
  };

  const refresh = () => {
    loadMedia(1, false);
  };

  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  useEffect(() => {
    loadMedia(1, false);
  }, [loadMedia]); 

  return {
    media,
    loading,
    pagination,
    createMedia,
    updateMedia,
    deleteMedia,
    loadMore,
    refresh,
    filters,
    setFilters: updateFilters
  };
};