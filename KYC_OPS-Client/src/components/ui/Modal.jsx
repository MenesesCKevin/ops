import { useEffect } from 'react';
import { cn } from '../../lib/utils';

/**
 * Modal alineado al design system HSBC: backdrop + panel blanco, header/footer gris, botones primary/gris.
 * Usar role="dialog", aria-modal y aria-labelledby para accesibilidad.
 */
export default function Modal({
  open,
  onClose,
  title,
  titleId = 'modal-title',
  children,
  footer,
  className,
  panelClassName,
}) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-xl border border-border max-w-md w-full',
          'transform transition-all duration-300 animate-dialog-in',
          panelClassName
        )}
      >
        {title && (
          <div className="px-6 py-4 bg-secondary rounded-t-lg border-b border-border">
            <h3 id={titleId} className="text-lg font-semibold text-foreground">
              {title}
            </h3>
          </div>
        )}
        <div className="px-6 py-4 text-card-foreground">{children}</div>
        {footer && (
          <div className="px-6 py-4 bg-secondary rounded-b-lg border-t border-border flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
