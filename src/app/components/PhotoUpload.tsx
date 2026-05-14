import { useState } from 'react';

interface PhotoUploadProps {
  onUpload?: (value: string) => void;
}

export function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ছবি ২ MB এর বেশি হবে না · File size must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onUpload?.('yes');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPreview(null);
    onUpload?.('');
  };

  return (
    <div className="mb-6">
      <label className="block mb-3" style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4A4030', fontFamily: 'DM Mono, monospace' }}>
        Applicant Photo · শিক্ষকের ছবি <span style={{ color: '#C94040' }}>*</span>
      </label>

      <div className="flex items-start gap-4 flex-wrap">
        {/* Photo Preview */}
        <div className="relative">
          <div data-required-target
            style={{
              width: '90px', height: '90px', background: '#111111',
              border: '1px dashed rgba(201,169,110,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', cursor: 'pointer',
              transition: 'border-color 0.3s',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)')}
            onClick={() => !preview && document.getElementById('photo-input')?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <svg style={{ width: '28px', height: '28px', color: '#3A3020' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" strokeWidth={1.2} />
                <path strokeWidth={1.2} d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            )}
          </div>
          {preview && (
            <button
              onClick={removePhoto}
              style={{
                position: 'absolute', top: '-8px', right: '-8px',
                width: '22px', height: '22px',
                background: '#C94040', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
              }}
            >
              <svg style={{ width: '12px', height: '12px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Upload Info */}
        <div className="flex-1 min-w-[200px]">
          <p style={{ fontSize: '11px', color: '#3A3020', lineHeight: 1.8, marginBottom: '12px', fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic' }}>
            পাসপোর্ট সাইজ ছবি · Passport size photo<br />
            JPG/PNG · সর্বোচ্চ 2MB · Max 2MB
          </p>
          <input
            type="file"
            id="photo-input"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="photo-input"
            style={{
              display: 'inline-block', fontSize: '9px', letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '8px 16px',
              background: 'rgba(201,169,110,0.07)',
              border: '1px solid rgba(201,169,110,0.22)',
              color: '#C9A96E', cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
              transition: 'all 0.3s',
            }}
          >
            Choose Photo
          </label>
          {preview && (
            <button
              onClick={removePhoto}
              style={{
                marginLeft: '8px', fontSize: '9px', letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '8px 14px',
                background: 'transparent',
                border: '1px solid rgba(201,80,80,0.25)',
                color: '#C94040', cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
