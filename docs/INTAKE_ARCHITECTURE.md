# N-400 Intake Form Architecture

## Overview

This document describes the architecture of the N-400 intake form and the "Meridian Guidance Pattern" for question screens.

## File Structure

```
n400-form/
├── app/
│   ├── form/page.tsx          # Entry point - renders N400Form
│   ├── globals.css            # Global styles including guidance pattern
│   └── actions/n400-form.ts   # Server action for form submission
├── components/
│   ├── n400-form.tsx          # Main form component (~2900 lines)
│   └── ui/
│       ├── guidance-header.tsx # Reusable guidance header component
│       └── ever-callout.tsx    # Part 9 "EVER" callout component
├── lib/
│   ├── types/
│   │   └── guidance.ts        # TypeScript types for guidance pattern
│   ├── question-metadata.ts   # Question metadata for Parts 1 & 9
│   ├── pdf-utils.ts           # PDF generation utilities
│   └── supabase.ts            # Database client
└── docs/
    └── INTAKE_ARCHITECTURE.md # This file
```

## Key Components

### 1. N400Form (`components/n400-form.tsx`)

The main form component containing:
- **Zod Schema**: Comprehensive validation for all N-400 fields
- **STEPS Array**: Step definitions with `{id, section, title, part}`
- **State Management**: `currentStep`, form values via react-hook-form
- **Field Arrays**: Dynamic arrays for trips, children, crimes, etc.
- **InfoIcon**: Tooltip component for USCIS text
- **YesNoField**: Reusable yes/no radio component

### 2. Guidance Pattern Components

#### GuidanceHeader (`components/ui/guidance-header.tsx`)
Displays the Meridian Guidance Pattern header:
- Part label (e.g., "Part 9 • Background")
- Plain English title
- Intent text (why USCIS asks this)
- Guardrail/reassurance text
- Optional "View USCIS wording" toggle

#### EverCallout (`components/ui/ever-callout.tsx`)
Persistent callout for Part 9:
- Reminds users that "EVER" applies to any time in their life, anywhere in the world.

### 3. Question Metadata (`lib/question-metadata.ts`)

Structured metadata for each question supporting:
```typescript
interface QuestionMetadata {
  id: string;           // Form field name
  part: string;         // N-400 Part number
  item: string;         // Item number (e.g., "15.b")
  title: string;        // Plain English title
  uscis_text: string;   // Official USCIS wording
  intent: string;       // Why USCIS asks this
  guardrail?: string;   // Reassurance text
  show_when?: {...};    // Conditional visibility
  explanation_required?: boolean; // Needs Part 14 explanation
}
```

## Current Guidance Implementation

The guidance pattern is currently implemented for:
- **Part 1 (Step 1)**: Eligibility
- **Part 9 (Step 10)**: Background Questions

### How It Works

1. In `n400-form.tsx`, the form card checks `currentStep`:
   - Steps 1 and 10 use `GuidanceHeader` with metadata from `question-metadata.ts`
   - Other steps use the default header pattern

2. For Part 9, the `EverCallout` component is rendered at the top of the section.

3. Metadata is loaded from `PART_1_METADATA` and `PART_9_METADATA` exports.

## Adding Guidance to More Parts

To add the guidance pattern to additional parts:

1. **Add Metadata** in `lib/question-metadata.ts`:
   ```typescript
   export const PART_N_METADATA: StepMetadata = {
     id: X,
     section: 'SECTION_NAME',
     title: 'Plain English Title',
     part: 'Part N',
     intent: 'USCIS uses this to...',
     guardrail: 'You can review...',
     questions: [ /* QuestionMetadata[] */ ],
   };
   ```

2. **Import** in `n400-form.tsx`:
   ```typescript
   import { PART_N_METADATA } from "@/lib/question-metadata";
   ```

3. **Add Conditional** in the form card header section:
   ```tsx
   {currentStep === X && (
     <GuidanceHeader
       partLabel={`${PART_N_METADATA.part} • ${PART_N_METADATA.section}`}
       title={PART_N_METADATA.title}
       intent={PART_N_METADATA.intent}
       guardrail={PART_N_METADATA.guardrail}
     />
   )}
   ```

4. **Update Default Condition** to exclude the new step:
   ```tsx
   {currentStep !== 1 && currentStep !== 10 && currentStep !== X && ( ... )}
   ```

## Additional Information Capture

When a user answers "Yes" to a question marked with `explanation_required: true`, the explanation should be captured in the Part 14 Additional Information format:

```typescript
interface AdditionalInfoEntry {
  page: number;           // N-400 page number
  part: number;           // Part number (e.g., 9)
  item: string;           // Item number (e.g., "15.b")
  explanation_text: string; // User's explanation
}
```

This structure is defined but not yet fully integrated into the form state. Future implementation should:
1. Track which "Yes" answers need explanations
2. Prompt for explanations inline or in a dedicated Part 14 step
3. Map explanations to the PDF generation flow

## Styling

Guidance pattern styles are in `app/globals.css`:
- `.guidance-header` - Main header container
- `.guidance-title` - Plain English title
- `.guidance-intent` - Intent explanation text
- `.guidance-guardrail` - Reassurance text (italic)
- `.guidance-toggle-btn` - USCIS wording toggle button
- `.guidance-uscis-text` - Expanded USCIS text
- `.ever-callout` - Part 9 EVER warning box

## Content Guidelines

When writing guidance content:

1. **Use neutral language**: "USCIS uses this to assess..." not "This is important because..."
2. **No advice or steering**: Never say things like "traffic tickets don't count"
3. **No examples with specific guidance**: Avoid "answer No if you were only..." 
4. **Keep intent descriptive**: Explain what USCIS does with the information, not what the user should do
5. **Guardrails are reassuring**: "You can review this later before finalizing"
