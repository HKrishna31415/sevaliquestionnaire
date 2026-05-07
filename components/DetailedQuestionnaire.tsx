import React, { useState } from 'react';
import { QuestionnaireField } from './QuestionnaireField';
import { SelectField } from './SelectField';
import { UnitInputField } from './UnitInputField';
import { SplitUnitInputField } from './SplitUnitInputField';
import { TankInventoryManager } from './TankInventoryManager';
import { useLang } from '../LanguageContext';

const inputClasses = "w-full pl-3 py-2 border border-(--color-border) rounded-md shadow-sm focus:ring-2 focus:ring-(--color-input-focus-ring) focus:border-(--color-input-focus-ring) transition duration-150 ease-in-out bg-(--color-input-bg) text-(--color-text-primary)";

type UnitFieldState = { value: string; unit: string };
type FormState = { [key: string]: UnitFieldState };
const TOTAL_STEPS = 10;

// ── Progress Bar ──────────────────────────────────────────────────────────────
const ProgressBar: React.FC<{
  step: number; total: number; labels: string[];
  onJump: (s: number) => void;
  accent: string; accentText: string;
}> = ({ step, total, labels, onJump, accent, accentText }) => (
  <div style={{ marginBottom: '0.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {Array.from({ length: total }).map((_, i) => {
        const done   = i + 1 < step;
        const active = i + 1 === step;
        return (
          <React.Fragment key={i}>
            <button
              type="button"
              onClick={() => onJump(i + 1)}
              title={labels[i]}
              aria-label={`Step ${i + 1}: ${labels[i]}`}
              style={{
                width: '2rem', height: '2rem', borderRadius: '9999px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, cursor: 'pointer',
                border: done || active ? `2px solid ${accent}` : '2px solid #D1D5DB',
                backgroundColor: done || active ? accent : '#FFFFFF',
                color: done || active ? accentText : '#9CA3AF',
                boxShadow: active ? `0 0 0 4px ${accent}33` : 'none',
                transform: active ? 'scale(1.18)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}
            >
              {done ? (
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </button>
            {i < total - 1 && (
              <div style={{
                flex: 1, height: '3px',
                backgroundColor: done ? accent : '#E5E7EB',
                transition: 'background-color 0.3s ease',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// ── Nav Buttons ───────────────────────────────────────────────────────────────
const StepNav: React.FC<{
  step: number; total: number;
  onBack: () => void; onNext: () => void; onSubmit: () => void;
  isGeneratingPdf: boolean;
  submitLabel: string; generatingLabel: string; backLabel: string; nextLabel: string;
  accent: string; accentText: string;
}> = ({ step, total, onBack, onNext, onSubmit, isGeneratingPdf, submitLabel, generatingLabel, backLabel, nextLabel, accent, accentText }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
    <button
      type="button" onClick={onBack} disabled={step === 1}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1.5px solid #D1D5DB', color: '#6B7280', backgroundColor: 'transparent', fontWeight: 600, fontSize: '0.875rem', cursor: step === 1 ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.35 : 1, transition: 'all 0.15s' }}
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {backLabel}
    </button>

    {step < total ? (
      <button
        type="button" onClick={onNext}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: accent, color: accentText, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'opacity 0.15s' }}
      >
        {nextLabel}
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    ) : (
      <button
        type="button" onClick={onSubmit} disabled={isGeneratingPdf}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: accent, color: accentText, fontWeight: 700, fontSize: '0.875rem', cursor: isGeneratingPdf ? 'wait' : 'pointer', opacity: isGeneratingPdf ? 0.6 : 1, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'opacity 0.15s' }}
      >
        {isGeneratingPdf ? (
          <>
            <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {generatingLabel}
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {submitLabel}
          </>
        )}
      </button>
    )}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export const DetailedQuestionnaire: React.FC<{ company?: string }> = ({ company = 'sevali' }) => {
  const { t, lang } = useLang();
  // Brand colors hardcoded per company — never driven by CSS variables
  const brandAccent  = company === 'kosman' ? '#1a4fa0' : '#F5C800';
  const brandText    = company === 'kosman' ? '#FFFFFF' : '#1a1a1a';
  const [step, setStep] = useState(1);
  const [classificationSystem, setClassificationSystem] = useState('Class/Division');
  const [storageType, setStorageType] = useState('Truck Filling Station');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    dischargePressure:    { value: '', unit: 'bar' },
    ambientTempMax:       { value: '', unit: '°C' },
    ambientTempMin:       { value: '', unit: '°C' },
    blanketingPressure:   { value: '', unit: 'mbar' },
    vaporMolecularWeight: { value: '', unit: 'g/mol' },
    vaporLEL:             { value: '', unit: '% by vol' },
    headerSize:           { value: '', unit: 'mm' },
    pipingLength:         { value: '', unit: 'meters' },
    instrumentAir:        { value: '', unit: 'bar' },
    coolingWaterFlow:     { value: '', unit: 'LPM' },
    coolingWaterTemp:     { value: '', unit: '°C' },
    coolingWaterPressure: { value: '', unit: 'bar' },
    vocRecovery:          { value: '', unit: '%' },
    noiseLevel:           { value: '', unit: 'dBA @ 1m' },
    loadingPumpFlowRate:  { value: '', unit: 'm³/h' },
  });

  const ui = (id: string) => ({
    value: formState[id].value,
    unit: formState[id].unit,
    onValueChange: (val: string) => setFormState(p => ({ ...p, [id]: { ...p[id], value: val } })),
    onUnitChange:  (val: string) => setFormState(p => ({ ...p, [id]: { ...p[id], unit: val } })),
  });

  const stepLabels = [
    t.s1title, t.s2title, t.s3title, t.s4title, t.s5title,
    t.s6title, t.s7title, t.s8title, t.s9title, t.s10title,
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goNext = () => { setStep(s => Math.min(s + 1, TOTAL_STEPS)); scrollToTop(); };
  const goBack = () => { setStep(s => Math.max(s - 1, 1)); scrollToTop(); };

  // ── PDF Generation ──────────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const formElement = document.getElementById('detailed-questionnaire-form');
    if (!formElement) { setIsGeneratingPdf(false); return; }

    const getBase64Image = (url: string): Promise<string> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('no ctx')); return; }
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
      });

    const logoUrl = 'https://i.ibb.co/Zpx00M2n/sevalitransparentlogo.png';
    const pdf = new (window as any).jspdf.jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();
    const m = 15;

    const projectName = (document.getElementById('projectName') as HTMLInputElement)?.value || 'Not Specified';
    const siteCity    = (document.getElementById('siteCity') as HTMLInputElement)?.value || '';
    const siteCountry = (document.getElementById('siteCountry') as HTMLInputElement)?.value || '';
    const siteLocation = [siteCity, siteCountry].filter(Boolean).join(', ') || 'Not Specified';
    const contactPerson = (document.getElementById('contactPerson') as HTMLInputElement)?.value || 'Not Specified';
    const generationDate = new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const generationDateZh = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    const disclaimer = 'This report is a preliminary assessment based on the data provided. It is for discussion purposes only and should not be considered a final engineering specification. A qualified engineer must be consulted for detailed design.';

    if (company === 'kosman') {
      // Kosman cover — rendered via HTML for Chinese font support
      const cover = document.createElement('div');
      cover.style.cssText = `position:absolute;left:-9999px;width:210mm;height:297mm;background:white;font-family:sans-serif;display:flex;flex-direction:column;`;
      cover.innerHTML = `
        <div style="background-color:#1a4fa0;height:40mm;display:flex;flex-direction:column;justify-content:center;align-items:center;color:white;">
          <div style="font-size:26pt;font-weight:bold;letter-spacing:2px;">KOSMAN</div>
          <div style="font-size:13pt;margin-top:2mm;">科仕曼环境科技</div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding-top:20mm;color:#1a202c;">
          <h1 style="font-size:24pt;font-weight:bold;margin-bottom:4mm;">VRU Specification Report</h1>
          <p style="font-size:14pt;color:#4A5568;">Preliminary Assessment</p>
          
          <div style="margin-top:35mm;width:100%;padding:0 20mm;font-size:12pt;color:#2D3748;">
            <div style="display:grid;grid-template-columns:40mm 1fr;gap:10mm;margin-bottom:8mm;">
              <span style="font-weight:bold;">项目名称:</span>
              <span>${projectName}</span>
            </div>
            <div style="display:grid;grid-template-columns:40mm 1fr;gap:10mm;margin-bottom:8mm;">
              <span style="font-weight:bold;">项目地点:</span>
              <span>${siteLocation}</span>
            </div>
            <div style="display:grid;grid-template-columns:40mm 1fr;gap:10mm;margin-bottom:8mm;">
              <span style="font-weight:bold;">联系人:</span>
              <span>${contactPerson}</span>
            </div>
            <div style="display:grid;grid-template-columns:40mm 1fr;gap:10mm;margin-bottom:8mm;">
              <span style="font-weight:bold;">日期:</span>
              <span>${generationDateZh}</span>
            </div>
          </div>
        </div>
        <div style="padding:20mm;font-size:9pt;color:#6B7280;line-height:1.5;">
          ${disclaimer}
        </div>
      `;
      document.body.appendChild(cover);
      const coverCanvas = await (window as any).html2canvas(cover, { scale: 2 });
      document.body.removeChild(cover);
      pdf.addImage(coverCanvas.toDataURL('image/png'), 'PNG', 0, 0, W, H);
    } else {
      // Sevali cover — logo + title
      const logoBase64 = await getBase64Image(logoUrl);
      pdf.addImage(logoBase64, 'PNG', (W - 60) / 2, m, 60, 60);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(22); pdf.setTextColor('#1a202c');
      pdf.text('VRU Specification Report', W / 2, m + 75, { align: 'center' });
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(14); pdf.setTextColor('#4A5568');
      pdf.text('Preliminary Assessment', W / 2, m + 85, { align: 'center' });

      const dy = m + 105;
      pdf.setFontSize(11); pdf.setTextColor('#2D3748');
      [['Project:', projectName], ['Site:', siteLocation], ['Contact:', contactPerson], ['Date:', generationDate]].forEach(([k, v], i) => {
        pdf.setFont('helvetica', 'bold'); pdf.text(k, m, dy + i * 10);
        pdf.setFont('helvetica', 'normal'); pdf.text(v, m + 40, dy + i * 10);
      });

      pdf.setFontSize(9); pdf.setTextColor('#6B7280');
      pdf.text(pdf.splitTextToSize(disclaimer, W - m * 2), m, H - m - 20);
    }

    pdf.addPage();

    // Render all sections into a hidden container
    const printContainer = document.createElement('div');
    printContainer.style.cssText = 'position:absolute;left:-9999px;width:210mm;box-sizing:border-box;';
    const style = document.createElement('style');
    style.innerHTML = '.ppa{font-family:sans-serif;color:#2D3748;background:white;padding:15mm}.ppa h2{font-size:1.1rem;font-weight:700;margin:1.5rem 0 0.75rem;border-bottom:1px solid #e2e8f0;padding-bottom:0.4rem}.ppa .row{display:grid;grid-template-columns:180px 1fr;gap:0.5rem;padding:0.4rem 0;border-bottom:1px solid #f1f5f9;font-size:0.8rem}.ppa .lbl{font-weight:600;color:#4A5568}.ppa .val{color:#2D3748}';
    printContainer.className = 'ppa';
    document.head.appendChild(style);
    document.body.appendChild(printContainer);

    const addEntry = (label: string, value: string) => {
      if (!value?.trim()) return;
      const row = document.createElement('div'); row.className = 'row';
      const l = document.createElement('span'); l.className = 'lbl'; l.textContent = label;
      const v = document.createElement('span'); v.className = 'val'; v.textContent = value;
      row.appendChild(l); row.appendChild(v); printContainer.appendChild(row);
    };

    const h1 = document.createElement('h1');
    h1.style.cssText = 'font-size:1.4rem;font-weight:700;text-align:center;margin-bottom:1rem';
    h1.textContent = t.detailedVRUSpec;
    printContainer.appendChild(h1);

    const fieldsets = formElement.querySelectorAll('fieldset');
    fieldsets.forEach(fieldset => {
      const legend = fieldset.querySelector('legend');
      if (legend) {
        const h2 = document.createElement('h2'); h2.textContent = legend.textContent || '';
        printContainer.appendChild(h2);
      }
      
      // Keep track of labels we've already added to avoid duplicates
      const addedLabels = new Set<string>();

      // Find all input-like elements
      const inputs = fieldset.querySelectorAll('input, select, textarea');
      inputs.forEach(inputEl => {
        const input = inputEl as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (!input.value || !input.value.trim()) return;

        // Find the label text
        let labelText = '';
        const label = fieldset.querySelector(`label[for="${input.id}"]`);
        if (label) {
          labelText = label.textContent?.trim() || '';
        } else {
          const wrap = input.closest('.field-wrap');
          if (wrap) labelText = wrap.querySelector('label')?.textContent?.trim() || '';
        }

        if (!labelText || addedLabels.has(labelText)) return;

        let value = '';
        const wrap = input.closest('.field-wrap') || input.parentElement;
        if (wrap) {
          // Check if this is a complex field with multiple inputs
          const allInps = wrap.querySelectorAll('input:not([type="hidden"]), textarea, select');
          const vals: string[] = [];
          const units: string[] = [];

          allInps.forEach(i => {
            const el = i as HTMLInputElement | HTMLSelectElement;
            if (el.tagName === 'SELECT') {
              units.push(el.value);
            } else if (el.value.trim()) {
              vals.push(el.value);
            }
          });

          if (vals.length > 0) {
            value = vals.join(' / ');
            if (units.length > 0) value += ` ${units[0]}`;
            else {
              const badge = wrap.querySelector('.unit-badge');
              if (badge) value += ` ${badge.textContent}`;
            }
            
            // Special handling for date
            if (input.type === 'date') {
              const [y, mo, d] = vals[0].split('-');
              value = lang === 'zh' ? `${d}/${mo}/${y}` : `${mo}/${d}/${y}`;
            }

            addEntry(labelText, value);
            addedLabels.add(labelText);
          }
        }
      });
    });

    const canvas = await (window as any).html2canvas(printContainer, { scale: 2, useCORS: true });
    document.body.removeChild(printContainer);
    document.head.removeChild(style);

    const imgData = canvas.toDataURL('image/png');
    const cw = W - m * 2;
    const ch = cw / (canvas.width / canvas.height);
    let pos = 0;
    pdf.addImage(imgData, 'PNG', m, m, cw, ch);
    let left = ch - (H - m * 2);
    while (left > 0) {
      pos -= (H - m * 2);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', m, pos + m, cw, ch);
      left -= (H - m * 2);
    }

    const pages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8); pdf.setTextColor(100);
      if (company === 'sevali') {
        pdf.text('CEO: Mr. Yalçin Aliyev', m, H - 12);
        pdf.text('Phone: +994 55 320 42 81', m, H - 8);
      }
      const companyName = company === 'kosman' ? 'Kosman' : 'Sevali Energy';
      pdf.text(`© ${new Date().getFullYear()} ${companyName}. All rights reserved.`, W - m, H - 12, { align: 'right' });
      pdf.text('For official use, consult a qualified engineer.', W - m, H - 8, { align: 'right' });
    }

    pdf.save('VRU_Questionnaire_Report.pdf');
    setIsGeneratingPdf(false);
  };

  // ── Step Sections ────────────────────────────────────────────────────────────
  const renderStep = (s: number) => {
    switch (s) {
      case 1: return (
        <fieldset>
          <legend className="sr-only">{t.s1title}</legend>
          <div className="form-grid">
            <QuestionnaireField label={t.projectNameId} description={t.projectNameDesc}>
              <input id="projectName" type="text" placeholder={t.ph_projectName} />
            </QuestionnaireField>
            <QuestionnaireField label={t.country} description={t.countryDesc}>
              <input id="siteCountry" type="text" placeholder={t.ph_country} />
            </QuestionnaireField>
            <QuestionnaireField label={t.cityState} description={t.cityStateDesc}>
              <input id="siteCity" type="text" placeholder={t.ph_city} />
            </QuestionnaireField>
            <QuestionnaireField label={t.streetAddress} description={t.streetAddressDesc}>
              <input id="siteAddress" type="text" placeholder={t.ph_address} />
            </QuestionnaireField>
            <QuestionnaireField label={t.contactPerson} description={t.contactPersonDesc}>
              <input id="contactPerson" type="text" placeholder={t.ph_contact} />
            </QuestionnaireField>
            <QuestionnaireField label={t.contactEmail} description={t.contactEmailDesc}>
              <input id="contactEmail" type="email" placeholder={t.ph_email} />
            </QuestionnaireField>
            <QuestionnaireField label={t.projectStartDate} description={t.projectStartDateDesc}>
              <input id="projectStartDate" type="date" style={{ direction: 'ltr' }} />
            </QuestionnaireField>
            <QuestionnaireField label={t.projectEndDate} description={t.projectEndDateDesc}>
              <input id="projectEndDate" type="date" style={{ direction: 'ltr' }} />
            </QuestionnaireField>
          </div>
        </fieldset>
      );

      case 2: return (
        <fieldset>
          <legend className="sr-only">{t.s2title}</legend>
          <div className="form-grid">
            <SelectField id="storageType" label={t.storageTypeLabel} description={t.storageTypeDesc}
              options={t.storageTypes as unknown as string[]} value={storageType} onChange={e => setStorageType(e.target.value)} />
            {storageType === 'Other' && (
              <QuestionnaireField label={t.specifyOtherStorage} description="">
                <input id="storageTypeOther" type="text" placeholder={t.ph_marineTerminal} />
              </QuestionnaireField>
            )}
            <SelectField id="deliveryMethod" label={t.deliveryMethod} description={t.deliveryMethodDesc}
              options={t.deliveryMethods as unknown as string[]} />
            <SelectField id="loadingMethod" label={t.loadingMethod} description={t.loadingMethodDesc}
              options={t.loadingMethods as unknown as string[]} />
            <QuestionnaireField label={t.loadingFrequency} description={t.loadingFrequencyDesc}>
              <div style={{ position: "relative" }}>
                <input id="loadingFrequency" type="number" step="1" placeholder={t.ph_loadingFreq} />
                <div style={{ position: "absolute", inset: "0 0 0 auto", right: "0.75rem", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                  <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>{t.truckDay}</span>
                </div>
              </div>
            </QuestionnaireField>
            <UnitInputField id="loadingPumpFlowRate" label={t.loadingPumpFlowRate} description={t.loadingPumpFlowRateDesc}
              units={['m³/h', 'LPM', 'GPM', 'BPH']} placeholder={t.ph_loadingPumpFlowRate} {...ui('loadingPumpFlowRate')} />
            <QuestionnaireField label={t.simultaneousTrucks} description={t.simultaneousTrucksDesc}>
              <input id="simultaneousTrucks" type="number" step="1" placeholder={t.ph_simultaneousTrucks} />
            </QuestionnaireField>
            <UnitInputField id="dischargePressure" label={t.dischargePressure} description={t.dischargePressureDesc}
              units={['bar', 'psig', 'kPa']} placeholder={t.ph_dischargePressure} {...ui('dischargePressure')} />
            <UnitInputField id="ambientTempMax" label={t.maxAmbientTemp} description={t.maxAmbientTempDesc}
              units={['°C', '°F']} placeholder={t.ph_tempMax} {...ui('ambientTempMax')} />
            <UnitInputField id="ambientTempMin" label={t.minAmbientTemp} description={t.minAmbientTempDesc}
              units={['°C', '°F']} placeholder={t.ph_tempMin} {...ui('ambientTempMin')} />
          </div>
        </fieldset>
      );

      case 3: return (
        <fieldset>
          <legend className="sr-only">{t.s3title}</legend>
          <div id="tank-inventory-section">
            <TankInventoryManager />
          </div>
          <div className="form-grid" style={{ marginTop: "1.5rem" }}>
            <SelectField id="tankBlanketing" label={t.tankBlanketed} description={t.tankBlanketedDesc}
              options={t.blanketOptions as unknown as string[]} />
            <div>
              <SelectField id="blanketingGasType" label={t.blanketGasType} description={t.blanketGasTypeDesc}
                options={t.blanketGases as unknown as string[]} />
              <UnitInputField id="blanketingPressure" label={t.blanketPressure} description={t.blanketPressureDesc}
                units={['mbar', 'in WC', 'Pa']} placeholder={t.ph_blanketPressure} {...ui('blanketingPressure')} />
            </div>
          </div>
        </fieldset>
      );

      case 4: return (
        <fieldset>
          <legend className="sr-only">{t.s4title}</legend>
          <QuestionnaireField label={t.gcAnalysis} description={t.gcAnalysisDesc}>
            <textarea id="gcAnalysis" rows={4} style={{ minHeight: "80px" }} placeholder={t.ph_gcAnalysis} />
          </QuestionnaireField>
          <div className="form-grid">
            <QuestionnaireField label={t.corrosiveComponents} description={t.corrosiveDesc}>
              <input id="corrosiveComponents" type="text" placeholder={t.ph_corrosive} />
            </QuestionnaireField>
            <SelectField id="vaporSaturation" label={t.vaporSaturation} description={t.vaporSaturationDesc}
              options={t.saturationOptions as unknown as string[]} />
            <UnitInputField id="vaporMolecularWeight" label={t.vaporMolWeight} description={t.vaporMolWeightDesc}
              units={['g/mol']} placeholder={t.ph_molWeight} {...ui('vaporMolecularWeight')} />
            <UnitInputField id="vaporLEL" label={t.vaporLEL} description={t.vaporLELDesc}
              units={['% by vol']} placeholder={t.ph_lel} {...ui('vaporLEL')} />
          </div>
        </fieldset>
      );

      case 5: return (
        <fieldset>
          <legend className="sr-only">{t.s5title}</legend>
          <div className="form-grid">
            <UnitInputField id="headerSize" label={t.headerDiameter} description={t.headerDiameterDesc}
              units={['mm', 'inches']} placeholder={t.ph_headerDiameter} {...ui('headerSize')} />
            <UnitInputField id="pipingLength" label={t.pipingLength} description={t.pipingLengthDesc}
              units={['meters', 'feet']} placeholder={t.ph_pipingLength} {...ui('pipingLength')} />
            <SplitUnitInputField id="ventSetPoints" label={t.ventSetPoints} description={t.ventSetPointsDesc}
              units={['mbar', 'in WC']} placeholders={{ positive: '+6.2', negative: '-1.2' }} />
            <SelectField id="arrestorExists" label={t.arrestorExists} description={t.arrestorDesc}
              options={t.arrestorOptions as unknown as string[]} />
            <QuestionnaireField label={t.pipingMaterial} description={t.pipingMaterialDesc}>
              <input id="pipingMaterial" type="text" placeholder={t.ph_pipingMaterial} />
            </QuestionnaireField>
          </div>
        </fieldset>
      );

      case 6: return (
        <fieldset>
          <legend className="sr-only">{t.s6title}</legend>
          <div className="form-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <QuestionnaireField label={t.availableVoltage} description={t.availableVoltageDesc}>
                <input id="electricalVoltage" type="number" placeholder={t.ph_voltage} />
              </QuestionnaireField>
              <SelectField id="electricalPhase" label={t.phase} options={t.phaseOptions as unknown as string[]} />
              <SelectField id="electricalFreq" label={t.frequency} options={t.frequencyOptions as unknown as string[]} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <SelectField id="classificationSystem" label={t.hazardClassSystem} description={t.hazardClassDesc}
                options={t.hazardSystems as unknown as string[]}
                value={classificationSystem} onChange={e => setClassificationSystem(e.target.value)} />
              {classificationSystem === 'Class/Division' ? (
                <div className="grid grid-cols-2 gap-x-2">
                  <SelectField id="areaDiv" label={t.division} options={t.divisionOptions as unknown as string[]} />
                  <SelectField id="areaGroup" label={t.group} options={t.groupOptions as unknown as string[]} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-2">
                  <SelectField id="areaZone" label={t.zone} options={t.zoneOptions as unknown as string[]} />
                  <SelectField id="areaGasGroup" label={t.gasGroup} options={t.gasGroupOptions as unknown as string[]} />
                </div>
              )}
            </div>
            <div className="col-span-2">
              <SelectField id="electricitySupply" label={t.electricitySupply} description={t.electricitySupplyDesc}
                options={t.electricityOptions as unknown as string[]} />
            </div>
            <div className="col-span-2">
              <SelectField id="internetAccess" label={t.internetAccess} description={t.internetAccessDesc}
                options={t.internetOptions as unknown as string[]} />
            </div>
            <div className="col-span-2">
              <UnitInputField id="instrumentAir" label={t.instrumentAir} description={t.instrumentAirDesc}
                units={['bar', 'PSIG']} placeholder={t.ph_instrumentAir} {...ui('instrumentAir')} />
            </div>
            <div className="col-span-2">
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>{t.coolingWater}</label>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "0.75rem" }}>{t.coolingWaterDesc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", padding: "1rem", border: "1.5px solid #E5E7EB", borderRadius: "0.5rem", backgroundColor: "#F9FAFB" }}>
                <UnitInputField id="coolingWaterFlow" label={t.coolingFlowRate} units={["LPM", "GPM"]} placeholder={t.ph_coolingFlow} {...ui('coolingWaterFlow')} />
                <UnitInputField id="coolingWaterTemp" label={t.temperature} units={['°C', '°F']} placeholder={t.ph_coolingTemp} {...ui('coolingWaterTemp')} />
                <UnitInputField id="coolingWaterPressure" label={t.pressure} units={['bar', 'PSIG']} placeholder={t.ph_coolingPressure} {...ui('coolingWaterPressure')} />
              </div>
            </div>
          </div>
        </fieldset>
      );

      case 7: return (
        <fieldset>
          <legend className="sr-only">{t.s7title}</legend>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <QuestionnaireField label={t.spaceConstraints} description={t.spaceConstraintsDesc}>
              <textarea id="spaceConstraints" rows={3} placeholder={t.ph_spaceConstraints} />
            </QuestionnaireField>
            <QuestionnaireField label={t.constructionEquipment} description={t.constructionEquipmentDesc}>
              <textarea id="constructionEquipment" rows={3} placeholder={t.ph_constructionEquip} />
            </QuestionnaireField>
            <div className="info-box mt-4">
              <svg className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-info-icon)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p>{t.blueprintNote}</p>
            </div>
          </div>
        </fieldset>
      );

      case 8: return (
        <fieldset>
          <legend className="sr-only">{t.s8title}</legend>
          <div className="form-grid">
            <QuestionnaireField label={t.envRegulations} description={t.envRegulationsDesc}>
              <input id="regulations" type="text" placeholder={t.ph_regulations} />
            </QuestionnaireField>
            <UnitInputField id="vocRecovery" label={t.vocRecovery} description={t.vocRecoveryDesc}
              units={['%']} placeholder={t.ph_vocRecovery} {...ui('vocRecovery')} />
          </div>
          <UnitInputField id="noiseLevel" label={t.noiseLevel} description={t.noiseLevelDesc}
            units={['dBA @ 1m', 'dBA @ 3ft']} placeholder={t.ph_noiseLevel} {...ui('noiseLevel')} />
        </fieldset>
      );

      case 9: return (
        <fieldset>
          <legend className="sr-only">{t.s9title}</legend>
          <QuestionnaireField label={t.reportingReqs} description={t.reportingReqsDesc}>
            <textarea id="reportingRequirements" rows={5} placeholder={t.ph_reportingReqs} />
          </QuestionnaireField>
        </fieldset>
      );

      case 10: return (
        <fieldset>
          <legend className="sr-only">{t.s10title}</legend>
          <QuestionnaireField label={t.additionalNotes} description={t.additionalNotesDesc}>
            <textarea id="otherRequirements" rows={6} placeholder={t.ph_additionalNotes} />
          </QuestionnaireField>
        </fieldset>
      );

      default: return null;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div id="detailed-questionnaire-form" className="mt-6">
      {/* Page title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{t.detailedVRUSpec}</h1>
        <p className="mt-2 max-w-2xl mx-auto text-sm" style={{ color: 'var(--color-text-secondary)' }}>{t.detailedVRUSpecDesc}</p>
      </div>

      {/* Card */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #E5E7EB' }}>

        {/* Step header — accent bar + stepper */}
        <div style={{ borderBottom: `3px solid ${brandAccent}`, padding: '1.25rem 1.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: brandAccent, marginBottom: '0.2rem' }}>
                Step {step} of {TOTAL_STEPS}
              </p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                {stepLabels[step - 1]}
              </h2>
            </div>
            {/* Mini progress pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#F3F4F6', borderRadius: '9999px', padding: '0.375rem 0.875rem' }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} style={{
                  width: i + 1 === step ? '1.5rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: i + 1 <= step ? brandAccent : '#D1D5DB',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }} onClick={() => { setStep(i + 1); scrollToTop(); }} />
              ))}
            </div>
          </div>
          <ProgressBar
            step={step} total={TOTAL_STEPS} labels={stepLabels}
            onJump={s => { setStep(s); scrollToTop(); }}
            accent={brandAccent} accentText={brandText}
          />
        </div>

        {/* Step content */}
        <div style={{ padding: '2rem 1.75rem' }}>
          <form onSubmit={e => e.preventDefault()}>
            <div className="step-content">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i + 1} style={{ display: i + 1 === step ? 'block' : 'none' }}>
                  {renderStep(i + 1)}
                </div>
              ))}
            </div>
            <StepNav
              step={step} total={TOTAL_STEPS}
              onBack={goBack} onNext={goNext} onSubmit={handleDownloadPdf}
              isGeneratingPdf={isGeneratingPdf}
              submitLabel={t.downloadPdf} generatingLabel={t.generatingPdf}
              backLabel={lang === 'zh' ? '上一步' : lang === 'ar' ? 'السابق' : 'Back'}
              nextLabel={lang === 'zh' ? '下一步' : lang === 'ar' ? 'التالي' : 'Next'}
              accent={brandAccent} accentText={brandText}
            />
          </form>
        </div>
      </div>

    </div>
  );
};
