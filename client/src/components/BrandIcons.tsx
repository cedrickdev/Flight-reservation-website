type BrandIconProps = {
  size?: number;
  className?: string;
};

export function InstagramBrandIcon({ size = 20, className }: BrandIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function TikTokBrandIcon({ size = 20, className }: BrandIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.72-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.11-.01 2.18-.66 2.76-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function FacebookBrandIcon({ size = 20, className }: BrandIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.72 21v-8.2h2.75l.41-3.2h-3.16V7.56c0-.93.26-1.56 1.59-1.56H17V3.15c-.29-.04-1.29-.15-2.45-.15-2.43 0-4.09 1.48-4.09 4.2v2.4H7.72v3.2h2.74V21h3.26Z" />
    </svg>
  );
}

export function WhatsAppBrandIcon({ size = 21, className }: BrandIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.4 11.6a8.4 8.4 0 0 1-12.38 7.38L3.5 20.2l1.2-4.37A8.4 8.4 0 1 1 20.4 11.6Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8.2 7.45c.2-.45.42-.46.78-.47h.29c.1 0 .27.04.41.35.14.32.52 1.26.57 1.35.05.09.08.2.02.32-.06.13-.1.2-.2.31-.1.11-.2.24-.29.32-.1.1-.2.2-.08.4.12.2.53.87 1.14 1.41.79.7 1.45.92 1.66 1.02.2.1.32.08.44-.05.12-.14.5-.59.64-.79.13-.2.27-.17.45-.1.19.06 1.18.56 1.38.66.2.1.34.15.39.23.05.08.05.46-.1.9-.15.43-.87.83-1.2.88-.31.06-.72.08-1.16-.06-.27-.09-.62-.2-1.07-.4-.47-.2-2.05-.75-3.48-2.01-1.2-1.05-2.01-2.35-2.24-2.75-.23-.4-.02-1.36.21-1.84Z" fill="currentColor" />
    </svg>
  );
}
