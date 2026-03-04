'use client';

import { Profile } from '@/types';

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
}

export default function ProfileCard({ profile, onSelect }: ProfileCardProps) {
  return (
    <button
      onClick={() => onSelect(profile)}
      className="group relative w-full text-left bg-card border border-border rounded-2xl p-6
                 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(200,169,81,0.1)]
                 transition-all duration-300 animate-fade-in"
    >
      {/* Icon */}
      <div className="text-5xl mb-4">{profile.icon}</div>

      {/* Name & Info */}
      <h3 className="font-display text-xl text-text-primary mb-1">
        {profile.name}, {profile.age} ans
      </h3>
      <p className="text-sm text-text-muted mb-3">
        {profile.job} — {profile.city}
      </p>

      {/* Context */}
      <p className="text-sm text-text-muted/80 leading-relaxed mb-4 line-clamp-3">
        {profile.context}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {profile.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full bg-surface text-gold/80 border border-border"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Hover arrow */}
      <div className="absolute top-6 right-6 text-text-muted/30 group-hover:text-gold transition-colors">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
