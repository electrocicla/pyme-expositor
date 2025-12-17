/**
 * FooterPanel Constants
 * Single Responsibility: Define footer panel configuration and options
 */

import type { SiteConfig } from '../../../../types/config';

// Type definitions for FooterPanel
export type FooterConfig = NonNullable<SiteConfig['footer']>;
export type FooterColumn = NonNullable<FooterConfig['columns']>[number];
export type LegalLink = NonNullable<FooterConfig['legalLinks']>[number];

// Tab configuration
export const footerTabs = [
  { id: 'layout', label: 'Layout' },
  { id: 'content', label: 'Content' },
  { id: 'social', label: 'Social' },
  { id: 'legal', label: 'Legal' },
];

export type FooterTabType = 'layout' | 'content' | 'social' | 'legal';

// Layout options
export const layoutOptions = [
  { value: 'simple', label: 'Simple' },
  { value: 'columns', label: 'Columns' },
  { value: 'centered', label: 'Centered' },
  { value: 'minimal', label: 'Minimal' },
] as const;

import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Github,
} from 'lucide-react';
import React from 'react';

// Custom icons for platforms not in lucide-react
export const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const ThreadsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.024.812-.675 1.89-1.082 3.108-1.161.868-.056 1.9.007 2.963.17-.043-.594-.129-1.106-.261-1.537-.239-.79-.644-1.378-1.207-1.746-.616-.403-1.42-.589-2.39-.552-.972.038-1.739.332-2.28.873-.51.51-.812 1.178-.898 1.986l-2.072-.224c.126-1.273.63-2.336 1.5-3.16.97-.92 2.262-1.397 3.84-1.42h.068c1.68.023 3.04.512 4.04 1.454.886.835 1.439 1.96 1.645 3.345.39.077.765.17 1.12.278 1.486.454 2.662 1.215 3.498 2.262 1.104 1.38 1.457 3.133 1.053 5.217-.392 2.029-1.536 3.728-3.312 4.916C17.677 23.372 15.116 24 12.186 24zm-.09-9.983c-.938.06-1.666.32-2.168.776-.456.414-.662.92-.632 1.548.034.717.377 1.276.963 1.654.655.424 1.514.6 2.42.547 1.1-.06 1.94-.471 2.498-1.222.493-.664.796-1.552.903-2.642-1.227-.22-2.62-.35-3.984-.66z"/>
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Social platforms supported with icons and brand colors
export const socialPlatforms = [
  { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourprofile', icon: Twitter, color: '#1DA1F2' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage', icon: Facebook, color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile', icon: Instagram, color: '#E4405F' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile', icon: Linkedin, color: '#0A66C2' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/yourchannel', icon: Youtube, color: '#FF0000' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile', icon: TikTokIcon, color: '#000000' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourusername', icon: Github, color: '#181717' },
  { key: 'threads', label: 'Threads', placeholder: 'https://threads.net/@yourprofile', icon: ThreadsIcon, color: '#000000' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/yournumber', icon: WhatsAppIcon, color: '#25D366' },
] as const;

export type SocialKey = typeof socialPlatforms[number]['key'];

// Quick add legal links
export const quickLegalLinks = [
  { label: 'Privacy Policy', url: '/privacy' },
  { label: 'Terms of Service', url: '/terms' },
  { label: 'Cookie Policy', url: '/cookies' },
  { label: 'GDPR', url: '/gdpr' },
] as const;
