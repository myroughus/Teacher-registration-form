import { TeacherApplicationForm } from './components/TeacherApplicationForm';

export default function App() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0b0b0b' }}>
      {/* Deep ambient gold gradients */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 15% 0%, rgba(201,169,110,0.055) 0%, transparent 65%),
            radial-gradient(ellipse 50% 35% at 85% 100%, rgba(201,169,110,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 35% 25% at 50% 45%, rgba(201,169,110,0.02) 0%, transparent 70%)
          `,
          zIndex: 0
        }}
      />
      {/* Subtle noise / grain texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          opacity: 0.6,
          zIndex: 0
        }}
      />
      {/* Ultra-fine line grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,169,110,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          zIndex: 0
        }}
      />
      <div className="relative z-[1]">
        <TeacherApplicationForm />
      </div>
    </div>
  );
}
