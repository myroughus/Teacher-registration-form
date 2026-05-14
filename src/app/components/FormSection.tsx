import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export function FormSection({ title, icon, children }: FormSectionProps) {
  return (
    <div style={{
      marginBottom: '24px',
      padding: '1px',
      borderRadius: '2px',
      background: 'linear-gradient(135deg, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0.04) 40%, rgba(20,28,45,0.6) 100%)',
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #111111 0%, #0b0b0b 100%)',
        borderRadius: '1px',
        padding: '28px 32px',
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          marginBottom: '28px', paddingBottom: '20px',
          borderBottom: '1px solid rgba(201,169,110,0.07)',
        }}>
          {icon && (
            <div style={{
              width: '34px', height: '34px', borderRadius: '2px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(201,169,110,0.05)',
              border: '1px solid rgba(201,169,110,0.14)',
              fontSize: '14px',
            }}>
              {icon}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '13px', fontWeight: 500, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#C9A96E', lineHeight: 1.2,
              fontFamily: 'DM Mono, monospace',
            }}>
              {title.split('·')[0].trim()}
            </h2>
            {title.includes('·') && (
              <span style={{
                fontSize: '11px', color: '#4A4030', letterSpacing: '0.04em',
                fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic',
              }}>
                {title.split('·')[1]?.trim()}
              </span>
            )}
          </div>
          {/* Gold accent line */}
          <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, rgba(201,169,110,0.4), transparent)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
