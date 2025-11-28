/**
 * InfoBox - Reusable informational message box
 * Single Responsibility: Display informational/warning/tip messages
 */

import type { ReactNode } from 'react';
import { Info, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';

type InfoBoxVariant = 'info' | 'warning' | 'tip' | 'success';

interface InfoBoxProps {
  children: ReactNode;
  variant?: InfoBoxVariant;
  title?: string;
  icon?: ReactNode;
  className?: string;
}

const variantConfig: Record<InfoBoxVariant, { bg: string; border: string; text: string; icon: ReactNode }> = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    icon: <Info className="w-4 h-4" />,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-300',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  tip: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-300',
    icon: <Lightbulb className="w-4 h-4" />,
  },
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    icon: <CheckCircle className="w-4 h-4" />,
  },
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  variant = 'info',
  title,
  icon,
  className = '',
}) => {
  const config = variantConfig[variant];

  return (
    <div className={`p-3 ${config.bg} border ${config.border} rounded-lg ${className}`}>
      <div className="flex items-start gap-2">
        <div className={`shrink-0 mt-0.5 ${config.text}`}>
          {icon || config.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h4 className={`text-sm font-medium ${config.text} mb-1`}>{title}</h4>
          )}
          <div className={`text-xs ${config.text}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
