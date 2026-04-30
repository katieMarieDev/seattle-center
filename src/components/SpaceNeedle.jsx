import React from 'react';

export default function SpaceNeedle({ size = 32, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size * 1.8}
      viewBox="0 0 40 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Space Needle"
    >
      {/* Spire */}
      <rect x="19" y="0" width="2" height="16" rx="1" fill={color} />

      {/* Top disc - upper curve */}
      <path d="M8 26 Q20 20 32 26 L30 30 Q20 26 10 30 Z" fill={color} />
      {/* Top disc - lower curve */}
      <path d="M10 30 Q20 36 30 30 L28 33 Q20 38 12 33 Z" fill={color} opacity="0.7" />

      {/* Shaft */}
      <rect x="18.5" y="33" width="3" height="26" fill={color} />

      {/* Legs */}
      <path d="M20 59 L8 70 L13 70 L20 62 L27 70 L32 70 Z" fill={color} opacity="0.85" />
      {/* Base platform */}
      <rect x="6" y="69" width="28" height="2.5" rx="1.25" fill={color} opacity="0.5" />
    </svg>
  );
}
