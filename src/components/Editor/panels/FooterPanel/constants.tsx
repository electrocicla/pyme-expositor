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

// Social platforms supported
export const socialPlatforms = [
  { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourprofile' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/yourchannel' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourusername' },
  { key: 'threads', label: 'Threads', placeholder: 'https://threads.net/@yourprofile' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/yournumber' },
] as const;

export type SocialKey = typeof socialPlatforms[number]['key'];

// Quick add legal links
export const quickLegalLinks = [
  { label: 'Privacy Policy', url: '/privacy' },
  { label: 'Terms of Service', url: '/terms' },
  { label: 'Cookie Policy', url: '/cookies' },
  { label: 'GDPR', url: '/gdpr' },
] as const;
