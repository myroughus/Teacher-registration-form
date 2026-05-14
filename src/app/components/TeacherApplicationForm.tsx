import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { DateField } from './DateField';
import { StepTracker } from './StepTracker';
import { ProgressBar } from './ProgressBar';
import { FormSection } from './FormSection';
import { FormField } from './FormField';
import { PhotoUpload } from './PhotoUpload';
import { SuccessScreen } from './SuccessScreen';
import { RequiredFieldWrapper } from './RequiredFieldWrapper';

const TOTAL_STEPS = 10;

// Required fields by step for navigation guidance
const STEP_REQUIRED_FIELDS: Record<number, string[]> = {
  1: ['photoUploaded', 'fullNameEnglish', 'fullNameBangla', 'fathersName', 'mothersName', 'dateOfBirth', 'gender', 'maritalStatus', 'nationalId'],
  2: ['mobileNumber', 'alternativeMobile', 'email', 'presentAddress', 'permanentAddress', 'district', 'thana', 'applyingForPost', 'subjectDepartment', 'expectedJoiningDate', 'employmentType'],
  3: ['examDegreeName1', 'groupSubject1', 'boardUniversity1', 'institutionName1', 'passingYear1', 'result1', 'outOf1', 'duration1', 'certificate1', 'examDegreeName2', 'groupSubject2', 'boardUniversity2', 'institutionName2', 'passingYear2', 'result2', 'outOf2', 'duration2', 'certificate2'],
  4: ['ntrcaStatus', 'mpoExperience'],
  5: ['whyWorkWithUs'],
  6: ['preferredSubjects', 'englishProficiency', 'spokenEnglishLevel', 'arabicProficiency', 'spokenArabicLevel'],
  7: ['emergencyContactName', 'emergencyContactNumber', 'emergencyContactRelation'],
  8: ['doc_passportPhoto', 'doc_nationalId', 'doc_birthCertificate', 'doc_signature'],
  9: ['ref1Name', 'ref1Designation', 'ref1Organization', 'ref1Relationship', 'ref1Phone', 'ref1Email'],
  10: ['declareAccuracy', 'declareVerification', 'declareFraud', 'signatureCanvas']
};

// All required fields across all steps
const ALL_REQUIRED_FIELDS = [
  { step: 1, field: 'photoUploaded' },
  { step: 1, field: 'fullNameEnglish' },
  { step: 1, field: 'fullNameBangla' },
  { step: 1, field: 'fathersName' },
  { step: 1, field: 'mothersName' },
  { step: 1, field: 'dateOfBirth' },
  { step: 1, field: 'gender' },
  { step: 1, field: 'maritalStatus' },
  { step: 1, field: 'nationality' },
  { step: 1, field: 'nationalId' },
  { step: 2, field: 'mobileNumber' },
  { step: 2, field: 'alternativeMobile' },
  { step: 2, field: 'email' },
  { step: 2, field: 'presentAddress' },
  { step: 2, field: 'permanentAddress' },
  { step: 2, field: 'district' },
  { step: 2, field: 'thana' },
  { step: 2, field: 'applyingForPost' },
  { step: 2, field: 'subjectDepartment' },
  { step: 2, field: 'expectedJoiningDate' },
  { step: 2, field: 'employmentType' },
  { step: 3, field: 'examDegreeName1' },
  { step: 3, field: 'groupSubject1' },
  { step: 3, field: 'boardUniversity1' },
  { step: 3, field: 'institutionName1' },
  { step: 3, field: 'passingYear1' },
  { step: 3, field: 'result1' },
  { step: 3, field: 'outOf1' },
  { step: 3, field: 'duration1' },
  { step: 3, field: 'certificate1' },
  { step: 3, field: 'examDegreeName2' },
  { step: 3, field: 'groupSubject2' },
  { step: 3, field: 'boardUniversity2' },
  { step: 3, field: 'institutionName2' },
  { step: 3, field: 'passingYear2' },
  { step: 3, field: 'result2' },
  { step: 3, field: 'outOf2' },
  { step: 3, field: 'duration2' },
  { step: 3, field: 'certificate2' },
  { step: 4, field: 'ntrcaStatus' },
  { step: 4, field: 'mpoExperience' },
  { step: 5, field: 'whyWorkWithUs' },
  { step: 6, field: 'preferredSubjects' },
  { step: 6, field: 'englishProficiency' },
  { step: 6, field: 'spokenEnglishLevel' },
  { step: 6, field: 'arabicProficiency' },
  { step: 6, field: 'spokenArabicLevel' },
  { step: 7, field: 'emergencyContactName' },
  { step: 7, field: 'emergencyContactNumber' },
  { step: 7, field: 'emergencyContactRelation' },
  { step: 8, field: 'doc_passportPhoto' },
  { step: 8, field: 'doc_nationalId' },
  { step: 8, field: 'doc_birthCertificate' },
  { step: 8, field: 'doc_signature' },
  { step: 9, field: 'ref1Name' },
  { step: 9, field: 'ref1Designation' },
  { step: 9, field: 'ref1Organization' },
  { step: 9, field: 'ref1Relationship' },
  { step: 9, field: 'ref1Phone' },
  { step: 9, field: 'ref1Email' },
  { step: 10, field: 'declareAccuracy' },
  { step: 10, field: 'declareVerification' },
  { step: 10, field: 'declareFraud' },
  { step: 10, field: 'signatureCanvas' },
];

export function TeacherApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({
    nationality: 'Bangladeshi',
    mobileNumber: '+880',
    alternativeMobile: '+880',
    hasQualifications: 'yes',
    hasTeachingExperience: 'yes',
    hasReferences: true,
    showSecondReference: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{step: number | null; fields: Record<string, boolean>}>({ step: null, fields: {} });
  const [showMissingFieldsPopup, setShowMissingFieldsPopup] = useState(false);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const getMissingRequiredFields = () => {
    return ALL_REQUIRED_FIELDS.filter(({ field }) => {
      if (shouldSkipField(field, formData)) return false;
      return isRequiredFieldEmpty(field, formData[field]);
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    const isEmpty = Array.isArray(value)
      ? value.length === 0
      : isRequiredFieldEmpty(field, value);

    setValidationErrors(prev => ({
      ...prev,
      fields: { ...prev.fields, [field]: isEmpty }
    }));
  };

  const validateCurrentStep = (): { isValid: boolean; emptyFields: string[] } => {
    const requiredFields = STEP_REQUIRED_FIELDS[currentStep] || [];
    const emptyFields: string[] = [];
    
    requiredFields.forEach(field => {
      if (shouldSkipField(field, formData)) return;
      if (isRequiredFieldEmpty(field, formData[field])) {
        emptyFields.push(field);
      }
    });
    
    return { isValid: emptyFields.length === 0, emptyFields };
  };

  const findFirstIncompleteStep = (): number => {
    // Simple heuristic: check if required fields for each step have values
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const requiredFields = STEP_REQUIRED_FIELDS[step];
      if (!requiredFields) continue;
      
      const hasEmptyField = requiredFields.some(field => {
        const value = formData[field];
        return !value || (typeof value === 'string' && value.trim() === '');
      });
      
      if (hasEmptyField) return step;
    }
    return 10; // All steps appear complete
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const missingFields = getMissingRequiredFields();

    if (missingFields.length > 0) {
      const firstMissing = missingFields[0];
      const errorFields: Record<string, boolean> = {};
      missingFields.forEach(({ field }) => {
        errorFields[field] = true;
      });

      setValidationErrors({ step: firstMissing.step, fields: errorFields });
      setShowMissingFieldsPopup(true);
      setCurrentStep(firstMissing.step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors({ step: null, fields: {} });
    setShowMissingFieldsPopup(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToField = (targetStep: number, field: string) => {
    if (targetStep !== currentStep) {
      setCurrentStep(targetStep);
    }

    // Keep popup visible, just highlight the field
    setHighlightedField(field);

    setTimeout(() => {
      const element = document.getElementById(`field-${field}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const focusable = element.querySelector('input, select, textarea, canvas, button') as HTMLElement | null;
        focusable?.focus();
      }
    }, targetStep !== currentStep ? 250 : 80);

    setTimeout(() => {
      setHighlightedField(null);
    }, 3500);
  };

  if (isSubmitted) {
    return <SuccessScreen />;
  }

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '48px 24px 64px' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        {/* Ornamental top line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4))' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(201,169,110,0.4)' }} />
            <span style={{
              fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#8A7250', fontFamily: 'DM Mono, monospace', fontWeight: 400,
            }}>
              শিক্ষক আবেদনপত্র
            </span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(201,169,110,0.4)' }} />
          </div>
          <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, rgba(201,169,110,0.4), transparent)' }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 'clamp(32px, 4.5vw, 48px)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #3B82F6, #F59E0B)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.08em',
          lineHeight: 1.2,
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}>
          Teacher Application
        </h1>
        <div style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(14px, 2vw, 18px)',
          fontWeight: 300,
          color: '#C9A96E',
          letterSpacing: '0.18em',
          fontStyle: 'italic',
          marginBottom: '28px',
        }}>
          Form — আবেদনপত্র
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.25))' }} />
          <div style={{ width: '5px', height: '5px', transform: 'rotate(45deg)', background: 'rgba(201,169,110,0.4)', flexShrink: 0 }} />
          <div style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(90deg, rgba(201,169,110,0.25), transparent)' }} />
        </div>

        <p style={{
          fontSize: '13px', color: '#4A4030', lineHeight: 2, maxWidth: '520px',
          margin: '0 auto', letterSpacing: '0.03em',
          fontFamily: 'Cormorant Garamond, Georgia, serif',
        }}>
          সকল প্রয়োজনীয় তথ্য পূরণ করুন এবং আবেদন জমা দিন।<br />
          Fill out all required fields and submit your application.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '36px' }}>
          {[
            { value: '10', label: 'Steps' },
            { value: '5–7', label: 'Days Review' },
            { value: '100%', label: 'Secure' },
          ].map((item, i) => (
            <div key={item.label} style={{ textAlign: 'center', position: 'relative' }}>
              {i > 0 && (
                <div style={{
                  position: 'absolute', left: '-24px', top: '50%', transform: 'translateY(-50%)',
                  width: '1px', height: '28px', background: 'rgba(201,169,110,0.1)',
                }} />
              )}
              <div style={{
                fontSize: '22px', fontWeight: 300, color: '#C9A96E', lineHeight: 1,
                fontFamily: 'Cormorant Garamond, Georgia, serif', letterSpacing: '0.02em',
              }}>{item.value}</div>
              <div style={{
                fontSize: '8px', color: '#3A3020', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginTop: '6px',
                fontFamily: 'DM Mono, monospace',
              }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Step Tracker ───────────────────────────────── */}
      <StepTracker
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* ── Progress Bar ───────────────────────────────── */}
      <ProgressBar progress={progress} currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {/* ── Missing Fields Popup ───────────────────────── */}
      <MissingFieldsPopup
        allFields={ALL_REQUIRED_FIELDS}
        formData={formData}
        currentStep={currentStep}
        onNavigate={handleNavigateToField}
        onClose={() => setShowMissingFieldsPopup(false)}
        visible={showMissingFieldsPopup}
      />

      {/* ── Form Card ──────────────────────────────────── */}
      <div style={{
        padding: '1px', borderRadius: '2px', marginBottom: '36px',
        background: 'linear-gradient(135deg, rgba(201,169,110,0.22) 0%, rgba(201,169,110,0.05) 35%, rgba(16,22,36,0.7) 100%)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 2px 0 rgba(201,169,110,0.06) inset',
      }}>
        {/* Gold accent top bar */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, #C9A96E, rgba(201,169,110,0.35) 55%, transparent)' }} />
        <div style={{
          background: 'linear-gradient(180deg, #0C1119 0%, #080D14 100%)',
          borderRadius: '0 0 1px 1px', padding: '40px 44px 44px',
        }}>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && <Step1BasicIdentity formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 2 && <Step2ContactJob formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 3 && <Step3Academics formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 4 && <Step4ProfessionalQualifications formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 5 && <Step5TeachingExperience formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 6 && <Step6SuitabilitySkills formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 7 && <Step7PersonalBackground formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 8 && <Step8Documents formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 9 && <Step9References formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
            {currentStep === 10 && <Step10Declaration formData={formData} updateField={updateField} validationErrors={validationErrors.fields} attemptedSubmit={submitAttempted} highlightedField={highlightedField} />}
          </form>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '9px', color: '#3A3020', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step</span>
          <span style={{ fontSize: '20px', fontWeight: 300, color: '#C9A96E', lineHeight: 1, fontFamily: 'Cormorant Garamond, Georgia, serif' }}>{currentStep}</span>
          <span style={{ fontSize: '9px', color: '#3A3020', fontFamily: 'DM Mono, monospace' }}>/ {TOTAL_STEPS}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '2px',
              background: 'transparent',
              border: '1px solid rgba(201,169,110,0.12)',
              color: currentStep === 1 ? '#2A2010' : '#6A6450',
              fontSize: '11px', fontWeight: 400,
              fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 1 ? 0.3 : 1,
              transition: 'all 0.3s ease',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {currentStep < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 28px', borderRadius: '2px',
                background: 'linear-gradient(135deg, #C9A96E 0%, #B8965A 100%)',
                border: '1px solid rgba(201,169,110,0.4)',
                color: '#030508',
                fontSize: '11px', fontWeight: 500,
                fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(201,169,110,0.18)',
                transition: 'all 0.3s ease',
              }}
            >
              Continue
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 32px', borderRadius: '2px',
                background: 'linear-gradient(135deg, #C9A96E 0%, #B8965A 100%)',
                border: '1px solid rgba(201,169,110,0.4)',
                color: '#030508',
                fontSize: '11px', fontWeight: 500,
                fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em',
                cursor: 'pointer',
                boxShadow: '0 6px 32px rgba(201,169,110,0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              Submit Application
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

// Step Components - Props with Validation
interface StepProps {
  formData: Record<string, any>;
  updateField: (field: string, value: any) => void;
  validationErrors: Record<string, boolean>;
  attemptedSubmit: boolean;
  highlightedField?: string | null;
}
function FieldError({ show, message }: { show: boolean; message: string }) {
  return null;
}

function isRequiredFieldEmpty(field: string, value: any): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (!value || (typeof value === 'string' && (value.trim() === '' || value === '-- Select --'))) return true;
  if ((field === 'mobileNumber' || field === 'alternativeMobile') && typeof value === 'string') return value.length < 14;
  return false;
}
function shouldSkipField(field: string, formData: Record<string, any>): boolean {
  if ((field === 'ntrcaStatus' || field === 'mpoExperience') && formData.hasQualifications === 'no') return true;
  if (['englishProficiency','spokenEnglishLevel','arabicProficiency','spokenArabicLevel'].includes(field) && formData.isLanguageProficient !== 'yes') return true;
  if (field === 'preferredSubjects' && (!formData.classesHandled || formData.classesHandled.length === 0)) return true;
  if (['ref1Name','ref1Designation','ref1Organization','ref1Relationship','ref1Phone','ref1Email'].includes(field) && formData.hasReferences === false) return true;
  return false;
}
const FIELD_LABELS: Record<string, string> = {
  photoUploaded:'Passport-size Photo',fullNameEnglish:'Full Name (English)',fullNameBangla:'Full Name (Bangla)',
  fathersName:"Father's Name",mothersName:"Mother's Name",dateOfBirth:'Date of Birth',gender:'Gender',
  maritalStatus:'Marital Status',nationality:'Nationality',nationalId:'National ID Number',
  mobileNumber:'Mobile Number',alternativeMobile:'Alternative Mobile Number',email:'Email Address',
  presentAddress:'Present Address',permanentAddress:'Permanent Address',district:'District',thana:'Thana / Upazila',
  applyingForPost:'Applying For Post',subjectDepartment:'Subject / Department',expectedJoiningDate:'Expected Joining Date',
  employmentType:'Employment Type',examDegreeName1:'Exam / Degree (1st)',groupSubject1:'Group / Subject (1st)',
  boardUniversity1:'Board / University (1st)',institutionName1:'Institution Name (1st)',passingYear1:'Passing Year (1st)',
  result1:'Result / GPA (1st)',outOf1:'Out Of (1st)',duration1:'Duration (1st)',certificate1:'Certificate (1st)',
  examDegreeName2:'Exam / Degree (2nd)',groupSubject2:'Group / Subject (2nd)',boardUniversity2:'Board / University (2nd)',
  institutionName2:'Institution Name (2nd)',passingYear2:'Passing Year (2nd)',result2:'Result / GPA (2nd)',
  outOf2:'Out Of (2nd)',duration2:'Duration (2nd)',certificate2:'Certificate (2nd)',
  ntrcaStatus:'NTRCA Registration Status',mpoExperience:'MPO Experience',whyWorkWithUs:'Why work with us?',
  emergencyContactName:'Emergency Contact Person',emergencyContactNumber:'Emergency Contact Number',
  emergencyContactRelation:'Emergency Contact Relation',preferredSubjects:'Preferred Subjects to Teach',
  englishProficiency:'English Proficiency',spokenEnglishLevel:'Spoken English Level',
  arabicProficiency:'Arabic Proficiency',spokenArabicLevel:'Spoken Arabic Level',
  doc_passportPhoto:'Passport-size Photo (Document)',doc_nationalId:'National ID Copy',
  doc_birthCertificate:'Birth Certificate',doc_signature:'Signature Upload',
  ref1Name:'Reference 1 – Full Name',ref1Designation:'Reference 1 – Designation',
  ref1Organization:'Reference 1 – Organization',ref1Relationship:'Reference 1 – Relationship',
  ref1Phone:'Reference 1 – Phone Number',ref1Email:'Reference 1 – Email',
  declareAccuracy:'Declaration: Accuracy',declareVerification:'Declaration: Consent to Verification',
  declareFraud:'Declaration: No Fraudulent Documents',signatureCanvas:'Applicant Signature',
};
const STEP_NAMES: Record<number, string> = {1:'Basic Identity',2:'Contact & Job',3:'Academics',4:'Professional',5:'Teaching Experience',6:'Skills',7:'Personal Background',8:'Documents',9:'References',10:'Declaration'};
const CRITICAL_FIELDS = new Set(['photoUploaded','fullNameEnglish','nationalId','dateOfBirth','gender','mobileNumber','email','signatureCanvas','declareAccuracy','declareVerification','declareFraud']);

function MissingFieldsPopup({allFields,formData,currentStep,onNavigate,onClose,visible}:{allFields:Array<{step:number;field:string}>;formData:Record<string,any>;currentStep:number;onNavigate:(step:number,field:string)=>void;onClose:()=>void;visible:boolean}) {
  const [isCollapsed,setIsCollapsed]=useState(false);
  const [justCompleted,setJustCompleted]=useState<string[]>([]);
  const [collapsedSteps,setCollapsedSteps]=useState<Set<number>>(new Set());
  const [searchQuery,setSearchQuery]=useState('');
  const [isShaking,setIsShaking]=useState(false);
  const [confettiFired,setConfettiFired]=useState(false);
  const prevMissingRef=useRef<string[]>([]);
  const prevVisibleRef=useRef(false);
  const [pos,setPos]=useState(()=>({x:typeof window!=='undefined'?window.innerWidth-340:0,y:88}));
  const dragRef=useRef<{startX:number;startY:number;startPosX:number;startPosY:number}|null>(null);
  const panelRef=useRef<HTMLDivElement>(null);
  const isDraggingRef=useRef(false);
  const [isDragging,setIsDragging]=useState(false);
  const missingFields=allFields.filter(({field})=>{if(shouldSkipField(field,formData))return false;return isRequiredFieldEmpty(field,formData[field]);});
  const total=missingFields.length;
  const filledCount=allFields.length-total;
  const completionPct=(filledCount/allFields.length)*100;
  useEffect(()=>{if(visible&&!prevVisibleRef.current&&total>0){setIsShaking(true);const t=setTimeout(()=>setIsShaking(false),600);prevVisibleRef.current=true;return()=>clearTimeout(t);}if(!visible)prevVisibleRef.current=false;},[visible,total]);
  useEffect(()=>{const prevMissing=prevMissingRef.current;const currentMissing=missingFields.map(f=>f.field);const newlyDone=prevMissing.filter(f=>!currentMissing.includes(f));if(newlyDone.length>0){setJustCompleted(prev=>[...prev,...newlyDone]);setTimeout(()=>{setJustCompleted(prev=>prev.filter(f=>!newlyDone.includes(f)));},650);}prevMissingRef.current=currentMissing;},[formData]);
  useEffect(()=>{if(visible&&total===0&&!confettiFired){setConfettiFired(true);import('canvas-confetti').then(({default:confetti})=>{confetti({particleCount:90,spread:65,origin:{y:0.5},colors:['#C9A96E','#E2C994','#B8965A','#8A7250']});});}if(!visible)setConfettiFired(false);},[total,visible,confettiFired]);
  useEffect(()=>{if(visible&&total===0){const timer=setTimeout(()=>onClose(),2000);return()=>clearTimeout(timer);}},[total,visible,onClose]);
  useEffect(()=>{if(!visible)return;const handleKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',handleKey);return()=>window.removeEventListener('keydown',handleKey);},[visible,onClose]);
  const onMouseDown=(e:React.MouseEvent)=>{if((e.target as HTMLElement).closest('button, input'))return;isDraggingRef.current=false;dragRef.current={startX:e.clientX,startY:e.clientY,startPosX:pos.x,startPosY:pos.y};const onMouseMove=(ev:MouseEvent)=>{if(!dragRef.current)return;const dx=ev.clientX-dragRef.current.startX;const dy=ev.clientY-dragRef.current.startY;if(Math.abs(dx)>3||Math.abs(dy)>3){isDraggingRef.current=true;setIsDragging(true);}const newX=Math.max(0,Math.min(window.innerWidth-320,dragRef.current.startPosX+dx));const newY=Math.max(0,Math.min(window.innerHeight-60,dragRef.current.startPosY+dy));setPos({x:newX,y:newY});};const onMouseUp=()=>{dragRef.current=null;isDraggingRef.current=false;setIsDragging(false);window.removeEventListener('mousemove',onMouseMove);window.removeEventListener('mouseup',onMouseUp);};window.addEventListener('mousemove',onMouseMove);window.addEventListener('mouseup',onMouseUp);};
  if(!visible)return null;
  const filteredMissing=searchQuery.trim()?missingFields.filter(({field})=>(FIELD_LABELS[field]||field).toLowerCase().includes(searchQuery.toLowerCase())):missingFields;
  const groupedByStep:Record<number,Array<{step:number;field:string;globalIndex:number}>>={};
  filteredMissing.forEach((item,i)=>{if(!groupedByStep[item.step])groupedByStep[item.step]=[];groupedByStep[item.step].push({...item,globalIndex:i});});
  const barColor=completionPct>=80?'#C9A96E':completionPct>=50?'#E2C994':'#B87070';
  const hasManyMissing=total>10;
  const circumference=2*Math.PI*9;
  const outerClasses=['mfp-outer',isShaking?'mfp-shake':'',hasManyMissing&&!isShaking?'mfp-pulse-glow':'',total>0&&!isDragging&&!isShaking?'mfp-float-anim':''].filter(Boolean).join(' ');
  const content=(
    <div ref={panelRef} style={{position:'fixed',left:`${pos.x}px`,top:`${pos.y}px`,zIndex:9999,width:'310px',fontFamily:'inherit',animation:'missingPopupSlideIn 0.32s cubic-bezier(0.16,1,0.3,1) both'}}>
      <div className={outerClasses} style={{padding:'1px',borderRadius:'2px',boxShadow:'0 24px 64px rgba(0,0,0,0.7)'}}>
        <div style={{background:'rgba(8,13,20,0.96)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderRadius:'1px',overflow:'hidden',userSelect:'none'}}>
          <div onMouseDown={onMouseDown} style={{padding:'14px 14px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'grab',borderBottom:isCollapsed?'none':'1px solid rgba(201,169,110,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'4px',padding:'2px',flexShrink:0}}>
                {[1,0.65,0.9].map((opacity,i)=>(<div key={i} style={{width:'18px',height:'2px',borderRadius:'2px',background:'linear-gradient(90deg,#C9A96E,#E2C994)',opacity}} />))}
              </div>
              <div>
                <div style={{fontSize:'12px',fontWeight:500,color:'#C8C4BC',letterSpacing:'0.01em',fontFamily:'DM Mono, monospace'}}>{total>0?`${total} field${total!==1?'s':''} required`:'✓ All fields complete!'}</div>
                <div style={{fontSize:'9px',color:'#3A3020',marginTop:'2px',fontFamily:'DM Mono, monospace',letterSpacing:'0.06em'}}>{filledCount}/{allFields.length} completed · Esc to close</div>
              </div>
            </div>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}} onMouseDown={e=>e.stopPropagation()}>
              <button className="mfp-btn" onClick={()=>setIsCollapsed(c=>!c)} title={isCollapsed?'Expand panel':'Collapse panel'} style={{width:'26px',height:'26px',borderRadius:'4px',border:'1px solid rgba(201,169,110,0.1)',background:'rgba(201,169,110,0.04)',color:'#4A4030',cursor:'pointer',fontSize:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}>{isCollapsed?'▼':'▲'}</button>
              <button className="mfp-btn" onClick={onClose} title="Close (Esc)" style={{width:'26px',height:'26px',borderRadius:'4px',border:'1px solid rgba(201,80,80,0.28)',background:'rgba(201,80,80,0.07)',color:'#C96060',cursor:'pointer',fontSize:'16px',lineHeight:1,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
            </div>
          </div>
          <div style={{height:'1px',background:'rgba(0,0,0,0.4)'}}>
            <div className="mfp-progress-bar" style={{height:'100%',width:`${completionPct}%`,'--mfp-bar-color':barColor,borderRadius:'0 3px 3px 0'} as React.CSSProperties} />
          </div>
          <div className={`mfp-accordion${isCollapsed?' collapsed':''}`} style={{maxHeight:isCollapsed?'0':'460px'}}>
            {total>8&&(<div style={{padding:'8px 12px 4px'}} onMouseDown={e=>e.stopPropagation()}><input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Filter fields..." style={{width:'100%',padding:'6px 10px',background:'rgba(201,169,110,0.04)',border:'1px solid rgba(201,169,110,0.1)',color:'#C8C4BC',fontSize:'10px',outline:'none',boxSizing:'border-box',fontFamily:'DM Mono, monospace'}} /></div>)}
            <div className="mfp-scroll" style={{maxHeight:'370px',overflowY:'auto',padding:'4px 0 8px'}}>
              {Object.entries(groupedByStep).map(([stepStr,items])=>{
                const stepNum=parseInt(stepStr,10);const stepCollapsed=collapsedSteps.has(stepNum);const isStepCurrent=stepNum===currentStep;const stepName=STEP_NAMES[stepNum]||`Step ${stepNum}`;
                return(<div key={stepStr}>
                  <div onClick={()=>setCollapsedSteps(prev=>{const next=new Set(prev);if(next.has(stepNum))next.delete(stepNum);else next.add(stepNum);return next;})} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px 4px',cursor:'pointer',userSelect:'none'}}>
                    <span style={{fontSize:'11px'}}>⚠️</span>
                    <span style={{flex:1,fontSize:'10px',fontWeight:700,color:isStepCurrent?'#C9A96E':'#3A3020',textTransform:'uppercase',letterSpacing:'0.07em'}}>Step {stepNum} — {stepName}<span style={{fontWeight:400,marginLeft:'4px'}}>({items.length})</span></span>
                    <span style={{fontSize:'9px',color:'#3A3020'}}>{stepCollapsed?'▶':'▼'}</span>
                  </div>
                  {!stepCollapsed&&items.map(({step,field,globalIndex})=>{
                    const isOnCurrentStep=step===currentStep;const isJustDone=justCompleted.includes(field);const isCritical=CRITICAL_FIELDS.has(field);const ringFill=circumference*((total-globalIndex)/total)*0.72;
                    return(<div key={`${step}-${field}`} className={`mfp-item${isJustDone?' mfp-item-done':''}`} onClick={()=>!isJustDone&&onNavigate(step,field)} title={`Step ${stepNum} — ${stepName}${isCritical?' · Critical field':' · Required field'}`} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 14px',cursor:'pointer',background:isOnCurrentStep?'rgba(201,169,110,0.06)':'transparent',animation:`mfpFieldIn 0.3s ease ${globalIndex*0.04}s both`}}>
                      <div style={{position:'relative',width:'22px',height:'22px',flexShrink:0}}>
                        <svg width="22" height="22" style={{position:'absolute',top:0,left:0}}>
                          <circle cx="11" cy="11" r="9" fill="none" stroke="rgba(201,169,110,0.1)" strokeWidth="1.5"/>
                          <circle cx="11" cy="11" r="9" fill="none"
                                  stroke={isOnCurrentStep?'#C9A96E':isCritical?'#C96060':'#2A2010'}
                                  strokeWidth="1.5" strokeDasharray={String(circumference)} strokeDashoffset={String(circumference-ringFill)} strokeLinecap="round" transform="rotate(-90 11 11)" style={{transition:'stroke-dashoffset 0.4s ease,stroke 0.2s ease'}}/>
                        </svg>
                        <div style={{position:'absolute',top:0,left:0,width:'22px',height:'22px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:isOnCurrentStep?'#C9A96E':isCritical?'#C96060':'#3A3020'}}>{globalIndex+1}</div>
                      </div>
                      <span style={{flex:1,fontSize:'12px',color:isOnCurrentStep?'#C8C4BC':'#5A5650',fontFamily:'Cormorant Garamond, Georgia, serif',lineHeight:1.3}}>{FIELD_LABELS[field]||field}</span>
                      {isCritical&&(<span style={{fontSize:'8px',padding:'2px 5px',borderRadius:'4px',background:'rgba(201,80,80,0.1)',color:'#C96060',fontWeight:700,letterSpacing:'0.04em',whiteSpace:'nowrap'}}>CRITICAL</span>)}
                      {!isOnCurrentStep&&!isCritical&&(<span style={{fontSize:'9px',padding:'2px 6px',borderRadius:'5px',background:'rgba(20,16,10,0.8)',color:'#3A3020',fontWeight:600,letterSpacing:'0.04em',whiteSpace:'nowrap'}}>Step {step}</span>)}
                    </div>);
                  })}
                </div>);
              })}
              {filteredMissing.length===0&&total>0&&(<div style={{padding:'16px 14px',textAlign:'center',color:'#3A3020',fontSize:'12px',fontFamily:'DM Mono, monospace'}}>No fields match your search.</div>)}
              {total===0&&(<div className="mfp-all-done" style={{padding:'22px 14px',textAlign:'center',color:'#C9A96E',fontSize:'14px',fontFamily:'Cormorant Garamond, Georgia, serif',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}><span style={{fontSize:'20px'}}>✓</span>All required fields completed!</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if(typeof document==='undefined')return null;
  return createPortal(content,document.body);
}

function Step1BasicIdentity({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];
  const isHighlighted = (fieldName: string) => highlightedField === fieldName;
  
  // Required fields for Step 1
  const requiredFields = ['photoUploaded', 'fullNameEnglish', 'fullNameBangla', 'fathersName', 'mothersName', 'dateOfBirth', 'gender', 'maritalStatus', 'nationalId'];

  return (
    <>
      <FormSection title="Basic Identity · ব্যক্তিগত পরিচয়" icon="👤">
        {/* Photo Upload Section */}
        <RequiredFieldWrapper
          fieldId="field-photoUploaded"
          hasError={showError('photoUploaded')}
          isHighlighted={isHighlighted('photoUploaded')}
          required={true}
        >
          <PhotoUpload onUpload={(val) => updateField('photoUploaded', val)} />
          <FieldError show={showError('photoUploaded')} message="Passport-size photo is required" />
        </RequiredFieldWrapper>

        {/* Divider */}
        <div className="border-t border-[rgba(201,169,110,0.08)] my-2" />

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RequiredFieldWrapper
            fieldId="field-fullNameEnglish"
            hasError={showError('fullNameEnglish')}
            isHighlighted={isHighlighted('fullNameEnglish')}
            required={true}
          >
            <FormField
              label="Full Name (English)"
              sublabel="পূর্ণ নাম (ইংরেজি)"
              placeholder="As per National ID"
              required
              value={formData.fullNameEnglish || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('fullNameEnglish', e.target.value)}
              hasError={showError('fullNameEnglish')}
            />
            <FieldError show={showError('fullNameEnglish')} message="Full name is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper
            fieldId="field-fullNameBangla"
            hasError={showError('fullNameBangla')}
            isHighlighted={isHighlighted('fullNameBangla')}
            required={true}
          >
            <FormField
              label="পূর্ণ নাম (বাংলা)"
              sublabel="Full Name (Bangla)"
              placeholder="বাংলায় লিখুন"
              bengali
              required
              value={formData.fullNameBangla || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('fullNameBangla', e.target.value)}
              hasError={showError('fullNameBangla')}
            />
            <FieldError show={showError('fullNameBangla')} message="Bangla name is required" />
          </RequiredFieldWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RequiredFieldWrapper
            fieldId="field-fathersName"
            hasError={showError('fathersName')}
            isHighlighted={isHighlighted('fathersName')}
            required={true}
          >
            <FormField
              label="Father's Name"
              sublabel="পিতার নাম"
              placeholder="Father's full name"
              required
              pattern="[A-Za-z\s\.\-']+"
              title="Please enter English characters only"
              value={formData.fathersName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('fathersName', e.target.value)}
              hasError={showError('fathersName')}
            />
            <p className="text-[#4A4030] text-[10px] mt-0.5">English characters only</p>
            <FieldError show={showError('fathersName')} message="Father's name is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper
            fieldId="field-mothersName"
            hasError={showError('mothersName')}
            isHighlighted={isHighlighted('mothersName')}
            required={true}
          >
            <FormField
              label="Mother's Name"
              sublabel="মাতার নাম"
              placeholder="Mother's full name"
              required
              pattern="[A-Za-z\s\.\-']+"
              title="Please enter English characters only"
              value={formData.mothersName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('mothersName', e.target.value)}
              hasError={showError('mothersName')}
            />
            <p className="text-[#4A4030] text-[10px] mt-0.5">English characters only</p>
            <FieldError show={showError('mothersName')} message="Mother's name is required" />
          </RequiredFieldWrapper>
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(201,169,110,0.08)] my-2" />

        {/* Identity Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RequiredFieldWrapper
            fieldId="field-dateOfBirth"
            hasError={showError('dateOfBirth')}
            isHighlighted={isHighlighted('dateOfBirth')}
            required={true}
          >
            <DateField
              label="Date of Birth"
              sublabel="জন্ম তারিখ"
              required
              value={formData.dateOfBirth || ''}
              onChange={(value: string) => updateField('dateOfBirth', value)}
            />
            <FieldError show={showError('dateOfBirth')} message="Date of birth is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper
            fieldId="field-gender"
            hasError={showError('gender')}
            isHighlighted={isHighlighted('gender')}
            required={true}
          >
            <FormField
              label="Gender"
              sublabel="লিঙ্গ"
              type="select"
              options={['', 'Male', 'Female', 'Other']}
              required
              value={formData.gender || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('gender', e.target.value)}
              hasError={showError('gender')}
            />
            <FieldError show={showError('gender')} message="Gender is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper
            fieldId="field-maritalStatus"
            hasError={showError('maritalStatus')}
            isHighlighted={isHighlighted('maritalStatus')}
            required={true}
          >
            <FormField
              label="Marital Status"
              sublabel="বৈবাহিক অবস্থা"
              type="select"
              options={['', 'Single', 'Married', 'Divorced', 'Widowed']}
              required
              value={formData.maritalStatus || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('maritalStatus', e.target.value)}
              hasError={showError('maritalStatus')}
            />
            <FieldError show={showError('maritalStatus')} message="Marital status is required" />
          </RequiredFieldWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RequiredFieldWrapper
            fieldId="field-nationality"
            hasError={showError('nationality')}
            isHighlighted={isHighlighted('nationality')}
            required={true}
          >
            <FormField
              label="Nationality"
              sublabel="জাতীয়তা"
              placeholder="e.g., Bangladeshi"
              defaultValue="Bangladeshi"
              required
              value={formData.nationality || 'Bangladeshi'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('nationality', e.target.value)}
              hasError={showError('nationality')}
            />
            <FieldError show={showError('nationality')} message="Nationality is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper
            fieldId="field-nationalId"
            hasError={showError('nationalId')}
            isHighlighted={isHighlighted('nationalId')}
            required={true}
          >
            <FormField
              label="National ID Number"
              sublabel="জাতীয় পরিচয়পত্র নম্বর"
              placeholder="NID Number"
              maxLength={17}
              required
              value={formData.nationalId || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('nationalId', e.target.value)}
              hasError={showError('nationalId')}
            />
            <FieldError show={showError('nationalId')} message="National ID is required" />
          </RequiredFieldWrapper>
        </div>

        <FormField
          label="Birth Registration Number"
          sublabel="জন্ম নিবন্ধন নম্বর (Optional)"
          placeholder="17-digit number"
          maxLength={17}
          value={formData.birthRegistrationNumber || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('birthRegistrationNumber', e.target.value)}
        />
      </FormSection>
    </>
  );
}

function Step2ContactJob({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];
  const getFieldWrapperClass = (fieldName: string) => {
    if (highlightedField === fieldName) return 'p-3 bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.4)] rounded-lg shadow-[0_0_24px_rgba(201,169,110,0.12),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out';
    if (showError(fieldName)) return 'p-3 rounded-lg border border-[rgba(248,92,92,0.4)] bg-[rgba(248,92,92,0.04)] shadow-[0_4px_12px_rgba(248,92,92,0.08)] transition-all duration-200';
    return '';
  };

  const handleMobileChange = (field: string, rawValue: string) => {
    const prefix = '+880';
    let val = rawValue;
    if (!val.startsWith(prefix)) {
      val = prefix + val.replace(/^\+880/, '');
    }
    if (val.length > 14) val = val.slice(0, 14);
    updateField(field, val);
  };

  return (
    <>
      <FormSection title="Contact Information · যোগাযোগের তথ্য" icon="📞">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RequiredFieldWrapper fieldId="field-mobileNumber" required={true} hasError={showError('mobileNumber')} isHighlighted={highlightedField === 'mobileNumber'}>
            <FormField label="Mobile Number" sublabel="মোবাইল নম্বর" type="tel" placeholder="+880 1X-XXXX-XXXX" required value={formData.mobileNumber || '+880'} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMobileChange('mobileNumber', e.target.value)} maxLength={14} hasError={showError('mobileNumber')} />
            <FieldError show={showError('mobileNumber')} message="Must be a valid Bangladesh number starting with +880 (e.g. +8801XXXXXXXXX)" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-alternativeMobile" required={true} hasError={showError('alternativeMobile')} isHighlighted={highlightedField === 'alternativeMobile'}>
            <FormField label="Alternative Mobile" sublabel="বিকল্প মোবাইল" type="tel" placeholder="+880 1X-XXXX-XXXX" required value={formData.alternativeMobile || '+880'} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMobileChange('alternativeMobile', e.target.value)} maxLength={14} hasError={showError('alternativeMobile')} />
            <FieldError show={showError('alternativeMobile')} message="Must be a valid Bangladesh number starting with +880 (e.g. +8801XXXXXXXXX)" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-email" required={true} hasError={showError('email')} isHighlighted={highlightedField === 'email'}>
            <FormField label="Email Address" sublabel="ইমেইল" type="email" placeholder="teacher@example.com" required value={formData.email || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)} hasError={showError('email')} />
            <FieldError show={showError('email')} message="Email is required" />
          </RequiredFieldWrapper>
        </div>

        <RequiredFieldWrapper fieldId="field-presentAddress" required={true} hasError={showError('presentAddress')} isHighlighted={highlightedField === 'presentAddress'}>
          <FormField label="Present Address" sublabel="বর্তমান ঠিকানা" type="textarea" placeholder="House, Road, Area..." rows={3} required value={formData.presentAddress || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('presentAddress', e.target.value)} hasError={showError('presentAddress')} />
          <FieldError show={showError('presentAddress')} message="Present address is required" />
        </RequiredFieldWrapper>

        <RequiredFieldWrapper fieldId="field-permanentAddress" required={true} hasError={showError('permanentAddress')} isHighlighted={highlightedField === 'permanentAddress'}>
          <FormField label="Permanent Address" sublabel="স্থায়ী ঠিকানা" type="textarea" placeholder="House, Road, Area..." rows={3} required value={formData.permanentAddress || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('permanentAddress', e.target.value)} hasError={showError('permanentAddress')} />
          <FieldError show={showError('permanentAddress')} message="Permanent address is required" />
        </RequiredFieldWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RequiredFieldWrapper fieldId="field-district" required={true} hasError={showError('district')} isHighlighted={highlightedField === 'district'}>
            <FormField label="District" sublabel="জেলা" type="select" options={['', 'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Comilla', 'Mymensingh', 'Rangpur', 'Gazipur', 'Narayanganj', 'Tangail', 'Jessore', 'Bogra', 'Dinajpur', 'Other']} required value={formData.district || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('district', e.target.value)} hasError={showError('district')} />
            <FieldError show={showError('district')} message="District is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-thana" required={true} hasError={showError('thana')} isHighlighted={highlightedField === 'thana'}>
            <FormField label="Thana / Upazila" sublabel="থানা / উপজেলা" placeholder="Thana or Upazila name" required value={formData.thana || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('thana', e.target.value)} hasError={showError('thana')} />
            <FieldError show={showError('thana')} message="Thana / Upazila is required" />
          </RequiredFieldWrapper>
          <FormField label="Post Code" sublabel="পোস্টাল কোড" placeholder="e.g. 1207" maxLength={6} value={formData.postCode || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('postCode', e.target.value)} />
        </div>
      </FormSection>

      <FormSection title="Job Application Details · পদের তথ্য" icon="💼">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RequiredFieldWrapper fieldId="field-applyingForPost" required={true} hasError={showError('applyingForPost')} isHighlighted={highlightedField === 'applyingForPost'}>
            <FormField label="Applying For Post" sublabel="পদের নাম" type="select" options={['', 'Assistant Teacher', 'Senior Teacher', 'Subject Teacher', 'Lecturer', 'Senior Lecturer', 'Head of Department', 'Lab Assistant']} required value={formData.applyingForPost || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('applyingForPost', e.target.value)} hasError={showError('applyingForPost')} />
            <FieldError show={showError('applyingForPost')} message="Applying post is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-subjectDepartment" required={true} hasError={showError('subjectDepartment')} isHighlighted={highlightedField === 'subjectDepartment'}>
            <FormField label="Subject / Department" sublabel="বিষয় / বিভাগ" type="select" options={['', 'Bangla', 'English', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics', 'Accounting', 'Finance', 'Business Studies', 'Computer Science', 'ICT', 'Islamic Studies', 'Hindi', 'Arts', 'Physical Education', 'Other']} required value={formData.subjectDepartment || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('subjectDepartment', e.target.value)} hasError={showError('subjectDepartment')} />
            <FieldError show={showError('subjectDepartment')} message="Subject / Department is required" />
          </RequiredFieldWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RequiredFieldWrapper fieldId="field-expectedJoiningDate" required={true} hasError={showError('expectedJoiningDate')} isHighlighted={highlightedField === 'expectedJoiningDate'}>
            <DateField label="Expected Joining Date" sublabel="যোগদানের তারিখ" required value={formData.expectedJoiningDate || ''} onChange={(value) => updateField('expectedJoiningDate', value)} hasError={showError('expectedJoiningDate')} />
            <FieldError show={showError('expectedJoiningDate')} message="Expected joining date is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-employmentType" required={true} hasError={showError('employmentType')} isHighlighted={highlightedField === 'employmentType'}>
            <FormField label="Employment Type" sublabel="চাকরির ধরন" type="select" options={['', 'Full-time', 'Part-time', 'Contractual']} required value={formData.employmentType || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('employmentType', e.target.value)} hasError={showError('employmentType')} />
            <FieldError show={showError('employmentType')} message="Employment type is required" />
          </RequiredFieldWrapper>
        </div>
      </FormSection>
    </>
  );
}

function Step3Academics({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];

  return (
    <FormSection title="Academic Qualifications · শিক্ষাগত যোগ্যতা" icon="🎓">
      {/* Qualification #1 - SSC (Default) */}
      <div className="mb-6 p-5 bg-[#090E16] border border-[rgba(201,169,110,0.1)] rounded-lg">
        <h3 className="text-[11px] tracking-[0.1em] uppercase text-[#C9A96E] mb-4">Qualification #1</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RequiredFieldWrapper fieldId="field-examDegreeName1" required={true} hasError={showError('examDegreeName1')} isHighlighted={highlightedField === 'examDegreeName1'}>
            <FormField
              label="Exam / Degree Name"
              sublabel="পরীক্ষা / ডিগ্রি"
              type="select"
              options={['-- Select --', 'SSC', 'HSC', 'Dakhil', 'Alim', 'Fazil', 'Kamil', 'Diploma', 'Honours / B.A. / B.Sc. / B.Com', 'Masters / M.A. / M.Sc. / M.Com', 'B.Ed', 'M.Ed', 'Ph.D', 'Other']}
              required
              value={formData.examDegreeName1 || '-- Select --'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('examDegreeName1', e.target.value)}
              hasError={showError('examDegreeName1')}
            />
            <FieldError show={showError('examDegreeName1')} message="Qualification #1 is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-groupSubject1" required={true} hasError={showError('groupSubject1')} isHighlighted={highlightedField === 'groupSubject1'}>
            <FormField
              label="Group / Subject"
              sublabel="বিভাগ / বিষয়"
              placeholder="e.g. Science, Arts, Mathematics"
              required
              value={formData.groupSubject1 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('groupSubject1', e.target.value)}
              hasError={showError('groupSubject1')}
            />
            <FieldError show={showError('groupSubject1')} message="Group / Subject is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-boardUniversity1" required={true} hasError={showError('boardUniversity1')} isHighlighted={highlightedField === 'boardUniversity1'}>
            <FormField
              label="Board / University"
              sublabel="বোর্ড / বিশ্ববিদ্যালয়"
              placeholder="Board or University name"
              required
              value={formData.boardUniversity1 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('boardUniversity1', e.target.value)}
              hasError={showError('boardUniversity1')}
            />
            <FieldError show={showError('boardUniversity1')} message="Board / University is required" />
          </RequiredFieldWrapper>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <RequiredFieldWrapper fieldId="field-institutionName1" required={true} hasError={showError('institutionName1')} isHighlighted={highlightedField === 'institutionName1'}>
            <FormField
              label="Institution Name"
              sublabel="প্রতিষ্ঠানের নাম"
              placeholder="School / College / University"
              required
              value={formData.institutionName1 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('institutionName1', e.target.value)}
              hasError={showError('institutionName1')}
            />
            <FieldError show={showError('institutionName1')} message="Institution name is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-passingYear1" required={true} hasError={showError('passingYear1')} isHighlighted={highlightedField === 'passingYear1'}>
            <FormField
              label="Passing Year"
              sublabel="পাশের সাল"
              type="number"
              placeholder="e.g. 2015"
              min={1970}
              max={2030}
              required
              value={formData.passingYear1 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('passingYear1', e.target.value)}
              hasError={showError('passingYear1')}
            />
            <FieldError show={showError('passingYear1')} message="Passing year is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-result1" required={true} hasError={showError('result1')} isHighlighted={highlightedField === 'result1'}>
            <FormField
              label="Result / GPA / CGPA"
              sublabel="ফলাফল / জিপিএ"
              placeholder="e.g. GPA 5.00 / A+ / Division 1"
              required
              value={formData.result1 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('result1', e.target.value)}
              hasError={showError('result1')}
            />
            <FieldError show={showError('result1')} message="Result is required" />
          </RequiredFieldWrapper>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 items-start">
          <RequiredFieldWrapper fieldId="field-outOf1" required={true} hasError={showError('outOf1')} isHighlighted={highlightedField === 'outOf1'}>
            <FormField
              label="Out Of"
              sublabel="সর্বোচ্চ নম্বর"
              placeholder="e.g. 5.00 / 4.00 / 800"
              required
              value={formData.outOf1 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('outOf1', e.target.value)}
              hasError={showError('outOf1')}
            />
            <FieldError show={showError('outOf1')} message="Out Of is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-duration1" required={true} hasError={showError('duration1')} isHighlighted={highlightedField === 'duration1'}>
            <FormField
              label="Duration"
              sublabel="মেয়াদকাল"
              placeholder="e.g. 2 years / 4 semesters"
              required
              value={formData.duration1 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('duration1', e.target.value)}
              hasError={showError('duration1')}
            />
            <FieldError show={showError('duration1')} message="Duration is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-certificate1" required={true} hasError={showError('certificate1')} isHighlighted={highlightedField === 'certificate1'}>
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2 leading-tight">
              Certificate Upload <span className="text-[#f85c5c]">*</span><br/>সনদ যুক্ত করুন
            </label>
            <div className={`flex-1 relative flex flex-col items-center justify-center gap-2 w-full min-h-[100px] px-4 py-4 border-2 border-dashed rounded-lg hover:border-[rgba(201,169,110,0.35)] hover:bg-[#0C1119] transition-all bg-[#0A0F1A] ${showError('certificate1') ? 'border-[rgba(248,92,92,0.5)]' : 'border-[rgba(201,169,110,0.1)]'}`}>
              <input
                type="file"
                accept=".pdf,image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => updateField('certificate1', e.target.files?.[0]?.name || '')}
              />
              <span className="text-[16px]">📎</span>
              <span className="text-[11px] text-[#4A4030]">{formData.certificate1 ? formData.certificate1 : 'Browse file'}</span>
            </div>
            <FieldError show={showError('certificate1')} message="Certificate is required" />
          </RequiredFieldWrapper>
          <div className="h-full flex flex-col">
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2 leading-tight">
              Transcript/Marksheet<br/>ট্রান্সক্রিপ্ট/মার্কশিট
            </label>
            <div className="flex-1 relative flex flex-col items-center justify-center gap-2 w-full min-h-[100px] px-4 py-4 border-2 border-dashed border-[rgba(201,169,110,0.1)] rounded-lg hover:border-[rgba(201,169,110,0.35)] hover:bg-[#0C1119] transition-all bg-[#0A0F1A]">
              <input
                type="file"
                accept=".pdf,image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-[16px]">📄</span>
              <span className="text-[11px] text-[#4A4030]">Browse file</span>
            </div>
          </div>
        </div>
      </div>

      {/* Qualification #2 - HSC (Default) */}
      <div className="mb-6 p-5 bg-[#090E16] border border-[rgba(201,169,110,0.1)] rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] tracking-[0.1em] uppercase text-[#C9A96E]">Qualification #2</h3>
          <button className="w-6 h-6 rounded-full border border-[rgba(240,113,113,0.3)] bg-[rgba(240,113,113,0.15)] text-[#f07171] flex items-center justify-center text-[14px] hover:bg-[#f07171] hover:text-white transition-colors" title="Remove">×</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RequiredFieldWrapper fieldId="field-examDegreeName2" required={true} hasError={showError('examDegreeName2')} isHighlighted={highlightedField === 'examDegreeName2'}>
            <FormField
              label="Exam / Degree Name"
              sublabel="পরীক্ষা / ডিগ্রি"
              type="select"
              options={['-- Select --', 'SSC', 'HSC', 'Dakhil', 'Alim', 'Fazil', 'Kamil', 'Diploma', 'Honours / B.A. / B.Sc. / B.Com', 'Masters / M.A. / M.Sc. / M.Com', 'B.Ed', 'M.Ed', 'Ph.D', 'Other']}
              required
              value={formData.examDegreeName2 || '-- Select --'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('examDegreeName2', e.target.value)}
              hasError={showError('examDegreeName2')}
            />
            <FieldError show={showError('examDegreeName2')} message="Qualification #2 is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-groupSubject2" required={true} hasError={showError('groupSubject2')} isHighlighted={highlightedField === 'groupSubject2'}>
            <FormField
              label="Group / Subject"
              sublabel="বিভাগ / বিষয়"
              placeholder="e.g. Science, Arts, Mathematics"
              required
              value={formData.groupSubject2 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('groupSubject2', e.target.value)}
              hasError={showError('groupSubject2')}
            />
            <FieldError show={showError('groupSubject2')} message="Group / Subject is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-boardUniversity2" required={true} hasError={showError('boardUniversity2')} isHighlighted={highlightedField === 'boardUniversity2'}>
            <FormField
              label="Board / University"
              sublabel="বোর্ড / বিশ্ববিদ্যালয়"
              placeholder="Board or University name"
              required
              value={formData.boardUniversity2 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('boardUniversity2', e.target.value)}
              hasError={showError('boardUniversity2')}
            />
            <FieldError show={showError('boardUniversity2')} message="Board / University is required" />
          </RequiredFieldWrapper>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <RequiredFieldWrapper fieldId="field-institutionName2" required={true} hasError={showError('institutionName2')} isHighlighted={highlightedField === 'institutionName2'}>
            <FormField
              label="Institution Name"
              sublabel="প্রতিষ্ঠানের নাম"
              placeholder="School / College / University"
              required
              value={formData.institutionName2 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('institutionName2', e.target.value)}
              hasError={showError('institutionName2')}
            />
            <FieldError show={showError('institutionName2')} message="Institution name is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-passingYear2" required={true} hasError={showError('passingYear2')} isHighlighted={highlightedField === 'passingYear2'}>
            <FormField
              label="Passing Year"
              sublabel="পাশের সাল"
              type="number"
              placeholder="e.g. 2017"
              min={1970}
              max={2030}
              required
              value={formData.passingYear2 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('passingYear2', e.target.value)}
              hasError={showError('passingYear2')}
            />
            <FieldError show={showError('passingYear2')} message="Passing year is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-result2" required={true} hasError={showError('result2')} isHighlighted={highlightedField === 'result2'}>
            <FormField
              label="Result / GPA / CGPA"
              sublabel="ফলাফল / জিপিএ"
              placeholder="e.g. GPA 5.00 / A+ / Division 1"
              required
              value={formData.result2 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('result2', e.target.value)}
              hasError={showError('result2')}
            />
            <FieldError show={showError('result2')} message="Result is required" />
          </RequiredFieldWrapper>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 items-start">
          <RequiredFieldWrapper fieldId="field-outOf2" required={true} hasError={showError('outOf2')} isHighlighted={highlightedField === 'outOf2'}>
            <FormField
              label="Out Of"
              sublabel="সর্বোচ্চ নম্বর"
              placeholder="e.g. 5.00 / 4.00 / 800"
              required
              value={formData.outOf2 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('outOf2', e.target.value)}
              hasError={showError('outOf2')}
            />
            <FieldError show={showError('outOf2')} message="Out Of is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-duration2" required={true} hasError={showError('duration2')} isHighlighted={highlightedField === 'duration2'}>
            <FormField
              label="Duration"
              sublabel="মেয়াদকাল"
              placeholder="e.g. 2 years / 4 semesters"
              required
              value={formData.duration2 || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('duration2', e.target.value)}
              hasError={showError('duration2')}
            />
            <FieldError show={showError('duration2')} message="Duration is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-certificate2" required={true} hasError={showError('certificate2')} isHighlighted={highlightedField === 'certificate2'}>
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2 leading-tight">
              Certificate Upload <span className="text-[#f85c5c]">*</span><br/>সনদ যুক্ত করুন
            </label>
            <div className={`flex-1 relative flex flex-col items-center justify-center gap-2 w-full min-h-[100px] px-4 py-4 border-2 border-dashed rounded-lg hover:border-[rgba(201,169,110,0.35)] hover:bg-[#0C1119] transition-all bg-[#0A0F1A] ${showError('certificate2') ? 'border-[rgba(248,92,92,0.5)]' : 'border-[rgba(201,169,110,0.1)]'}`}>
              <input
                type="file"
                accept=".pdf,image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => updateField('certificate2', e.target.files?.[0]?.name || '')}
              />
              <span className="text-[16px]">📎</span>
              <span className="text-[11px] text-[#4A4030]">{formData.certificate2 ? formData.certificate2 : 'Browse file'}</span>
            </div>
            <FieldError show={showError('certificate2')} message="Certificate is required" />
          </RequiredFieldWrapper>
          <div className="h-full flex flex-col">
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2 leading-tight">
              Transcript/Marksheet<br/>ট্রান্সক্রিপ্ট/মার্কশিট
            </label>
            <div className="flex-1 relative flex flex-col items-center justify-center gap-2 w-full min-h-[100px] px-4 py-4 border-2 border-dashed border-[rgba(201,169,110,0.1)] rounded-lg hover:border-[rgba(201,169,110,0.35)] hover:bg-[#0C1119] transition-all bg-[#0A0F1A]">
              <input
                type="file"
                accept=".pdf,image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-[16px]">📄</span>
              <span className="text-[11px] text-[#4A4030]">Browse file</span>
            </div>
          </div>
        </div>
      </div>

      <button className="text-[11px] px-4 py-2 bg-[rgba(201,169,110,0.07)] border border-dashed border-[rgba(201,169,110,0.35)] text-[#C9A96E] rounded hover:bg-[rgba(201,169,110,0.1)] transition-colors">
        ＋ Add Qualification
      </button>
    </FormSection>
  );
}

function Step4ProfessionalQualifications({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const hasQualifications = formData.hasQualifications !== 'no';
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];
  const getFieldWrapperClass = (fieldName: string) => {
    if (highlightedField === fieldName) return 'p-2 bg-[rgba(201,169,110,0.06)] border-2 border-[rgba(201,169,110,0.45)] rounded shadow-[0_0_20px_rgba(201,169,110,0.2)]';
    if (showError(fieldName)) return 'p-2 rounded-lg border-l-4 border-l-[#f85c5c] border border-[rgba(248,92,92,0.3)] bg-[rgba(248,92,92,0.06)] shadow-[0_2px_8px_rgba(248,92,92,0.12)]';
    return '';
  };

  return (
    <FormSection title="Professional & Teaching Qualifications" sublabel="পেশাগত যোগ্যতা ও প্রশিক্ষণ" icon="📜">
      <div className="mb-6">
        <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
          Do you have professional qualifications? · আপনার পেশাগত যোগ্যতা আছে?
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={() => updateField('hasQualifications', 'yes')} className={`px-4 py-2 rounded text-[12px] transition-all ${hasQualifications ? 'bg-[#C9A96E] text-[#030508] font-medium' : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'}`}>Yes</button>
          <button type="button" onClick={() => { updateField('hasQualifications', 'no'); updateField('ntrcaStatus', 'Not Applicable'); updateField('mpoExperience', 'No'); }} className={`px-4 py-2 rounded text-[12px] transition-all ${!hasQualifications ? 'bg-[#f85c5c] text-white font-medium' : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'}`}>No</button>
        </div>
      </div>

      {hasQualifications && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="B.Ed / M.Ed Degree" sublabel="বি.এড / এম.এড ডিগ্রি" type="select" options={['Select', 'B.Ed', 'M.Ed', 'Both B.Ed and M.Ed', 'Not Applicable']} value={formData.bedMedDegree || 'Select'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('bedMedDegree', e.target.value)} hasError={showError('bedMedDegree')} />
            <RequiredFieldWrapper fieldId="field-ntrcaStatus" required={true} hasError={showError('ntrcaStatus')} isHighlighted={highlightedField === 'ntrcaStatus'}>
              <FormField label="NTRCA Status" sublabel="এনটিআরসিএ অবস্থা" type="select" options={['', 'Registered (Certificate Obtained)', 'Awaiting Result', 'Not Registered', 'Exempted']} required value={formData.ntrcaStatus || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('ntrcaStatus', e.target.value)} hasError={showError('ntrcaStatus')} />
              <FieldError show={showError('ntrcaStatus')} message="NTRCA status is required" />
            </RequiredFieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="NTRCA Certificate Number" sublabel="এনটিআরসিএ সার্টিফিকেট নম্বর" placeholder="If registered" value={formData.ntrcaCertificateNumber || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ntrcaCertificateNumber', e.target.value)} hasError={showError('ntrcaCertificateNumber')} />
            <FormField label="NTRCA Level" sublabel="এনটিআরসিএ লেভেল" type="select" options={['Select', 'School', 'School-2', 'College', 'N/A']} value={formData.ntrcaLevel || 'Select'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('ntrcaLevel', e.target.value)} hasError={showError('ntrcaLevel')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RequiredFieldWrapper fieldId="field-mpoExperience" required={true} hasError={showError('mpoExperience')} isHighlighted={highlightedField === 'mpoExperience'}>
              <FormField label="MPO Experience" sublabel="এমপিও অভিজ্ঞতা" type="select" options={['', 'Yes', 'No']} required value={formData.mpoExperience || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('mpoExperience', e.target.value)} hasError={showError('mpoExperience')} />
              <FieldError show={showError('mpoExperience')} message="MPO experience is required" />
            </RequiredFieldWrapper>
            <FormField label="Teaching License / Certification" sublabel="শিক্ষকতা লাইসেন্স (Optional)" placeholder="Certificate name if any" value={formData.teachingLicense || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('teachingLicense', e.target.value)} hasError={showError('teachingLicense')} />
          </div>

          <FormField label="Training Received" sublabel="গৃহীত প্রশিক্ষণ (Optional)" type="textarea" placeholder="List any training programs, workshops, or professional development received..." rows={4} value={formData.trainingReceived || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('trainingReceived', e.target.value)} hasError={showError('trainingReceived')} />
        </>
      )}
    </FormSection>
  );
}

function Step5TeachingExperience({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const hasExperience = formData.hasTeachingExperience !== 'no';
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];
  const [experiences, setExperiences] = useState([
    { id: 1, institutionName: '', institutionType: '', subjectTaught: '', classRange: '', servingTime: '', currentlyWorking: 'No', reasonForLeaving: '' }
  ]);
  
  const addExperience = () => {
    const newId = experiences.length > 0 ? Math.max(...experiences.map(e => e.id)) + 1 : 1;
    setExperiences([...experiences, { 
      id: newId, 
      institutionName: '', 
      institutionType: '', 
      subjectTaught: '', 
      classRange: '', 
      servingTime: '', 
      currentlyWorking: 'No', 
      reasonForLeaving: '' 
    }]);
  };
  
  const removeExperience = (id: number) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };
  
  const updateExperience = (id: number, field: string, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const showExpError = (exp: typeof experiences[0], field: keyof typeof experiences[0]) =>
    attemptedSubmit && hasExperience && !exp[field];
  
  return (
    <FormSection title="Work Experience · কর্ম অভিজ্ঞতা" icon="💼">
      <div className="mb-6">
        <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
          Do you have teaching experience? · আপনার শিক্ষকতার অভিজ্ঞতা আছে?
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateField('hasTeachingExperience', 'yes')}
            className={`px-4 py-2 rounded text-[12px] transition-all ${
              hasExperience
                ? 'bg-[#C9A96E] text-[#030508] font-medium'
                : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => updateField('hasTeachingExperience', 'no')}
            className={`px-4 py-2 rounded text-[12px] transition-all ${
              !hasExperience
                ? 'bg-[#f85c5c] text-white font-medium'
                : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {hasExperience && (
        <>
          {experiences.map((exp, index) => (
            <div key={exp.id} className="mb-6 p-5 bg-[#090E16] border border-[rgba(201,169,110,0.1)] rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] tracking-[0.1em] uppercase text-[#C9A96E]">
                  Experience #{index + 1} · অভিজ্ঞতা #{index + 1}
                </h3>
                {experiences.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="w-6 h-6 rounded-full border border-[rgba(240,113,113,0.3)] bg-[rgba(240,113,113,0.15)] text-[#f07171] flex items-center justify-center text-[14px] hover:bg-[#f07171] hover:text-white transition-colors"
                    title="Remove Experience"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FormField 
                      label="Institution Name" 
                      sublabel="প্রতিষ্ঠানের নাম" 
                      placeholder="School / College name"
                      required
                      value={exp.institutionName}
                      onChange={(e) => updateExperience(exp.id, 'institutionName', e.target.value)}
                      hasError={showExpError(exp, 'institutionName')}
                    />
                    <FieldError show={showExpError(exp, 'institutionName')} message="Institution name is required" />
                  </div>
                  <div>
                    <FormField 
                      label="Institution Type" 
                      sublabel="প্রতিষ্ঠানের ধরন" 
                      type="select"
                      options={['Select Type', 'School', 'College', 'University', 'Private Tutoring', 'Coaching Center', 'Other']}
                      required
                      value={exp.institutionType}
                      onChange={(e) => updateExperience(exp.id, 'institutionType', e.target.value)}
                      hasError={attemptedSubmit && hasExperience && (!exp.institutionType || exp.institutionType === 'Select Type')}
                    />
                    <FieldError show={attemptedSubmit && hasExperience && (!exp.institutionType || exp.institutionType === 'Select Type')} message="Institution type is required" />
                  </div>
                  <div>
                    <FormField 
                      label="Subject Taught" 
                      sublabel="পড়ানো বিষয়" 
                      placeholder="e.g. Physics, Mathematics"
                      required
                      value={exp.subjectTaught}
                      onChange={(e) => updateExperience(exp.id, 'subjectTaught', e.target.value)}
                      hasError={showExpError(exp, 'subjectTaught')}
                    />
                    <FieldError show={showExpError(exp, 'subjectTaught')} message="Subject taught is required" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <FormField 
                      label="Class Range Taught" 
                      sublabel="পড়ানো শ্রেণির সীমা" 
                      placeholder="e.g. Class 9-12"
                      required
                      value={exp.classRange}
                      onChange={(e) => updateExperience(exp.id, 'classRange', e.target.value)}
                      hasError={showExpError(exp, 'classRange')}
                    />
                    <FieldError show={showExpError(exp, 'classRange')} message="Class range is required" />
                  </div>
                  <div>
                    <FormField 
                      label="Serving / Total Time" 
                      sublabel="কর্মকাল / মোট সময়" 
                      placeholder="e.g. 3 years 6 months"
                      required
                      value={exp.servingTime}
                      onChange={(e) => updateExperience(exp.id, 'servingTime', e.target.value)}
                      hasError={showExpError(exp, 'servingTime')}
                    />
                    <FieldError show={showExpError(exp, 'servingTime')} message="Serving time is required" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
                      Currently Working Here? · এখানে এখনো কাজ করছেন?
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateExperience(exp.id, 'currentlyWorking', 'Yes')}
                        className={`px-4 py-2 rounded text-[12px] transition-all ${
                          exp.currentlyWorking === 'Yes'
                            ? 'bg-[#C9A96E] text-[#030508] font-medium'
                            : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => updateExperience(exp.id, 'currentlyWorking', 'No')}
                        className={`px-4 py-2 rounded text-[12px] transition-all ${
                          exp.currentlyWorking === 'No'
                            ? 'bg-[#C9A96E] text-[#030508] font-medium'
                            : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>

                {exp.currentlyWorking === 'No' && (
                  <div>
                    <FormField
                      label="Reason for Leaving"
                      sublabel="ছেড়ে যাওয়ার কারণ"
                      placeholder="e.g. Better opportunity, Contract ended"
                      required
                      value={exp.reasonForLeaving}
                      onChange={(e) => updateExperience(exp.id, 'reasonForLeaving', e.target.value)}
                      hasError={attemptedSubmit && hasExperience && exp.currentlyWorking === 'No' && !exp.reasonForLeaving}
                    />
                    <FieldError show={attemptedSubmit && hasExperience && exp.currentlyWorking === 'No' && !exp.reasonForLeaving} message="Reason for leaving is required" />
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="pt-2 pb-6">
            <button 
              type="button"
              onClick={addExperience}
              className="text-[11px] px-4 py-2 bg-[rgba(201,169,110,0.07)] border border-[rgba(201,169,110,0.2)] text-[#C9A96E] rounded hover:bg-[rgba(201,169,110,0.09)] transition-colors"
            >
              + Add Another Experience
            </button>
          </div>
        </>
      )}

      <RequiredFieldWrapper fieldId="field-whyWorkWithUs" required={true} hasError={showError('whyWorkWithUs')} isHighlighted={highlightedField === 'whyWorkWithUs'}>
        <FormField
          label="Why do you want to work with us?"
          sublabel="আমাদের সাথে কেন কাজ করতে চান?"
          type="textarea"
          placeholder="Describe your motivation and reasons for wanting to join our institution..."
          rows={4}
          required
          value={formData.whyWorkWithUs || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('whyWorkWithUs', e.target.value)}
          hasError={showError('whyWorkWithUs')}
        />
        <FieldError show={attemptedSubmit && validationErrors.whyWorkWithUs} message="This field is required" />
      </RequiredFieldWrapper>
    </FormSection>
  );
}

function Step6SuitabilitySkills({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const [classesHandled, setClassesHandled] = useState<string[]>([]);
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([]);
  const [additionalSubjects, setAdditionalSubjects] = useState<string[]>([]);
  const [coaching, setCoaching] = useState('No');
  const [examInvigilation, setExamInvigilation] = useState('Yes');
  const [classTeacherDuty, setClassTeacherDuty] = useState('Yes');
  const [coCurricular, setCoCurricular] = useState('Yes');
  const [softwareSkills, setSoftwareSkills] = useState<string[]>([]);
  const [ictSkillsLevel, setIctSkillsLevel] = useState('Select');
  const [hasIctCertificates, setHasIctCertificates] = useState(false);
  const [ictCertificates, setIctCertificates] = useState([{ id: 1, file: null as File | null }]);
  const [hasAdditionalSkills, setHasAdditionalSkills] = useState(false);
  const [hasIctSkills, setHasIctSkills] = useState(false);
  const [hasLanguageCertificates, setHasLanguageCertificates] = useState(false);
  const [languageCertificates, setLanguageCertificates] = useState([{ id: 1, file: null as File | null }]);

  const isLanguageProficient = formData.isLanguageProficient;
  const showLanguageDropdowns = isLanguageProficient === 'yes';
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];

  const addLanguageCertificate = () => {
    const newId = languageCertificates.length > 0 ? Math.max(...languageCertificates.map(c => c.id)) + 1 : 1;
    setLanguageCertificates([...languageCertificates, { id: newId, file: null }]);
  };

  const removeLanguageCertificate = (id: number) => {
    setLanguageCertificates(languageCertificates.filter(cert => cert.id !== id));
  };

  const clearLanguageCertificate = (id: number) => {
    setLanguageCertificates(languageCertificates.map(cert => 
      cert.id === id ? { ...cert, file: null } : cert
    ));
    const input = document.getElementById(`lang-cert-${id}`) as HTMLInputElement;
    if (input) input.value = '';
  };

  const addIctCertificate = () => {
    const newId = ictCertificates.length > 0 ? Math.max(...ictCertificates.map(c => c.id)) + 1 : 1;
    setIctCertificates([...ictCertificates, { id: newId, file: null }]);
  };

  const removeIctCertificate = (id: number) => {
    setIctCertificates(ictCertificates.filter(cert => cert.id !== id));
  };

  const clearIctCertificate = (id: number) => {
    setIctCertificates(ictCertificates.map(cert => 
      cert.id === id ? { ...cert, file: null } : cert
    ));
    const input = document.getElementById(`ict-cert-${id}`) as HTMLInputElement;
    if (input) input.value = '';
  };
  
  const toggleClass = (cls: string) => {
    setClassesHandled(prev => 
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };
  
  const isPrimaryClassSelected = classesHandled.includes('Class 0-5');
  const isSecondaryClassSelected = classesHandled.includes('Class 6-8');
  const isClass9to10Selected = classesHandled.includes('Class 9/10');
  
  const primarySubjects0to5 = [
    { value: 'Quran Majid and Tajbid', label: 'কুরআন মাজিদ ও তাজভিদ · Quran Majid & Tajbid' },
    { value: 'Aqaid and Fiqh', label: 'আকাইদ ও ফিকহ · Aqaid & Fiqh' },
    { value: 'Arabic', label: 'আদ্দুরুসুল আরাবিয়্যাহ / আরবি · Arabic' },
    { value: 'Bengali', label: 'আমার বাংলা বই · Bengali' },
    { value: 'English', label: 'English For Today · English' },
    { value: 'Primary Mathematics', label: 'প্রাথমিক গণিত · Mathematics' }
  ];
  
  const secondarySubjects0to5 = [
    { value: 'Primary Science', label: 'প্রাথমিক বিজ্ঞান · Primary Science' },
    { value: 'Bangladesh and Global Studies', label: 'বাংলাদেশ ও বিশ্বপরিচয় · Bangladesh and Global Studies' }
  ];
  
  const primarySubjects6to8 = [
    { value: 'Quran Majid and Tajbid 6-8', label: 'কুরআন মাজিদ ও তাজভিদ · Quran Majid & Tajbid' },
    { value: 'Aqaid and Fiqh 6-8', label: 'আকাইদ ও ফিকহ · Aqaid & Fiqh' },
    { value: 'Arabic 1st and 2nd Paper', label: 'আরবি ১ম ও ২য় পত্র · Arabic 1st & 2nd Paper' },
    { value: 'Bengali 1st and 2nd Paper 6-8', label: 'বাংলা ১ম ও ২য় পত্র · Bengali 1st & 2nd Paper' },
    { value: 'English 1st and 2nd Paper 6-8', label: 'ইংরেজি ১ম ও ২য় পত্র · English 1st & 2nd Paper' },
    { value: 'Mathematics 6-8', label: 'গণিত · Mathematics' },
    { value: 'General Science', label: 'সাধারণ বিজ্ঞান · General Science' }
  ];
  
  const secondarySubjects6to8 = [
    { value: 'Bangladesh and Global Studies 6-8', label: 'বাংলাদেশ ও বিশ্বপরিচয় · Bangladesh & Global Studies' },
    { value: 'ICT 6-8', label: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT) · ICT' },
    { value: 'Agriculture or Home Science 6-8', label: 'কৃষি শিক্ষা / গার্হস্থ্য বিজ্ঞান (যেকোনো একটি) · Agriculture / Home Science' },
    { value: 'Career and Life Skills', label: 'কর্ম ও জীবনমুখী শিক্ষা · Career & Life Skills' },
    { value: 'Arts and Crafts', label: 'চারু ও কারুকলা · Arts & Crafts' }
  ];
  
  const primarySubjects9to10 = [
    { value: 'Quran Majid and Tajbid 9-10', label: 'কুরআন মাজিদ ও তাজভিদ · Quran Majid & Tajbid' },
    { value: 'Hadith Sharif', label: 'হাদিস শরিফ · Hadith Sharif' },
    { value: 'Aqaid and Fiqh 9-10', label: 'আকাইদ ও ফিকহ · Aqaid & Fiqh' },
    { value: 'Arabic 1st and 2nd Paper 9-10', label: 'আরবি ১ম ও ২য় পত্র · Arabic 1st & 2nd Paper' },
    { value: 'Bengali 1st and 2nd Paper 9-10', label: 'বাংলা ১ম ও ২য় পত্র · Bengali 1st & 2nd Paper' },
    { value: 'English 1st and 2nd Paper 9-10', label: 'ইংরেজি ১ম ও ২য় পত্র · English 1st & 2nd Paper' },
    { value: 'Mathematics 9-10', label: 'গণিত · Mathematics' },
    { value: 'ICT 9-10', label: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT) · ICT' }
  ];
  
  const secondarySubjects9to10 = [
    { value: 'History of Islam', label: 'ইসলামের ইতিহাস · History of Islam' },
    { value: 'Bangladesh and Global Studies 9-10', label: 'বাংলাদেশ ও বিশ্বপরিচয় · Bangladesh & Global Studies' },
    { value: 'Agriculture or Home Science 9-10', label: 'কৃষি শিক্ষা/গার্হস্থ্য বিজ্ঞান · Agriculture / Home Science' },
    { value: 'Physics', label: 'পদার্থবিজ্ঞান · Physics' },
    { value: 'Chemistry', label: 'রসায়ন · Chemistry' },
    { value: 'Biology', label: 'জীববিজ্ঞান · Biology' },
    { value: 'Higher Mathematics', label: 'উচ্চতর গণিত · Higher Mathematics' }
  ];
  
  // Helper function to merge subject arrays - union with deduplication by English name
  // Subjects sharing the same English name (after ' · ') are deduplicated; last encountered wins
  const getUnion = (arrays: Array<typeof primarySubjects0to5>) => {
    if (arrays.length === 0) return [];
    if (arrays.length === 1) return arrays[0];
    
    const map = new Map<string, typeof primarySubjects0to5[0]>();
    
    for (const arr of arrays) {
      for (const subject of arr) {
        const separatorIdx = subject.label.indexOf(' · ');
        const key = separatorIdx !== -1 ? subject.label.slice(separatorIdx + 3) : subject.label;
        map.set(key, subject);
      }
    }
    
    return Array.from(map.values());
  };
  
  // Build arrays of selected primary and secondary subjects
  const selectedPrimaryArrays = [];
  const selectedSecondaryArrays = [];
  
  if (isPrimaryClassSelected) {
    selectedPrimaryArrays.push(primarySubjects0to5);
    selectedSecondaryArrays.push(secondarySubjects0to5);
  }
  if (isSecondaryClassSelected) {
    selectedPrimaryArrays.push(primarySubjects6to8);
    selectedSecondaryArrays.push(secondarySubjects6to8);
  }
  if (isClass9to10Selected) {
    selectedPrimaryArrays.push(primarySubjects9to10);
    selectedSecondaryArrays.push(secondarySubjects9to10);
  }
  
  // Get all unique subjects from selected classes (union)
  const primarySubjects = getUnion(selectedPrimaryArrays);
  const secondarySubjects = getUnion(selectedSecondaryArrays);
  
  // Filter out subjects already selected as preferred from additional list
  const availableAdditionalSubjects = primarySubjects.filter(
    subject => !preferredSubjects.includes(subject.value)
  );
  
  // Auto-remove from additional if selected as preferred
  useEffect(() => {
    setAdditionalSubjects(prev => prev.filter(sub => !preferredSubjects.includes(sub)));
  }, [preferredSubjects]);

  // Sync preferredSubjects and classesHandled to formData for validation
  useEffect(() => {
    updateField('preferredSubjects', preferredSubjects);
  }, [preferredSubjects]);

  useEffect(() => {
    updateField('classesHandled', classesHandled);
  }, [classesHandled]);
  
  return (
    <>
      <FormSection title="Teaching Suitability & Skills" sublabel="পাঠদান উপযুক্ততা ও দক্ষতা" icon="🎯">
        <div>
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
            Classes Able to Handle · যে শ্রেণিগুলো পরিচালনা করতে পারেন <span className="text-[#f85c5c]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {['Class 0-5', 'Class 6-8', 'Class 9/10'].map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => toggleClass(cls)}
                className={`px-4 py-2 rounded text-[12px] transition-all ${
                  classesHandled.includes(cls)
                    ? 'bg-[#C9A96E] text-[#030508] font-medium'
                    : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isPrimaryClassSelected || isSecondaryClassSelected || isClass9to10Selected ? (
            <>
              <RequiredFieldWrapper fieldId="field-preferredSubjects" required={true} hasError={!!showError('preferredSubjects')} isHighlighted={highlightedField === 'preferredSubjects'}>
                <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
                  Preferred Subjects to Teach · পাঠদানের জন্য পছন্দের বিষয় <span className="text-[#f85c5c]">*</span>
                </label>
                <div className={showError('preferredSubjects') ? 'p-2 rounded-lg border-l-4 border-l-[#f85c5c] border border-[rgba(248,92,92,0.3)] bg-[rgba(248,92,92,0.06)] shadow-[0_2px_8px_rgba(248,92,92,0.12)]' : ''}>
                  <CheckboxGroup
                    options={primarySubjects}
                    selected={preferredSubjects}
                    onChange={setPreferredSubjects}
                    columns={2}
                  />
                </div>
                <FieldError show={!!showError('preferredSubjects')} message="Please select at least one preferred subject" />
              </RequiredFieldWrapper>
              <div>
                <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
                  Additional Subjects Able to Teach · অতিরিক্ত বিষয় যেগুলো পড়াতে পারেন
                </label>
                <CheckboxGroup
                  options={secondarySubjects}
                  selected={additionalSubjects}
                  onChange={setAdditionalSubjects}
                  columns={2}
                />
              </div>
            </>
          ) : (
            <div className="col-span-2 p-6 bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] rounded-lg text-center">
              <p className="text-[12px] text-[#4A4030]">
                Please select at least one class to view available subjects
              </p>
              <p className="text-[11px] text-[#3A3020] mt-1">
                অন্তত একটি শ্রেণি নির্বাচন করুন বিষয়গুলো দেখতে
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
              Coaching / Private Tutoring? · কোচিং/প্রাইভেট টিউটরিং? <span className="text-[#f85c5c]">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCoaching('Yes')}
                className={`px-4 py-2 rounded text-[12px] transition-all ${
                  coaching === 'Yes'
                    ? 'bg-[#C9A96E] text-[#030508] font-medium'
                    : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setCoaching('No')}
                className={`px-4 py-2 rounded text-[12px] transition-all ${
                  coaching === 'No'
                    ? 'bg-[#C9A96E] text-[#030508] font-medium'
                    : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
              Willing: Exam Invigilation? · পরীক্ষা পর্যবেক্ষণ? <span className="text-[#f85c5c]">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExamInvigilation('Yes')}
                className={`px-4 py-2 rounded text-[12px] transition-all ${
                  examInvigilation === 'Yes'
                    ? 'bg-[#C9A96E] text-[#030508] font-medium'
                    : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setExamInvigilation('No')}
                className={`px-4 py-2 rounded text-[12px] transition-all ${
                  examInvigilation === 'No'
                    ? 'bg-[#C9A96E] text-[#030508] font-medium'
                    : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
              Willing: Class Teacher Duty? · শ্রেণি শিক্ষকের দায়িত্ব?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setClassTeacherDuty('Yes')}
                className={`px-4 py-2 rounded text-[12px] transition-all ${
                  classTeacherDuty === 'Yes'
                    ? 'bg-[#C9A96E] text-[#030508] font-medium'
                    : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setClassTeacherDuty('No')}
                className={`px-4 py-2 rounded text-[12px] transition-all ${
                  classTeacherDuty === 'No'
                    ? 'bg-[#C9A96E] text-[#030508] font-medium'
                    : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
            Willing: Co-Curricular Activities? · সহ-পাঠক্রমিক কার্যক্রম?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCoCurricular('Yes')}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                coCurricular === 'Yes'
                  ? 'bg-[#C9A96E] text-[#030508] font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setCoCurricular('No')}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                coCurricular === 'No'
                  ? 'bg-[#C9A96E] text-[#030508] font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </FormSection>

      <FormSection title="Language Proficiency" sublabel="ভাষা দক্ষতা" icon="🌐">
        {/* Language proficiency gate question */}
        <div className="mb-4">
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
            Are you proficient in English / Arabic? · আপনি কি ইংরেজি / আরবিতে দক্ষ?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateField('isLanguageProficient', 'yes')}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                isLanguageProficient === 'yes'
                  ? 'bg-[#C9A96E] text-[#030508] font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateField('isLanguageProficient', 'no')}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                isLanguageProficient === 'no'
                  ? 'bg-[#f85c5c] text-white font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {showLanguageDropdowns && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RequiredFieldWrapper fieldId="field-englishProficiency" required={true} hasError={showError('englishProficiency')} isHighlighted={highlightedField === 'englishProficiency'}>
                <FormField
                  label="English Proficiency"
                  sublabel="ইংরেজি দক্ষতা"
                  type="select"
                  required
                  options={['', 'Beginner', 'Elementary (A2)', 'Intermediate (B1)', 'Upper Intermediate (B2)', 'Advanced (C1)', 'Fluent (C2)', 'Native']}
                  value={formData.englishProficiency || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('englishProficiency', e.target.value)}
                  hasError={showError('englishProficiency')}
                />
                <FieldError show={showError('englishProficiency')} message="English proficiency is required" />
              </RequiredFieldWrapper>
              <RequiredFieldWrapper fieldId="field-spokenEnglishLevel" required={true} hasError={showError('spokenEnglishLevel')} isHighlighted={highlightedField === 'spokenEnglishLevel'}>
                <FormField
                  label="Spoken English Level"
                  sublabel="বলিত ইংরেজির স্তর"
                  type="select"
                  required
                  options={['', 'Beginner', 'Intermediate', 'Fluent', 'Native']}
                  value={formData.spokenEnglishLevel || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('spokenEnglishLevel', e.target.value)}
                  hasError={showError('spokenEnglishLevel')}
                />
                <FieldError show={showError('spokenEnglishLevel')} message="Spoken English level is required" />
              </RequiredFieldWrapper>
              <RequiredFieldWrapper fieldId="field-arabicProficiency" required={true} hasError={showError('arabicProficiency')} isHighlighted={highlightedField === 'arabicProficiency'}>
                <FormField
                  label="Arabic Proficiency"
                  sublabel="আরবি দক্ষতা"
                  type="select"
                  required
                  options={['', 'Beginner', 'Elementary (A2)', 'Intermediate (B1)', 'Upper Intermediate (B2)', 'Advanced (C1)', 'Fluent (C2)', 'Native']}
                  value={formData.arabicProficiency || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('arabicProficiency', e.target.value)}
                  hasError={showError('arabicProficiency')}
                />
                <FieldError show={showError('arabicProficiency')} message="Arabic proficiency is required" />
              </RequiredFieldWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RequiredFieldWrapper fieldId="field-spokenArabicLevel" required={true} hasError={showError('spokenArabicLevel')} isHighlighted={highlightedField === 'spokenArabicLevel'}>
                <FormField
                  label="Spoken Arabic Level"
                  sublabel="বলিত আরবির স্তর"
                  type="select"
                  required
                  options={['', 'Beginner', 'Intermediate', 'Fluent', 'Native']}
                  value={formData.spokenArabicLevel || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('spokenArabicLevel', e.target.value)}
                  hasError={showError('spokenArabicLevel')}
                />
                <FieldError show={showError('spokenArabicLevel')} message="Spoken Arabic level is required" />
              </RequiredFieldWrapper>
              <FormField
                label="Additional Languages You Know"
                sublabel="আপনার জানা অতিরিক্ত ভাষা"
                placeholder="e.g., Hindi, Urdu, French, etc."
                value={formData.additionalLanguages || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('additionalLanguages', e.target.value)}
                hasError={showError('additionalLanguages')}
              />
            </div>
          </>
        )}

        {!showLanguageDropdowns && (
          <div className="mb-2">
            <FormField
              label="Additional Languages You Know"
              sublabel="আপনার জানা অতিরিক্ত ভাষা"
              placeholder="e.g., Hindi, Urdu, French, etc."
              value={formData.additionalLanguages || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('additionalLanguages', e.target.value)}
              hasError={showError('additionalLanguages')}
            />
          </div>
        )}

        <div className="pt-4">
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
            Do you have any certificate related to language proficiency? · ভাষা দক্ষতা সম্পর্কিত কোনো সার্টিফিকেট আছে?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHasLanguageCertificates(true)}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                hasLanguageCertificates
                  ? 'bg-[#C9A96E] text-[#030508] font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHasLanguageCertificates(false)}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                !hasLanguageCertificates
                  ? 'bg-[#f85c5c] text-white font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {hasLanguageCertificates && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {languageCertificates.map((cert, index) => (
              <div key={cert.id} className="relative">
                <label className="flex items-center text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">
                  <span>Certificate {index + 1}</span>
                  {languageCertificates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLanguageCertificate(cert.id)}
                      className="ml-2 w-5 h-5 rounded-full bg-[#f07171] text-white flex items-center justify-center text-[12px] font-bold hover:bg-[#f85c5c] transition-colors shadow-sm border border-[rgba(201,169,110,0.1)]"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </label>
                <div className="relative flex flex-col items-center justify-center gap-1 w-full px-3 py-2 border-2 border-dashed border-[rgba(201,169,110,0.1)] rounded-lg hover:border-[rgba(201,169,110,0.35)] hover:bg-[#0C1119] transition-all bg-[#0A0F1A]">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id={`lang-cert-${cert.id}`}
                  />
                  <span className="text-[14px]">📜</span>
                  <span className="text-[10px] text-[#4A4030]">Browse file</span>
                  {index === languageCertificates.length - 1 && (
                    <button
                      type="button"
                      onClick={addLanguageCertificate}
                      className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#C9A96E] text-[#030508] flex items-center justify-center text-[16px] font-bold hover:bg-[#B8965A] transition-colors shadow-lg z-20 border-2 border-[rgba(201,169,110,0.2)]"
                      title="Add Another Certificate"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </FormSection>

      <FormSection title="Skills Assessment" sublabel="দক্ষতা মূল্যায়ন" icon="💻">
        {/* Conditional: Do you have ICT/Computer skills? */}
        <div className="mb-6">
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
            Do you have any skills related to computer or ICT? · আপনার কি কম্পিউটার বা আইসিটি সম্পর্কিত দক্ষতা আছে?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHasIctSkills(true)}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                hasIctSkills
                  ? 'bg-[#C9A96E] text-[#030508] font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                setHasIctSkills(false);
                setIctSkillsLevel('Select');
                setSoftwareSkills([]);
                setHasIctCertificates(false);
              }}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                !hasIctSkills
                  ? 'bg-[#f85c5c] text-white font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* ICT Skills sections - only show if hasIctSkills is true */}
        {hasIctSkills && (
          <>
            {/* ICT Skills Level & Certificate - 50/50 Split Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
              {/* Left - ICT Skills Level & Software Proficiency (50%) */}
              <div className="w-full md:w-1/2 shrink-0">
                <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">
                  ICT Skills Level · আইসিটি দক্ষতার স্তর
                </label>
                <select
                  value={ictSkillsLevel}
                  onChange={(e) => {
                    setIctSkillsLevel(e.target.value);
                    setSoftwareSkills([]);
                  }}
                  className="w-full max-w-[280px] px-3 py-2 bg-[#080D14] border border-[rgba(201,169,110,0.1)] rounded text-[13px] text-[#C8C4BC] font-['DM_Mono'] focus:outline-none focus:border-[rgba(201,169,110,0.55)] focus:ring-1 focus:ring-[rgba(201,169,110,0.09)]"
                >
                  <option value="Select">Select</option>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                {/* Software / Platform Proficiency - Now on left side */}
                {ictSkillsLevel !== 'Select' && (
                  <div className="mt-6 pt-6 border-t border-[rgba(201,169,110,0.1)]">
                    <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
                      Software / Platform Proficiency · সফটওয়্যার/প্ল্যাটফর্ম দক্ষতা
                    </label>
                    <CheckboxGroup
                      options={
                        ictSkillsLevel === 'Basic'
                          ? [
                              { value: 'MS Word', label: 'MS Word' },
                              { value: 'MS Excel', label: 'MS Excel' },
                              { value: 'PowerPoint', label: 'PowerPoint' },
                              { value: 'Google Classroom', label: 'Google Classroom' },
                              { value: 'Bangla Typing', label: 'Bangla Typing' },
                              { value: 'English Typing', label: 'English Typing' }
                            ]
                          : ictSkillsLevel === 'Intermediate'
                          ? [
                              { value: 'MS Word', label: 'MS Word' },
                              { value: 'MS Excel', label: 'MS Excel' },
                              { value: 'PowerPoint', label: 'PowerPoint' },
                              { value: 'Google Classroom', label: 'Google Classroom' },
                              { value: 'Bangla Typing', label: 'Bangla Typing' },
                              { value: 'English Typing', label: 'English Typing' },
                              { value: 'Google Docs', label: 'Google Docs' },
                              { value: 'Google Sheets', label: 'Google Sheets' },
                              { value: 'Canva', label: 'Canva' },
                              { value: 'Filmora / Video Editing', label: 'Filmora / Video Editing' },
                              { value: 'Basic Graphic Design', label: 'Basic Graphic Design' },
                              { value: 'Zoom / Online Meeting Tools', label: 'Zoom / Online Meeting Tools' }
                            ]
                          : [
                              { value: 'MS Word', label: 'MS Word' },
                              { value: 'MS Excel', label: 'MS Excel' },
                              { value: 'PowerPoint', label: 'PowerPoint' },
                              { value: 'Google Classroom', label: 'Google Classroom' },
                              { value: 'Bangla Typing', label: 'Bangla Typing' },
                              { value: 'English Typing', label: 'English Typing' },
                              { value: 'Adobe Photoshop', label: 'Adobe Photoshop' },
                              { value: 'Adobe Illustrator', label: 'Adobe Illustrator' },
                              { value: 'Canva Pro', label: 'Canva Pro' },
                              { value: 'Premiere Pro / Video Editing', label: 'Premiere Pro / Video Editing' },
                              { value: 'HTML / CSS / Web Design', label: 'HTML / CSS / Web Design' },
                              { value: 'JavaScript / Programming', label: 'JavaScript / Programming' },
                              { value: 'Python / Data Analysis', label: 'Python / Data Analysis' },
                              { value: 'Database Management', label: 'Database Management' }
                            ]
                      }
                      selected={softwareSkills}
                      onChange={setSoftwareSkills}
                      columns={2}
                    />
                  </div>
                )}
              </div>

              {/* Vertical divider line */}
              <div className="hidden md:block w-px bg-[rgba(201,169,110,0.08)] self-stretch"></div>

              {/* Right - Certificate Only (50%) */}
              <div className="w-full md:w-1/2">
                <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">
                  Certificate? · সার্টিফিকেট আছে?
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setHasIctCertificates(true)}
                      className={`px-3 py-1.5 rounded text-[11px] transition-all ${
                        hasIctCertificates
                          ? 'bg-[#C9A96E] text-[#030508] font-medium'
                          : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasIctCertificates(false)}
                      className={`px-3 py-1.5 rounded text-[11px] transition-all ${
                        !hasIctCertificates
                          ? 'bg-[#f85c5c] text-white font-medium'
                          : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                
                {/* Certificate list with plus button on last certificate */}
                {hasIctCertificates && ictCertificates.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {ictCertificates.map((cert, index) => (
                      <div key={cert.id} className="relative">
                        <label className="flex items-center text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">
                          <span>Certificate {index + 1}</span>
                          {ictCertificates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeIctCertificate(cert.id)}
                              className="ml-2 w-5 h-5 rounded-full bg-[#f07171] text-white flex items-center justify-center text-[12px] font-bold hover:bg-[#f85c5c] transition-colors shadow-sm border border-[rgba(201,169,110,0.1)]"
                              title="Remove"
                            >
                              ×
                            </button>
                          )}
                        </label>
                        <div className="relative flex flex-col items-center justify-center gap-1 w-full px-3 py-2 border-2 border-dashed border-[rgba(201,169,110,0.1)] rounded-lg hover:border-[rgba(201,169,110,0.35)] hover:bg-[#0C1119] transition-all bg-[#0A0F1A]">
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id={`ict-cert-${cert.id}`}
                          />
                          <span className="text-[14px]">💻</span>
                          <span className="text-[10px] text-[#4A4030]">Browse file</span>
                          {/* Plus button on the last certificate */}
                          {index === ictCertificates.length - 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addIctCertificate();
                              }}
                              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#C9A96E] text-[#030508] flex items-center justify-center text-[16px] font-bold hover:bg-[#B8965A] transition-colors shadow-lg z-20 border-2 border-[rgba(201,169,110,0.2)]"
                              title="Add Another Certificate"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Additional Skills Toggle - always visible */}
        <div className="pt-6 border-t border-[rgba(201,169,110,0.1)]">
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
            Do you have any additional skills? · আপনার কি অতিরিক্ত দক্ষতা আছে?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHasAdditionalSkills(true)}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                hasAdditionalSkills
                  ? 'bg-[#C9A96E] text-[#030508] font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHasAdditionalSkills(false)}
              className={`px-4 py-2 rounded text-[12px] transition-all ${
                !hasAdditionalSkills
                  ? 'bg-[#f85c5c] text-white font-medium'
                  : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {hasAdditionalSkills && (
          <div className="pt-4">
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
              Describe your additional skills · আপনার অতিরিক্ত দক্ষতা বর্ণনা করুন
            </label>
            <textarea
              rows={3}
              placeholder="Describe any type of skills (technical, creative, soft skills, hobbies, etc.) that may be relevant..."
              className="w-full px-3 py-2.5 bg-[#080D14] border border-[rgba(201,169,110,0.1)] rounded text-[13px] text-[#C8C4BC] font-['DM_Mono'] focus:outline-none focus:border-[rgba(201,169,110,0.55)] focus:ring-2 focus:ring-[rgba(201,169,110,0.09)] placeholder:text-[#3A3020]"
            />
          </div>
        )}
      </FormSection>
    </>
  );
}

function Step7PersonalBackground({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];
  const getFieldWrapperClass = (fieldName: string) => {
    if (highlightedField === fieldName) return 'p-3 bg-[rgba(201,169,110,0.07)] border border-[rgba(201,169,110,0.45)] rounded-lg shadow-[0_0_24px_rgba(201,169,110,0.15),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out relative before:absolute before:inset-0 before:rounded-lg before:border before:border-[rgba(201,169,110,0.22)] before:shadow-[inset_0_0_20px_rgba(201,169,110,0.08)]';
    if (showError(fieldName)) return 'p-3 rounded-lg border border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.05)] shadow-[0_0_25px_rgba(201,169,110,0.15),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-200 relative before:absolute before:inset-0 before:rounded-lg before:border before:border-[rgba(201,169,110,0.15)]';
    return '';
  };

  return (
    <FormSection title="Personal & Background Information" sublabel="ব্যাকগ্রাউন্ড তথ্য" icon="👤">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">Blood Group · রক্তের গ্রুপ</label>
          <select value={formData.bloodGroup || ''} onChange={(e) => updateField('bloodGroup', e.target.value)} className="w-full px-3 py-2 bg-[#080D14] border border-[rgba(201,169,110,0.1)] rounded text-[13px] text-[#C8C4BC] font-['DM_Mono'] focus:outline-none focus:border-[rgba(201,169,110,0.55)] focus:ring-1 focus:ring-[rgba(201,169,110,0.09)]">
            <option value="">Select</option><option value="Never checked">Never checked · পরীক্ষা করা হয়নি</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">Physical Disability · শারীরিক অক্ষমতা <span className="text-[#3A3020]">(Optional)</span></label>
          <div className="flex gap-2">
            <button type="button" onClick={() => updateField('hasDisability', true)} className={`px-3 py-1.5 rounded text-[11px] transition-all ${formData.hasDisability ? 'bg-[#C9A96E] text-[#030508] font-medium' : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'}`}>Yes</button>
            <button type="button" onClick={() => { updateField('hasDisability', false); updateField('disabilityDetails', ''); }} className={`px-3 py-1.5 rounded text-[11px] transition-all ${!formData.hasDisability ? 'bg-[#f85c5c] text-white font-medium' : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'}`}>No</button>
          </div>
          {formData.hasDisability && <input type="text" value={formData.disabilityDetails || ''} onChange={(e) => updateField('disabilityDetails', e.target.value)} placeholder="Specify disability" className="w-full mt-2 px-3 py-2 bg-[#080D14] border border-[rgba(201,169,110,0.1)] rounded text-[13px] text-[#C8C4BC] font-['DM_Mono'] focus:outline-none focus:border-[rgba(201,169,110,0.55)] focus:ring-1 focus:ring-[rgba(201,169,110,0.09)] placeholder:text-[#3A3020]" />}
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">Relatives in this Institution? · এই প্রতিষ্ঠানে আত্মীয়?</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => updateField('hasRelatives', true)} className={`px-3 py-1.5 rounded text-[11px] transition-all ${formData.hasRelatives ? 'bg-[#C9A96E] text-[#030508] font-medium' : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'}`}>Yes</button>
            <button type="button" onClick={() => { updateField('hasRelatives', false); updateField('relativeDetails', ''); }} className={`px-3 py-1.5 rounded text-[11px] transition-all ${!formData.hasRelatives ? 'bg-[#f85c5c] text-white font-medium' : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'}`}>No</button>
          </div>
          {formData.hasRelatives && <input type="text" value={formData.relativeDetails || ''} onChange={(e) => updateField('relativeDetails', e.target.value)} placeholder="Name, Designation, Relation" className="w-full mt-2 px-3 py-2 bg-[#080D14] border border-[rgba(201,169,110,0.1)] rounded text-[13px] text-[#C8C4BC] font-['DM_Mono'] focus:outline-none focus:border-[rgba(201,169,110,0.55)] focus:ring-1 focus:ring-[rgba(201,169,110,0.09)] placeholder:text-[#3A3020]" />}
        </div>
      </div>

      <div className="pt-4 border-t border-[rgba(201,169,110,0.1)] mt-4">
        <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">Emergency Contact Information · জরুরী যোগাযোগের তথ্য</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RequiredFieldWrapper fieldId="field-emergencyContactName" required={true} hasError={showError('emergencyContactName')} isHighlighted={highlightedField === 'emergencyContactName'}>
            <FormField label="Emergency Contact Person" sublabel="জরুরী যোগাযোগের ব্যক্তি" placeholder="Full name" required value={formData.emergencyContactName || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('emergencyContactName', e.target.value)} hasError={showError('emergencyContactName')} />
            <FieldError show={showError('emergencyContactName')} message="Emergency contact person is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-emergencyContactNumber" required={true} hasError={showError('emergencyContactNumber')} isHighlighted={highlightedField === 'emergencyContactNumber'}>
            <FormField label="Emergency Contact Number" sublabel="জরুরী ফোন নম্বর" type="tel" placeholder="+880 1X-XXXX-XXXX" required value={formData.emergencyContactNumber || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('emergencyContactNumber', e.target.value)} hasError={showError('emergencyContactNumber')} />
            <FieldError show={showError('emergencyContactNumber')} message="Emergency contact number is required" />
          </RequiredFieldWrapper>
          <RequiredFieldWrapper fieldId="field-emergencyContactRelation" required={true} hasError={showError('emergencyContactRelation')} isHighlighted={highlightedField === 'emergencyContactRelation'}>
            <FormField label="Relation with Emergency Contact" sublabel="সম্পর্ক" type="select" options={['', 'Father', 'Mother', 'Spouse', 'Sibling', 'Child', 'Friend', 'Colleague', 'Other']} required value={formData.emergencyContactRelation || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('emergencyContactRelation', e.target.value)} hasError={showError('emergencyContactRelation')} />
            <FieldError show={showError('emergencyContactRelation')} message="Emergency relation is required" />
          </RequiredFieldWrapper>
        </div>
      </div>
    </FormSection>
  );
}

function Step8Documents({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];
  const getFieldWrapperClass = (fieldName: string) => {
    if (highlightedField === fieldName) return 'p-3 bg-[rgba(201,169,110,0.07)] border border-[rgba(201,169,110,0.45)] rounded-lg shadow-[0_0_24px_rgba(201,169,110,0.15),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out relative before:absolute before:inset-0 before:rounded-lg before:border before:border-[rgba(201,169,110,0.22)] before:shadow-[inset_0_0_20px_rgba(201,169,110,0.08)]';
    if (showError(fieldName)) return 'p-3 rounded-lg border border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.05)] shadow-[0_0_25px_rgba(201,169,110,0.15),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-200 relative before:absolute before:inset-0 before:rounded-lg before:border before:border-[rgba(201,169,110,0.15)]';
    return '';
  };

  const docs = [
    { label: 'Passport-size Photo', sublabel: 'পাসপোর্ট সাইজ ছবি', icon: '🖼️', field: 'doc_passportPhoto', accept: 'image/*', required: true },
    { label: 'National ID Copy', sublabel: 'জাতীয় পরিচয়পত্রের কপি', icon: '📇', field: 'doc_nationalId', accept: '.pdf,image/*', required: true },
    { label: 'Birth Certificate', sublabel: 'জন্ম সনদ', icon: '📄', field: 'doc_birthCertificate', accept: '.pdf,image/*', required: true },
    { label: 'Experience Certificates', sublabel: 'অভিজ্ঞতার সনদ (ঐচ্ছিক)', icon: '🏅', field: 'doc_experienceCertificates', accept: '.pdf,image/*', required: false, multiple: true },
    { label: 'Signature Upload', sublabel: 'স্বাক্ষর আপলোড', icon: '✍️', field: 'doc_signature', accept: 'image/*', required: true },
  ];

  return (
    <FormSection title="Document Upload · নথিপত্র আপলোড" icon="📁">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <RequiredFieldWrapper fieldId={`field-${doc.field}`} required={doc.required || false} hasError={showError(doc.field)} isHighlighted={highlightedField === doc.field}>
            <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">
              {doc.label} {doc.required && <span className="text-[#f85c5c]">*</span>}
              {doc.sublabel && <><br /><span className="normal-case tracking-normal">{doc.sublabel}</span></>}
            </label>
            <div className={`relative border-[1.5px] border-dashed rounded-lg hover:border-[rgba(201,169,110,0.35)] hover:bg-[#0C1119] transition-all bg-[#0A0F1A] ${showError(doc.field) ? 'border-[rgba(248,92,92,0.5)]' : 'border-[rgba(201,169,110,0.1)]'}`}>
              <input
                type="file"
                accept={doc.accept}
                multiple={doc.multiple}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id={`doc-${doc.field}`}
                onChange={(e) => updateField(doc.field, e.target.files?.[0]?.name || '')}
              />
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 pointer-events-none">
                <span className="text-[20px]">{doc.icon}</span>
                <span className="text-[11px] text-[#4A4030]">
                  {formData[doc.field]
                    ? <strong className="text-[#C9A96E]">{formData[doc.field]}</strong>
                    : <>{doc.multiple ? 'Multiple files ' : 'Drop or '}<strong className="text-[#C9A96E]">{doc.multiple ? 'OK' : 'Browse'}</strong></>
                  }
                </span>
              </div>
            </div>
            {doc.required && <FieldError show={showError(doc.field)} message={`${doc.label} is required`} />}
          </RequiredFieldWrapper>
        ))}
      </div>
    </FormSection>
  );
}

function Step9References({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const hasReferences = formData.hasReferences !== false;
  const showSecondReference = formData.showSecondReference === true;
  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];
  const getFieldWrapperClass = (fieldName: string) => {
    if (highlightedField === fieldName) return 'p-3 bg-[rgba(201,169,110,0.07)] border border-[rgba(201,169,110,0.45)] rounded-lg shadow-[0_0_24px_rgba(201,169,110,0.15),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out relative before:absolute before:inset-0 before:rounded-lg before:border before:border-[rgba(201,169,110,0.22)] before:shadow-[inset_0_0_20px_rgba(201,169,110,0.08)]';
    if (showError(fieldName)) return 'p-3 rounded-lg border border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.05)] shadow-[0_0_25px_rgba(201,169,110,0.15),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-200 relative before:absolute before:inset-0 before:rounded-lg before:border before:border-[rgba(201,169,110,0.15)]';
    return '';
  };

  return (
    <FormSection title="Professional References · পেশাদার রেফারেন্স" icon="👥">
      <div className="mb-4">
        <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-3">
          Do you have professional references? · কি আপনার পেশাদার রেফারেন্স আছে?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateField('hasReferences', true)}
            className={`px-4 py-2 rounded text-[12px] transition-all ${
              hasReferences 
                ? 'bg-[#C9A96E] text-[#030508] font-medium' 
                : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,169,110,0.45)]'
            }`}
          >
            Yes, I have references
          </button>
          <button
            type="button"
            onClick={() => updateField('hasReferences', false)}
            className={`px-4 py-2 rounded text-[12px] transition-all ${
              !hasReferences 
                ? 'bg-[#f85c5c] text-white font-medium' 
                : 'bg-[#0A0F1A] border border-[rgba(201,169,110,0.1)] text-[#5A5650] hover:border-[rgba(201,80,80,0.45)]'
            }`}
          >
            No, I don't have
          </button>
        </div>
      </div>

      {hasReferences && (
        <>
          {/* Reference 1 - Required */}
          <div className="p-5 bg-[#090E16] border border-[rgba(201,169,110,0.1)] rounded-lg mb-4">
            <h3 className="text-[11px] tracking-[0.1em] uppercase text-[#C9A96E] mb-4">Reference 1</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RequiredFieldWrapper fieldId="field-ref1Name" required={true} hasError={showError('ref1Name')} isHighlighted={highlightedField === 'ref1Name'}>
                  <FormField label="Full Name" sublabel="পূর্ণ নাম" placeholder="Reference person's name" required
                    value={formData.ref1Name || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref1Name', e.target.value)}
                  />
                  <FieldError show={showError('ref1Name')} message="Reference name is required" />
                </RequiredFieldWrapper>
                <RequiredFieldWrapper fieldId="field-ref1Designation" required={true} hasError={showError('ref1Designation')} isHighlighted={highlightedField === 'ref1Designation'}>
                  <FormField label="Designation" sublabel="পদবি" placeholder="Their position" required
                    value={formData.ref1Designation || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref1Designation', e.target.value)}
                  />
                  <FieldError show={showError('ref1Designation')} message="Designation is required" />
                </RequiredFieldWrapper>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RequiredFieldWrapper fieldId="field-ref1Organization" required={true} hasError={showError('ref1Organization')} isHighlighted={highlightedField === 'ref1Organization'}>
                  <FormField label="Organization" sublabel="প্রতিষ্ঠান" placeholder="Where they work" required
                    value={formData.ref1Organization || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref1Organization', e.target.value)}
                  />
                  <FieldError show={showError('ref1Organization')} message="Organization is required" />
                </RequiredFieldWrapper>
                <RequiredFieldWrapper fieldId="field-ref1Relationship" required={true} hasError={showError('ref1Relationship')} isHighlighted={highlightedField === 'ref1Relationship'}>
                  <FormField label="Relationship" sublabel="সম্পর্ক" placeholder="e.g., Former supervisor" required
                    value={formData.ref1Relationship || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref1Relationship', e.target.value)}
                  />
                  <FieldError show={showError('ref1Relationship')} message="Relationship is required" />
                </RequiredFieldWrapper>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RequiredFieldWrapper fieldId="field-ref1Phone" required={true} hasError={showError('ref1Phone')} isHighlighted={highlightedField === 'ref1Phone'}>
                  <FormField label="Phone Number" sublabel="ফোন নম্বর" type="tel" placeholder="Contact number" required
                    value={formData.ref1Phone || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref1Phone', e.target.value)}
                  />
                  <FieldError show={showError('ref1Phone')} message="Phone number is required" />
                </RequiredFieldWrapper>
                <RequiredFieldWrapper fieldId="field-ref1Email" required={true} hasError={showError('ref1Email')} isHighlighted={highlightedField === 'ref1Email'}>
                  <FormField label="Email" sublabel="ইমেইল" type="email" placeholder="Email address" required
                    value={formData.ref1Email || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref1Email', e.target.value)}
                  />
                  <FieldError show={showError('ref1Email')} message="Email is required" />
                </RequiredFieldWrapper>
              </div>
            </div>
          </div>

          {/* Reference 2 - Optional */}
          {showSecondReference && (
            <div className="p-5 bg-[#090E16] border border-[rgba(201,169,110,0.1)] rounded-lg mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] tracking-[0.1em] uppercase text-[#C9A96E]">Reference 2</h3>
                <button 
                  type="button"
                  onClick={() => updateField('showSecondReference', false)}
                  className="w-6 h-6 rounded-full border border-[rgba(240,113,113,0.3)] bg-[rgba(240,113,113,0.15)] text-[#f07171] flex items-center justify-center text-[14px] hover:bg-[#f07171] hover:text-white transition-colors"
                  title="Remove Reference 2"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Full Name" sublabel="পূর্ণ নাম" placeholder="Reference person's name" required
                    value={formData.ref2Name || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref2Name', e.target.value)}
                  />
                  <FormField label="Designation" sublabel="পদবি" placeholder="Their position" required
                    value={formData.ref2Designation || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref2Designation', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Organization" sublabel="প্রতিষ্ঠান" placeholder="Where they work" required
                    value={formData.ref2Organization || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref2Organization', e.target.value)}
                  />
                  <FormField label="Relationship" sublabel="সম্পর্ক" placeholder="e.g., Academic mentor" required
                    value={formData.ref2Relationship || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref2Relationship', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Phone Number" sublabel="ফোন নম্বর" type="tel" placeholder="Contact number" required
                    value={formData.ref2Phone || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref2Phone', e.target.value)}
                  />
                  <FormField label="Email" sublabel="ইমেইল" type="email" placeholder="Email address" required
                    value={formData.ref2Email || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ref2Email', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {!showSecondReference && (
            <button 
              type="button"
              onClick={() => updateField('showSecondReference', true)}
              className="text-[11px] px-4 py-2 bg-[rgba(201,169,110,0.07)] border border-[rgba(201,169,110,0.2)] text-[#C9A96E] rounded hover:bg-[rgba(201,169,110,0.09)] transition-colors"
            >
              + Add Second Reference
            </button>
          )}
        </>
      )}
    </FormSection>
  );
}

function Step10Declaration({ formData, updateField, validationErrors, attemptedSubmit, highlightedField }: StepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDrawn, setSignatureDrawn] = useState(!!(formData.signatureDataURL || formData.signatureCanvas));

  // Restore saved signature drawing on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !formData.signatureDataURL) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = formData.signatureDataURL;
  }, [formData.signatureDataURL]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left) * scaleX;
    const y = (('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top) * scaleY;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#C9A96E';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left) * scaleX;
    const y = (('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top) * scaleY;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setSignatureDrawn(true);
    updateField('signatureCanvas', 'signed');
    // Save drawing to formData for persistence
    updateField('signatureDataURL', canvas.toDataURL());
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDrawn(false);
    updateField('signatureCanvas', '');
    updateField('signatureDataURL', '');
  };

  const showError = (fieldName: string) => attemptedSubmit && validationErrors[fieldName];

  return (
    <FormSection title="Declaration & Submission · ঘোষণা ও জমা" icon="✓">
      <div className="space-y-3 mb-6">
        <RequiredFieldWrapper fieldId="field-declareAccuracy" required={true} hasError={showError('declareAccuracy')} isHighlighted={highlightedField === 'declareAccuracy'}>
          <Checkbox
            checked={!!formData.declareAccuracy}
            onChange={(checked) => updateField('declareAccuracy', checked)}
            label="I hereby confirm that all information provided in this application form is true, complete, and accurate to the best of my knowledge. I understand that any false or misleading information may result in immediate disqualification or termination. · আমি এতদ্বারা নিশ্চিত করছি যে এই আবেদনপত্রে প্রদত্ত সমস্ত তথ্য আমার জ্ঞানমতে সত্য, সম্পূর্ণ এবং সঠিক। আমি বুঝি যে কোনো মিথ্যা বা বিভ্রান্তিকর তথ্যের ফলে অবিলম্বে অযোগ্যতা বা চাকরিচ্যুতি হতে পারে।"
            required
          />
          <FieldError show={showError('declareAccuracy')} message="You must confirm the accuracy of information" />
        </RequiredFieldWrapper>
        <RequiredFieldWrapper fieldId="field-declareVerification" required={true} hasError={showError('declareVerification')} isHighlighted={highlightedField === 'declareVerification'}>
          <Checkbox
            checked={!!formData.declareVerification}
            onChange={(checked) => updateField('declareVerification', checked)}
            label="I agree that the institution has the right to verify all information provided in this application, including contacting previous employers, educational institutions, and references listed herein. · আমি একমত যে প্রতিষ্ঠানের এই আবেদনে প্রদত্ত সমস্ত তথ্য যাচাই করার অধিকার আছে, যার মধ্যে রয়েছে পূর্ববর্তী নিয়োগকর্তা, শিক্ষা প্রতিষ্ঠান এবং এখানে তালিকাভুক্ত রেফারেন্সের সাথে যোগাযোগ।"
            required
          />
          <FieldError show={showError('declareVerification')} message="You must consent to verification" />
        </RequiredFieldWrapper>
        <RequiredFieldWrapper fieldId="field-declareFraud" required={true} hasError={showError('declareFraud')} isHighlighted={highlightedField === 'declareFraud'}>
          <Checkbox
            checked={!!formData.declareFraud}
            onChange={(checked) => updateField('declareFraud', checked)}
            label="I understand that submission of false information, misrepresentation of qualifications, or fraudulent documents may result in permanent cancellation of my application and possible legal consequences. · মিথ্যা তথ্য জমা দেওয়া, যোগ্যতার ভুল উপস্থাপনা, বা প্রতারণামূলক নথিপত্রের ফলে আমার আবেদনের স্থায়ী বাতিল এবং সম্ভাব্য আইনি পরিণতি হতে পারে তা আমি বুঝি।"
            required
          />
          <FieldError show={showError('declareFraud')} message="You must acknowledge the fraud declaration" />
        </RequiredFieldWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[rgba(201,169,110,0.1)]">
        <RequiredFieldWrapper fieldId="field-signatureCanvas" required={true} hasError={showError('signatureCanvas')} isHighlighted={highlightedField === 'signatureCanvas'}>
          <label className="block text-[10px] tracking-[0.12em] uppercase text-[#4A4030] mb-2">
            Applicant Signature (Draw) <span className="text-[#f85c5c]">*</span>
          </label>
          <div 
            data-required-target
            className="border-[1.5px] border-dashed border-[rgba(201,169,110,0.1)] rounded-lg overflow-hidden hover:border-[rgba(201,169,110,0.45)] transition-colors"
          >
            <canvas 
              ref={canvasRef}
              width={400} 
              height={100}
              className="block w-full h-[100px] bg-[#0A0F1A] cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex gap-2 mt-2 items-center">
            <button 
              type="button"
              onClick={clearSignature}
              className="px-3 py-1.5 text-[11px] border border-[rgba(201,169,110,0.1)] rounded text-[#4A4030] hover:border-[rgba(201,169,110,0.45)] hover:text-[#C9A96E] transition-colors"
            >
              Clear
            </button>
            {signatureDrawn && (
              <span className="text-[11px] text-[#C9A96E] flex items-center gap-1">
                <span>✓</span> Signature drawn
              </span>
            )}
          </div>
          <FieldError show={attemptedSubmit && validationErrors.signatureCanvas} message="Applicant signature is required" />
        </RequiredFieldWrapper>
        <DateField
          label="Submission Date"
          sublabel="জমার তারিখ"
          defaultValue={new Date().toISOString().split('T')[0]}
          readOnly
        />
      </div>

    </FormSection>
  );
}
