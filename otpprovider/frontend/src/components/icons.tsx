export function Icon({ name, className = 'h-6 w-6' }: { name: string; className?: string }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
  };
  switch (name) {
    case 'sms':
      return (
        <svg {...common}>
          <path d="M4 5h16v11H8l-4 4V5Z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M4 20l1.3-3.9A8 8 0 1 1 8.9 19L4 20Z" />
          <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case 'lookup':
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="6" />
          <path d="m20 20-4.3-4.3" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" />
          <path d="m9.5 12 1.8 1.8L14.8 10" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m5 13 4 4L19 7" />
        </svg>
      );
    case 'chevron':
      return (
        <svg {...common}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case 'plug':
      return (
        <svg {...common}>
          <path d="M9 3v5M15 3v5M7 8h10l-1 4a5 5 0 0 1-9 0L6 8Z" />
          <path d="M10 17v4M14 17v4" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 3 5 14h5l-1 7 8-11h-5l1-7Z" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.5-4 5-5.5 7-5.5S17.5 16 19 20" />
        </svg>
      );
    default:
      return null;
  }
}
