interface ProgressBarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

function getProgressWidth(step: number, total: number): number {
  return (step / total) * 100;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const width = getProgressWidth(currentStep, totalSteps);
  const pct = Math.round(width);
  const segmentWidth = 100 / totalSteps;
  
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{
          fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#4A4030', fontWeight: 500, fontFamily: 'DM Mono, monospace',
        }}>
          Application Progress
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>
            {pct}
          </span>
          <span style={{ fontSize: '8px', color: '#6A6450', fontFamily: 'DM Mono, monospace' }}>%</span>
        </div>
      </div>
      <div style={{ height: '1px', background: 'rgba(201,169,110,0.08)', overflow: 'visible', position: 'relative' }}>
        {/* Background track */}
        <div style={{ height: '100%', width: '100%', background: 'rgba(201,169,110,0.08)' }} />
        
        {/* Progress segments */}
        {Array.from({ length: currentStep }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * segmentWidth}%`,
              top: '0',
              height: '100%',
              width: `${segmentWidth}%`,
              background: 'linear-gradient(90deg, #3B82F6, #F59E0B 70%, #3B82F6)',
              boxShadow: '0 0 12px rgba(201,169,110,0.3)',
            }}
          >
            {/* Segment end dot */}
            <div style={{
              position: 'absolute', right: '-3px', top: '50%', transform: 'translateY(-50%)',
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#F59E0B',
              boxShadow: '0 0 8px rgba(245,158,11,0.6)',
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
