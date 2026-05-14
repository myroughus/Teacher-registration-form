import { useState, useEffect } from 'react';

interface DateFieldProps {
  label: string;
  sublabel?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}

export function DateField({ 
  label, 
  sublabel, 
  value, 
  defaultValue,
  onChange, 
  required = false,
  placeholder = "DD/MM/YYYY",
  readOnly = false
}: DateFieldProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  
  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  const formatForDisplay = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };
  
  // Convert dd/mm/yyyy to yyyy-mm-dd for storage
  const formatForStorage = (dateStr: string): string => {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };
  
  // Validate dd/mm/yyyy format
  const isValidDate = (dateStr: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;
    
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year &&
           year >= 1900 && 
           year <= 2100;
  };
  
  useEffect(() => {
    const initialValue = value !== undefined ? value : defaultValue || '';
    setInputValue(formatForDisplay(initialValue));
  }, [value, defaultValue]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Auto-format as user types
    newValue = newValue.replace(/[^\d/]/g, '');
    
    // Auto-add slashes
    if (newValue.length === 2 && !newValue.includes('/') && inputValue.length < 2) {
      newValue += '/';
    } else if (newValue.length === 5 && newValue.split('/').length === 2 && inputValue.length < 5) {
      newValue += '/';
    }
    
    setInputValue(newValue);
    
    if (newValue === '') {
      setError('');
      onChange?.('');
    } else if (isValidDate(newValue)) {
      setError('');
      onChange?.(formatForStorage(newValue));
    } else {
      setError('Invalid date format. Use DD/MM/YYYY');
    }
  };
  
  const handleBlur = () => {
    if (inputValue && !isValidDate(inputValue)) {
      setError('Invalid date. Please use DD/MM/YYYY format');
    }
  };

  const id = Math.random().toString(36).substr(2, 9);

  return (
    <div>
      <label htmlFor={id} className="block mb-2">
        <span style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4A4030', fontFamily: 'DM Mono, monospace' }}>
          {label}
          {required && <span style={{ color: '#C94040', marginLeft: '4px' }}>*</span>}
        </span>
        {sublabel && <span style={{ display: 'block', fontSize: '11px', color: '#2E2A22', marginTop: '2px', fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' }}>{sublabel}</span>}
      </label>
      <div data-required-target className="relative" style={{ padding: '1px', background: error ? 'rgba(201,80,80,0.3)' : 'rgba(201,169,110,0.08)' }}>
        <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={readOnly}
        className={`w-full px-4 py-3 bg-[#0A0F1A] text-[13px] text-[#D8D4CC] font-['DM_Mono'] focus:outline-none transition-all placeholder:text-[#2E2A22] ${
          readOnly ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ border: 'none' }}
        />
      </div>
      {error && <p style={{ fontSize: '10px', color: '#C94040', marginTop: '4px', fontFamily: 'DM Mono, monospace' }}>{error}</p>}
    </div>
  );
}
