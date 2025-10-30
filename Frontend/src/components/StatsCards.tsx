import React from 'react';
import { Film, Tv, Clock, BarChart3 } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    movies: number;
    tvShows: number;
    recent: number;
  };
  loading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Media',
      value: stats.total,
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Movies',
      value: stats.movies,
      icon: Film,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'TV Shows',
      value: stats.tvShows,
      icon: Tv,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Recent (7d)',
      value: stats.recent,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20'
    }
  ];

  if (loading && stats.total === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={card.title}
            className="stats-card animate-pulse-soft"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-white/20 rounded w-20 mb-2"></div>
                <div className="h-8 bg-white/20 rounded w-12"></div>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="stats-card card-hover group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-white">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-2xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className={`h-1 mt-4 bg-gradient-to-r ${card.color} rounded-full transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-90`}></div>
          </div>
        );
      })}
    </div>
  );
};