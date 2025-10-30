import React from 'react';
import type { Media } from '../types/media';
import { Edit2, Trash2, Film, Tv, Image as ImageIcon, Star, Calendar } from 'lucide-react';

interface MediaTableProps {
  media: Media[];
  onEdit: (media: Media) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const MediaTable: React.FC<MediaTableProps> = ({
  media,
  onEdit,
  onDelete,
  loading
}) => {
  const handleDelete = (mediaItem: Media) => {
    if (window.confirm(`Are you sure you want to delete "${mediaItem.title}"?`)) {
      onDelete(mediaItem.id);
    }
  };

  if (loading && media.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-8 border border-white/10">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Media
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Production
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Specifications
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {media.map((item, index) => (
              <tr 
                key={item.id} 
                className="hover:bg-white/5 transition-colors duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Poster and Basic Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-16 w-12 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="h-16 w-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <ImageIcon className="h-6 w-6 text-white/40" />
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1">
                        {item.type === 'MOVIE' ? (
                          <Film className="h-4 w-4 text-blue-400" />
                        ) : (
                          <Tv className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-semibold group-hover:text-primary-200 transition-colors">
                        {item.title}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="h-3 w-3 text-white/40" />
                        <span className="text-white/60 text-xs">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Type and Director */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'MOVIE' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      {item.type === 'MOVIE' ? 'Movie' : 'TV Show'}
                    </span>
                    <div className="text-white/80 text-sm">
                      <div className="font-medium">Director</div>
                      <div className="text-white/60">{item.director}</div>
                    </div>
                  </div>
                </td>

                {/* Budget and Location */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <div className="text-white/80 text-sm">
                      <div className="font-medium">Budget</div>
                      <div className="text-white/60 flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{item.budget}</span>
                      </div>
                    </div>
                    <div className="text-white/80 text-sm">
                      <div className="font-medium">Location</div>
                      <div className="text-white/60">{item.location}</div>
                    </div>
                  </div>
                </td>

                {/* Duration and Year */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <div className="text-white/80 text-sm">
                      <div className="font-medium">Duration</div>
                      <div className="text-white/60">{item.duration}</div>
                    </div>
                    <div className="text-white/80 text-sm">
                      <div className="font-medium">Year</div>
                      <div className="text-white/60">{item.year}</div>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};