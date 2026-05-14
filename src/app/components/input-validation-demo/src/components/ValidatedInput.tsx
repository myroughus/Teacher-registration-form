import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ValidatedInputProps {
  label: string;
  subLabel?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  isTouched: boolean;
  setIsTouched: (touched: boolean) => void;
  required?: boolean;
  type?: string;
  hint?: string;
}

export default function ValidatedInput({
  label,
  subLabel,
  placeholder,
  value,
  onChange,
  isTouched,
  setIsTouched,
  required = false,
  type = 'text',
  hint,
}: ValidatedInputProps) {
  const isEmpty = value.trim() === '';
  const showError = required && isTouched && isEmpty;
  const brandGradient = 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #8b6f47 100%)';

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 block leading-tight">
          {label} {required && <span className="text-red-500 text-sm">*</span>}
        </label>
        {subLabel && (
          <span className="text-[10px] text-gray-600 font-medium block leading-none">
            {subLabel}
          </span>
        )}
      </div>

      <div className="relative group">
        {/* Background Glow Effect */}
        <div 
          className={`absolute -inset-4 rounded-2xl blur-2xl transition-opacity duration-700 pointer-events-none ${
            showError ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'
          }`}
          style={{ background: brandGradient }}
        />

        {/* REQUIRED Label */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute bottom-full right-0 z-20 mb-[-1.5px]"
            >
              <div className="relative p-[1.5px] rounded-tl-sm rounded-tr-none overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div 
                  className="absolute inset-0" 
                  style={{ background: brandGradient }}
                />
                <div className="relative bg-[#0d1321] px-2.5 py-0.5 rounded-tl-[1px] rounded-tr-none">
                  <span className="text-[9px] font-black text-blue-100 italic tracking-tighter uppercase block font-sans">
                    Required
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Container */}
        <div className="relative p-[1.5px] rounded-lg transition-all duration-500">
          <div 
            className={`absolute inset-0 rounded-lg transition-opacity duration-500 blur-[1px] ${
              showError ? 'opacity-100' : 'opacity-30 group-hover:opacity-50'
            }`}
            style={{ background: brandGradient }}
          />
          
          <div className="relative bg-[#0d1321] rounded-[7px] flex items-center overflow-hidden">
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setIsTouched(true)}
              placeholder={placeholder}
              className="w-full bg-transparent px-5 py-3.5 text-[13px] text-gray-200 placeholder-gray-700 outline-none transition-colors duration-300 focus:placeholder-gray-600"
            />
            
            <AnimatePresence>
              {showError && (
                <motion.div 
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="pr-4 text-blue-400"
                >
                  <AlertTriangle size={16} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {hint && (
          <p className="text-[10px] text-gray-700 mt-2 ml-1 font-medium italic">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
