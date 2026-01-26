"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HelpCircle, Plus, Trash2 } from "lucide-react";
import { submitN400Form } from "@/app/actions/n400-form";

// Comprehensive Zod validation schema for N-400
const n400Schema = z.object({
  // ═══════════════════════════════════════════════════════════════
  // PART 1: ELIGIBILITY
  // ═══════════════════════════════════════════════════════════════
  eligibility_basis: z.string().min(1, "Please select your eligibility basis"),
  other_basis_reason: z.string().optional(),
  uscis_field_office: z.string().optional(), // For INA section 319(b) filers

  // ═══════════════════════════════════════════════════════════════
  // PART 2: INFORMATION ABOUT YOU
  // ═══════════════════════════════════════════════════════════════
  // Current Legal Name
  last_name: z.string().min(1, "Last name is required"),
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),

  // Name Change
  wants_name_change: z.string().optional(),
  new_name_first: z.string().optional(),
  new_name_middle: z.string().optional(),
  new_name_last: z.string().optional(),

  // Other Names Used
  has_used_other_names: z.string().optional(),
  other_names: z.array(z.object({
    family_name: z.string(),
    given_name: z.string(),
    middle_name: z.string().optional(),
  })).optional(),

  // Personal Information
  date_of_birth: z.string().min(1, "Date of birth is required"),
  country_of_birth: z.string().min(1, "Country of birth is required"),
  country_of_citizenship: z.string().min(1, "Country of citizenship is required"),
  gender: z.string().min(1, "Gender is required"),

  // Parent Citizenship
  parent_us_citizen_before_18: z.string().optional(),

  // Identification Numbers
  a_number: z.string().optional(),
  uscis_account_number: z.string().optional(),
  ssn: z.string().optional(),

  // Social Security Update
  ssa_wants_card: z.string().optional(),
  ssa_consent_disclosure: z.string().optional(),

  // Green Card Information
  date_became_permanent_resident: z.string().min(1, "Date is required"),

  // Disability Accommodations
  request_disability_accommodations: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 4: CONTACT INFORMATION
  // ═══════════════════════════════════════════════════════════════
  daytime_phone: z.string().min(1, "Phone number is required"),
  mobile_phone: z.string().optional(),
  email: z.string().email("Please enter a valid email"),

  // ═══════════════════════════════════════════════════════════════
  // PART 5: RESIDENCE INFORMATION
  // ═══════════════════════════════════════════════════════════════
  // Physical Addresses (array for multiple addresses)
  residence_addresses: z.array(z.object({
    street_address: z.string(),
    apt_ste_flr: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    zip_code: z.string().optional(),
    country: z.string().optional(),
    province: z.string().optional(),
    postal_code: z.string().optional(),
    dates_from: z.string(),
    dates_to: z.string().optional(),
  })).optional(),
  
  // Current Address (for backward compatibility)
  street_address: z.string().min(1, "Street address is required"),
  apt_ste_flr: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(5, "ZIP code is required"),
  residence_from: z.string().optional(),
  residence_to: z.string().optional(),

  // Mailing Address (if different)
  mailing_same_as_residence: z.string().optional(),
  mailing_street_address: z.string().optional(),
  mailing_apt_ste_flr: z.string().optional(),
  mailing_in_care_of: z.string().optional(),
  mailing_city: z.string().optional(),
  mailing_state: z.string().optional(),
  mailing_zip_code: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 7: BIOGRAPHIC INFORMATION
  // ═══════════════════════════════════════════════════════════════
  ethnicity: z.string().min(1, "Ethnicity is required"),
  race: z.string().min(1, "Race is required"), // Form allows multiple but we'll handle as string for now
  height_feet: z.string().min(1, "Height is required"),
  height_inches: z.string().optional(),
  weight: z.string().min(1, "Weight is required"),
  eye_color: z.string().min(1, "Eye color is required"),
  hair_color: z.string().min(1, "Hair color is required"),

  // ═══════════════════════════════════════════════════════════════
  // PART 8: EMPLOYMENT
  // ═══════════════════════════════════════════════════════════════
  // Employment History (array for multiple entries)
  employment_history: z.array(z.object({
    employer_or_school: z.string(),
    occupation_or_field: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip_code: z.string().optional(),
    country: z.string().optional(),
    province: z.string().optional(),
    postal_code: z.string().optional(),
    dates_from: z.string(),
    dates_to: z.string().optional(),
  })).optional(),
  
  // Current Employment (for backward compatibility)
  current_employer: z.string().optional(),
  current_occupation: z.string().optional(),
  employer_city: z.string().optional(),
  employer_state: z.string().optional(),
  employer_zip_code: z.string().optional(),
  employment_from: z.string().optional(),
  employment_to: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 9: TIME OUTSIDE THE US
  // ═══════════════════════════════════════════════════════════════
  // Trip Details (array)
  trips: z.array(z.object({
    date_left_us: z.string(),
    date_returned_us: z.string(),
    countries_traveled: z.string(),
  })).optional(),
  
  total_days_outside_us: z.string().optional(),
  trips_over_6_months: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 10: MARITAL HISTORY
  // ═══════════════════════════════════════════════════════════════
  marital_status: z.string().min(1, "Marital status is required"),
  times_married: z.string().optional(),
  
  // Current Spouse Information (if married)
  spouse_is_military_member: z.string().optional(),
  spouse_last_name: z.string().optional(),
  spouse_first_name: z.string().optional(),
  spouse_middle_name: z.string().optional(),
  spouse_date_of_birth: z.string().optional(),
  spouse_date_of_marriage: z.string().optional(),
  spouse_is_us_citizen: z.string().optional(),
  spouse_citizenship_by_birth: z.string().optional(),
  spouse_date_became_citizen: z.string().optional(),
  spouse_address_same_as_applicant: z.string().optional(),
  spouse_a_number: z.string().optional(),
  spouse_times_married: z.string().optional(),
  spouse_country_of_birth: z.string().optional(),
  spouse_current_employer: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 11: CHILDREN
  // ═══════════════════════════════════════════════════════════════
  total_children: z.string().optional(),
  children: z.array(z.object({
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.string(),
    residence: z.string(), // resides with me, does not reside with me, unknown/missing
    relationship: z.string(), // biological son/daughter, stepchild, legally adopted
  })).optional(),
  providing_support_for_children: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 12: ADDITIONAL QUESTIONS (Yes/No)
  // ═══════════════════════════════════════════════════════════════
  // General Eligibility
  q_claimed_us_citizen: z.string().optional(),
  q_voted_in_us: z.string().optional(),
  q_failed_to_file_taxes: z.string().optional(),
  q_nonresident_alien_tax: z.string().optional(),
  q_owe_taxes: z.string().optional(),
  q_title_of_nobility: z.string().optional(),
  q_willing_to_give_up_titles: z.string().optional(),

  // Affiliations
  q_communist_party: z.string().optional(),
  q_advocated_overthrow: z.string().optional(),
  q_terrorist_org: z.string().optional(),
  q_genocide: z.string().optional(),
  q_torture: z.string().optional(),
  q_killing_person: z.string().optional(),
  q_sexual_contact_nonconsent: z.string().optional(),
  q_severely_injuring: z.string().optional(),
  q_religious_persecution: z.string().optional(),
  q_harm_race_religion: z.string().optional(),

  // Weapons and Violence
  q_used_weapon_explosive: z.string().optional(),
  q_kidnapping_assassination_hijacking: z.string().optional(),
  q_threatened_weapon_violence: z.string().optional(),

  // Military/Police Service
  q_military_police_service: z.string().optional(),
  q_armed_group: z.string().optional(),
  q_detention_facility: z.string().optional(),
  q_group_used_weapons: z.string().optional(),
  q_used_weapon_against_person: z.string().optional(),
  q_threatened_weapon_use: z.string().optional(),
  q_weapons_training: z.string().optional(),
  q_sold_provided_weapons: z.string().optional(),
  q_recruited_under_15: z.string().optional(),
  q_used_under_15_hostilities: z.string().optional(),

  // Crimes and Offenses
  q_arrested: z.string().optional(),
  q_committed_crime_not_arrested: z.string().optional(),
  crimes: z.array(z.object({
    date_of_crime: z.string().optional(),
    date_of_conviction: z.string().optional(),
    crime_description: z.string().optional(),
    place_of_crime: z.string().optional(),
    result_disposition: z.string().optional(),
    sentence: z.string().optional(),
  })).optional(),
  q_completed_probation: z.string().optional(),

  // Moral Character
  q_habitual_drunkard: z.string().optional(),
  q_prostitution: z.string().optional(),
  q_controlled_substances: z.string().optional(),
  q_marriage_fraud: z.string().optional(),
  q_polygamy: z.string().optional(),
  q_helped_illegal_entry: z.string().optional(),
  q_illegal_gambling: z.string().optional(),
  q_failed_child_support: z.string().optional(),
  q_misrepresentation_public_benefits: z.string().optional(),

  // Immigration Violations
  q_false_info_us_government: z.string().optional(),
  q_lied_us_government: z.string().optional(),
  q_removed_deported: z.string().optional(),
  q_removal_proceedings: z.string().optional(),

  // Selective Service
  q_male_18_26_lived_us: z.string().optional(),
  q_registered_selective_service: z.string().optional(),
  selective_service_number: z.string().optional(),
  selective_service_date: z.string().optional(),

  // Military Service
  q_left_us_avoid_draft: z.string().optional(),
  q_applied_military_exemption: z.string().optional(),
  q_served_us_military: z.string().optional(),
  q_current_military_member: z.string().optional(),
  q_scheduled_deploy: z.string().optional(),
  q_stationed_outside_us: z.string().optional(),
  q_former_military_outside_us: z.string().optional(),
  q_discharged_because_alien: z.string().optional(),
  q_court_martialed: z.string().optional(),
  q_deserted_military: z.string().optional(),

  // Oath of Allegiance
  q_support_constitution: z.string().optional(),
  q_understand_oath: z.string().optional(),
  q_unable_oath_disability: z.string().optional(),
  q_willing_take_oath: z.string().optional(),
  q_willing_bear_arms: z.string().optional(),
  q_willing_noncombatant: z.string().optional(),
  q_willing_work_national_importance: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 10: FEE REDUCTION
  // ═══════════════════════════════════════════════════════════════
  fee_reduction_requested: z.string().optional(),
  household_income: z.string().optional(),
  household_size: z.string().optional(),
  household_income_earners: z.string().optional(),
  is_head_of_household: z.string().optional(),
  head_of_household_name: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 11: APPLICANT SIGNATURE
  // ═══════════════════════════════════════════════════════════════
  applicant_signature: z.string().optional(),
  signature_date: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 12: INTERPRETER
  // ═══════════════════════════════════════════════════════════════
  used_interpreter: z.string().optional(),
  interpreter_first_name: z.string().optional(),
  interpreter_last_name: z.string().optional(),
  interpreter_business_name: z.string().optional(),
  interpreter_phone: z.string().optional(),
  interpreter_mobile: z.string().optional(),
  interpreter_email: z.string().optional(),
  interpreter_language: z.string().optional(),
  interpreter_signature: z.string().optional(),
  interpreter_signature_date: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 13: PREPARER
  // ═══════════════════════════════════════════════════════════════
  used_preparer: z.string().optional(),
  preparer_first_name: z.string().optional(),
  preparer_last_name: z.string().optional(),
  preparer_business_name: z.string().optional(),
  preparer_phone: z.string().optional(),
  preparer_mobile: z.string().optional(),
  preparer_email: z.string().optional(),
  preparer_signature: z.string().optional(),
  preparer_signature_date: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 14: ADDITIONAL INFORMATION
  // ═══════════════════════════════════════════════════════════════
  additional_information: z.array(z.object({
    page_number: z.string().optional(),
    part_number: z.string().optional(),
    item_number: z.string().optional(),
    explanation: z.string(),
  })).optional(),

  // Missing Part 9 fields
  q_served_military_police_unit: z.string().optional(), // Item 7.h / 8.a
  q_titles_list: z.string().optional(), // Item 30.b - list of titles
}).refine(
  (data) => {
    if (data.eligibility_basis === "other") {
      return data.other_basis_reason && data.other_basis_reason.trim().length > 0;
    }
    return true;
  },
  {
    message: "Please specify your basis for eligibility",
    path: ["other_basis_reason"],
  }
).refine(
  (data) => {
    if (data.wants_name_change === "yes") {
      return data.new_name_first && data.new_name_last;
    }
    return true;
  },
  {
    message: "Please provide your new name",
    path: ["new_name_first"],
  }
).refine(
  (data) => {
    if (data.ssa_wants_card === "yes") {
      return data.ssa_consent_disclosure === "yes";
    }
    return true;
  },
  {
    message: "You must consent to disclosure to receive a Social Security card",
    path: ["ssa_consent_disclosure"],
  }
).refine(
  (data) => {
    if (data.has_used_other_names === "yes") {
      return data.other_names && data.other_names.length > 0 && data.other_names.some(name => name.family_name || name.given_name);
    }
    return true;
  },
  {
    message: "Please provide at least one other name you have used",
    path: ["other_names"],
  }
);

type FormData = z.infer<typeof n400Schema>;

// ═══════════════════════════════════════════════════════════════
// STEP DEFINITIONS
// ═══════════════════════════════════════════════════════════════
const STEPS = [
  { id: 1, section: "ELIGIBILITY", title: "How do you qualify for citizenship?", part: "Part 1" },
  { id: 2, section: "INFORMATION ABOUT YOU", title: "Tell us about yourself.", part: "Part 2" },
  { id: 3, section: "BIOGRAPHIC INFORMATION", title: "Physical characteristics.", part: "Part 3" },
  { id: 4, section: "CONTACT", title: "How can we reach you?", part: "Part 4" },
  { id: 5, section: "RESIDENCE", title: "Where do you live?", part: "Part 4" },
  { id: 6, section: "MARITAL HISTORY", title: "Your marriage information.", part: "Part 5" },
  { id: 7, section: "CHILDREN", title: "Information about your children.", part: "Part 6" },
  { id: 8, section: "EMPLOYMENT", title: "Your work history.", part: "Part 7" },
  { id: 9, section: "TRAVEL", title: "Time outside the US.", part: "Part 8" },
  { id: 10, section: "BACKGROUND", title: "Important eligibility questions.", part: "Part 9" },
  { id: 11, section: "FEE REDUCTION", title: "Request for fee reduction (optional).", part: "Part 10" },
  { id: 12, section: "SIGNATURE", title: "Certification and signature.", part: "Part 11" },
  { id: 13, section: "INTERPRETER", title: "Interpreter information (if applicable).", part: "Part 12" },
  { id: 14, section: "PREPARER", title: "Preparer information (if applicable).", part: "Part 13" },
  { id: 15, section: "ADDITIONAL INFO", title: "Additional information.", part: "Part 14" },
  { id: 16, section: "REVIEW", title: "Review your application.", part: "" },
  { id: 17, section: "COMPLETE", title: "You're all set!", part: "" },
];

// ═══════════════════════════════════════════════════════════════
// OPTIONS DATA
// ═══════════════════════════════════════════════════════════════
const ELIGIBILITY_OPTIONS = [
  { value: "5year", label: "General Provision - I have been a lawful permanent resident for at least 5 years" },
  { value: "3year_marriage", label: "Spouse of U.S. Citizen - I have been married to and living with a U.S. citizen for at least 3 years" },
  { value: "vawa", label: "VAWA - Eligibility for the Spouse, Former Spouse, or Child of a U.S. Citizen under the Violence Against Women Act" },
  { value: "qualified_employment", label: "Spouse of U.S. Citizen in Qualified Employment Outside the United States" },
  { value: "military_current", label: "Military Service During Period of Hostilities - I am a current member of the U.S. Armed Forces" },
  { value: "military_former", label: "At Least One Year of Honorable Military Service - I was formerly a member of the U.S. Armed Forces" },
  { value: "other", label: "Other basis for eligibility" },
];

const USCIS_FIELD_OFFICES = [
  "Atlanta, GA", "Baltimore, MD", "Boston, MA", "Buffalo, NY", "Charlotte, NC",
  "Chicago, IL", "Dallas, TX", "Denver, CO", "Detroit, MI", "El Paso, TX",
  "Hartford, CT", "Houston, TX", "Jacksonville, FL", "Kansas City, MO", "Las Vegas, NV",
  "Los Angeles, CA", "Louisville, KY", "Memphis, TN", "Miami, FL", "Milwaukee, WI",
  "Newark, NJ", "New Orleans, LA", "New York, NY", "Oklahoma City, OK", "Omaha, NE",
  "Philadelphia, PA", "Phoenix, AZ", "Portland, OR", "Sacramento, CA", "Saint Louis, MO",
  "Saint Paul, MN", "Salt Lake City, UT", "San Antonio, TX", "San Diego, CA", "San Francisco, CA",
  "San Jose, CA", "Seattle, WA", "Tampa, FL", "Washington, DC", "Other"
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

const COUNTRIES = [
  "Mexico", "China", "India", "Philippines", "Vietnam", "El Salvador", "Cuba",
  "Dominican Republic", "Korea", "Guatemala", "Canada", "United Kingdom",
  "Jamaica", "Colombia", "Haiti", "Honduras", "Brazil", "Peru", "Ecuador",
  "Pakistan", "Nigeria", "Bangladesh", "Other"
];

const ETHNICITIES = [
  { value: "hispanic", label: "Hispanic or Latino" },
  { value: "not_hispanic", label: "Not Hispanic or Latino" },
];

const RACES = [
  { value: "white", label: "White" },
  { value: "asian", label: "Asian" },
  { value: "black", label: "Black or African American" },
  { value: "native", label: "American Indian or Alaska Native" },
  { value: "pacific", label: "Native Hawaiian or Pacific Islander" },
];

const EYE_COLORS = ["Black", "Blue", "Brown", "Gray", "Green", "Hazel", "Maroon", "Pink", "Unknown"];
const HAIR_COLORS = ["Bald", "Black", "Blond", "Brown", "Gray", "Red", "Sandy", "White", "Unknown"];

export default function N400Form() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    control,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(n400Schema),
    mode: "onBlur",
    defaultValues: {
      // Part 1 - Eligibility
      eligibility_basis: "5year",

      // Part 2 - Identity
      first_name: "Maria",
      middle_name: "Elena",
      last_name: "Rodriguez",
      date_of_birth: "03/15/1985",
      country_of_birth: "Mexico",
      country_of_citizenship: "Mexico",
      gender: "female",
      has_used_other_names: "no",

      // Part 2 - Immigration
      a_number: "A123456789",
      uscis_account_number: "",
      ssn: "123-45-6789",
      date_became_permanent_resident: "06/20/2019",
      request_disability_accommodations: "no",

      // Part 4 - Contact
      daytime_phone: "555-123-4567",
      mobile_phone: "555-987-6543",
      email: "maria.rodriguez@email.com",

      // Part 5 - Residence
      street_address: "1234 Oak Street",
      apt_ste_flr: "Apt 4B",
      city: "San Francisco",
      state: "CA",
      zip_code: "94102",
      residence_from: "01/2021",
      mailing_same_as_residence: "yes",

      // Part 7 - Biographic
      ethnicity: "hispanic",
      race: "white",
      height_feet: "5",
      height_inches: "6",
      weight: "135",
      eye_color: "Brown",
      hair_color: "Black",

      // Part 8 - Employment
      current_employer: "Tech Solutions Inc.",
      current_occupation: "Software Engineer",
      employer_city: "San Francisco",
      employer_state: "CA",
      employment_from: "03/2020",

      // Part 9 - Travel
      total_days_outside_us: "45",
      trips_over_6_months: "no",

      // Part 10 - Marital
      marital_status: "married",
      times_married: "1",
      spouse_first_name: "Carlos",
      spouse_middle_name: "Antonio",
      spouse_last_name: "Rodriguez",
      spouse_date_of_birth: "07/22/1983",
      spouse_date_of_marriage: "09/15/2010",
      spouse_is_us_citizen: "yes",
      spouse_country_of_birth: "Mexico",
      spouse_current_employer: "City Hospital",

      // Part 11 - Children
      total_children: "2",

      // Part 12 - Background (all "no" for sample)
      q_claimed_us_citizen: "no",
      q_voted_in_us: "no",
      q_failed_to_file_taxes: "no",
      q_owe_taxes: "no",
      q_title_of_nobility: "no",
      q_communist_party: "no",
      q_terrorist_org: "no",
      q_genocide: "no",
      q_torture: "no",
      q_arrested: "no",
      q_habitual_drunkard: "no",
      q_prostitution: "no",
      q_illegal_gambling: "no",
      q_failed_child_support: "no",
      q_served_us_military: "no",
      q_deserted_military: "no",
    },
  });

  const watchedData = watch();
  const progress = (currentStep / STEPS.length) * 100;

  // Field arrays for dynamic fields
  const { fields: tripFields, append: appendTrip, remove: removeTrip } = useFieldArray({
    control,
    name: "trips",
  });

  const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
    control,
    name: "children",
  });

  const { fields: additionalFields, append: appendAdditional, remove: removeAdditional } = useFieldArray({
    control,
    name: "additional_information",
  });

  const { fields: employmentFields, append: appendEmployment, remove: removeEmployment } = useFieldArray({
    control,
    name: "employment_history",
  });

  const { fields: crimeFields, append: appendCrime, remove: removeCrime } = useFieldArray({
    control,
    name: "crimes",
  });

  const { fields: otherNamesFields, append: appendOtherName, remove: removeOtherName } = useFieldArray({
    control,
    name: "other_names",
  });

  // Sync children array with total_children value
  useEffect(() => {
    const numChildren = parseInt(watchedData.total_children || "0");
    const currentLength = childrenFields.length;
    
    if (numChildren > currentLength) {
      // Add missing children
      for (let i = currentLength; i < numChildren; i++) {
        appendChild({ first_name: "", last_name: "", date_of_birth: "", residence: "", relationship: "" });
      }
    } else if (numChildren < currentLength && numChildren >= 0) {
      // Remove extra children
      for (let i = currentLength - 1; i >= numChildren; i--) {
        removeChild(i);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedData.total_children]);

  // Auto-prompt for Part 14 explanations when "Yes" is answered to Part 9 questions (Items 1-14)
  useEffect(() => {
    const part9Questions: Array<{ field: string; item: string; label: string }> = [
      { field: "q_registered_voted", item: "1", label: "Registered to vote or voted" },
      { field: "q_claimed_us_citizen", item: "2", label: "Claimed to be a U.S. citizen" },
      { field: "q_owe_taxes", item: "3", label: "Owe overdue taxes" },
      { field: "q_nonresident_alien_tax", item: "4", label: "Called yourself a nonresident alien on tax return" },
      { field: "q_communist_party", item: "5.a", label: "Member of Communist or totalitarian party" },
      { field: "q_advocated_overthrow", item: "5.b", label: "Advocated overthrow of government" },
      { field: "q_terrorist_org", item: "6", label: "Member of terrorist organization" },
      { field: "q_military_police_service", item: "8.a", label: "Served in military or police unit" },
      { field: "q_armed_group", item: "8.b", label: "Served in armed group" },
      { field: "q_detention_facility", item: "9", label: "Worked in detention facility" },
      { field: "q_group_used_weapons", item: "10.a", label: "Part of group that used weapons" },
      { field: "q_weapons_training", item: "11", label: "Received weapons training" },
      { field: "q_sold_provided_weapons", item: "12", label: "Sold or provided weapons" },
      { field: "q_recruited_under_15", item: "13", label: "Recruited person under 15" },
      { field: "q_used_under_15_hostilities", item: "14", label: "Used person under 15 in hostilities" },
    ];

    part9Questions.forEach(({ field, item, label }) => {
      const value = (watchedData as Record<string, unknown>)[field];
      if (value === "yes") {
        // Check if explanation already exists for this question
        const existingEntry = additionalFields.find(
          entry => entry.part_number === "9" && entry.item_number === item
        );
        
        if (!existingEntry) {
          appendAdditional({
            page_number: "",
            part_number: "9",
            item_number: item,
            explanation: `Please provide an explanation for Item ${item} (${label}): `,
          });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedData)]);

  // Auto-fill mailing address when same as physical address
  useEffect(() => {
    if (watchedData.mailing_same_as_residence === "yes") {
      setValue("mailing_street_address", watchedData.street_address || "");
      setValue("mailing_apt_ste_flr", watchedData.apt_ste_flr || "");
      setValue("mailing_city", watchedData.city || "");
      setValue("mailing_state", watchedData.state || "");
      setValue("mailing_zip_code", watchedData.zip_code || "");
      setValue("mailing_in_care_of", ""); // Clear in care of when same
    } else if (watchedData.mailing_same_as_residence === "no") {
      // Clear mailing address fields when not the same
      setValue("mailing_street_address", "");
      setValue("mailing_apt_ste_flr", "");
      setValue("mailing_city", "");
      setValue("mailing_state", "");
      setValue("mailing_zip_code", "");
      setValue("mailing_in_care_of", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedData.mailing_same_as_residence, watchedData.street_address, watchedData.apt_ste_flr, watchedData.city, watchedData.state, watchedData.zip_code]);

  // Get fields to validate for each step
  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1: {
        const fields: (keyof FormData)[] = ["eligibility_basis"];
        if (watchedData.eligibility_basis === "other") {
          fields.push("other_basis_reason");
        }
        return fields;
      }
      case 2: return ["first_name", "last_name", "date_of_birth", "country_of_birth", "country_of_citizenship", "gender"];
      case 3: return ["date_became_permanent_resident"];
      case 4: return ["daytime_phone", "email"];
      case 5: return ["street_address", "city", "state", "zip_code"];
      case 6: return ["ethnicity", "race", "height_feet", "weight", "eye_color", "hair_color"];
      case 7: return [];
      case 8: return [];
      case 9: return ["marital_status"];
      case 10: return [];
      case 11: return [];
      default: return [];
    }
  };

  const handleNext = async () => {
    const fields = getStepFields(currentStep);
    const isValid = fields.length === 0 || await trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitN400Form({
        // ═══════════════════════════════════════════════════════════════
        // PART 1: ELIGIBILITY
        // ═══════════════════════════════════════════════════════════════
        eligibility_basis: data.eligibility_basis,
        other_basis_reason: data.other_basis_reason,
        uscis_field_office: data.uscis_field_office,

        // ═══════════════════════════════════════════════════════════════
        // PART 2: INFORMATION ABOUT YOU
        // ═══════════════════════════════════════════════════════════════
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        wants_name_change: data.wants_name_change,
        new_name_first: data.new_name_first,
        new_name_middle: data.new_name_middle,
        new_name_last: data.new_name_last,
        has_used_other_names: data.has_used_other_names,
        other_names: data.other_names ? JSON.stringify(data.other_names) : undefined,
        date_of_birth: data.date_of_birth,
        country_of_birth: data.country_of_birth,
        country_of_citizenship: data.country_of_citizenship,
        gender: data.gender,
        parent_us_citizen_before_18: data.parent_us_citizen_before_18,

        // Identification Numbers
        a_number: data.a_number,
        uscis_account_number: data.uscis_account_number,
        ssn: data.ssn,
        ssa_wants_card: data.ssa_wants_card,
        ssa_consent_disclosure: data.ssa_consent_disclosure,

        // Green Card Information
        date_became_permanent_resident: data.date_became_permanent_resident,

        // Disability Accommodations
        request_disability_accommodations: data.request_disability_accommodations,

        // ═══════════════════════════════════════════════════════════════
        // PART 4: CONTACT INFORMATION
        // ═══════════════════════════════════════════════════════════════
        daytime_phone: data.daytime_phone,
        mobile_phone: data.mobile_phone,
        email: data.email,

        // ═══════════════════════════════════════════════════════════════
        // PART 5: RESIDENCE INFORMATION
        // ═══════════════════════════════════════════════════════════════
        street_address: data.street_address,
        apt_ste_flr: data.apt_ste_flr,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        residence_from: data.residence_from,
        residence_to: data.residence_to,
        residence_addresses: data.residence_addresses ? JSON.stringify(data.residence_addresses) : undefined,

        // Mailing Address (conditional - only if different from residence)
        mailing_same_as_residence: data.mailing_same_as_residence,
        ...(data.mailing_same_as_residence === "no" && {
          mailing_street_address: data.mailing_street_address,
          mailing_apt_ste_flr: data.mailing_apt_ste_flr,
          mailing_in_care_of: data.mailing_in_care_of,
          mailing_city: data.mailing_city,
          mailing_state: data.mailing_state,
          mailing_zip_code: data.mailing_zip_code,
        }),

        // ═══════════════════════════════════════════════════════════════
        // PART 7: BIOGRAPHIC INFORMATION
        // ═══════════════════════════════════════════════════════════════
        ethnicity: data.ethnicity,
        race: data.race,
        height_feet: data.height_feet,
        height_inches: data.height_inches,
        weight: data.weight,
        eye_color: data.eye_color,
        hair_color: data.hair_color,

        // ═══════════════════════════════════════════════════════════════
        // PART 8: EMPLOYMENT
        // ═══════════════════════════════════════════════════════════════
        current_employer: data.current_employer,
        current_occupation: data.current_occupation,
        employer_city: data.employer_city,
        employer_state: data.employer_state,
        employment_from: data.employment_from,
        employment_history: data.employment_history ? JSON.stringify(data.employment_history) : undefined,

        // ═══════════════════════════════════════════════════════════════
        // PART 9: TIME OUTSIDE THE US
        // ═══════════════════════════════════════════════════════════════
        total_days_outside_us: data.total_days_outside_us,
        trips_over_6_months: data.trips_over_6_months,
        trips: data.trips ? JSON.stringify(data.trips) : undefined,

        // ═══════════════════════════════════════════════════════════════
        // PART 10: MARITAL HISTORY
        // ═══════════════════════════════════════════════════════════════
        marital_status: data.marital_status,
        times_married: data.times_married,

        // Spouse Information (conditional - only if married)
        ...(data.marital_status === "married" && {
          spouse_is_military_member: data.spouse_is_military_member,
          spouse_first_name: data.spouse_first_name,
          spouse_middle_name: data.spouse_middle_name,
          spouse_last_name: data.spouse_last_name,
          spouse_date_of_birth: data.spouse_date_of_birth,
          spouse_date_of_marriage: data.spouse_date_of_marriage,
          spouse_is_us_citizen: data.spouse_is_us_citizen,
          spouse_citizenship_by_birth: data.spouse_citizenship_by_birth,
          spouse_date_became_citizen: data.spouse_date_became_citizen,
          spouse_address_same_as_applicant: data.spouse_address_same_as_applicant,
          spouse_a_number: data.spouse_a_number,
          spouse_times_married: data.spouse_times_married,
          spouse_country_of_birth: data.spouse_country_of_birth,
          spouse_current_employer: data.spouse_current_employer,
        }),

        // ═══════════════════════════════════════════════════════════════
        // PART 11: CHILDREN
        // ═══════════════════════════════════════════════════════════════
        total_children: data.total_children,
        children: data.children ? JSON.stringify(data.children) : undefined,
        providing_support_for_children: data.providing_support_for_children,

        // ═══════════════════════════════════════════════════════════════
        // PART 12: BACKGROUND QUESTIONS
        // ═══════════════════════════════════════════════════════════════
        // General Eligibility
        q_claimed_us_citizen: data.q_claimed_us_citizen,
        q_voted_in_us: data.q_voted_in_us,
        q_failed_to_file_taxes: data.q_failed_to_file_taxes,
        q_nonresident_alien_tax: data.q_nonresident_alien_tax,
        q_owe_taxes: data.q_owe_taxes,
        q_title_of_nobility: data.q_title_of_nobility,
        q_willing_to_give_up_titles: data.q_willing_to_give_up_titles,

        // Affiliations
        q_communist_party: data.q_communist_party,
        q_advocated_overthrow: data.q_advocated_overthrow,
        q_terrorist_org: data.q_terrorist_org,
        q_genocide: data.q_genocide,
        q_torture: data.q_torture,
        q_killing_person: data.q_killing_person,
        q_sexual_contact_nonconsent: data.q_sexual_contact_nonconsent,
        q_severely_injuring: data.q_severely_injuring,
        q_religious_persecution: data.q_religious_persecution,
        q_harm_race_religion: data.q_harm_race_religion,

        // Weapons and Violence
        q_used_weapon_explosive: data.q_used_weapon_explosive,
        q_kidnapping_assassination_hijacking: data.q_kidnapping_assassination_hijacking,
        q_threatened_weapon_violence: data.q_threatened_weapon_violence,

        // Military/Police Service
        q_military_police_service: data.q_military_police_service,
        q_armed_group: data.q_armed_group,
        q_detention_facility: data.q_detention_facility,
        q_group_used_weapons: data.q_group_used_weapons,
        q_used_weapon_against_person: data.q_used_weapon_against_person,
        q_threatened_weapon_use: data.q_threatened_weapon_use,
        q_weapons_training: data.q_weapons_training,
        q_sold_provided_weapons: data.q_sold_provided_weapons,
        q_recruited_under_15: data.q_recruited_under_15,
        q_used_under_15_hostilities: data.q_used_under_15_hostilities,

        // Crimes and Offenses
        q_arrested: data.q_arrested,
        q_committed_crime_not_arrested: data.q_committed_crime_not_arrested,
        crimes: data.crimes ? JSON.stringify(data.crimes) : undefined,
        q_completed_probation: data.q_completed_probation,

        // Moral Character
        q_habitual_drunkard: data.q_habitual_drunkard,
        q_prostitution: data.q_prostitution,
        q_controlled_substances: data.q_controlled_substances,
        q_marriage_fraud: data.q_marriage_fraud,
        q_polygamy: data.q_polygamy,
        q_helped_illegal_entry: data.q_helped_illegal_entry,
        q_illegal_gambling: data.q_illegal_gambling,
        q_failed_child_support: data.q_failed_child_support,
        q_misrepresentation_public_benefits: data.q_misrepresentation_public_benefits,

        // Immigration Violations
        q_false_info_us_government: data.q_false_info_us_government,
        q_lied_us_government: data.q_lied_us_government,
        q_removed_deported: data.q_removed_deported,
        q_removal_proceedings: data.q_removal_proceedings,

        // Selective Service
        q_male_18_26_lived_us: data.q_male_18_26_lived_us,
        q_registered_selective_service: data.q_registered_selective_service,
        selective_service_number: data.selective_service_number,
        selective_service_date: data.selective_service_date,

        // Military Service
        q_left_us_avoid_draft: data.q_left_us_avoid_draft,
        q_applied_military_exemption: data.q_applied_military_exemption,
        q_served_us_military: data.q_served_us_military,
        q_current_military_member: data.q_current_military_member,
        q_scheduled_deploy: data.q_scheduled_deploy,
        q_stationed_outside_us: data.q_stationed_outside_us,
        q_former_military_outside_us: data.q_former_military_outside_us,
        q_discharged_because_alien: data.q_discharged_because_alien,
        q_court_martialed: data.q_court_martialed,
        q_deserted_military: data.q_deserted_military,

        // Oath of Allegiance
        q_support_constitution: data.q_support_constitution,
        q_understand_oath: data.q_understand_oath,
        q_unable_oath_disability: data.q_unable_oath_disability,
        q_willing_take_oath: data.q_willing_take_oath,
        q_willing_bear_arms: data.q_willing_bear_arms,
        q_willing_noncombatant: data.q_willing_noncombatant,
        q_willing_work_national_importance: data.q_willing_work_national_importance,
      });

      if (result.success && result.data) {
        setSubmittedId(result.data.id || null);
        setCurrentStep(13);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/generate-n400", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: submittedId }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `N-400_${watchedData.last_name}_${watchedData.first_name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentStepData = STEPS[currentStep - 1];

  // Info Icon Component with Tooltip
  const InfoIcon = ({ tooltip }: { tooltip: string }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div style={{ position: "relative", display: "inline-block", marginLeft: "6px" }}>
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            display: "inline-flex",
            alignItems: "center",
            color: "var(--gray)",
            transition: "color 0.2s",
          }}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        >
          <HelpCircle size={16} />
        </button>
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
              padding: "12px 16px",
              background: "var(--dark)",
              color: "white",
              borderRadius: "8px",
              fontSize: "13px",
              lineHeight: "1.5",
              maxWidth: "320px",
              width: "max-content",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              whiteSpace: "normal",
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {tooltip}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                border: "6px solid transparent",
                borderTopColor: "var(--dark)",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // Helper component for Yes/No radio buttons with optional tooltip
  const YesNoField = ({ name, label, tooltip }: { name: keyof FormData; label: string; tooltip?: string }) => (
    <div className="form-group">
      <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
        {label}
        {tooltip && <InfoIcon tooltip={tooltip} />}
      </label>
      <div className="radio-group">
        <div className="radio-option">
          <input type="radio" id={`${name}-yes`} value="yes" {...register(name)} />
          <label htmlFor={`${name}-yes`} className="radio-label">Yes</label>
        </div>
        <div className="radio-option">
          <input type="radio" id={`${name}-no`} value="no" {...register(name)} />
          <label htmlFor={`${name}-no`} className="radio-label">No</label>
        </div>
      </div>
      {errors[name] && <p className="error-message">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <>
      {/* Progress Bar */}
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">◆</span>
          Meridian
        </div>
        <button className="save-btn">SAVE AND CLOSE ✕</button>
      </header>

      {/* Main Container */}
      <div className="container">
        <div className="form-card fade-in" key={currentStep}>
          {currentStepData.part && (
            <div className="section-label">{currentStepData.part} • {currentStepData.section}</div>
          )}
          {!currentStepData.part && (
            <div className="section-label">{currentStepData.section}</div>
          )}
          <h1>{currentStepData.title}</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 1: ELIGIBILITY */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <div className="form-group">
                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                    Enter Your 9 Digit A-Number
                    <InfoIcon tooltip="Found on your green card (9 digits after 'A')" />
                  </label>
                  <input type="text" className="form-input" placeholder="A-XXXXXXXXX" style={{ maxWidth: "250px" }} {...register("a_number")} />
                </div>
                
                <label className="form-label">Select the basis for your eligibility</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                  {ELIGIBILITY_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="checkbox-group"
                      style={{
                        borderColor: watchedData.eligibility_basis === option.value ? "var(--dark)" : undefined,
                        background: watchedData.eligibility_basis === option.value ? "var(--bg)" : undefined,
                      }}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("eligibility_basis")}
                        style={{ width: "18px", height: "18px", accentColor: "var(--dark)" }}
                      />
                      <span className="checkbox-label">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.eligibility_basis && <p className="error-message">{errors.eligibility_basis.message}</p>}
                
                {watchedData.eligibility_basis === "other" && (
                  <div className="form-group" style={{ marginTop: "20px" }}>
                    <label className="form-label">Please specify your basis for eligibility</label>
                    <textarea
                      {...register("other_basis_reason")}
                      className="form-input"
                      rows={4}
                      placeholder="Enter the reason for your eligibility basis..."
                      style={{ width: "100%", padding: "12px", fontSize: "16px", fontFamily: "inherit", border: "1px solid var(--border)", borderRadius: "4px" }}
                    />
                    {errors.other_basis_reason && <p className="error-message">{errors.other_basis_reason.message}</p>}
                  </div>
                )}

                {(watchedData.eligibility_basis === "qualified_employment") && (
                  <div className="form-group" style={{ marginTop: "20px" }}>
                    <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                      Select USCIS Field Office for Interview
                      <InfoIcon tooltip="If your residential address is outside the United States and you are filing under INA section 319(b), select the USCIS field office where you would like to have your naturalization interview. You can find a USCIS field office at www.uscis.gov/field-offices" />
                    </label>
                    <select className="form-select" {...register("uscis_field_office")}>
                      <option value="">Select USCIS Field Office...</option>
                      {USCIS_FIELD_OFFICES.map(office => (
                        <option key={office} value={office}>{office}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 2: IDENTITY */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <>
                {/* Item 1: Current Legal Name */}
                <div className="form-group">
                  <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                    1. Your Current Legal Name
                    <InfoIcon tooltip="Do not provide a nickname" />
                  </label>
                  <div className="form-row-thirds">
                    <div>
                      <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Family Name (Last Name)</label>
                      <input type="text" className="form-input" placeholder="Last Name" {...register("last_name")} />
                      {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Given Name (First Name)</label>
                      <input type="text" className="form-input" placeholder="First Name" {...register("first_name")} />
                      {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Middle Name (if applicable)</label>
                      <input type="text" className="form-input" placeholder="Middle Name" {...register("middle_name")} />
                    </div>
                  </div>
                </div>

                {/* Item 2: Other Names Used */}
                <YesNoField 
                  name="has_used_other_names" 
                  label="2. Have you used other names since birth?" 
                  tooltip="Include all names you have used, including maiden names, previous married names, aliases, or any other names used in official documents. See the Instructions for this Item Number for more information about which names to include."
                />
                
                {watchedData.has_used_other_names === "yes" && (
                  <div className="form-group" style={{ marginTop: "10px" }}>
                    <p className="helper-text" style={{ marginBottom: "12px" }}>Provide all other names you have used:</p>
                    
                    {otherNamesFields.length === 0 && (
                      <div style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px", marginBottom: "16px" }}>
                        <button
                          type="button"
                          onClick={() => appendOtherName({ family_name: "", given_name: "", middle_name: "" })}
                          className="save-btn"
                          style={{ padding: "8px 16px", fontSize: "14px" }}
                        >
                          + Add Other Name
                        </button>
                      </div>
                    )}

                    {otherNamesFields.map((field, index) => (
                      <div key={field.id} style={{ marginBottom: "16px", padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Other Name {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeOtherName(index)}
                            style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="form-row-thirds">
                    <div>
                            <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Family Name (Last Name)</label>
                            <input type="text" className="form-input" placeholder="Last Name" {...register(`other_names.${index}.family_name`)} />
                    </div>
                          <div>
                            <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Given Name (First Name)</label>
                            <input type="text" className="form-input" placeholder="First Name" {...register(`other_names.${index}.given_name`)} />
                  </div>
                          <div>
                            <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Middle Name (if applicable)</label>
                            <input type="text" className="form-input" placeholder="Middle Name" {...register(`other_names.${index}.middle_name`)} />
                </div>
                        </div>
                      </div>
                    ))}

                    {otherNamesFields.length > 0 && (
                      <button
                        type="button"
                        onClick={() => appendOtherName({ family_name: "", given_name: "", middle_name: "" })}
                        className="save-btn"
                        style={{ padding: "8px 16px", fontSize: "14px", marginTop: "8px" }}
                      >
                        + Add Another Name
                      </button>
                    )}
                  </div>
                )}

                {/* Item 3: Name Change */}
                <YesNoField name="wants_name_change" label="3. Would you like to legally change your name?" />
                
                {watchedData.wants_name_change === "yes" && (
                  <div className="form-group" style={{ marginTop: "20px" }}>
                    <label className="form-label">Type or print the new name you would like to use:</label>
                    <div className="form-row-thirds">
                      <div>
                        <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Family Name (Last Name)</label>
                        <input type="text" className="form-input" placeholder="New Last Name" {...register("new_name_last")} />
                        {errors.new_name_last && <p className="error-message">{errors.new_name_last.message}</p>}
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Given Name (First Name)</label>
                        <input type="text" className="form-input" placeholder="New First Name" {...register("new_name_first")} />
                        {errors.new_name_first && <p className="error-message">{errors.new_name_first.message}</p>}
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Middle Name (if applicable)</label>
                        <input type="text" className="form-input" placeholder="New Middle Name" {...register("new_name_middle")} />
                      </div>
                    </div>
                    <p className="helper-text" style={{ marginTop: "8px", fontSize: "14px" }}>
                      Read the Instructions for this Item Number before you decide whether you would like to legally change your name.
                    </p>
                  </div>
                )}

                {/* Item 4: USCIS Online Account Number */}
                <div className="form-group">
                  <label className="form-label">4. USCIS Online Account Number</label>
                  <input type="text" className="form-input" placeholder="12-digit number" style={{ maxWidth: "250px" }} {...register("uscis_account_number")} />
                </div>

                {/* Item 5: Sex */}
                <div className="form-group">
                  <label className="form-label">5. Sex</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input type="radio" id="gender-male" value="male" {...register("gender")} />
                      <label htmlFor="gender-male" className="radio-label">Male</label>
                    </div>
                    <div className="radio-option">
                      <input type="radio" id="gender-female" value="female" {...register("gender")} />
                      <label htmlFor="gender-female" className="radio-label">Female</label>
                    </div>
                  </div>
                  {errors.gender && <p className="error-message">{errors.gender.message}</p>}
                </div>

                {/* Item 6: Date of Birth */}
                <div className="form-group">
                  <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                    6. Date of Birth
                    <InfoIcon tooltip="In addition to your actual date of birth, include any other dates of birth you have ever used, including dates used in connection with any legal names or non-legal names, in the space provided in Part 14. Additional Information." />
                  </label>
                  <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ maxWidth: "200px" }} {...register("date_of_birth")} />
                  {errors.date_of_birth && <p className="error-message">{errors.date_of_birth.message}</p>}
                </div>

                {/* Item 7: Date Became Permanent Resident */}
                  <div className="form-group">
                  <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                    7. Date You Became a Lawful Permanent Resident
                    <InfoIcon tooltip="If you are a lawful permanent resident, provide the date you became a lawful permanent resident (mm/dd/yyyy). Found on your green card as 'Resident Since'" />
                  </label>
                  <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ maxWidth: "200px" }} {...register("date_became_permanent_resident")} />
                  {errors.date_became_permanent_resident && <p className="error-message">{errors.date_became_permanent_resident.message}</p>}
                </div>

                {/* Item 8: Country of Birth */}
                <div className="form-group">
                  <label className="form-label">8. Country of Birth</label>
                    <select className="form-select" {...register("country_of_birth")}>
                      <option value="">Select...</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country_of_birth && <p className="error-message">{errors.country_of_birth.message}</p>}
                  </div>

                {/* Item 9: Country of Citizenship */}
                  <div className="form-group">
                  <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                    9. Country of Citizenship or Nationality
                    <InfoIcon tooltip="If you are a citizen or national of more than one country, list additional countries of nationality in the space provided in Part 14. Additional Information." />
                  </label>
                    <select className="form-select" {...register("country_of_citizenship")}>
                      <option value="">Select...</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country_of_citizenship && <p className="error-message">{errors.country_of_citizenship.message}</p>}
                  </div>

                {/* Item 10: Parent U.S. Citizen */}
                <YesNoField 
                  name="parent_us_citizen_before_18" 
                  label="10. Was your parent a U.S. citizen before your 18th birthday?" 
                  tooltip="Was your mother or father (including adoptive mother or father) a U.S. citizen before your 18th birthday? If you answered 'Yes,' you may already be a U.S. citizen. If you are a U.S. citizen, you should not complete Form N-400."
                />

                {/* Item 11: Disability Accommodations */}
                <YesNoField 
                  name="request_disability_accommodations" 
                  label="11. Do you need disability accommodations?" 
                  tooltip="Do you have a physical or developmental disability or mental impairment that prevents you from demonstrating your knowledge and understanding of the English language or civics requirements for naturalization? If you answered 'Yes,' submit a completed Form N-648, Medical Certification for Disability Exceptions, when you file your Form N-400."
                />

                {/* Item 12: Social Security Update */}
                <YesNoField 
                  name="ssa_wants_card" 
                  label="12.a. Do you want SSA to issue you a Social Security card?" 
                  tooltip="Do you want the Social Security Administration (SSA) to issue you an original or replacement Social Security card and update your immigration status with the SSA if and when you are naturalized?"
                />
                
                {watchedData.ssa_wants_card === "yes" && (
                  <>
                    <div className="form-group" style={{ marginTop: "10px" }}>
                      <label className="form-label">12.b. Social Security Number (if any)</label>
                      <input type="text" className="form-input" placeholder="XXX-XX-XXXX" style={{ maxWidth: "200px" }} {...register("ssn")} />
                </div>
                    <YesNoField 
                      name="ssa_consent_disclosure" 
                      label="12.c. Do you consent to disclosure of information to SSA?" 
                      tooltip="I authorize disclosure of information from this application and USCIS systems to the SSA as required for the purpose of assigning me an SSN, issuing me an original or replacement Social Security card, and updating my immigration status with the SSA. NOTE: If you answered 'Yes' to Item Number 12.a., you must also answer 'Yes' to Item Number 12.c., Consent for Disclosure, to receive a card."
                    />
                    {errors.ssa_consent_disclosure && <p className="error-message">{errors.ssa_consent_disclosure.message}</p>}
                  </>
                )}

                {watchedData.ssa_wants_card === "no" && (
                  <p className="helper-text" style={{ marginTop: "-10px" }}>(Go to Part 3.)</p>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 3: BIOGRAPHIC INFORMATION (Part 3) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px", fontSize: "14px" }}>
                  USCIS requires you to complete the categories below to conduct background checks.
                </p>

                {/* Item 1: Ethnicity */}
                <div className="form-group">
                  <label className="form-label">1. Ethnicity</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input type="radio" id="ethnicity-hispanic" value="hispanic" {...register("ethnicity")} />
                      <label htmlFor="ethnicity-hispanic" className="radio-label">Hispanic or Latino</label>
                    </div>
                    <div className="radio-option">
                      <input type="radio" id="ethnicity-not-hispanic" value="not_hispanic" {...register("ethnicity")} />
                      <label htmlFor="ethnicity-not-hispanic" className="radio-label">Not Hispanic or Latino</label>
                    </div>
                  </div>
                  {errors.ethnicity && <p className="error-message">{errors.ethnicity.message}</p>}
                </div>

                {/* Item 2: Race */}
                <div className="form-group">
                  <label className="form-label">2. Race</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                    {RACES.map((race) => (
                      <label key={race.value} className="checkbox-group">
                        <input
                          type="checkbox"
                          value={race.value}
                          {...register("race")}
                          style={{ width: "18px", height: "18px", accentColor: "var(--dark)" }}
                        />
                        <span className="checkbox-label">{race.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.race && <p className="error-message">{errors.race.message}</p>}
                </div>

                {/* Item 3: Height */}
                <div className="form-row-equal">
                <div className="form-group">
                    <label className="form-label">3. Height</label>
                    <div className="form-row" style={{ gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <input type="number" className="form-input" placeholder="Feet" style={{ maxWidth: "80px" }} {...register("height_feet")} />
                      <input type="number" className="form-input" placeholder="Inches" style={{ maxWidth: "80px" }} {...register("height_inches")} />
                </div>
                    {errors.height_feet && <p className="error-message">{errors.height_feet.message}</p>}
                  </div>
                <div className="form-group">
                    <label className="form-label">4. Weight (Pounds)</label>
                    <input type="number" className="form-input" placeholder="150" style={{ maxWidth: "100px" }} {...register("weight")} />
                    {errors.weight && <p className="error-message">{errors.weight.message}</p>}
                  </div>
                </div>

                {/* Item 5: Eye Color */}
                <div className="form-group">
                  <label className="form-label">5. Eye color (Select only one box)</label>
                  <select className="form-select" {...register("eye_color")}>
                    <option value="">Select...</option>
                    {EYE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.eye_color && <p className="error-message">{errors.eye_color.message}</p>}
                </div>

                {/* Item 6: Hair Color */}
                <div className="form-group">
                  <label className="form-label">6. Hair color (Select only one box)</label>
                  <select className="form-select" {...register("hair_color")}>
                    <option value="">Select...</option>
                    {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.hair_color && <p className="error-message">{errors.hair_color.message}</p>}
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 4: CONTACT */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 4 && (
              <>
                <div className="form-row-equal">
                  <div className="form-group">
                    <label className="form-label">Daytime Phone Number</label>
                    <input type="tel" className="form-input" placeholder="(555) 123-4567" {...register("daytime_phone")} />
                    {errors.daytime_phone && <p className="error-message">{errors.daytime_phone.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Phone Number</label>
                    <input type="tel" className="form-input" placeholder="(555) 987-6543" {...register("mobile_phone")} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="you@example.com" {...register("email")} />
                  <p className="helper-text">USCIS may contact you at this email address</p>
                  {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 4: CONTACT INFORMATION (Part 4) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 4 && (
              <>
                <div className="form-row-equal">
                  <div className="form-group">
                    <label className="form-label">Daytime Phone Number</label>
                    <input type="tel" className="form-input" placeholder="(555) 123-4567" {...register("daytime_phone")} />
                    {errors.daytime_phone && <p className="error-message">{errors.daytime_phone.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Phone Number (if any)</label>
                    <input type="tel" className="form-input" placeholder="(555) 987-6543" {...register("mobile_phone")} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (if any)</label>
                  <input type="email" className="form-input" placeholder="you@example.com" {...register("email")} />
                  <p className="helper-text">USCIS may contact you at this email address</p>
                  {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 5: RESIDENCE INFORMATION (Part 4) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 5: RESIDENCE (Part 4) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 5 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px" }}>
                  List every location where you have lived during the last 5 years if you are filing based on the general provision under Part 1., Item Number 1.a. If you are filing based on other naturalization eligibility options, see Part 4. in the Specific Instructions by Item Number section of the Instructions for the applicable period of time for which you must enter this information.
                </p>

                {/* Item 1: Physical Addresses */}
                <div className="form-group">
                  <label className="form-label">1. Physical Addresses</label>
                  <div className="form-group" style={{ marginTop: "12px", padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                    <label className="form-label" style={{ fontSize: "14px", marginBottom: "8px" }}>Current Physical Address</label>
                    <div className="form-row" style={{ gridTemplateColumns: "1fr 120px", gap: "8px" }}>
                      <input type="text" className="form-input" placeholder="Street Number and Name" {...register("street_address")} />
                    <input type="text" className="form-input" placeholder="Apt/Ste/Flr" {...register("apt_ste_flr")} />
                  </div>
                  {errors.street_address && <p className="error-message">{errors.street_address.message}</p>}

                    <div className="form-row-thirds" style={{ marginTop: "12px" }}>
                  <div className="form-group">
                        <label className="form-label" style={{ fontSize: "14px" }}>City or Town</label>
                    <input type="text" className="form-input" placeholder="City" {...register("city")} />
                    {errors.city && <p className="error-message">{errors.city.message}</p>}
                  </div>
                  <div className="form-group">
                        <label className="form-label" style={{ fontSize: "14px" }}>State / Province</label>
                    <select className="form-select" {...register("state")}>
                      <option value="">Select...</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="error-message">{errors.state.message}</p>}
                  </div>
                  <div className="form-group">
                        <label className="form-label" style={{ fontSize: "14px" }}>ZIP Code / Postal Code</label>
                        <input type="text" className="form-input" placeholder="ZIP" {...register("zip_code")} />
                    {errors.zip_code && <p className="error-message">{errors.zip_code.message}</p>}
                  </div>
                </div>

                    <div className="form-row-equal" style={{ marginTop: "12px" }}>
                <div className="form-group">
                        <label className="form-label" style={{ fontSize: "14px" }}>Dates of Residence: From (mm/dd/yyyy)</label>
                        <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ maxWidth: "150px" }} {...register("residence_from")} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: "14px" }}>Dates of Residence: To (mm/dd/yyyy) or PRESENT</label>
                        <input type="text" className="form-input" placeholder="MM/DD/YYYY or PRESENT" style={{ maxWidth: "150px" }} {...register("residence_to")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item 2: Mailing Address Same as Physical */}
                <YesNoField name="mailing_same_as_residence" label="2. Is your current physical address also your current mailing address?" />

                {/* Item 3: Mailing Address (if different) - Only show if "No" */}
                {watchedData.mailing_same_as_residence === "no" && (
                  <div className="form-group" style={{ marginTop: "20px" }}>
                    <label className="form-label">3. Current Mailing Address (Safe Mailing Address, if applicable)</label>
                    <div className="form-group" style={{ marginTop: "12px", padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                    <div className="form-group">
                        <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Street Number and Name</label>
                        <div className="form-row" style={{ gridTemplateColumns: "1fr 120px", gap: "8px" }}>
                      <input type="text" className="form-input" placeholder="Street Address" {...register("mailing_street_address")} />
                          <input type="text" className="form-input" placeholder="Apt/Ste/Flr" {...register("mailing_apt_ste_flr")} />
                    </div>
                      </div>
                      <div className="form-group" style={{ marginTop: "12px" }}>
                        <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>In Care Of Name (if any)</label>
                        <input type="text" className="form-input" placeholder="In Care Of Name" {...register("mailing_in_care_of")} />
                      </div>
                      <div className="form-row-thirds" style={{ marginTop: "12px" }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>City or Town</label>
                      <input type="text" className="form-input" placeholder="City" {...register("mailing_city")} />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>State / Province</label>
                      <select className="form-select" {...register("mailing_state")}>
                            <option value="">Select...</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>ZIP Code / Postal Code</label>
                      <input type="text" className="form-input" placeholder="ZIP" {...register("mailing_zip_code")} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 8: EMPLOYMENT (Part 7) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 8 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px" }}>
                  {watchedData.eligibility_basis === "general" || watchedData.eligibility_basis === "marriage" ? (
                    <>List where you have worked or attended school full time or part time during the last <strong>5 years</strong> if you are filing based on the general provision under Part 1., Item Number 1.a.</>
                  ) : watchedData.eligibility_basis === "military" || watchedData.eligibility_basis === "military_hostilities" ? (
                    <>List where you have worked or attended school full time or part time during the last <strong>5 years</strong>.</>
                  ) : watchedData.eligibility_basis === "qualified_employment" ? (
                    <>List where you have worked or attended school full time or part time during the last <strong>3 years</strong> if you are filing under INA section 319(b).</>
                  ) : (
                    <>List where you have worked or attended school full time or part time during the applicable period. See Part 7. in the Specific Instructions by Item Number section of the Instructions for the applicable period of time for which you must enter this information.</>
                  )} Provide information for the complete time period for all employment, including foreign government employment such as military, police, and intelligence services. Begin by providing information about your most recent or current employment, studies, or unemployment. Provide the locations and dates where you worked, were self-employed, were unemployed, or have studied. If you worked for yourself and not for a specific employer, type or print "self-employed" for the employer name. If you were unemployed, type or print "unemployed." If you are retired, type or print "retired." If you need extra space to complete Part 7., use the space provided in Part 14. Additional Information.
                </p>

                {/* Employment History */}
                <div className="form-group">
                  <label className="form-label">1. Employment and School History</label>
                  <p className="helper-text" style={{ marginBottom: "16px", marginTop: "8px" }}>
                    Begin by providing information about your most recent or current employment, studies, or unemployment. If you worked for yourself, type "self-employed". If you were unemployed, type "unemployed." If you are retired, type "retired."
                  </p>
                  
                  {/* Employment Table */}
                  <div style={{ marginTop: "16px" }}>
                    {employmentFields.length === 0 && (
                      <div style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px", marginBottom: "16px" }}>
                        <p style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "12px" }}>No employment entries yet. Click "Add Employment Entry" to begin.</p>
                        <button
                          type="button"
                          onClick={() => appendEmployment({ employer_or_school: "", occupation_or_field: "", city: "", state: "", zip_code: "", country: "", province: "", postal_code: "", dates_from: "", dates_to: "" })}
                          className="save-btn"
                          style={{ padding: "8px 16px", fontSize: "14px" }}
                        >
                          + Add Employment Entry
                        </button>
                      </div>
                    )}

                    {employmentFields.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Table Header */}
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.5fr 1fr 1fr", gap: "8px", padding: "12px", background: "var(--light-gray)", borderRadius: "8px 8px 0 0", fontWeight: "600", fontSize: "14px", borderBottom: "2px solid var(--dark)" }}>
                          <div>Employer or School</div>
                          <div>City/Town</div>
                          <div>State/Province</div>
                          <div>ZIP Code/Postal Code</div>
                          <div>Country</div>
                          <div>Occupation or Field of Study</div>
                          <div>From (mm/dd/yyyy)</div>
                          <div>To (mm/dd/yyyy)</div>
                        </div>

                        {/* Table Rows */}
                        {employmentFields.map((field, index) => (
                          <div key={field.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.5fr 1fr 1fr", gap: "8px", padding: "12px", background: index % 2 === 0 ? "var(--bg)" : "white", alignItems: "center", borderBottom: "1px solid var(--light-gray)" }}>
                            <div>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ fontSize: "14px", padding: "8px" }}
                                placeholder="Name or 'self-employed' or 'unemployed' or 'retired'" 
                                {...register(`employment_history.${index}.employer_or_school`)} 
                              />
                            </div>
                            <div>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ fontSize: "14px", padding: "8px" }}
                                placeholder="City" 
                                {...register(`employment_history.${index}.city`)} 
                              />
                            </div>
                            <div>
                              <select 
                                className="form-select" 
                                style={{ fontSize: "14px", padding: "8px" }}
                                {...register(`employment_history.${index}.state`)}
                              >
                                <option value="">—</option>
                                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ fontSize: "14px", padding: "8px" }}
                                placeholder="ZIP" 
                                {...register(`employment_history.${index}.zip_code`)} 
                              />
                            </div>
                            <div>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ fontSize: "14px", padding: "8px" }}
                                placeholder="Country" 
                                {...register(`employment_history.${index}.country`)} 
                              />
                            </div>
                            <div>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ fontSize: "14px", padding: "8px" }}
                                placeholder="Occupation or Field of Study" 
                                {...register(`employment_history.${index}.occupation_or_field`)} 
                              />
                            </div>
                            <div>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ fontSize: "14px", padding: "8px" }}
                                placeholder="MM/DD/YYYY" 
                                {...register(`employment_history.${index}.dates_from`)} 
                              />
                            </div>
                            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ fontSize: "14px", padding: "8px", flex: 1 }}
                                placeholder="MM/DD/YYYY or PRESENT" 
                                {...register(`employment_history.${index}.dates_to`)} 
                              />
                              {employmentFields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeEmployment(index)}
                                  style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer", padding: "4px" }}
                                  title="Remove this entry"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                      </div>
                    ))}
                  </div>
                    )}

                    {employmentFields.length > 0 && employmentFields.length < 3 && (
                      <button
                        type="button"
                        onClick={() => appendEmployment({ employer_or_school: "", occupation_or_field: "", city: "", state: "", zip_code: "", country: "", province: "", postal_code: "", dates_from: "", dates_to: "" })}
                        className="save-btn"
                        style={{ padding: "8px 16px", fontSize: "14px", marginTop: "16px" }}
                      >
                        + Add Another Employment Entry
                      </button>
                    )}

                    {employmentFields.length >= 3 && (
                      <p className="helper-text" style={{ marginTop: "16px" }}>
                        Maximum of 3 entries reached. If you need to add more employment or school entries, use Part 14. Additional Information.
                      </p>
                    )}
                </div>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 9: TRAVEL (Part 8) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 9 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px" }}>
                  {watchedData.eligibility_basis === "general" || watchedData.eligibility_basis === "marriage" ? (
                    <>List below all the trips that you have taken outside the United States during the last <strong>5 years</strong> if you are filing based on the general provision under Part 1., Item Number 1.a.</>
                  ) : watchedData.eligibility_basis === "military" || watchedData.eligibility_basis === "military_hostilities" ? (
                    <>List below all the trips that you have taken outside the United States during the last <strong>5 years</strong>.</>
                  ) : watchedData.eligibility_basis === "qualified_employment" ? (
                    <>List below all the trips that you have taken outside the United States during the last <strong>3 years</strong> if you are filing under INA section 319(b).</>
                  ) : (
                    <>List below all the trips that you have taken outside the United States during the applicable period. See Part 8. in the Specific Instructions by Item Number section of the Instructions for the applicable period of time for which you must enter this information.</>
                  )} Start with your most recent trip and work backwards. Do not include day trips (where the entire trip was completed within 24 hours) in the table. If you have taken any trips outside the United States that lasted more than 6 months, see the Required Evidence - Continuous Residence section of the Instructions for evidence you should provide.
                </p>

                {/* Trip Details Table */}
                <div className="form-group">
                  <label className="form-label">1. Trip Details</label>
                  <p className="helper-text" style={{ marginBottom: "12px" }}>
                    Start with your most recent trip and work backwards. If you need extra space, use Part 14. Additional Information.
                  </p>
                  
                  {tripFields.length === 0 && (
                    <div style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px", marginBottom: "16px" }}>
                      <p style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "12px" }}>No trips added yet. Click "Add Trip" to begin.</p>
                      <button
                        type="button"
                        onClick={() => appendTrip({ date_left_us: "", date_returned_us: "", countries_traveled: "" })}
                        className="save-btn"
                        style={{ padding: "8px 16px", fontSize: "14px" }}
                      >
                        + Add Trip
                      </button>
                    </div>
                  )}

                  {/* Display trips */}
                  {tripFields.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {tripFields.map((field, index) => (
                        <div key={field.id} style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Trip {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeTrip(index)}
                              style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="form-row-equal">
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "14px" }}>Date You Left the United States (mm/dd/yyyy)</label>
                              <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register(`trips.${index}.date_left_us`)} />
                            </div>
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "14px" }}>Date You Returned to the United States (mm/dd/yyyy)</label>
                              <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register(`trips.${index}.date_returned_us`)} />
                            </div>
                          </div>
                          <div className="form-group" style={{ marginTop: "12px" }}>
                            <label className="form-label" style={{ fontSize: "14px" }}>Countries to Which You Traveled</label>
                            <input type="text" className="form-input" placeholder="List all countries visited" {...register(`trips.${index}.countries_traveled`)} />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => appendTrip({ date_left_us: "", date_returned_us: "", countries_traveled: "" })}
                        className="save-btn"
                        style={{ padding: "8px 16px", fontSize: "14px", alignSelf: "flex-start" }}
                      >
                        + Add Another Trip
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginTop: "24px" }}>
                  <label className="form-label">Total Days Outside United States</label>
                  <input type="number" className="form-input" placeholder="0" style={{ maxWidth: "120px" }} {...register("total_days_outside_us")} />
                  <p className="helper-text" style={{ marginTop: "4px" }}>Add up all the days from all your trips</p>
                </div>

                <YesNoField name="trips_over_6_months" label="Have you taken any trip outside the United States that lasted more than 6 months?" />

                {watchedData.trips_over_6_months === "yes" && (
                  <div style={{ marginTop: "16px", padding: "16px", background: "#FEF3C7", borderRadius: "8px", border: "1px solid #F59E0B" }}>
                    <p style={{ color: "#92400E", fontSize: "14px" }}>
                      ⚠️ Trips of 6 months or more may affect your continuous residence. You may need to provide additional documentation. See the Required Evidence - Continuous Residence section of the Instructions.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 6: MARITAL HISTORY (Part 5) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 6 && (
              <>
                {/* Item 1: Current Marital Status */}
                <div className="form-group">
                  <label className="form-label">1. What is your current marital status?</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {[
                      { value: "single", label: "Single, Never Married" },
                      { value: "married", label: "Married" },
                      { value: "divorced", label: "Divorced" },
                      { value: "widowed", label: "Widowed" },
                      { value: "separated", label: "Separated" },
                      { value: "annulled", label: "Marriage Annulled" }
                    ].map(status => (
                      <label key={status.value} className="radio-option" style={{ flex: "0 0 auto" }}>
                        <input type="radio" value={status.value} {...register("marital_status")} />
                        <span className="radio-label" style={{ padding: "10px 20px" }}>{status.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.marital_status && <p className="error-message">{errors.marital_status.message}</p>}
                </div>

                {watchedData.marital_status === "single" && (
                  <p className="helper-text" style={{ marginTop: "-10px" }}>If you are single and have never married, go to Part 6. Information About Your Children.</p>
                )}

                {watchedData.marital_status && watchedData.marital_status !== "single" && (
                  <>
                    {/* Item 2: Spouse Military Member (only if married) */}
                    {watchedData.marital_status === "married" && (
                      <YesNoField name="spouse_is_military_member" label="2. If you are currently married, is your spouse a current member of the U.S. armed forces?" />
                    )}

                    {/* Item 3: Times Married */}
                  <div className="form-group">
                      <label className="form-label">3. How many times have you been married? (See the Specific Instructions by Item Number section of the Instructions for more information about which marriages to include.)</label>
                      <input type="number" className="form-input" placeholder="0" style={{ maxWidth: "100px" }} {...register("times_married")} />
                      <p className="helper-text" style={{ marginTop: "4px" }}>Provide current marriage certificate and any divorce decree, annulment decree, or death certificate showing that your prior marriages were terminated (if applicable).</p>
                    </div>

                    {/* Conditional sections for married filers */}
                    {(watchedData.marital_status === "married" || watchedData.eligibility_basis === "3year_marriage" || watchedData.eligibility_basis === "qualified_employment") && (
                      <>
                        <p className="helper-text" style={{ marginTop: "20px", marginBottom: "12px", fontWeight: "500" }}>
                          If you are filing under one of the categories below, answer Item Numbers 4.a. - 8.:<br />
                          Spouse of U.S. Citizen, Part 1., Item Number 1.b.; or;<br />
                          Spouse of U.S. Citizen in Qualified Employment Outside the United States, Part 1., Item Number 1.d.
                        </p>

                        {/* Item 4.a: Current Spouse's Legal Name */}
                        <div className="form-group">
                          <label className="form-label">4.a. Current Spouse's Legal Name</label>
                          <div className="form-row-thirds">
                            <div>
                              <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Family Name (Last Name)</label>
                              <input type="text" className="form-input" {...register("spouse_last_name")} />
                  </div>
                            <div>
                              <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Given Name (First Name)</label>
                              <input type="text" className="form-input" {...register("spouse_first_name")} />
                            </div>
                            <div>
                              <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Middle Name (if applicable)</label>
                              <input type="text" className="form-input" {...register("spouse_middle_name")} />
                            </div>
                          </div>
                        </div>

                        {/* Item 4.b: Spouse Date of Birth */}
                  <div className="form-group">
                          <label className="form-label">4.b. Current Spouse's Date of Birth (mm/dd/yyyy)</label>
                          <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ maxWidth: "200px" }} {...register("spouse_date_of_birth")} />
                  </div>

                        {/* Item 4.c: Date Entered into Marriage */}
                        <div className="form-group">
                          <label className="form-label">4.c. Date You Entered into Marriage with Current Spouse (mm/dd/yyyy)</label>
                          <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ maxWidth: "200px" }} {...register("spouse_date_of_marriage")} />
                </div>

                        {/* Item 4.d: Spouse Address Same */}
                        <YesNoField name="spouse_address_same_as_applicant" label="4.d. Is your current spouse's present physical address the same as your physical address?" />
                        {watchedData.spouse_address_same_as_applicant === "no" && (
                          <p className="helper-text" style={{ marginTop: "-10px" }}>If you answered "No," provide address in Part 14. Additional Information.</p>
                        )}

                        {/* Item 5.a: When did spouse become citizen */}
                        <YesNoField name="spouse_is_us_citizen" label="5.a. When did your current spouse become a U.S. citizen?" />
                        
                        {watchedData.spouse_is_us_citizen === "yes" && (
                          <>
                            <div className="form-group" style={{ marginTop: "10px" }}>
                              <label className="form-label">How did your spouse become a U.S. citizen?</label>
                              <div className="radio-group">
                                <div className="radio-option">
                                  <input type="radio" id="spouse-citizen-birth-yes" value="yes" {...register("spouse_citizenship_by_birth")} />
                                  <label htmlFor="spouse-citizen-birth-yes" className="radio-label">By Birth in the United States - Go to Item Number 7.</label>
                                </div>
                                <div className="radio-option">
                                  <input type="radio" id="spouse-citizen-birth-no" value="no" {...register("spouse_citizenship_by_birth")} />
                                  <label htmlFor="spouse-citizen-birth-no" className="radio-label">Other - Complete Item Number 5.b.</label>
                                </div>
                              </div>
                            </div>

                            {watchedData.spouse_citizenship_by_birth === "no" && (
                  <div className="form-group">
                                <label className="form-label">5.b. Date Your Current Spouse Became a U.S. Citizen (mm/dd/yyyy)</label>
                                <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ maxWidth: "200px" }} {...register("spouse_date_became_citizen")} />
                  </div>
                            )}
                          </>
                        )}

                        {/* Item 6: Spouse A-Number */}
                  <div className="form-group">
                          <label className="form-label">6. Current Spouse's Alien Registration Number (A-Number) (if any)</label>
                          <input type="text" className="form-input" placeholder="A-XXXXXXXXX" style={{ maxWidth: "200px" }} {...register("spouse_a_number")} />
                  </div>

                        {/* Item 7: Spouse Times Married */}
                        <div className="form-group">
                          <label className="form-label">7. How many times has your current spouse been married? (See the Specific Instructions by Item Number section of the Instructions for more information about which marriages to include.)</label>
                          <input type="number" className="form-input" placeholder="0" style={{ maxWidth: "100px" }} {...register("spouse_times_married")} />
                          <p className="helper-text" style={{ marginTop: "4px" }}>Provide divorce decrees, annulment decrees, or death certificates showing that all of your spouse's prior marriages were terminated (if applicable).</p>
                        </div>

                        {/* Item 8: Spouse Current Employer */}
                        <div className="form-group">
                          <label className="form-label">8. Current Spouse's Current Employer or Company</label>
                          <input type="text" className="form-input" {...register("spouse_current_employer")} />
                </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 7: CHILDREN (Part 6) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 7 && (
              <>
                <div className="form-group">
                  <label className="form-label">1. Indicate your total number of children under 18 years of age.</label>
                  <input type="number" className="form-input" placeholder="0" style={{ maxWidth: "100px" }} {...register("total_children")} />
                </div>

                {parseInt(watchedData.total_children || "0") > 0 && (
                  <div>
                    <div className="form-group" style={{ marginTop: "20px" }}>
                      <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                        2. Provide information about your children
                        <InfoIcon tooltip="For the residence and relationship columns, you must type or print one of the valid options listed. If any of your children do not reside with you, provide the address(es) where those children live in Part 14. Additional Information. If you have more than three children, use the space provided in Part 14. Additional Information." />
                      </label>
                      
                      {childrenFields.slice(0, Math.min(parseInt(watchedData.total_children || "0"), 10)).map((field, index) => (
                        <div key={field.id} style={{ marginBottom: "24px", padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Child {index + 1}</h3>
                            {index >= parseInt(watchedData.total_children || "0") && (
                              <button
                                type="button"
                                onClick={() => removeChild(index)}
                                style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                <div className="form-row-equal">
                  <div className="form-group">
                              <label className="form-label">Son or Daughter's Name (First Name and Family Name)</label>
                              <div className="form-row-equal">
                                <input type="text" className="form-input" placeholder="First Name" {...register(`children.${index}.first_name`)} />
                                <input type="text" className="form-input" placeholder="Last Name" {...register(`children.${index}.last_name`)} />
                  </div>
                  </div>
                </div>
                          <div className="form-row-equal">
                  <div className="form-group">
                              <label className="form-label">Date of Birth (mm/dd/yyyy)</label>
                              <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register(`children.${index}.date_of_birth`)} />
                  </div>
                  <div className="form-group">
                              <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                                Residence
                                <InfoIcon tooltip="Valid options include: resides with me, does not reside with me, or unknown/missing" />
                              </label>
                              <select className="form-select" {...register(`children.${index}.residence`)}>
                      <option value="">Select...</option>
                                <option value="resides with me">Resides with me</option>
                                <option value="does not reside with me">Does not reside with me</option>
                                <option value="unknown/missing">Unknown/Missing</option>
                    </select>
                  </div>
                  <div className="form-group">
                              <label className="form-label" style={{ display: "flex", alignItems: "center" }}>
                                Relationship
                                <InfoIcon tooltip="Valid options include: biological son or daughter, stepchild, or legally adopted son or daughter" />
                              </label>
                              <select className="form-select" {...register(`children.${index}.relationship`)}>
                                <option value="">Select...</option>
                                <option value="biological son or daughter">Biological son or daughter</option>
                                <option value="stepchild">Stepchild</option>
                                <option value="legally adopted son or daughter">Legally adopted son or daughter</option>
                              </select>
                  </div>
                </div>
                        </div>
                      ))}
                    </div>
                    
                    {watchedData.eligibility_basis === "qualified_employment" && (
                      <div style={{ marginTop: "16px" }}>
                        <YesNoField 
                          name="providing_support_for_children" 
                          label="Are you providing support for your son or daughter?" 
                          tooltip="Only answer Item Number 8. if you are filing under Part 1., Item Number 1.d., Spouse of U.S. Citizen in Qualified Employment Outside the United States."
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 10: BACKGROUND QUESTIONS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 10 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px" }}>
                  Answer the following questions honestly. Answering "Yes" does not automatically disqualify you.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>General Eligibility</h3>
                  <YesNoField name="q_claimed_us_citizen" label="Have you ever claimed to be a U.S. citizen?" tooltip="Have you EVER claimed to be a U.S. citizen (in writing or any other way)?" />
                  <YesNoField name="q_voted_in_us" label="Have you ever registered to vote or voted in a U.S. election?" tooltip="Have you EVER registered to vote or voted in any Federal, state, or local election in the United States? If you lawfully voted only in a local election where aliens are eligible to vote, you may answer 'No.'" />
                  <YesNoField name="q_failed_to_file_taxes" label="Have you ever failed to file a tax return?" tooltip="Have you EVER failed to file a Federal, state, or local tax return since you became a lawful permanent resident?" />
                  <YesNoField name="q_nonresident_alien_tax" label="Did you call yourself a 'nonresident alien' on a tax return?" tooltip="Since you became a lawful permanent resident, have you called yourself a 'nonresident alien' on a Federal, state, or local tax return or decided not to file a tax return because you considered yourself to be a nonresident?" />
                  <YesNoField name="q_owe_taxes" label="Do you currently owe overdue taxes?" tooltip="Do you currently owe any overdue Federal, state, or local taxes in the United States?" />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Affiliations and Associations</h3>
                  <YesNoField name="q_communist_party" label="Have you ever been associated with a Communist or totalitarian party?" tooltip="Have you EVER been a member of, involved in, or in any way associated with any Communist or totalitarian party anywhere in the world?" />
                  <YesNoField name="q_advocated_overthrow" label="Have you ever advocated the overthrow of the U.S. government?" tooltip="Have you EVER advocated (supported and promoted) the overthrow by force or violence or other unconstitutional means of the Government of the United States or all forms of law, opposition to all organized government, world communism, the establishment in the United States of a totalitarian dictatorship, or been a member of, involved in, or in any way associated with any group anywhere in the world that advocated any of the following?" />
                  <YesNoField name="q_terrorist_org" label="Have you ever been associated with or supported a terrorist organization?" tooltip="Have you EVER been a member of, involved in, or in any way associated with, or have you EVER provided money, a thing of value, services or labor, or any other assistance or support to a group that used a weapon against any person, or threatened to do so?" />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Violence and Harm</h3>
                  <YesNoField name="q_used_weapon_explosive" label="Have you ever used a weapon or explosive to harm someone or damage property?" tooltip="Have you EVER used a weapon or explosive with intent to harm another person or cause damage to property?" />
                  <YesNoField name="q_kidnapping_assassination_hijacking" label="Have you ever engaged in kidnapping, assassination, or hijacking?" tooltip="Have you EVER engaged (participated) in kidnapping, assassination, or hijacking or sabotage of an airplane, ship, vehicle, or other mode of transportation?" />
                  <YesNoField name="q_threatened_weapon_violence" label="Have you ever threatened or planned violence with weapons?" tooltip="Have you EVER threatened, attempted (tried), conspired (planned with others), prepared, planned, advocated for, or incited (encouraged) others to commit any of the acts listed above?" />
                  <YesNoField name="q_genocide" label="Have you ever participated in genocide?" tooltip="Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in genocide?" />
                  <YesNoField name="q_torture" label="Have you ever participated in torture?" tooltip="Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in torture?" />
                  <YesNoField name="q_killing_person" label="Have you ever participated in killing or trying to kill someone?" tooltip="Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in killing or trying to kill any person?" />
                  <YesNoField name="q_sexual_contact_nonconsent" label="Have you ever had non-consensual sexual contact?" tooltip="Have you EVER had any kind of sexual contact or activity with any person who did not consent (did not agree) or was unable to consent (could not agree), or was being forced or threatened by you or by someone else?" />
                  <YesNoField name="q_severely_injuring" label="Have you ever intentionally and severely injured someone?" tooltip="Have you EVER intentionally and severely injuring or trying to injure any person?" />
                  <YesNoField name="q_religious_persecution" label="Have you ever prevented someone from practicing their religion?" tooltip="Have you EVER not let someone practice his or her religion?" />
                  <YesNoField name="q_harm_race_religion" label="Have you ever harmed someone because of their race, religion, or political opinion?" tooltip="Have you EVER caused harm or suffering to any person because of his or her race, religion, national origin, membership in a particular social group, or political opinion?" />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Military and Police Service</h3>
                  <YesNoField name="q_military_police_service" label="Have you ever served in a military or police unit?" tooltip="Have you EVER served in, been a member of, assisted (helped), or participated in any military or police unit?" />
                  <YesNoField name="q_armed_group" label="Have you ever been part of an armed group?" tooltip="Have you EVER served in, been a member of, assisted (helped), or participated in any armed group (a group that carries weapons), for example: paramilitary unit, self-defense unit, vigilante unit, rebel group, or guerrilla group?" />
                  <YesNoField name="q_detention_facility" label="Have you ever worked in a detention facility?" tooltip="Have you EVER worked, volunteered, or otherwise served in a place where people were detained (forced to stay), for example, a prison, jail, prison camp, detention facility, or labor camp, or have you EVER directed or participated in any other activity that involved detaining people?" />
                  <YesNoField name="q_group_used_weapons" label="10.a. Were you ever part of a group that used weapons?" tooltip="Were you EVER a part of any group, or did you EVER help any group, unit, or organization that used a weapon against any person, or threatened to do so?" />
                  {watchedData.q_group_used_weapons === "yes" && (
                    <>
                      <YesNoField name="q_used_weapon_against_person" label="10.b. Did you use a weapon against another person?" tooltip="If you answered 'Yes' to Item Number 10.a., when you were part of this group, or when you helped this group, did you ever use a weapon against another person?" />
                      <YesNoField name="q_threatened_weapon_use" label="10.c. Did you threaten to use a weapon against another person?" tooltip="If you answered 'Yes' to Item Number 10.a., when you were part of this group, or when you helped this group, did you ever threaten another person that you would use a weapon against that person?" />
                    </>
                  )}
                  <YesNoField name="q_weapons_training" label="Have you ever received weapons or military training?" tooltip="Have you EVER received any weapons training, paramilitary training, or other military-type training?" />
                  <YesNoField name="q_sold_provided_weapons" label="Have you ever sold or provided weapons?" tooltip="Have you EVER sold, provided, or transported weapons, or assisted any person in selling, providing, or transporting weapons, which you knew or believed would be used against another person?" />
                  <YesNoField name="q_recruited_under_15" label="Have you ever recruited someone under 15 for an armed group?" tooltip="Have you EVER recruited (asked), enlisted (signed up), conscripted (required to join), or used any person under 15 years of age to serve in or help an armed group, or attempted or worked with others to do so?" />
                  <YesNoField name="q_used_under_15_hostilities" label="Have you ever used someone under 15 in hostilities?" tooltip="Have you EVER used any person under 15 years of age to take part in hostilities or attempted or worked with others to do so? This could include participating in combat or providing services related to combat (such as serving as a messenger or transporting supplies)." />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Crimes and Offenses</h3>
                  <YesNoField name="q_committed_crime_not_arrested" label="15.a. Have you ever committed a crime for which you were not arrested?" tooltip="Have you EVER committed, agreed to commit, asked someone else to commit, helped commit, or tried to commit a crime or offense for which you were NOT arrested?" />
                  <YesNoField name="q_arrested" label="15.b. Have you ever been arrested, cited, or detained?" tooltip="Have you EVER been arrested, cited, detained or confined by any law enforcement officer, military official (in the U.S. or elsewhere), or immigration official for any reason, or been charged with a crime or offense?" />
                  
                  {(watchedData.q_committed_crime_not_arrested === "yes" || watchedData.q_arrested === "yes") && (
                    <div className="form-group" style={{ marginTop: "16px" }}>
                      <p className="helper-text" style={{ marginBottom: "12px", fontWeight: "500" }}>
                        If you answer "Yes" to any part of Item Number 15., complete the table below with each crime or offense even if your records have been sealed, expunged, or otherwise cleared. You must disclose this information even if someone, including a judge, law enforcement officer, or attorney, told you that it is no longer on your record, or told you that you do not have to disclose the information.
                      </p>
                      
                      {crimeFields.length === 0 && (
                        <div style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px", marginBottom: "16px" }}>
                          <button
                            type="button"
                            onClick={() => appendCrime({ date_of_crime: "", date_of_conviction: "", crime_description: "", place_of_crime: "", result_disposition: "", sentence: "" })}
                            className="save-btn"
                            style={{ padding: "8px 16px", fontSize: "14px" }}
                          >
                            + Add Crime or Offense
                          </button>
                        </div>
                      )}

                      {crimeFields.length > 0 && (
                        <div style={{ overflowX: "auto", marginTop: "16px" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                              <tr style={{ background: "var(--bg)", borderBottom: "2px solid var(--border)" }}>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Date of Crime</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Crime Description</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Place of Crime</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Result/Disposition</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Date of Conviction</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Sentence</th>
                                <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {crimeFields.map((field, index) => (
                                <tr key={field.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                  <td style={{ padding: "12px" }}>
                                    <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ width: "100%", fontSize: "14px" }} {...register(`crimes.${index}.date_of_crime`)} />
                                  </td>
                                  <td style={{ padding: "12px" }}>
                                    <input type="text" className="form-input" placeholder="Crime description" style={{ width: "100%", fontSize: "14px" }} {...register(`crimes.${index}.crime_description`)} />
                                  </td>
                                  <td style={{ padding: "12px" }}>
                                    <input type="text" className="form-input" placeholder="City, State, Country" style={{ width: "100%", fontSize: "14px" }} {...register(`crimes.${index}.place_of_crime`)} />
                                  </td>
                                  <td style={{ padding: "12px" }}>
                                    <input type="text" className="form-input" placeholder="Result" style={{ width: "100%", fontSize: "14px" }} {...register(`crimes.${index}.result_disposition`)} />
                                  </td>
                                  <td style={{ padding: "12px" }}>
                                    <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ width: "100%", fontSize: "14px" }} {...register(`crimes.${index}.date_of_conviction`)} />
                                  </td>
                                  <td style={{ padding: "12px" }}>
                                    <input type="text" className="form-input" placeholder="Sentence" style={{ width: "100%", fontSize: "14px" }} {...register(`crimes.${index}.sentence`)} />
                                  </td>
                                  <td style={{ padding: "12px", textAlign: "center" }}>
                                    <button
                                      type="button"
                                      onClick={() => removeCrime(index)}
                                      style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button
                            type="button"
                            onClick={() => appendCrime({ date_of_crime: "", date_of_conviction: "", crime_description: "", place_of_crime: "", result_disposition: "", sentence: "" })}
                            className="save-btn"
                            style={{ padding: "8px 16px", fontSize: "14px", marginTop: "12px" }}
                          >
                            + Add Another Crime or Offense
                          </button>
                          <p className="helper-text" style={{ marginTop: "8px", fontSize: "13px" }}>
                            If you need extra space, use Part 14. Additional Information.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {(watchedData.q_committed_crime_not_arrested === "yes" || watchedData.q_arrested === "yes") && (
                    <YesNoField name="q_completed_probation" label="16. If you received a suspended sentence, were placed on probation, or were paroled, have you completed your suspended sentence, probation, or parole?" />
                  )}
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Moral Character</h3>
                  <YesNoField name="q_prostitution" label="Have you ever engaged in prostitution?" tooltip="Have you EVER engaged in prostitution, attempted to procure or import prostitutes or persons for the purpose of prostitution, or received any proceeds or money from prostitution?" />
                  <YesNoField name="q_controlled_substances" label="Have you ever sold or trafficked controlled substances?" tooltip="Have you EVER manufactured, cultivated, produced, distributed, dispensed, sold, or smuggled (trafficked) any controlled substances, illegal drugs, narcotics, or drug paraphernalia in violation of any law or regulation of a U.S. state, the United States, or a foreign country?" />
                  <YesNoField name="q_marriage_fraud" label="Have you ever married someone to obtain an immigration benefit?" tooltip="Have you EVER married someone in order to obtain an immigration benefit?" />
                  <YesNoField name="q_polygamy" label="Have you ever been married to more than one person at the same time?" />
                  <YesNoField name="q_helped_illegal_entry" label="Have you ever helped someone enter the U.S. illegally?" tooltip="Have you EVER helped anyone to enter, or try to enter, the United States illegally?" />
                  <YesNoField name="q_illegal_gambling" label="Have you ever gambled illegally or received income from illegal gambling?" />
                  <YesNoField name="q_failed_child_support" label="Have you ever failed to pay child support or alimony?" tooltip="Have you EVER failed to support your dependents (pay child support) or to pay alimony (court-ordered financial support after divorce or separation)?" />
                  <YesNoField name="q_misrepresentation_public_benefits" label="Have you ever misrepresented information to obtain public benefits?" tooltip="Have you EVER made any misrepresentation to obtain any public benefit in the United States?" />
                  <YesNoField name="q_habitual_drunkard" label="Have you ever been a habitual drunkard?" />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Immigration Violations</h3>
                  <YesNoField name="q_false_info_us_government" label="Have you ever given false information to U.S. government officials?" tooltip="Have you EVER given any U.S. Government officials any information or documentation that was false, fraudulent, or misleading?" />
                  <YesNoField name="q_lied_us_government" label="Have you ever lied to U.S. government officials?" tooltip="Have you EVER lied to any U.S. Government officials to gain entry or admission into the United States or to gain immigration benefits while in the United States?" />
                  <YesNoField name="q_removed_deported" label="Have you ever been removed or deported from the U.S.?" />
                  <YesNoField name="q_removal_proceedings" label="Have you ever been placed in removal or deportation proceedings?" />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Selective Service</h3>
                  <YesNoField name="q_male_18_26_lived_us" label="Are you a male who lived in the U.S. between ages 18-26?" tooltip="Are you a male who lived in the United States at any time between your 18th and 26th birthdays? (Do not select 'Yes' if you were a lawful nonimmigrant for all of that time period.)" />
                  {watchedData.q_male_18_26_lived_us === "yes" && (
                    <>
                      <YesNoField name="q_registered_selective_service" label="Did you register for the Selective Service?" />
                      {watchedData.q_registered_selective_service === "yes" && (
                        <div className="form-row-equal" style={{ marginTop: "10px" }}>
                <div className="form-group">
                            <label className="form-label">Selective Service Number</label>
                            <input type="text" className="form-input" {...register("selective_service_number")} />
                </div>
                          <div className="form-group">
                            <label className="form-label">Date Registered</label>
                            <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register("selective_service_date")} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Military Service</h3>
                  <YesNoField name="q_left_us_avoid_draft" label="23. Did you leave the U.S. to avoid being drafted?" />
                  <YesNoField name="q_applied_military_exemption" label="24. Have you ever applied for a military service exemption?" />
                  <YesNoField name="q_served_us_military" label="25. Have you ever served in the U.S. armed forces?" />
                  
                  {/* Items 26-29 only show if Item 25 is "yes" */}
                  {watchedData.q_served_us_military === "yes" && (
                    <>
                      <YesNoField name="q_current_military_member" label="26.a. Are you currently a member of the U.S. armed forces?" />
                      {watchedData.q_current_military_member === "yes" && (
                        <>
                          <YesNoField name="q_scheduled_deploy" label="26.b. Are you scheduled to deploy outside the U.S. within 3 months?" tooltip="Are you scheduled to deploy outside the United States, including to a vessel, within the next 3 months? (Call the Military Help Line at 877-247-4645 if you transfer to a new duty station after you file your Form N-400, including if you are deployed outside the United States or to a vessel.)" />
                          <YesNoField name="q_stationed_outside_us" label="26.c. Are you currently stationed outside the U.S.?" />
                        </>
                      )}
                      {watchedData.q_current_military_member === "no" && (
                        <YesNoField name="q_former_military_outside_us" label="26.d. Are you a former military member living outside the U.S.?" />
                      )}
                      <YesNoField name="q_discharged_because_alien" label="27. Were you discharged because you were an alien?" tooltip="Have you EVER been discharged from training or service in the U.S. armed forces because you were an alien?" />
                      <YesNoField name="q_court_martialed" label="28. Were you court-martialed or received a dishonorable discharge?" tooltip="Have you EVER been court-martialed or have you received a discharge characterized as other than honorable, bad conduct, or dishonorable, while in the U.S. armed forces?" />
                      <YesNoField name="q_deserted_military" label="29. Have you ever deserted from the U.S. armed forces?" />
                    </>
                  )}
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Title of Nobility</h3>
                  <YesNoField name="q_title_of_nobility" label="30.a. Do you have or have you ever had a hereditary title or order of nobility?" tooltip="Do you now have, or did you EVER have, a hereditary title or an order of nobility in any foreign country?" />
                  {watchedData.q_title_of_nobility === "yes" && (
                    <>
                      <YesNoField name="q_willing_to_give_up_titles" label="30.b. Are you willing to give up your titles at your naturalization ceremony?" tooltip="If you answered 'Yes' to Item Number 30.a., are you willing to give up any inherited titles or orders of nobility, that you have in a foreign country at your naturalization ceremony?" />
                      {/* USCIS requires listing titles regardless of willingness to give them up */}
                      <div className="form-group" style={{ marginTop: "10px" }}>
                        <label className="form-label">List all titles and orders of nobility:</label>
                        <textarea className="form-input" rows={3} placeholder="List each title on a separate line" {...register("q_titles_list")} />
                        <p className="helper-text" style={{ fontSize: "13px", marginTop: "4px" }}>
                          You must list all titles and orders of nobility, regardless of whether you are willing to give them up.
                    </p>
                  </div>
                    </>
                  )}
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "16px 0" }} />
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Oath of Allegiance</h3>
                  <YesNoField name="q_support_constitution" label="31. Do you support the U.S. Constitution and form of government?" />
                  <YesNoField name="q_understand_oath" label="32. Do you understand the full Oath of Allegiance?" tooltip="Do you understand the full Oath of Allegiance to the United States (see Part 16. Oath of Allegiance)?" />
                  <YesNoField name="q_unable_oath_disability" label="33. Are you unable to take the Oath due to a disability?" tooltip="Are you unable to take the Oath of Allegiance because of a physical or developmental disability or mental impairment? If you answer 'Yes,' skip Item Numbers 34. - 37. and see the Legal Guardian, Surrogate, or Designated Representative section in the Instructions." />
                  {watchedData.q_unable_oath_disability === "no" && (
                    <>
                      <YesNoField name="q_willing_take_oath" label="34. Are you willing to take the full Oath of Allegiance?" />
                      <YesNoField name="q_willing_bear_arms" label="35. Are you willing to bear arms if required by law?" tooltip="If the law requires it, are you willing to bear arms (carry weapons) on behalf of the United States?" />
                      <YesNoField name="q_willing_noncombatant" label="36. Are you willing to perform noncombatant services if required?" tooltip="If the law requires it, are you willing to perform noncombatant services (do something that does not include fighting in a war) in the U.S. armed forces?" />
                      <YesNoField name="q_willing_work_national_importance" label="37. Are you willing to perform work of national importance if required?" tooltip="If the law requires it, are you willing to perform work of national importance under civilian direction (do non-military work that the U.S. Government says is important to the country)?" />
                      <p className="helper-text" style={{ marginTop: "-10px", fontSize: "13px" }}>
                        If you answer "No" to any question except Item Number 33., see the Oath of Allegiance section of the Instructions for more information.
                      </p>
                    </>
                  )}
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 11: FEE REDUCTION (Part 10) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 11 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px" }}>
                  For information about fees, fee waivers, and reduced fees, see Form G-1055, Fee Schedule, at www.uscis.gov/g-1055. To apply for a reduced fee, complete Item Numbers 1. - 5.b. If you are not eligible for a reduced fee, complete Item Number 1. and proceed to Part 11.
                </p>

                <YesNoField 
                  name="fee_reduction_requested" 
                  label="1. Do you qualify for a fee reduction?" 
                  tooltip="My household income is less than or equal to 400% of the Federal Poverty Guidelines (see Instructions for required documentation)."
                />
                
                {watchedData.fee_reduction_requested === "yes" && (
                  <>
                    <div className="form-group" style={{ marginTop: "16px" }}>
                      <label className="form-label">2. Total household income:</label>
                      <input type="text" className="form-input" placeholder="$0.00" style={{ maxWidth: "200px" }} {...register("household_income")} />
                    </div>

                <div className="form-group">
                      <label className="form-label">3. My household size is:</label>
                      <input type="number" className="form-input" placeholder="0" style={{ maxWidth: "100px" }} {...register("household_size")} />
                </div>

                  <div className="form-group">
                      <label className="form-label">4. Total number of household members earning income including yourself:</label>
                      <input type="number" className="form-input" placeholder="0" style={{ maxWidth: "100px" }} {...register("household_income_earners")} />
                    </div>

                    <YesNoField name="is_head_of_household" label="5.a. Are you the head of household?" />
                    
                    {watchedData.is_head_of_household === "no" && (
                      <div className="form-group" style={{ marginTop: "10px" }}>
                        <label className="form-label">5.b. Name of head of household (if you selected 'No' in Item Number 5.a.):</label>
                        <input type="text" className="form-input" placeholder="Full name" {...register("head_of_household_name")} />
                  </div>
                    )}
                  </>
                )}

                {watchedData.fee_reduction_requested === "no" && (
                  <p className="helper-text" style={{ marginTop: "-10px" }}>(Skip to Part 11.)</p>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 12: APPLICANT SIGNATURE (Part 11) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 12 && (
              <>
                      <div className="form-group">
                  <label className="form-label">1. Applicant's Daytime Telephone Number</label>
                  <input type="tel" className="form-input" placeholder="(555) 123-4567" {...register("daytime_phone")} />
                  {errors.daytime_phone && <p className="error-message">{errors.daytime_phone.message}</p>}
                      </div>

                      <div className="form-group">
                  <label className="form-label">2. Applicant's Mobile Telephone Number (if any)</label>
                  <input type="tel" className="form-input" placeholder="(555) 987-6543" {...register("mobile_phone")} />
                      </div>

                      <div className="form-group">
                  <label className="form-label">3. Applicant's Email Address (if any)</label>
                  <input type="email" className="form-input" placeholder="you@example.com" {...register("email")} />
                  {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                <div className="form-group" style={{ marginTop: "32px" }}>
                  <label className="form-label">4. Applicant's Certification and Signature</label>
                  <div style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px", marginTop: "12px" }}>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                      I certify, under penalty of perjury, that I provided or authorized all of the responses and information contained in and submitted with my application, I read and understand or, if interpreted to me in a language in which I am fluent by the interpreter listed in Part 12., understood, all of the responses and information contained in, and submitted with, my application, and that all of the responses and the information are complete, true, and correct. Furthermore, I authorize the release of any information from any and all of my records that USCIS may need to determine my eligibility for an immigration request and to other entities and persons where necessary for the administration and enforcement of U.S. immigration law.
                    </p>
                    <div className="form-row-equal">
                      <div className="form-group">
                        <label className="form-label">Applicant's Signature (or signature of a legal guardian, surrogate, or designated representative, if applicable)</label>
                        <input type="text" className="form-input" placeholder="Type your full name" {...register("applicant_signature")} />
                        <p className="helper-text" style={{ fontSize: "12px", marginTop: "4px" }}>By typing your name, you are signing this form electronically</p>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Signature (mm/dd/yyyy)</label>
                        <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register("signature_date")} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 13: INTERPRETER (Part 12) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 13 && (
              <>
                <YesNoField name="used_interpreter" label="Did you use an interpreter to complete this application?" />
                
                {watchedData.used_interpreter === "yes" && (
                  <>
                    <div className="form-group" style={{ marginTop: "20px" }}>
                      <label className="form-label">Interpreter's Full Name</label>
                    <div className="form-row-equal">
                        <div>
                          <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Interpreter's Family Name (Last Name)</label>
                          <input type="text" className="form-input" {...register("interpreter_last_name")} />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Interpreter's Given Name (First Name)</label>
                          <input type="text" className="form-input" {...register("interpreter_first_name")} />
                        </div>
                      </div>
                    </div>

                      <div className="form-group">
                      <label className="form-label">2. Interpreter's Business or Organization Name</label>
                      <input type="text" className="form-input" {...register("interpreter_business_name")} />
                      </div>

                    <div className="form-row-equal">
                      <div className="form-group">
                        <label className="form-label">3. Interpreter's Daytime Telephone Number</label>
                        <input type="tel" className="form-input" placeholder="(555) 123-4567" {...register("interpreter_phone")} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">4. Interpreter's Mobile Telephone Number (if any)</label>
                        <input type="tel" className="form-input" placeholder="(555) 987-6543" {...register("interpreter_mobile")} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">5. Interpreter's Email Address (if any)</label>
                      <input type="email" className="form-input" placeholder="interpreter@example.com" {...register("interpreter_email")} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Language in which interpreter is fluent</label>
                      <input type="text" className="form-input" placeholder="e.g., Spanish, Chinese, etc." {...register("interpreter_language")} />
                    </div>

                    <div className="form-group" style={{ marginTop: "24px" }}>
                      <label className="form-label">Interpreter's Certification and Signature</label>
                      <div style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px", marginTop: "12px" }}>
                        <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                          I certify, under penalty of perjury, that I am fluent in English and [language] and I have interpreted every question on the application and Instructions and interpreted the applicant's answers to the questions in that language, and the applicant informed me that he or she understood every instruction, question, and answer on the application.
                        </p>
                        <div className="form-row-equal">
                          <div className="form-group">
                            <label className="form-label">Interpreter's Signature</label>
                            <input type="text" className="form-input" placeholder="Type interpreter's full name" {...register("interpreter_signature")} />
                  </div>
                          <div className="form-group">
                            <label className="form-label">Date of Signature (mm/dd/yyyy)</label>
                            <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register("interpreter_signature_date")} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {watchedData.used_interpreter === "no" && (
                  <p className="helper-text" style={{ marginTop: "-10px" }}>(Skip to Part 13 if someone else prepared this application, otherwise skip to Part 14.)</p>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 14: PREPARER (Part 13) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 14 && (
              <>
                <YesNoField name="used_preparer" label="Did someone other than you prepare this application?" />
                
                {watchedData.used_preparer === "yes" && (
                  <>
                    <div className="form-group" style={{ marginTop: "20px" }}>
                      <label className="form-label">Preparer's Full Name</label>
                      <div className="form-row-equal">
                        <div>
                          <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Preparer's Family Name (Last Name)</label>
                          <input type="text" className="form-input" {...register("preparer_last_name")} />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: "14px", marginBottom: "4px" }}>Preparer's Given Name (First Name)</label>
                          <input type="text" className="form-input" {...register("preparer_first_name")} />
                        </div>
                      </div>
                    </div>

                <div className="form-group">
                      <label className="form-label">2. Preparer's Business or Organization Name</label>
                      <input type="text" className="form-input" {...register("preparer_business_name")} />
                </div>

                    <div className="form-row-equal">
                      <div className="form-group">
                        <label className="form-label">3. Preparer's Daytime Telephone Number</label>
                        <input type="tel" className="form-input" placeholder="(555) 123-4567" {...register("preparer_phone")} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">4. Preparer's Mobile Telephone Number (if any)</label>
                        <input type="tel" className="form-input" placeholder="(555) 987-6543" {...register("preparer_mobile")} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">5. Preparer's Email Address (if any)</label>
                      <input type="email" className="form-input" placeholder="preparer@example.com" {...register("preparer_email")} />
                    </div>

                    <div className="form-group" style={{ marginTop: "24px" }}>
                      <label className="form-label">Preparer's Certification and Signature</label>
                      <div style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px", marginTop: "12px" }}>
                        <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                          I certify, under penalty of perjury, that I prepared this application for the applicant at his or her request and with express consent and that all of the responses and information contained in and submitted with the application are complete, true, and correct and reflects only information provided by the applicant. The applicant reviewed the responses and information and informed me that he or she understands the responses and information in or submitted with the application.
                        </p>
                        <div className="form-row-equal">
                          <div className="form-group">
                            <label className="form-label">Preparer's Signature</label>
                            <input type="text" className="form-input" placeholder="Type preparer's full name" {...register("preparer_signature")} />
                  </div>
                          <div className="form-group">
                            <label className="form-label">Date of Signature (mm/dd/yyyy)</label>
                            <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register("preparer_signature_date")} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {watchedData.used_preparer === "no" && (
                  <p className="helper-text" style={{ marginTop: "-10px" }}>(Skip to Part 14.)</p>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 15: ADDITIONAL INFORMATION (Part 14) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 15 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px" }}>
                  If you need extra space to provide any additional information within this application, use the space below. If you need more space than what is provided, you may make copies of this page to complete and file with this application or attach a separate sheet of paper. Type or print your name and A-Number at the top of each sheet; indicate the Page Number, Part Number, and Item Number to which your answer refers; and sign and date each sheet.
                </p>

                <div className="form-group">
                  <label className="form-label">Additional Information</label>
                  <p className="helper-text" style={{ marginBottom: "12px" }}>
                    Use this section to provide explanations for any "Yes" answers in Part 9, or to provide any additional information requested throughout the form.
                  </p>
                  
                  {/* Additional information array */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {additionalFields.length === 0 && (
                      <div style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                        <p style={{ fontSize: "14px", color: "var(--gray)", marginBottom: "12px" }}>No additional information entries yet. Click "Add Entry" to begin.</p>
                        <button
                          type="button"
                          onClick={() => appendAdditional({ page_number: "", part_number: "", item_number: "", explanation: "" })}
                          className="save-btn"
                          style={{ padding: "8px 16px", fontSize: "14px" }}
                        >
                          + Add Entry
                        </button>
                      </div>
                    )}

                    {additionalFields.map((field, index) => (
                      <div key={field.id} style={{ padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Entry {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeAdditional(index)}
                            style={{ background: "none", border: "none", color: "var(--gray)", cursor: "pointer" }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="form-row-thirds">
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: "14px" }}>Page Number</label>
                            <input type="text" className="form-input" placeholder="Page" {...register(`additional_information.${index}.page_number`)} />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: "14px" }}>Part Number</label>
                            <input type="text" className="form-input" placeholder="Part" {...register(`additional_information.${index}.part_number`)} />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: "14px" }}>Item Number</label>
                            <input type="text" className="form-input" placeholder="Item" {...register(`additional_information.${index}.item_number`)} />
                          </div>
                        </div>
                        <div className="form-group" style={{ marginTop: "12px" }}>
                          <label className="form-label" style={{ fontSize: "14px" }}>Explanation</label>
                          <textarea className="form-input" rows={4} placeholder="Provide your explanation or additional information here" {...register(`additional_information.${index}.explanation`)} />
                        </div>
                      </div>
                    ))}

                    {additionalFields.length > 0 && (
                      <button
                        type="button"
                        onClick={() => appendAdditional({ page_number: "", part_number: "", item_number: "", explanation: "" })}
                        className="save-btn"
                        style={{ padding: "8px 16px", fontSize: "14px", alignSelf: "flex-start" }}
                      >
                        + Add Another Entry
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 16: REVIEW */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 16 && (
              <>
                <ReviewSection title="ELIGIBILITY" onEdit={() => goToStep(1)}>
                  <ReviewField label="Basis" value={ELIGIBILITY_OPTIONS.find(o => o.value === watchedData.eligibility_basis)?.label || "—"} />
                </ReviewSection>

                <ReviewSection title="IDENTITY" onEdit={() => goToStep(2)}>
                  <ReviewField label="Name" value={`${watchedData.first_name} ${watchedData.middle_name || ""} ${watchedData.last_name}`.trim()} />
                  <ReviewField label="Date of Birth" value={watchedData.date_of_birth} />
                  <ReviewField label="Country of Birth" value={watchedData.country_of_birth} />
                  <ReviewField label="Gender" value={watchedData.gender} />
                </ReviewSection>

                <ReviewSection title="IMMIGRATION STATUS" onEdit={() => goToStep(3)}>
                  <ReviewField label="A-Number" value={watchedData.a_number || "—"} />
                  <ReviewField label="SSN" value={watchedData.ssn || "—"} />
                  <ReviewField label="Date Became PR" value={watchedData.date_became_permanent_resident} />
                </ReviewSection>

                <ReviewSection title="CONTACT" onEdit={() => goToStep(4)}>
                  <ReviewField label="Phone" value={watchedData.daytime_phone} />
                  <ReviewField label="Email" value={watchedData.email} />
                </ReviewSection>

                <ReviewSection title="RESIDENCE" onEdit={() => goToStep(5)}>
                  <ReviewField label="Address" value={`${watchedData.street_address}, ${watchedData.city}, ${watchedData.state} ${watchedData.zip_code}`} />
                </ReviewSection>

                <ReviewSection title="BIOGRAPHIC" onEdit={() => goToStep(6)}>
                  <ReviewField label="Ethnicity" value={ETHNICITIES.find(e => e.value === watchedData.ethnicity)?.label || "—"} />
                  <ReviewField label="Height" value={`${watchedData.height_feet}'${watchedData.height_inches || 0}"`} />
                  <ReviewField label="Weight" value={`${watchedData.weight} lbs`} />
                  <ReviewField label="Eyes / Hair" value={`${watchedData.eye_color} / ${watchedData.hair_color}`} />
                </ReviewSection>

                <ReviewSection title="MARITAL STATUS" onEdit={() => goToStep(9)}>
                  <ReviewField label="Status" value={watchedData.marital_status} />
                  {watchedData.spouse_first_name && (
                    <ReviewField label="Spouse" value={`${watchedData.spouse_first_name} ${watchedData.spouse_last_name}`} />
                  )}
                </ReviewSection>

                <ReviewSection title="CHILDREN" onEdit={() => goToStep(10)}>
                  <ReviewField label="Total" value={watchedData.total_children || "0"} />
                </ReviewSection>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 17: COMPLETE */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 17 && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div className="complete-icon">✓</div>
                <p style={{ fontSize: "16px", color: "var(--gray)", marginBottom: "32px", lineHeight: "1.6" }}>
                  Your N-400 application data has been saved.
                  <br />
                  Download your completed form below.
                </p>
                <button
                  type="button"
                  className="btn-next"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <span className="spinner" />
                      Generating PDF...
                    </>
                  ) : (
                    "DOWNLOAD N-400 FORM"
                  )}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 12 && (
              <div className="button-row">
                {currentStep > 1 && (
                  <button type="button" className="btn-back" onClick={handleBack}>← Back</button>
                )}
                <button type="button" className="btn-next" onClick={handleNext}>
                  NEXT <span style={{ marginLeft: "4px" }}>→</span>
                </button>
              </div>
            )}

            {currentStep === 12 && (
              <div className="button-row">
                <button type="button" className="btn-back" onClick={handleBack}>← Back</button>
                <button type="submit" className="btn-next" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      Submitting...
                    </>
                  ) : (
                    "SUBMIT APPLICATION"
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Support Button */}
      <button className="support-btn" title="Get help">
        <HelpCircle size={24} />
      </button>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="review-section">
      <div className="review-section-title">
        {title}
        <button type="button" onClick={onEdit}>Edit</button>
      </div>
      {children}
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-field">
      <div className="review-label">{label}</div>
      <div className="review-value" style={{ textTransform: label === "Status" || label === "Gender" ? "capitalize" : undefined }}>
        {value || "—"}
      </div>
    </div>
  );
}

