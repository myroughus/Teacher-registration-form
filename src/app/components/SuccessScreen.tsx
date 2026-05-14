export function SuccessScreen() {
  const referenceNumber = `TCH${Math.floor(100000 + Math.random() * 900000)}`;

  const nextSteps = [
    { num: '01', text: 'Confirmation email within 24 hours', sub: '২৪ ঘন্টার মধ্যে নিশ্চিতকরণ ইমেইল' },
    { num: '02', text: 'Application review (5–7 business days)', sub: 'আবেদন পর্যালোচনা (৫–৭ দিন)' },
    { num: '03', text: 'Shortlisted candidates contacted for interview', sub: 'সাক্ষাৎকারের জন্য যোগাযোগ' },
    { num: '04', text: 'Final decision communicated via email', sub: 'চূড়ান্ত সিদ্ধান্ত ইমেইলে' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: '#030508' }}>
      <div className="max-w-[580px] w-full">

        {/* Ornamental header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3))' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(201,169,110,0.4)' }} />
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, rgba(201,169,110,0.3), transparent)' }} />
          </div>
          {/* Checkmark */}
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 20px',
            borderRadius: '50%',
            background: 'rgba(201,169,110,0.06)',
            border: '1px solid rgba(201,169,110,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
              <path d="M2 10l7 7L22 2" stroke="#C9A96E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '42px', fontWeight: 300, color: '#E8E4DC',
            letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: '8px',
          }}>
            Application Submitted
          </h1>
          <div style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '16px', fontWeight: 300, color: '#8A7250',
            letterSpacing: '0.12em', fontStyle: 'italic',
          }}>
            আবেদন জমা হয়েছে
          </div>
        </div>

        {/* Card */}
        <div style={{
          padding: '1px', borderRadius: '2px',
          background: 'linear-gradient(135deg, rgba(201,169,110,0.2) 0%, rgba(201,169,110,0.04) 40%, rgba(16,22,36,0.6) 100%)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, #C9A96E, rgba(201,169,110,0.2) 60%, transparent)' }} />
          <div style={{ background: '#0C1119', borderRadius: '0 0 1px 1px', padding: '36px 40px' }}>

            <p style={{
              fontSize: '13px', color: '#4A4030', lineHeight: 1.9, textAlign: 'center',
              marginBottom: '32px', fontFamily: 'Cormorant Garamond, Georgia, serif',
            }}>
              আপনার শিক্ষক আবেদন সফলভাবে গৃহীত হয়েছে।<br />
              Your application has been received. Please allow{' '}
              <span style={{ color: '#C9A96E' }}>5–7 business days</span> for review.
            </p>

            {/* Reference Number */}
            <div style={{
              textAlign: 'center', marginBottom: '36px',
              padding: '20px 28px',
              background: 'rgba(201,169,110,0.03)',
              border: '1px solid rgba(201,169,110,0.12)',
              borderTop: '1px solid rgba(201,169,110,0.22)',
            }}>
              <div style={{
                fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#3A3020', fontFamily: 'DM Mono, monospace', marginBottom: '10px',
              }}>
                আবেদন আইডি · Application ID
              </div>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: '22px', color: '#C9A96E',
                letterSpacing: '0.14em', fontWeight: 300,
              }}>
                {referenceNumber}
              </div>
            </div>

            {/* Next Steps */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#3A3020', fontFamily: 'DM Mono, monospace', marginBottom: '20px',
              }}>
                What happens next
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {nextSteps.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                    padding: '14px 0',
                    borderBottom: i < nextSteps.length - 1 ? '1px solid rgba(201,169,110,0.06)' : 'none',
                  }}>
                    <div style={{
                      fontSize: '10px', fontFamily: 'DM Mono, monospace',
                      color: '#4A3D26', letterSpacing: '0.06em', flexShrink: 0,
                      marginTop: '2px', minWidth: '20px',
                    }}>{s.num}</div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#8A8478', fontFamily: 'Cormorant Garamond, Georgia, serif', lineHeight: 1.4 }}>{s.text}</div>
                      <div style={{ fontSize: '11px', color: '#3A3020', marginTop: '2px', fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' }}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '12px 24px',
                background: 'linear-gradient(135deg, #C9A96E 0%, #B8965A 100%)',
                border: '1px solid rgba(201,169,110,0.4)',
                color: '#030508', cursor: 'pointer', width: '100%',
                transition: 'all 0.3s ease', borderRadius: '2px',
              }}>
                Download Receipt
              </button>
              <button style={{
                fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '12px 24px',
                background: 'transparent',
                border: '1px solid rgba(201,169,110,0.1)',
                color: '#4A4030', cursor: 'pointer', width: '100%',
                transition: 'all 0.3s ease', borderRadius: '2px',
              }}>
                Back to Home
              </button>
            </div>

            {/* Contact Info */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(201,169,110,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: '#2E2820', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                Questions? Contact us at{' '}
                <a href="mailto:hr@school.edu" style={{ color: '#8A7250', textDecoration: 'none' }}>hr@school.edu</a>
                {' '}or{' '}
                <a href="tel:+8801234567890" style={{ color: '#8A7250', textDecoration: 'none' }}>+880 1234-567890</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
