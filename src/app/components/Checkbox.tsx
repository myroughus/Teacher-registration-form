import { useState } from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  sublabel?: string;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
}

export function Checkbox({ 
  checked, 
  onChange, 
  label, 
  sublabel,
  required = false,
  className = '',
  name,
  id
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(checked || false);
  
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  
  const handleChange = () => {
    const newValue = !isChecked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  const checkboxId = id || name || Math.random().toString(36).substr(2, 9);

  return (
    <label 
      data-required-target
      className={`flex items-start gap-3 p-4 bg-[#0A0F1A] border border-[rgba(201,169,110,0.08)] cursor-pointer transition-all hover:border-[rgba(201,169,110,0.3)] hover:bg-[#0C1119] ${isChecked ? 'border-[rgba(201,169,110,0.35)] bg-[rgba(201,169,110,0.04)]' : ''} ${className}`}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={isChecked}
          onChange={handleChange}
          required={required}
          className="peer sr-only"
        />
        <div 
          className={`w-5 h-5 rounded-sm border transition-all duration-200 flex items-center justify-center
            ${isChecked 
              ? 'bg-[#C9A96E] border-[#C9A96E] shadow-[0_0_10px_rgba(201,169,110,0.25)]' 
              : 'bg-[#080D14] border-[rgba(201,169,110,0.18)] peer-hover:border-[rgba(201,169,110,0.4)]'
            }`}
        >
          {isChecked && (
            <svg 
              className="w-3 h-3 text-[#030508]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </div>
      </div>
      {(label || sublabel) && (
        <div className="flex-1">
          {label && (
            <span className={`text-[12px] leading-relaxed block font-['Cormorant_Garamond'] ${isChecked ? 'text-[#C8C4BC]' : 'text-[#5A5650]'}`}>
              {label}
              {required && <span className="text-[#f85c5c] ml-1">*</span>}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] text-[#3A3020] block mt-0.5 font-['DM_Mono']">{sublabel}</span>
          )}
        </div>
      )}
    </label>
  );
}

interface CheckboxGroupProps {
  options: { value: string; label: string; icon?: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: 2 | 3 | 4;
}

export function CheckboxGroup({ options, selected, onChange, columns = 4 }: CheckboxGroupProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-2`}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <label 
            key={option.value}
            className={`flex items-center gap-2 p-2.5 rounded cursor-pointer transition-all border
              ${isSelected 
                ? 'bg-[rgba(201,169,110,0.07)] border-[rgba(201,169,110,0.35)]' 
                : 'bg-[#0A0F1A] border-[rgba(201,169,110,0.08)] hover:border-[rgba(201,169,110,0.28)]'
              }`}
          >
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                className="peer sr-only"
              />
              <div 
                className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center
                  ${isSelected 
                    ? 'bg-[#C9A96E] border-[#C9A96E]' 
                    : 'bg-[#080D14] border-[rgba(201,169,110,0.15)] peer-hover:border-[rgba(201,169,110,0.4)]'
                  }`}
              >
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-[#030508]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            {option.icon && <span className="text-[14px]">{option.icon}</span>}
            <span className={`text-[12px] font-['Cormorant_Garamond'] ${isSelected ? 'text-[#C8C4BC]' : 'text-[#5A5650]'}`}>
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
