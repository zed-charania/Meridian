"use client";

import { AlertCircle } from "lucide-react";
import type { EverCalloutProps } from "@/lib/types/guidance";

/**
 * EverCallout Component
 * 
 * Persistent callout for Part 9 questions that use "EVER" language.
 * Signals broad time and location scope in USCIS forms.
 */

const DEFAULT_EVER_TEXT = 'In USCIS forms, \'EVER\' signals broad time and location scope.';

export function EverCallout({ text = DEFAULT_EVER_TEXT }: EverCalloutProps) {
  return (
    <div className="ever-callout" role="alert">
      <div className="ever-callout-icon">
        <AlertCircle size={18} />
      </div>
      <p className="ever-callout-text">{text}</p>
    </div>
  );
}

export default EverCallout;
