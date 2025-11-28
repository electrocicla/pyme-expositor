/**
 * SectionHeader - Reusable section header with icon
 * Single Responsibility: Display section titles consistently
 */

import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  description?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  description,
  className = '',
}) => (
  <div className={`flex items-center gap-2 ${description ? '' : 'mb-3'} ${className}`}>
    {icon && (
      <div className="w-6 h-6 rounded-md bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400">
        {icon}
      </div>
    )}
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description && (
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      )}
    </div>
  </div>
);

export default SectionHeader;
