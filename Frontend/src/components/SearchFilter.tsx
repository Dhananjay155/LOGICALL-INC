import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import type { SearchFilters } from '../types/media';
import { debounce } from '../utils/debounce';

interface SearchFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  debounceDelay?: number; 
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  onFiltersChange,
  debounceDelay = 1000 
}) => {
  const [searchValue, setSearchValue] = useState(filters.search);

  const debouncedSearchHandler = useCallback((search: string) => {
    const handler = async () => {
      onFiltersChange({ ...filters, search });
    };
    debounce(handler, debounceDelay)();
  }, [filters, onFiltersChange, debounceDelay]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearchHandler(value);
  };

  const handleTypeChange = (value: SearchFilters['type']) => {
    onFiltersChange({ ...filters, type: value });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({ search: '', type: '' });
  };

  const hasActiveFilters = filters.search || filters.type;

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-5 w-5 text-white/60" />
          <h3 className="text-lg font-semibold text-white">Filters & Search</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search by title, director, or location..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
          />
        </div>

        {/* Type Filter */}
        <div className="sm:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-white/40" />
            </div>
            <select
              value={filters.type}
              onChange={(e) => handleTypeChange(e.target.value as SearchFilters['type'])}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 appearance-none"
            >
              <option value="">All Types</option>
              <option value="MOVIE">Movies</option>
              <option value="TV_SHOW">TV Shows</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-white/60 text-sm">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Search: "{filters.search}"
            </span>
          )}
          {filters.type && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Type: {filters.type === 'MOVIE' ? 'Movie' : 'TV Show'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};