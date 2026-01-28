"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { GuidanceHeaderProps } from "@/lib/types/guidance";

/**
 * GuidanceHeader Component
 * 
 * Displays the "Meridian Guidance Pattern" header for question screens:
 * - Part label (e.g., "Part 9 • Additional Information")
 * - Plain English title
 * - Intent text explaining why USCIS asks this
 * - Guardrail/reassurance text
 * - Optional toggle to view official USCIS wording
 */
export function GuidanceHeader({
  partLabel,
  title,
  intent,
  guardrail,
  uscisText,
  showToggle = true,
}: GuidanceHeaderProps) {
  const [showUscisWording, setShowUscisWording] = useState(false);

  return (
    <div className="guidance-header">
      {/* Part Label */}
      {partLabel && (
        <div className="section-label">{partLabel}</div>
      )}
      
      {/* Plain English Title */}
      <h1 className="guidance-title">{title}</h1>
      
      {/* Intent Text */}
      {intent && (
        <p className="guidance-intent">{intent}</p>
      )}
      
      {/* Guardrail/Reassurance Text */}
      {guardrail && (
        <p className="guidance-guardrail">{guardrail}</p>
      )}
      
      {/* USCIS Wording Toggle */}
      {uscisText && showToggle && (
        <div className="guidance-uscis-toggle">
          <button
            type="button"
            onClick={() => setShowUscisWording(!showUscisWording)}
            className="guidance-toggle-btn"
            aria-expanded={showUscisWording}
          >
            {showUscisWording ? (
              <>
                <ChevronUp size={16} />
                <span>Hide USCIS wording</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>View USCIS wording</span>
              </>
            )}
          </button>
          
          {showUscisWording && (
            <div className="guidance-uscis-text">
              {uscisText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GuidanceHeader;
