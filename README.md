# N-400 Form Application

A Next.js application for completing USCIS Form N-400 (Application for Naturalization) and generating filled PDFs.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   FRONTEND   │     │   NEXT.JS    │     │   pdf-lib    │
│  React Form  │────▶│  API Route   │────▶│  PDF Filler  │
│  Component   │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                         │
       │ Save form data                          │ Fill PDF fields
       ▼                                         ▼
┌──────────────┐                         ┌──────────────┐
│   SUPABASE   │                         │   N-400.pdf  │
│  PostgreSQL  │                         │   Template   │
└──────────────┘                         └──────────────┘
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE n400_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Eligibility
  eligibility_basis TEXT,
  
  -- Personal Information
  last_name TEXT,
  first_name TEXT,
  middle_name TEXT,
  other_last_names TEXT,
  other_first_names TEXT,
  date_of_birth DATE,
  country_of_birth TEXT,
  
  -- Contact
  daytime_phone TEXT,
  mobile_phone TEXT,
  email TEXT,
  
  -- Physical Address
  street_address TEXT,
  apt_ste_flr TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Mailing Address
  mailing_street_address TEXT,
  mailing_apt_ste_flr TEXT,
  mailing_city TEXT,
  mailing_state TEXT,
  mailing_zip_code TEXT,
  
  -- Identification
  ssn TEXT,
  uscis_account_number TEXT,
  a_number TEXT,
  
  -- Demographics
  gender TEXT,
  marital_status TEXT,
  
  -- Citizenship
  current_citizenship TEXT,
  
  -- Green Card
  green_card_number TEXT,
  date_became_permanent_resident DATE,
  class_of_admission TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'submitted'
);

-- Enable Row Level Security
ALTER TABLE n400_forms ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can do everything" ON n400_forms
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 4. Add the N-400 PDF Template

1. Download the official fillable N-400 PDF from [USCIS](https://www.uscis.gov/n-400)
2. Place it in the `templates/` folder as `n-400.pdf`

### 5. Inspect PDF Field Names

To map your form data to the correct PDF fields, run this to get field names:

```bash
# Visit the API endpoint to list all fields
curl http://localhost:3000/api/generate-n400
```

Then update `lib/pdf-utils.ts` with the correct field names.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
n400-form/
├── app/
│   ├── page.tsx                    # Home page with form
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── api/
│   │   └── generate-n400/
│   │       └── route.ts            # PDF generation API
│   └── actions/
│       └── n400-form.ts            # Server actions for DB
├── components/
│   └── n400-form.tsx               # Multi-step form component
├── lib/
│   ├── supabase.ts                 # Supabase client & types
│   └── pdf-utils.ts                # PDF field mapping
├── templates/
│   └── n-400.pdf                   # Blank N-400 form (add this)
└── package.json
```

## Key Dependencies

- **Next.js 15** - React framework
- **react-hook-form** - Form state management
- **Zod** - Schema validation
- **pdf-lib** - PDF manipulation
- **@supabase/supabase-js** - Database client
- **lucide-react** - Icons

## Deployment

Deploy to Vercel for the simplest setup:

```bash
npm install -g vercel
vercel
```

Make sure to add your environment variables in the Vercel dashboard.

## Notes

- The PDF field names in `lib/pdf-utils.ts` are placeholders. You **must** inspect your actual N-400 PDF to get the correct field names.
- This application is a form-filling assistant. Always verify completed forms against official USCIS guidelines before submission.
- Sensitive data (SSN, A-Number) should be handled with appropriate security measures in production.
