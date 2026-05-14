import React from 'react';

interface StepTrackerProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { num: 1, label: 'Identity' },
  { num: 2, label: 'Contact' },
  { num: 3, label: 'Academics' },
  { num: 4, label: 'Professional' },
  { num: 5, label: 'Experience' },
  { num: 6, label: 'Suitability' },
  { num: 7, label: 'Background' },
  { num: 8, label: 'Documents' },
  { num: 9, label: 'References' },
  { num: 10, label: 'Declaration' },
];

export function StepTracker({ currentStep, totalSteps, onStepClick }: StepTrackerProps) {
  return (
    <div
      style={{
        marginBottom: '28px',
        padding: '20px 28px',
        borderRadius: '4px',
        background: 'linear-gradient(180deg, #0A0F1A 0%, #080D14 100%)',
        border: '1px solid rgba(201,169,110,0.12)',
        borderTop: '1px solid rgba(201,169,110,0.2)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,169,110,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="step-tracker-scroll">
        {steps.map((step, index) => {
          const isActive = step.num === currentStep;
          const isCompleted = step.num < currentStep;

          return (
            <React.Fragment key={step.num}>
              <div
                style={{ cursor: onStepClick ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}
                onClick={() => onStepClick && onStepClick(step.num)}
              >
                {/* Circle */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 600,
                  fontFamily: 'DM Mono, monospace',
                  position: 'relative', zIndex: 1,
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                  border: isCompleted
                    ? '1.5px solid #C9A96E'
                    : isActive
                    ? '1.5px solid rgba(201,169,110,0.85)'
                    : '1.5px solid rgba(201,169,110,0.12)',
                  background: isCompleted
                    ? 'linear-gradient(135deg, #C9A96E 0%, #B8965A 100%)'
                    : isActive
                    ? 'rgba(201,169,110,0.1)'
                    : '#080D14',
                  color: isCompleted ? '#030508' : isActive ? '#C9A96E' : '#3A3830',
                  boxShadow: isActive
                    ? '0 0 20px rgba(201,169,110,0.2), inset 0 1px 0 rgba(201,169,110,0.1)'
                    : isCompleted
                    ? '0 2px 10px rgba(201,169,110,0.15)'
                    : 'none',
                }}>
                  {isCompleted ? (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4.5l3 3 6-7" stroke="#030508" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : <span>{step.num}</span>}
                </div>
                {/* Label */}
                <span style={{
                  fontSize: '8px', fontWeight: 500, textTransform: 'uppercase',
                  letterSpacing: '0.1em', whiteSpace: 'nowrap', maxWidth: '64px',
                  textAlign: 'center', lineHeight: 1.2,
                  fontFamily: 'DM Mono, monospace',
                  color: isActive ? '#C9A96E' : isCompleted ? '#6A6450' : '#2E2A22',
                  transition: 'color 0.3s ease',
                }}>
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div style={{
                  flex: 1, minWidth: '16px', maxWidth: '44px', height: '1px',
                  margin: '0 4px', marginBottom: '24px',
                  background: isCompleted
                    ? 'linear-gradient(90deg, rgba(201,169,110,0.6), rgba(201,169,110,0.1))'
                    : 'rgba(201,169,110,0.07)',
                  transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
