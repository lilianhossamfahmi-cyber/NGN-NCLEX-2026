/**
 * Master NGN Question Creator - Core Type Definitions
 * v2.0 - Extended for Advanced AI Generation, Copyright Safety, and Batching
 */

export type ImplementationStatus = 'Planned' | 'In Progress' | 'Completed';

// --- TIER 4: STRICT TYPE REGISTRY ---
export type StrictItemType =
  | 'multiple-choice'
  | 'multiple-response'
  | 'matrix'
  // NGN TYPES
  | 'bow-tie'
  | 'highlight'
  | 'ordered-response'
  | 'drop-cloze'
  | 'case-study'
  | 'trend'
  | 'split-screen';

export interface QuestionTypeDefinition {
  typeId: StrictItemType | string; // Use strict type, fallback to string
  typeName: string;
  description: string;
  status: ImplementationStatus;
  version: string;
  lastUpdated: string; // 2026-01-02
  config?: QuestionTypeConfig;
}

export interface QuestionTypeConfig {
  typeId: string;
  initialContent: Record<string, any>;
  uiSchema: {
    layout: 'single-page' | 'tabbed-steps' | 'split-pane';
    sections: FormSection[];
  };
  validation: Record<string, any>;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'rich-text' | 'number' | 'select' | 'checkbox' | 'array' | 'matrix' | 'date-time' | 'temperature' | 'clinical-focus' | 'custom';
  required?: boolean;
  helpText?: string;
  options?: { label: string; value: string }[];
  arrayConfig?: {
    itemSchema: FormField[];
  };
}

// --- v2.0: DATA SOURCES & REFERENCE ---

export type ReferenceFileType = 'pdf' | 'docx' | 'csv' | 'json';
export type CopyrightLicense = 'public_domain' | 'cc_by' | 'cc_by_sa' | 'proprietary' | 'ncsbn_official';

export interface ReferenceSource {
  referenceId: string;
  fileName: string;
  fileType: ReferenceFileType;
  uploadDate: string;
  uploadedBy: string;
  topicTags: string[]; // Auto-tagged + Manual
  clinicalDomains?: string[]; // e.g. "Physiological Integrity"
  copyrightStatus: CopyrightLicense;
  citationText?: string; // Auto-generated citation
  isActive: boolean;
  contentSummary?: string;
}

export type InputMode = 'upload' | 'manual' | 'ai' | 'hybrid';

// --- v2.0: GENERATION SETTINGS ---

export interface GenerationSettings {
  mode: InputMode;
  selectedReferenceIds: string[];
  manualContext?: string; // The pasted/typed clinical data
  aiPrompt?: string; // The user's scenario description

  targetTypes: string[]; // List of typeIds to generate. Includes 'mix-all'.
  quantityPerType: number; // 1-50

  clinicalFocus: string[]; // Multi-select from taxonomy
  customClinicalFocus?: string; // Free text focus
  difficultyLevel: number; // 1-5

  temperature: number; // 0.0 - 2.0

  advanced: {
    includeAnswerKeys: boolean;
    includeRationales: boolean;
    detectDuplicates: boolean;
    flagCopyright: boolean;
    paraphraseStrictness: 'loose' | 'standard' | 'strict';
  };
}

// --- v2.0: SAFETY & QUALITY ---

export interface AIDuplicateCheck {
  isDuplicate: boolean;
  similarityScore: number; // 0-100
  originalItemId?: string;
}

export type AIValidationStatus = 'Pass' | 'Warnings' | 'Fail';

export interface AIValidationIssue {
  type: 'content' | 'safety' | 'format';
  severity: 'info' | 'warning' | 'error';
  message: string;
  proposedFix?: string;
}

export interface AIAutoFixEntry {
  timestamp: string;
  performedBy: 'system' | 'user';
  beforeText?: string;
  afterText?: string;
  description: string;
}

export interface AISafetyCheck {
  runId: string;
  timestamp: string;
  copyrightScore: number;
  duplicationCheck: AIDuplicateCheck;
  validationStatus: AIValidationStatus;
  issues: AIValidationIssue[];
  autoFixHistory: AIAutoFixEntry[];
}

export interface BatchGenerationInfo {
  batchId: string;
  batchSize: number;
  temperature: number;
  generationDate: string;
}

export interface TemperatureValue {
  tempF: number;
  tempC: number;
}

// --- UPDATED: Generic Item Schema ---

export interface MasterQuestionItem {
  id: string;
  typeId: string; // The NGN Type
  type?: string;  // Alias used by pipeline and legacy components
  tags?: string[];

  // Metadata for Source & Generation
  metadata: {
    title: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'in-review' | 'approved' | 'published' | 'archived';

    // v2.0 Fields
    sourceOrigin: InputMode;
    sourceReferences: string[]; // Array of referenceIds
    batchInfo?: BatchGenerationInfo;
    qualityScore?: number; // 0-100
    hasStudentPreview: boolean;
    allowed_modes?: string[]; // e.g., ["tutor", "exam", "survival"]
  };

  // Standard NGN Attributes extended
  pedagogy: {
    difficultyLevel: number; // 1-5
    cjmmPhase?: string;
    clinicalFocus: string; // Primary focus
    clinicalFocusTopics?: string[]; // Secondary tags
  };

  // AI Safety Layer
  aiSafetyChecks?: AISafetyCheck;

  // The specific data payload (The "Item")
  content: Record<string, any>;
}
