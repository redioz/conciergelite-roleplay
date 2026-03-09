'use client';

interface AvatarProps {
  profileId: string;
  size?: number;
  className?: string;
}

export default function Avatar({ profileId, size = 120, className = '' }: AvatarProps) {
  const avatars: Record<string, JSX.Element> = {
    hicham: <HichamAvatar size={size} />,
    karim: <KarimAvatar size={size} />,
    fatima: <FatimaAvatar size={size} />,
    mystery: <MysteryAvatar size={size} />,
    'generic-male': <GenericMaleAvatar size={size} />,
    'generic-female': <GenericFemaleAvatar size={size} />,
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {avatars[profileId] || <FallbackAvatar size={size} />}
    </div>
  );
}

// Hicham: 48, cadre bancaire, glasses, clean-cut
function HichamAvatar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="#1A1A1A" stroke="#F4C842" strokeWidth="1.5" strokeOpacity="0.3" />

      {/* Neck */}
      <rect x="47" y="78" width="26" height="14" rx="4" fill="#C49A6C" />

      {/* Shirt/Suit collar */}
      <path d="M35 95C35 88 43 82 60 82C77 82 85 88 85 95V110H35V95Z" fill="#2A2A2A" />
      <path d="M55 82V92L60 96L65 92V82" fill="white" fillOpacity="0.9" />
      {/* Tie */}
      <path d="M58 92L60 102L62 92L60 96Z" fill="#F4C842" />

      {/* Head */}
      <ellipse cx="60" cy="55" rx="22" ry="26" fill="#C49A6C" />

      {/* Hair */}
      <path d="M38 48C38 34 47 27 60 27C73 27 82 34 82 48C82 44 78 38 60 38C42 38 38 44 38 48Z" fill="#1A1A1A" />

      {/* Ears */}
      <ellipse cx="38" cy="55" rx="4" ry="6" fill="#B8895E" />
      <ellipse cx="82" cy="55" rx="4" ry="6" fill="#B8895E" />

      {/* Eyes */}
      <ellipse cx="50" cy="53" rx="3" ry="3" fill="white" />
      <ellipse cx="70" cy="53" rx="3" ry="3" fill="white" />
      <ellipse cx="50.5" cy="53.5" rx="1.8" ry="1.8" fill="#2C1810" />
      <ellipse cx="70.5" cy="53.5" rx="1.8" ry="1.8" fill="#2C1810" />

      {/* Glasses */}
      <rect x="42" y="48" width="16" height="12" rx="3" fill="none" stroke="#F4C842" strokeWidth="1.8" strokeOpacity="0.8" />
      <rect x="62" y="48" width="16" height="12" rx="3" fill="none" stroke="#F4C842" strokeWidth="1.8" strokeOpacity="0.8" />
      <line x1="58" y1="53" x2="62" y2="53" stroke="#F4C842" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="42" y1="53" x2="38" y2="52" stroke="#F4C842" strokeWidth="1.2" strokeOpacity="0.6" />
      <line x1="78" y1="53" x2="82" y2="52" stroke="#F4C842" strokeWidth="1.2" strokeOpacity="0.6" />

      {/* Eyebrows */}
      <path d="M44 46C46 44 52 44 56 46" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M64 46C66 44 72 44 76 46" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Nose */}
      <path d="M58 58C58 62 60 64 62 62" stroke="#A67D52" strokeWidth="1.2" strokeLinecap="round" />

      {/* Mustache */}
      <path d="M50 67C53 65 57 65 60 66C63 65 67 65 70 67" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

      {/* Slight smile */}
      <path d="M52 70C55 72 65 72 68 70" stroke="#A67D52" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Karim: 35, entrepreneur, beard, dynamic
function KarimAvatar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="#1A1A1A" stroke="#F4C842" strokeWidth="1.5" strokeOpacity="0.3" />

      {/* Neck */}
      <rect x="48" y="78" width="24" height="14" rx="4" fill="#B8895E" />

      {/* Casual shirt / polo */}
      <path d="M33 97C33 88 43 82 60 82C77 82 87 88 87 97V110H33V97Z" fill="#1E1E1E" />
      {/* Polo collar */}
      <path d="M52 82C52 82 56 86 60 86C64 86 68 82 68 82" fill="none" stroke="#333" strokeWidth="2" />
      {/* Gold chain */}
      <path d="M50 86C53 90 57 92 60 92C63 92 67 90 70 86" fill="none" stroke="#F4C842" strokeWidth="1" strokeOpacity="0.7" />

      {/* Head */}
      <ellipse cx="60" cy="54" rx="23" ry="27" fill="#B8895E" />

      {/* Hair - trendy short */}
      <path d="M37 46C37 30 46 24 60 24C74 24 83 30 83 46C83 40 77 34 60 34C43 34 37 40 37 46Z" fill="#0D0D0D" />
      {/* Hair texture */}
      <path d="M42 36C48 32 55 30 60 30C65 30 72 32 78 36" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx="37" cy="54" rx="4" ry="6" fill="#A67D52" />
      <ellipse cx="83" cy="54" rx="4" ry="6" fill="#A67D52" />

      {/* Eyes */}
      <ellipse cx="50" cy="50" rx="3.5" ry="3" fill="white" />
      <ellipse cx="70" cy="50" rx="3.5" ry="3" fill="white" />
      <ellipse cx="50.5" cy="50.5" rx="2" ry="2" fill="#1A0E05" />
      <ellipse cx="70.5" cy="50.5" rx="2" ry="2" fill="#1A0E05" />
      {/* Eye shine */}
      <circle cx="51.5" cy="49.5" r="0.8" fill="white" />
      <circle cx="71.5" cy="49.5" r="0.8" fill="white" />

      {/* Bold eyebrows */}
      <path d="M43 45C46 42 53 42 57 44" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M63 44C67 42 74 42 77 45" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" />

      {/* Nose */}
      <path d="M58 55C57 59 59 62 63 60" stroke="#9A7048" strokeWidth="1.3" strokeLinecap="round" />

      {/* Beard */}
      <path d="M42 62C42 62 44 72 48 75C52 78 56 79 60 79C64 79 68 78 72 75C76 72 78 62 78 62" fill="#0D0D0D" fillOpacity="0.85" />
      {/* Beard shape */}
      <path d="M42 62C43 58 46 56 50 56L54 58C56 59 58 60 60 60C62 60 64 59 66 58L70 56C74 56 77 58 78 62" fill="#0D0D0D" fillOpacity="0.85" />

      {/* Mouth (visible through beard) */}
      <path d="M54 66C57 68 63 68 66 66" stroke="#8B5E3C" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Confident smile showing through */}
      <path d="M55 68C57 70 63 70 65 68" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />
    </svg>
  );
}

// Fatima: 62, retired teacher, hijab, warm
function FatimaAvatar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="#1A1A1A" stroke="#F4C842" strokeWidth="1.5" strokeOpacity="0.3" />

      {/* Hijab - outer shape */}
      <path d="M28 55C28 35 42 22 60 22C78 22 92 35 92 55C92 70 88 82 82 90L60 100L38 90C32 82 28 70 28 55Z" fill="#2A2A2A" />
      {/* Hijab inner wrap */}
      <path d="M32 55C32 38 44 26 60 26C76 26 88 38 88 55C88 68 85 78 80 86L60 94L40 86C35 78 32 68 32 55Z" fill="#333333" />
      {/* Hijab drape left */}
      <path d="M38 70C35 78 34 86 36 96L28 100C26 90 27 78 32 68Z" fill="#2A2A2A" />
      {/* Hijab drape right */}
      <path d="M82 70C85 78 86 86 84 96L92 100C94 90 93 78 88 68Z" fill="#2A2A2A" />

      {/* Hijab border accent */}
      <path d="M36 55C36 40 46 30 60 30C74 30 84 40 84 55" fill="none" stroke="#F4C842" strokeWidth="1" strokeOpacity="0.4" />

      {/* Face */}
      <ellipse cx="60" cy="56" rx="20" ry="22" fill="#D4A574" />

      {/* Eyes */}
      <ellipse cx="50" cy="52" rx="3" ry="2.8" fill="white" />
      <ellipse cx="70" cy="52" rx="3" ry="2.8" fill="white" />
      <ellipse cx="50.3" cy="52.3" rx="1.8" ry="1.8" fill="#3D2B1F" />
      <ellipse cx="70.3" cy="52.3" rx="1.8" ry="1.8" fill="#3D2B1F" />
      {/* Eye shine */}
      <circle cx="51" cy="51.5" r="0.7" fill="white" />
      <circle cx="71" cy="51.5" r="0.7" fill="white" />

      {/* Gentle eyebrows */}
      <path d="M44 48C47 46 52 46 55 48" stroke="#5C3D2E" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M65 48C68 46 73 46 76 48" stroke="#5C3D2E" strokeWidth="1.3" strokeLinecap="round" />

      {/* Nose */}
      <path d="M58 56C57 59 59 61 62 60" stroke="#BA8B5E" strokeWidth="1" strokeLinecap="round" />

      {/* Warm smile */}
      <path d="M50 66C54 70 66 70 70 66" stroke="#BA8B5E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Smile line */}
      <path d="M52 67C55 70 65 70 68 67" stroke="#C49A6C" strokeWidth="0.8" strokeLinecap="round" fill="none" />

      {/* Laugh lines (warm, expressive) */}
      <path d="M44 60C43 62 43 64 44 66" stroke="#BA8B5E" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
      <path d="M76 60C77 62 77 64 76 66" stroke="#BA8B5E" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />

      {/* Small earring accents */}
      <circle cx="40" cy="58" r="2" fill="#F4C842" fillOpacity="0.6" />
      <circle cx="80" cy="58" r="2" fill="#F4C842" fillOpacity="0.6" />
    </svg>
  );
}

// Mystery Avatar: silhouette with "?" — used for simulation mode mystery card
function MysteryAvatar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle with gold glow */}
      <defs>
        <radialGradient id="mysteryGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4C842" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#F4C842" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="#1A1A1A" />
      <circle cx="60" cy="60" r="58" fill="url(#mysteryGlow)" />
      <circle cx="60" cy="60" r="58" stroke="#F4C842" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Silhouette head */}
      <circle cx="60" cy="42" r="18" fill="#2A2A2A" />

      {/* Silhouette shoulders */}
      <path d="M30 100C30 82 43 72 60 72C77 72 90 82 90 100" fill="#2A2A2A" />

      {/* Question mark */}
      <text
        x="60" y="62"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#F4C842"
        fontSize="36"
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        opacity="0.9"
      >
        ?
      </text>
    </svg>
  );
}

// Generic Male Avatar: neutral male face for generated male prospects
function GenericMaleAvatar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="#1A1A1A" stroke="#F4C842" strokeWidth="1.5" strokeOpacity="0.3" />

      {/* Neck */}
      <rect x="48" y="78" width="24" height="14" rx="4" fill="#C49A6C" />

      {/* Shirt */}
      <path d="M33 97C33 88 43 82 60 82C77 82 87 88 87 97V110H33V97Z" fill="#2A2A2A" />
      <path d="M54 82V88L60 92L66 88V82" fill="#333" />

      {/* Head */}
      <ellipse cx="60" cy="54" rx="22" ry="26" fill="#C49A6C" />

      {/* Hair */}
      <path d="M38 46C38 32 47 25 60 25C73 25 82 32 82 46C82 40 76 34 60 34C44 34 38 40 38 46Z" fill="#1A1A1A" />

      {/* Ears */}
      <ellipse cx="38" cy="54" rx="4" ry="6" fill="#B8895E" />
      <ellipse cx="82" cy="54" rx="4" ry="6" fill="#B8895E" />

      {/* Eyes */}
      <ellipse cx="50" cy="52" rx="3" ry="2.8" fill="white" />
      <ellipse cx="70" cy="52" rx="3" ry="2.8" fill="white" />
      <ellipse cx="50.5" cy="52.5" rx="1.8" ry="1.8" fill="#2C1810" />
      <ellipse cx="70.5" cy="52.5" rx="1.8" ry="1.8" fill="#2C1810" />

      {/* Eyebrows */}
      <path d="M44 47C47 45 53 45 56 47" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M64 47C67 45 73 45 76 47" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" />

      {/* Nose */}
      <path d="M58 57C58 60 60 63 62 61" stroke="#A67D52" strokeWidth="1.2" strokeLinecap="round" />

      {/* Neutral mouth */}
      <path d="M52 68C56 70 64 70 68 68" stroke="#A67D52" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Light stubble dots */}
      <circle cx="50" cy="72" r="0.4" fill="#8B7355" opacity="0.3" />
      <circle cx="55" cy="74" r="0.4" fill="#8B7355" opacity="0.3" />
      <circle cx="60" cy="74" r="0.4" fill="#8B7355" opacity="0.3" />
      <circle cx="65" cy="74" r="0.4" fill="#8B7355" opacity="0.3" />
      <circle cx="70" cy="72" r="0.4" fill="#8B7355" opacity="0.3" />
    </svg>
  );
}

// Generic Female Avatar: neutral female face with hijab for generated female prospects
function GenericFemaleAvatar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="#1A1A1A" stroke="#F4C842" strokeWidth="1.5" strokeOpacity="0.3" />

      {/* Hijab */}
      <path d="M28 55C28 35 42 22 60 22C78 22 92 35 92 55C92 70 88 82 82 90L60 100L38 90C32 82 28 70 28 55Z" fill="#333333" />
      <path d="M32 55C32 38 44 26 60 26C76 26 88 38 88 55C88 68 85 78 80 86L60 94L40 86C35 78 32 68 32 55Z" fill="#3D3D3D" />
      {/* Hijab drape */}
      <path d="M38 70C35 78 34 86 36 96L28 100C26 90 27 78 32 68Z" fill="#333333" />
      <path d="M82 70C85 78 86 86 84 96L92 100C94 90 93 78 88 68Z" fill="#333333" />

      {/* Hijab accent */}
      <path d="M36 55C36 40 46 30 60 30C74 30 84 40 84 55" fill="none" stroke="#F4C842" strokeWidth="0.8" strokeOpacity="0.3" />

      {/* Face */}
      <ellipse cx="60" cy="56" rx="20" ry="22" fill="#D4A574" />

      {/* Eyes */}
      <ellipse cx="50" cy="52" rx="3" ry="2.8" fill="white" />
      <ellipse cx="70" cy="52" rx="3" ry="2.8" fill="white" />
      <ellipse cx="50.3" cy="52.3" rx="1.8" ry="1.8" fill="#3D2B1F" />
      <ellipse cx="70.3" cy="52.3" rx="1.8" ry="1.8" fill="#3D2B1F" />
      <circle cx="51" cy="51.5" r="0.6" fill="white" />
      <circle cx="71" cy="51.5" r="0.6" fill="white" />

      {/* Eyebrows */}
      <path d="M44 48C47 46 52 46 55 48" stroke="#5C3D2E" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M65 48C68 46 73 46 76 48" stroke="#5C3D2E" strokeWidth="1.2" strokeLinecap="round" />

      {/* Nose */}
      <path d="M58 56C57 59 59 61 62 60" stroke="#BA8B5E" strokeWidth="1" strokeLinecap="round" />

      {/* Neutral smile */}
      <path d="M52 66C55 69 65 69 68 66" stroke="#BA8B5E" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Subtle earring accents */}
      <circle cx="40" cy="58" r="1.5" fill="#F4C842" fillOpacity="0.4" />
      <circle cx="80" cy="58" r="1.5" fill="#F4C842" fillOpacity="0.4" />
    </svg>
  );
}

function FallbackAvatar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="58" fill="#1A1A1A" stroke="#F4C842" strokeWidth="1.5" strokeOpacity="0.3" />
      <circle cx="60" cy="48" r="16" fill="#555" />
      <path d="M35 95C35 78 46 70 60 70C74 70 85 78 85 95" fill="#555" />
    </svg>
  );
}
