/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [value, setValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const isEmpty = value.trim() === '';
  const showError = isTouched && isEmpty;

  // The gradient provided by the user
  const brandGradient = 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #8b6f47 100%)';

  return (
    <div className="min-h-screen bg-[#060a14] flex items-center justify-center p-6 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-2xl space-y-12">
        
        {/* Header Section */}
        <div className="space-y-2 border-b border-gray-800/50 pb-6">
          <h2 className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">
            Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          
          {/* Full Name Input Group */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-1">
                Full Name (English) <span className="text-red-500 text-sm">*</span>
              </label>
            </div>

            <div className="relative group">
              {/* Background Glow Effect */}
              <div 
                className={`absolute -inset-4 rounded-2xl blur-2xl transition-opacity duration-700 pointer-events-none ${
                  showError ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'
                }`}
                style={{ background: brandGradient }}
              />

              {/* REQUIRED Label - Attached to Outside Top Right Border */}
              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute bottom-full right-0 z-20 mb-[-1.5px]"
                  >
                    <div className="relative p-[1.5px] rounded-tl-sm rounded-tr-none overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      {/* Gradient Border for Label */}
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

              {/* Input Container with Gradient Border */}
              <div className="relative p-[1.5px] rounded-lg transition-all duration-500">
                {/* Border Glow Layer */}
                <div 
                  className={`absolute inset-0 rounded-lg transition-opacity duration-500 blur-[1px] ${
                    showError ? 'opacity-100' : 'opacity-30 group-hover:opacity-50'
                  }`}
                  style={{ background: brandGradient }}
                />
                
                {/* Inner Input Area */}
                <div className="relative bg-[#0d1321] rounded-[7px] flex items-center overflow-hidden">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={() => setIsTouched(true)}
                    placeholder="As per National ID"
                    className="w-full bg-transparent px-5 py-4 text-[13px] text-gray-200 placeholder-gray-700 outline-none transition-colors duration-300 focus:placeholder-gray-600"
                  />
                  
                  {/* Warning Icon */}
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
              
              <p className="text-[10px] text-gray-700 mt-2.5 ml-1 font-medium italic">
                English characters only
              </p>
            </div>
          </div>

          {/* Placeholder for second column */}
          <div className="hidden md:block opacity-10 pointer-events-none">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-800/50 rounded" />
              <div className="h-[54px] w-full bg-gray-900/30 border border-gray-800/50 rounded-lg" />
            </div>
          </div>

        </div>

        {/* Submit Button Section */}
        <div className="pt-8 flex flex-col items-start gap-4">
          <button
            onClick={() => {
              setIsTouched(true);
            }}
            className="relative group overflow-hidden rounded-lg p-[1px] transition-all duration-300 active:scale-95"
          >
            <div 
              className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ background: brandGradient }}
            />
            <div className="relative bg-[#060a14] px-12 py-3.5 rounded-[7px] group-hover:bg-transparent transition-colors duration-300">
              <span className="text-gray-400 group-hover:text-white text-[11px] uppercase tracking-[0.3em] font-black transition-colors duration-300">
                Submit Application
              </span>
            </div>
          </button>
          
          <p className="text-[9px] text-gray-800 uppercase tracking-[0.2em] font-bold">
            All fields marked with <span className="text-red-900/50">*</span> are mandatory
          </p>
        </div>

      </div>
    </div>
  );
}
