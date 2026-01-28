/**
 * Meridian Guidance Pattern - Type Definitions
 * 
 * This module defines the data structures for the guidance layer
 * that enhances each question in the N-400 intake form.
 */

/**
 * Metadata for an individual question within a step.
 * Supports the "Meridian Guidance Pattern" with optional copy elements.
 */
export interface QuestionMetadata {
  /** Unique identifier matching the form field name */
  id: string;
  
  /** N-400 Part number (e.g., "Part 1", "Part 9") */
  part: string;
  
  /** Item number within the part (e.g., "1.a", "15.b") */
  item: string;
  
  /** Plain English question title (without changing meaning) */
  title: string;
  
  /** Official USCIS wording for the question */
  uscis_text: string;
  
  /** One-sentence explanation of why USCIS asks this (descriptive only) */
  intent: string;
  
  /** One-sentence reassurance/guardrail text */
  guardrail?: string;
  
  /** 
   * Condition for when this question should be shown.
   * References other field names and values.
   * Example: { field: "q_served_us_military", value: "yes" }
   */
  show_when?: {
    field: string;
    value: string | string[];
  };
  
  /** 
   * If true, answering "Yes" requires an explanation that will
   * be captured in Part 14 Additional Information format.
   */
  explanation_required?: boolean;
}

/**
 * Structured entry for Part 14 Additional Information.
 * Captures explanations for questions answered "Yes".
 */
export interface AdditionalInfoEntry {
  /** Page number in the N-400 form */
  page: number;
  
  /** Part number (e.g., 9) */
  part: number;
  
  /** Item number (e.g., "15.b") */
  item: string;
  
  /** The explanation text provided by the user */
  explanation_text: string;
}

/**
 * Extended step metadata that includes guidance elements.
 */
export interface StepMetadata {
  /** Step ID (1-based) */
  id: number;
  
  /** Section name in uppercase */
  section: string;
  
  /** Plain English step title */
  title: string;
  
  /** N-400 Part label (e.g., "Part 1") */
  part: string;
  
  /** One-sentence intent for the entire section */
  intent?: string;
  
  /** Guardrail/reassurance text for the section */
  guardrail?: string;
  
  /** Array of question metadata for this step */
  questions?: QuestionMetadata[];
  
  /** Persistent callout to show at the top of this section */
  callout?: {
    type: 'info' | 'warning' | 'ever';
    text: string;
  };
}

/**
 * Props for the GuidanceHeader component
 */
export interface GuidanceHeaderProps {
  /** Part label (e.g., "Part 9 • Additional Information") */
  partLabel?: string;
  
  /** Plain English title */
  title: string;
  
  /** One-sentence intent text */
  intent?: string;
  
  /** Guardrail/reassurance text */
  guardrail?: string;
  
  /** Official USCIS wording (for toggle) */
  uscisText?: string;
  
  /** Whether to show the USCIS toggle (default: true if uscisText provided) */
  showToggle?: boolean;
}

/**
 * Props for the EverCallout component
 */
export interface EverCalloutProps {
  /** Custom text override */
  text?: string;
}
