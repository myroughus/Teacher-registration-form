import type { ChangeEventHandler } from 'react';
import { useState } from 'react';

interface FormFieldProps {
  label: string;
  sublabel?: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  rows?: number;
  maxLength?: number;
  defaultValue?: string;
  bengali?: boolean;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  min?: number;
  max?: number;
  id?: string;
  name?: string;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  pattern?: string;
  title?: string;
  hasError?: boolean;
}

export function FormField({
  label,
  sublabel,
  type = 'text',
  placeholder,
  required = false,
  options,
  rows = 3,
  maxLength,
  defaultValue,
  bengali,
  value,
  onChange,
  min,
  max,
  id,
  name,
  className = '',
  readOnly = false,
  disabled = false,
  pattern,
  title,
  hasError = false,
}: FormFieldProps) {
  const inputId = id || name || `field-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  const [isFocused, setIsFocused] = useState(false);

  const innerInputClass = [
    'w-full bg-transparent px-4 py-3 text-[13px] text-[#F8FAFC] outline-none transition-all duration-300',
    "font-['DM_Mono']",
    'placeholder:text-[#94A3B8]',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    bengali && type !== 'select' ? 'font-["Noto_Sans_Bengali"]' : '',
    className,
  ].join(' ');

  const commonProps = { id: inputId, name, required, disabled };

  const renderInput = () => {
    if (type === 'select') {
      return (
        <div className="relative">
          <select
            {...commonProps}
            className={`${innerInputClass} appearance-none cursor-pointer pr-10`}
            value={value ?? defaultValue ?? ''}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {options?.map((option, index) => (
              <option key={`${option}-${index}`} value={option} className="bg-[#0f1524]">
                {option || '— Select an option —'}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="#8A7250" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      );
    }
    if (type === 'textarea') {
      return (
        <textarea
          {...commonProps}
          className={`${innerInputClass} resize-none`}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          value={value ?? defaultValue ?? ''}
          onChange={onChange}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      );
    }
    return (
      <input
        {...commonProps}
        type={type}
        className={innerInputClass}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value ?? defaultValue ?? ''}
        onChange={onChange}
        min={min}
        max={max}
        readOnly={readOnly}
        pattern={pattern}
        title={title}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    );
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block">
        <span className="text-[9px] tracking-[0.16em] uppercase" style={{
          color: isFocused ? '#3B82F6' : (value && value !== '') ? '#F59E0B' : '#64748B',
          fontFamily: 'DM Mono, monospace',
          transition: 'color 0.3s',
          opacity: (value && value !== '') ? 1 : 0.9,
        }}>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </span>
        {sublabel && (
          <span className={`block mt-0.5 text-[11px] ${bengali ? 'font-["Noto_Sans_Bengali"]' : ''}`} style={{
            color: bengali ? '#94A3B8' : '#CBD5E1',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontStyle: 'italic',
            opacity: 1,
          }}>
            {sublabel}
          </span>
        )}
      </label>

      {/* Gradient border wrapper */}
      <div data-required-target className="relative" style={{
        padding: '1px', borderRadius: '2px',
        background: (isFocused && !hasError)
          ? 'linear-gradient(135deg, rgba(59,130,246,0.7), rgba(245,158,11,0.15))'
          : 'rgba(245,158,11,0.12)',
        transition: 'all 0.35s ease',
      }}>
        {/* Glow on focus - only when no error */}
        {(isFocused && !hasError) && (
          <div style={{
            position: 'absolute', inset: '-6px', borderRadius: '6px',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.15), rgba(245,158,11,0.1), transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}
        {/* Inner surface */}
        <div style={{ background: '#1E293B', borderRadius: '1px', position: 'relative', overflow: 'hidden' }}>
          {renderInput()}
        </div>
      </div>
    </div>
  );
}
