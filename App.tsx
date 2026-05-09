import React, { useState, useEffect } from 'react';
import { DetailedQuestionnaire } from './components/DetailedQuestionnaire';
import { useLang } from './LanguageContext';
import { type Language } from './i18n';

type Company = 'sevali' | 'kosman' | 'autower' | 'custom';

// Brand is set at build time via VITE_BRAND env variable.
// In Vercel: set VITE_BRAND=sevali, VITE_BRAND=kosman, or VITE_BRAND=autower
// Locally: set VITE_BRAND in .env.local
const BRAND = ((import.meta as any).env.VITE_BRAND as Company) || 'sevali';

// Brand accent colors — fixed per company
export const BRAND_COLOR: Record<Company, { accent: string; accentText: string }> = {
  sevali:  { accent: '#F5D781', accentText: '#1a1a1a' },
  kosman:  { accent: '#1a4fa0', accentText: '#FFFFFF' },
  autower: { accent: '#F47920', accentText: '#FFFFFF' },
  custom:  { accent: '#F5D781', accentText: '#1a1a1a' },
};

const App: React.FC = () => {
  const { t, lang, setLang } = useLang();
  const company = BRAND;  // locked at build time — no runtime switching
  const [customCompanyName] = useState('');

  // Apply kosman body class for its CSS variable overrides
  useEffect(() => {
    document.body.className = company === 'kosman' ? 'kosman' : '';
  }, []);

  const logos: Record<Company, string> = {
    sevali: 'https://i.ibb.co/Zpx00M2n/sevalitransparentlogo.png',
    kosman: '',
    autower: 'https://www.autoware-group.com/uploads/202030878/logo202011131203306290370.png',
    custom: '',
  };

  return (
    <div className="min-h-screen font-sans" style={{ color: 'var(--color-text-primary)' }}>
      {/* ── Header ── */}
      <header style={{ backgroundColor: 'var(--color-header-bg)', color: 'var(--color-header-text)', borderBottom: '1px solid var(--color-border)' }}
        className="sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">

          {/* Logo / branding */}
          <div className="flex items-center">
            {company === 'kosman' ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ backgroundColor: '#1a4fa0' }}>
                {/* Snowflake SVG */}
                <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  {[0, 60, 120, 180, 240, 300].map((deg) => {
                    const r = Math.PI / 180;
                    const cx = 22, cy = 22, len = 18, branch = 6;
                    const ax = cx + len * Math.cos(deg * r);
                    const ay = cy + len * Math.sin(deg * r);
                    const b1x = cx + len * 0.5 * Math.cos(deg * r);
                    const b1y = cy + len * 0.5 * Math.sin(deg * r);
                    const b2x = cx + len * 0.75 * Math.cos(deg * r);
                    const b2y = cy + len * 0.75 * Math.sin(deg * r);
                    const a1 = (deg + 60) * r, a2 = (deg - 60) * r;
                    return (
                      <g key={deg}>
                        <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1={b1x} y1={b1y} x2={b1x + branch * Math.cos(a1)} y2={b1y + branch * Math.sin(a1)} stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1={b1x} y1={b1y} x2={b1x + branch * Math.cos(a2)} y2={b1y + branch * Math.sin(a2)} stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1={b2x} y1={b2y} x2={b2x + branch * 0.7 * Math.cos(a1)} y2={b2y + branch * 0.7 * Math.sin(a1)} stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1={b2x} y1={b2y} x2={b2x + branch * 0.7 * Math.cos(a2)} y2={b2y + branch * 0.7 * Math.sin(a2)} stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    );
                  })}
                  <circle cx="22" cy="22" r="2.5" fill="white" />
                </svg>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.35)', paddingLeft: '0.75rem' }}>
                  <div className="font-bold text-xl tracking-widest leading-tight text-white">KOSMAN</div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.4)', margin: '3px 0' }} />
                  <div className="text-white text-sm tracking-wide">科仕曼环境科技</div>
                </div>
              </div>
            ) : company === 'autower' ? (
              <img src={logos.autower} alt="Autower" style={{ height: '3.5rem', width: 'auto' }} />
            ) : (
              <img src={logos.sevali} alt="Sevali Energy" style={{ height: '4rem', width: 'auto' }} />
            )}          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Language */}
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Language)}
              style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '0.375rem', border: '1.5px solid var(--color-border)', backgroundColor: 'var(--color-panel-bg)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              aria-label="Select language"
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DetailedQuestionnaire company={company} />
        <footer className="text-center mt-10 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <p>&copy; {new Date().getFullYear()} {
            company === 'kosman' ? 'Kosman' :
            company === 'autower' ? 'Autower' :
            'Sevali Energy'
          }. {t.allRightsReserved}</p>
          <p className="mt-1">{t.consultEngineer}</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
