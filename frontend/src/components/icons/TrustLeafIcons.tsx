// Copyright © 2026 Browns Studio
"use client";

import React from "react";

export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const Ico = ({
  className = "w-5 h-5",
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    {children}
  </svg>
);

export const HomeIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </Ico>
);

export const PillIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M10.5 3.5a5 5 0 0 1 7 7l-8 8a5 5 0 0 1-7-7l8-8z" />
    <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
  </Ico>
);

export const FichaIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="2" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </Ico>
);

export const LockIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </Ico>
);

export const LockOpenIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 019.9-1" />
  </Ico>
);

export const QrIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="3" height="3" />
    <line x1="14" y1="20" x2="20" y2="20" />
    <line x1="20" y1="14" x2="20" y2="17" />
  </Ico>
);

export const ShieldCheckIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </Ico>
);

export const AlertTriangleIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Ico>
);

export const ClockIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Ico>
);

export const HeartPulseIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <polyline points="8.5 13 10.5 11 12.5 14 14.5 11 16.5 13" />
  </Ico>
);

export const SyringeIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <line x1="19" y1="5" x2="5" y2="19" />
    <path d="M17 3l4 4-3 3-4-4z" />
    <path d="M7 17l-4 4" />
    <line x1="12" y1="8" x2="16" y2="12" />
    <line x1="9.5" y1="10.5" x2="13.5" y2="14.5" />
  </Ico>
);

export const CalendarIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </Ico>
);

export const CheckIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <polyline points="20 6 9 17 4 12" />
  </Ico>
);

export const UserIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Ico>
);

export const ChevronRightIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <polyline points="9 18 15 12 9 6" />
  </Ico>
);

export const CloseIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Ico>
);

export const StethoscopeIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <circle cx="17" cy="18" r="3" />
    <path d="M5 2v5a7 7 0 0014 0V2" />
    <line x1="17" y1="15" x2="17" y2="10" />
    <path d="M12 10a7 7 0 01-7-7" />
  </Ico>
);

export const ClipboardCheckIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="2" />
    <path d="M9 14l2 2 4-4" />
  </Ico>
);

export const DownloadIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Ico>
);

export const SearchIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Ico>
);

export const FilterIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </Ico>
);

export const SettingsIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </Ico>
);

export const BellIcon = ({ className, style }: IconProps) => (
  <Ico className={className} style={style}>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </Ico>
);
