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
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE n400_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE n400_forms ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own forms
CREATE POLICY "Users can manage own forms" ON n400_forms
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role (server actions) can do everything
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
