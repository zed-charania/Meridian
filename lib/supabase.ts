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
  user_id?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 1: ELIGIBILITY
  // ═══════════════════════════════════════════════════════════════
  eligibility_basis: string;
  other_basis_reason?: string;
  uscis_field_office?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 2: INFORMATION ABOUT YOU
  // ═══════════════════════════════════════════════════════════════
  // Current Legal Name
  last_name: string;
  first_name: string;
  middle_name?: string;

  // Name Change
  wants_name_change?: string;
  new_name_first?: string;
  new_name_middle?: string;
  new_name_last?: string;

  // Other Names Used
  has_used_other_names?: string;
  other_names?: string; // JSON stringified array

  // Personal Information
  date_of_birth: string;
  country_of_birth: string;
  country_of_citizenship: string;
  gender: string;

  // Parent Citizenship
  parent_us_citizen_before_18?: string;

  // Identification Numbers
  a_number?: string;
  uscis_account_number?: string;
  ssn?: string;

  // Social Security Update
  ssa_wants_card?: string;
  ssa_consent_disclosure?: string;

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
  residence_to?: string;
  residence_addresses?: string; // JSON stringified array

  // Mailing Address (if different)
  mailing_same_as_residence?: string;
  mailing_street_address?: string;
  mailing_apt_ste_flr?: string;
  mailing_in_care_of?: string;
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
  employer_zip_code?: string;
  employment_from?: string;
  employment_to?: string;
  employment_history?: string; // JSON stringified array

  // ═══════════════════════════════════════════════════════════════
  // PART 9: TIME OUTSIDE THE US
  // ═══════════════════════════════════════════════════════════════
  total_days_outside_us?: string;
  trips_over_6_months?: string;
  trips?: string; // JSON stringified array

  // ═══════════════════════════════════════════════════════════════
  // PART 10: MARITAL HISTORY
  // ═══════════════════════════════════════════════════════════════
  marital_status: string;
  times_married?: string;

  // Current Spouse Information (if married)
  spouse_is_military_member?: string;
  spouse_last_name?: string;
  spouse_first_name?: string;
  spouse_middle_name?: string;
  spouse_date_of_birth?: string;
  spouse_date_of_marriage?: string;
  spouse_is_us_citizen?: string;
  spouse_citizenship_by_birth?: string;
  spouse_date_became_citizen?: string;
  spouse_address_same_as_applicant?: string;
  spouse_a_number?: string;
  spouse_times_married?: string;
  spouse_country_of_birth?: string;
  spouse_current_employer?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 11: CHILDREN
  // ═══════════════════════════════════════════════════════════════
  total_children?: string;
  children?: string; // JSON stringified array
  providing_support_for_children?: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 12: ADDITIONAL QUESTIONS (Yes/No)
  // ═══════════════════════════════════════════════════════════════
  // General Eligibility
  q_claimed_us_citizen?: string;
  q_voted_in_us?: string;
  q_failed_to_file_taxes?: string;
  q_nonresident_alien_tax?: string;
  q_owe_taxes?: string;
  q_title_of_nobility?: string;
  q_willing_to_give_up_titles?: string;
  q_titles_list?: string;

  // Affiliations
  q_communist_party?: string;
  q_advocated_overthrow?: string;
  q_terrorist_org?: string;
  q_genocide?: string;
  q_torture?: string;
  q_killing_person?: string;
  q_sexual_contact_nonconsent?: string;
  q_severely_injuring?: string;
  q_religious_persecution?: string;
  q_harm_race_religion?: string;

  // Weapons and Violence
  q_used_weapon_explosive?: string;
  q_kidnapping_assassination_hijacking?: string;
  q_threatened_weapon_violence?: string;

  // Military/Police Service
  q_military_police_service?: string;
  q_armed_group?: string;
  q_detention_facility?: string;
  q_group_used_weapons?: string;
  q_used_weapon_against_person?: string;
  q_threatened_weapon_use?: string;
  q_weapons_training?: string;
  q_sold_provided_weapons?: string;
  q_recruited_under_15?: string;
  q_used_under_15_hostilities?: string;

  // Crimes and Offenses
  q_arrested?: string;
  q_committed_crime_not_arrested?: string;
  crimes?: string; // JSON stringified array
  q_completed_probation?: string;

  // Moral Character
  q_habitual_drunkard?: string;
  q_prostitution?: string;
  q_controlled_substances?: string;
  q_marriage_fraud?: string;
  q_polygamy?: string;
  q_helped_illegal_entry?: string;
  q_illegal_gambling?: string;
  q_failed_child_support?: string;
  q_misrepresentation_public_benefits?: string;

  // Immigration Violations
  q_false_info_us_government?: string;
  q_lied_us_government?: string;
  q_removed_deported?: string;
  q_removal_proceedings?: string;

  // Selective Service
  q_male_18_26_lived_us?: string;
  q_registered_selective_service?: string;
  selective_service_number?: string;
  selective_service_date?: string;

  // Military Service
  q_left_us_avoid_draft?: string;
  q_applied_military_exemption?: string;
  q_served_us_military?: string;
  q_current_military_member?: string;
  q_scheduled_deploy?: string;
  q_stationed_outside_us?: string;
  q_former_military_outside_us?: string;
  q_discharged_because_alien?: string;
  q_court_martialed?: string;
  q_deserted_military?: string;

  // Oath of Allegiance
  q_support_constitution?: string;
  q_understand_oath?: string;
  q_unable_oath_disability?: string;
  q_willing_take_oath?: string;
  q_willing_bear_arms?: string;
  q_willing_noncombatant?: string;
  q_willing_work_national_importance?: string;

  // Additional Information
  additional_information?: string; // JSON stringified array

  // ═══════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════
  created_at?: string;
  updated_at?: string;
  status?: string;
  current_step?: number;
}

export interface N400FormRecord {
  id?: string;
  user_id?: string;
  payload: N400FormData;
  created_at?: string;
  updated_at?: string;
  status?: string;
}
