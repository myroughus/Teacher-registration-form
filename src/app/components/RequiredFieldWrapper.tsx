import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface RequiredFieldWrapperProps {
  children: ReactNode;
  hasError?: boolean;
  isHighlighted?: boolean;
  required?: boolean;
  fieldId?: string;
}

const brandGradient = 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #8b6f47 100%)';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function RequiredFieldWrapper({
  children,
  hasError = false,
  isHighlighted = false,
  required = false,
  fieldId,
}: RequiredFieldWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isSelect, setIsSelect] = useState(false);

  const showRequiredStyling = hasError || isHighlighted;
  const showBadge = required && hasError;

  const updateTargetRect = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const target =
      container.querySelector<HTMLElement>('[data-required-target]') ||
      container.querySelector<HTMLElement>('input, textarea, select, button');

    if (!target) {
      setTargetRect(null);
      setIsSelect(false);
      return;
    }

    setIsSelect(target.tagName === 'SELECT' || target.querySelector('select') !== null);

    const containerBox = container.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();

    setTargetRect({
      top: targetBox.top - containerBox.top,
      left: targetBox.left - containerBox.left,
      width: targetBox.width,
      height: targetBox.height,
    });
  }, []);

  useLayoutEffect(() => {
    updateTargetRect();

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => updateTargetRect());
    observer.observe(container);

    const target =
      container.querySelector<HTMLElement>('[data-required-target]') ||
      container.querySelector<HTMLElement>('input, textarea, select, button');

    if (target) observer.observe(target);

    window.addEventListener('resize', updateTargetRect);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateTargetRect);
    };
  }, [updateTargetRect, children]);

  const effectiveRect = targetRect || { top: 0, left: 0, width: 0, height: 0 };

  return (
    <div
      id={fieldId}
      ref={containerRef}
      className="relative"
    >
      {showRequiredStyling && targetRect && (
        <>
          <div
            className="absolute z-10 rounded-2xl blur-2xl transition-opacity duration-700 pointer-events-none"
            style={{
              top: effectiveRect.top - 6,
              left: effectiveRect.left - 6,
              width: effectiveRect.width + 12,
              height: effectiveRect.height + 12,
              background: brandGradient,
              opacity: 0.28,
            }}
          />

          <div
            className="absolute z-20 p-[1.5px] rounded-lg transition-all duration-500 pointer-events-none"
            style={{
              top: effectiveRect.top - 2,
              left: effectiveRect.left - 2,
              width: effectiveRect.width + 4,
              height: effectiveRect.height + 4,
            }}
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: brandGradient,
                opacity: 0.95,
              }}
            />
            <div className="absolute inset-[2px] rounded-[6px] bg-[#0d1220]" />
            <div
              className="absolute inset-0 rounded-lg transition-opacity duration-500 blur-[1px]"
              style={{
                background: brandGradient,
                opacity: 0.9,
              }}
            />
          </div>

          {showBadge && (
            <div
              className="absolute z-20"
              style={{
                top: fieldId === 'field-photoUploaded' ? effectiveRect.top - 8 : effectiveRect.top,
                left: fieldId === 'field-photoUploaded' ? effectiveRect.left + effectiveRect.width - 8 : effectiveRect.left + effectiveRect.width,
                transform: fieldId === 'field-photoUploaded' ? 'translate(0, -100%)' : 'translate(-100%, calc(-100% + 2px))',
              }}
            >
              <div
                className="relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                style={{
                  padding: fieldId === 'field-photoUploaded' ? '1px' : '1.5px',
                  borderRadius: fieldId === 'field-photoUploaded' ? '4px' : '2px',
                  borderTopLeftRadius: fieldId === 'field-photoUploaded' ? '4px' : '2px',
                  borderTopRightRadius: fieldId === 'field-photoUploaded' ? '4px' : 0,
                  background: brandGradient,
                }}
              >
                <div
                  className="relative bg-[#0d1321] px-2.5 py-0.5"
                  style={{
                    borderRadius: fieldId === 'field-photoUploaded' ? '3px' : '1px',
                    borderTopLeftRadius: fieldId === 'field-photoUploaded' ? '3px' : '1px',
                    borderTopRightRadius: fieldId === 'field-photoUploaded' ? '3px' : 0,
                  }}
                >
                  <span className="block text-[9px] font-black italic tracking-[-0.01em] uppercase text-blue-100 font-sans">
                    Required
                  </span>
                </div>
              </div>
            </div>
          )}

          {hasError && !isSelect && (
            <div
              className="absolute z-40 pointer-events-none text-blue-400"
              style={{
                top: effectiveRect.top + effectiveRect.height / 2,
                left: effectiveRect.left + effectiveRect.width - 24,
                transform: 'translateY(-50%)',
              }}
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M12 9v4M12 17h.01M10.29 3.86l-8.01 13.87A2 2 0 0 0 4.01 21h15.98a2 2 0 0 0 1.73-3.01L13.71 3.86a2 2 0 0 0-3.42 0z"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </>
      )}

      <div className="relative z-30">{children}</div>
    </div>
  );
}
