/**
 * PanelHeader - Reusable panel header with title
 * Single Responsibility: Display panel titles consistently
 */

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  subtitle,
  className = '',
}) => (
  <div className={className}>
    <h3 className="text-lg font-semibold text-white/90">{title}</h3>
    {subtitle && (
      <p className="text-sm text-white/50 mt-1">{subtitle}</p>
    )}
  </div>
);

export default PanelHeader;
