import { createClient } from "@supabase/supabase-js";

// Client for server-side operations (with service role key)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Client for client-side operations (with anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Database types for N-400 form
export interface N400FormData {
  id?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 1: ELIGIBILITY
  // ═══════════════════════════════════════════════════════════════
  eligibility_basis: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 2: INFORMATION ABOUT YOU
  // ═══════════════════════════════════════════════════════════════
  // Current Legal Name
  last_name: string;
  first_name: string;
  middle_name?: string;

  // Other Names Used
  has_used_other_names?: string;
  other_names?: string; // JSON stringified array

  // Personal Information
  date_of_birth: string;
  country_of_birth: string;
  country_of_citizenship: string;
  gender: string;

  // Identification Numbers
  a_number?: string;
  uscis_account_number?: string;
  ssn?: string;

  // Green Card Information
  date_became_permanent_resident: string;

  // Disability Accommodations
  request_disability_accommodations?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 4: CONTACT INFORMATION
  // ═══════════════════════════════════════════════════════════════
  daytime_phone: string;
  mobile_phone?: string;
  email: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 5: RESIDENCE INFORMATION
  // ═══════════════════════════════════════════════════════════════
  // Current Address
  street_address: string;
  apt_ste_flr?: string;
  city: string;
  state: string;
  zip_code: string;
  residence_from?: string;

  // Mailing Address (if different)
  mailing_same_as_residence?: string;
  mailing_street_address?: string;
  mailing_city?: string;
  mailing_state?: string;
  mailing_zip_code?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 7: BIOGRAPHIC INFORMATION
  // ═══════════════════════════════════════════════════════════════
  ethnicity?: string;
  race?: string;
  height_feet?: string;
  height_inches?: string;
  weight?: string;
  eye_color?: string;
  hair_color?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 8: EMPLOYMENT
  // ═══════════════════════════════════════════════════════════════
  current_employer?: string;
  current_occupation?: string;
  employer_city?: string;
  employer_state?: string;
  employment_from?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 9: TIME OUTSIDE THE US
  // ═══════════════════════════════════════════════════════════════
  total_days_outside_us?: string;
  trips_over_6_months?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 10: MARITAL HISTORY
  // ═══════════════════════════════════════════════════════════════
  marital_status: string;
  times_married?: string;

  // Current Spouse Information (if married)
  spouse_last_name?: string;
  spouse_first_name?: string;
  spouse_middle_name?: string;
  spouse_date_of_birth?: string;
  spouse_date_of_marriage?: string;
  spouse_is_us_citizen?: string;
  spouse_a_number?: string;
  spouse_country_of_birth?: string;
  spouse_current_employer?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 11: CHILDREN
  // ═══════════════════════════════════════════════════════════════
  total_children?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 12: ADDITIONAL QUESTIONS (Yes/No)
  // ═══════════════════════════════════════════════════════════════
  // General Eligibility
  q_claimed_us_citizen?: string;
  q_voted_in_us?: string;
  q_failed_to_file_taxes?: string;
  q_owe_taxes?: string;
  q_title_of_nobility?: string;

  // Affiliations
  q_communist_party?: string;
  q_terrorist_org?: string;
  q_genocide?: string;
  q_torture?: string;

  // Moral Character
  q_arrested?: string;
  q_habitual_drunkard?: string;
  q_prostitution?: string;
  q_illegal_gambling?: string;
  q_failed_child_support?: string;

  // Military
  q_served_us_military?: string;
  q_deserted_military?: string;

  // ═══════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════
  created_at?: string;
  updated_at?: string;
  status?: string;
}
