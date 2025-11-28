/**
 * Footer Section Component
 * Following SRP: Only handles footer rendering
 */

import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import type { DynamicStyles } from './useDynamicStyles';

interface FooterSectionProps {
  styles: DynamicStyles;
  transparentBg?: boolean;
}

const FooterSection: React.FC<FooterSectionProps> = ({ styles, transparentBg = false }) => {
  const { config } = useConfig();
  const { footer, header } = config;

  return (
    <footer 
      className="border-t py-12" 
      style={transparentBg ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)' } : styles.footerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: styles.textColor }}>Contact</h3>
            <div className="space-y-2" style={{ color: styles.textMuted }}>
              {footer.contact.email && <p>Email: {footer.contact.email}</p>}
              {footer.contact.phone && <p>Phone: {footer.contact.phone}</p>}
              {footer.contact.address && <p>Address: {footer.contact.address}</p>}
              {!footer.contact.email && !footer.contact.phone && !footer.contact.address && (
                <p>Add your contact info</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: styles.textColor }}>Social</h3>
            <div className="flex gap-4">
              {Object.entries(footer.socials).map(([platform, url]) => (
                url && (
                  <a 
                    key={platform} 
                    href={url} 
                    className="capitalize transition-colors"
                    style={{ color: styles.textMuted }}
                    onMouseEnter={(e) => e.currentTarget.style.color = styles.hoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = styles.textMuted}
                  >
                    {platform}
                  </a>
                )
              ))}
              {Object.values(footer.socials).every(v => !v) && (
                <span style={{ color: styles.textMuted }}>Add social links</span>
              )}
            </div>
          </div>

          {/* Newsletter */}
          {footer.showNewsletter && (
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: styles.textColor }}>Newsletter</h3>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 border"
                  style={styles.inputStyle}
                />
                <button 
                  className="px-4 py-2 font-medium transition-opacity hover:opacity-90"
                  style={styles.buttonPrimary}
                >
                  Subscribe
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        {footer.showCopyright && (
          <div 
            className="text-center text-sm pt-8 border-t"
            style={{ color: styles.textMuted, borderColor: styles.footerStyle.borderColor }}
          >
            © {new Date().getFullYear()} {header.title}. All rights reserved.
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterSection;
