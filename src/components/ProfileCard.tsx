'use client';

import { Profile } from '@/types';
import Avatar from './Avatar';

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
}

export default function ProfileCard({ profile, onSelect }: ProfileCardProps) {
  return (
    <button
      onClick={() => onSelect(profile)}
      className="group relative w-full text-left glass rounded-3xl p-6
                 hover:bg-white/[0.07] hover:border-gold/30
                 hover:shadow-[0_0_40px_rgba(244,200,66,0.06)]
                 transition-all duration-500 animate-fade-in"
    >
      {/* Avatar */}
      <div className="mb-5 flex justify-center">
        <div className="transition-transform duration-500 group-hover:scale-105 group-hover:animate-float">
          <Avatar profileId={profile.id} size={80} />
        </div>
      </div>

      {/* Name & Info */}
      <h3 className="text-lg font-semibold text-text-primary mb-1 text-center">
        {profile.name}, {profile.age} ans
      </h3>
      <p className="text-sm text-text-muted mb-3 text-center">
        {profile.job} &mdash; {profile.city}
      </p>

      {/* Context */}
      <p className="text-sm text-text-muted/70 leading-relaxed mb-4 line-clamp-3 text-center">
        {profile.context}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2">
        {profile.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full bg-white/[0.04] text-gold/80
                       border border-white/[0.06] backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gold">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
