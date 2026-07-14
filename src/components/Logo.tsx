import { useId } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Admin-uploaded logo (Settings → Logo URL). Falls back to the SVG mark when unset. */
  imageUrl?: string;
}

const sizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "w-9 h-9",
  md: "w-10 h-10",
  lg: "w-24 h-24",
};

const textSizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-[9px]",
  md: "text-[11px]",
  lg: "text-2xl",
};

export default function Logo({ size = "md", className = "", imageUrl }: LogoProps) {
  const gradientId = `mmHeartGradient-${useId().replace(/:/g, "")}`;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="Logo"
        className={`shrink-0 object-contain ${sizeMap[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`relative shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 92"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(183,110,121,0.45)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="45%" stopColor="#b76e79" />
            <stop offset="100%" stopColor="#8b5a3c" />
          </linearGradient>
        </defs>
        <path
          d="M50 90 C 48 88.5, 8 62, 2 30 C -1.5 12, 11 -1, 27 1.5 C 38 3, 46 12, 50 20 C 54 12, 62 3, 73 1.5 C 89 -1, 101.5 12, 98 30 C 92 62, 52 88.5, 50 90 Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center pt-[3px] text-white font-bold ${textSizeMap[size]} font-['Playfair_Display'] tracking-tight`}
      >
        MM
      </span>
    </div>
  );
}
