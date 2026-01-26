"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

  // ═══════════════════════════════════════════════════════════════
  // PART 2: INFORMATION ABOUT YOU
  // ═══════════════════════════════════════════════════════════════
  // Current Legal Name
  last_name: z.string().min(1, "Last name is required"),
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),

  // Other Names Used
  has_used_other_names: z.string().optional(),
  other_names: z.array(z.object({
    family_name: z.string(),
    given_name: z.string(),
  })).optional(),

  // Personal Information
  date_of_birth: z.string().min(1, "Date of birth is required"),
  country_of_birth: z.string().min(1, "Country of birth is required"),
  country_of_citizenship: z.string().min(1, "Country of citizenship is required"),
  gender: z.string().min(1, "Gender is required"),

  // Identification Numbers
  a_number: z.string().optional(),
  uscis_account_number: z.string().optional(),
  ssn: z.string().optional(),

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
  // Current Address
  street_address: z.string().min(1, "Street address is required"),
  apt_ste_flr: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(5, "ZIP code is required"),
  residence_from: z.string().optional(),

  // Mailing Address (if different)
  mailing_same_as_residence: z.string().optional(),
  mailing_street_address: z.string().optional(),
  mailing_city: z.string().optional(),
  mailing_state: z.string().optional(),
  mailing_zip_code: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 7: BIOGRAPHIC INFORMATION
  // ═══════════════════════════════════════════════════════════════
  ethnicity: z.string().min(1, "Ethnicity is required"),
  race: z.string().min(1, "Race is required"),
  height_feet: z.string().min(1, "Height is required"),
  height_inches: z.string().optional(),
  weight: z.string().min(1, "Weight is required"),
  eye_color: z.string().min(1, "Eye color is required"),
  hair_color: z.string().min(1, "Hair color is required"),

  // ═══════════════════════════════════════════════════════════════
  // PART 8: EMPLOYMENT
  // ═══════════════════════════════════════════════════════════════
  current_employer: z.string().optional(),
  current_occupation: z.string().optional(),
  employer_city: z.string().optional(),
  employer_state: z.string().optional(),
  employment_from: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 9: TIME OUTSIDE THE US
  // ═══════════════════════════════════════════════════════════════
  total_days_outside_us: z.string().optional(),
  trips_over_6_months: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 10: MARITAL HISTORY
  // ═══════════════════════════════════════════════════════════════
  marital_status: z.string().min(1, "Marital status is required"),
  times_married: z.string().optional(),
  
  // Current Spouse Information (if married)
  spouse_last_name: z.string().optional(),
  spouse_first_name: z.string().optional(),
  spouse_middle_name: z.string().optional(),
  spouse_date_of_birth: z.string().optional(),
  spouse_date_of_marriage: z.string().optional(),
  spouse_is_us_citizen: z.string().optional(),
  spouse_a_number: z.string().optional(),
  spouse_country_of_birth: z.string().optional(),
  spouse_current_employer: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 11: CHILDREN
  // ═══════════════════════════════════════════════════════════════
  total_children: z.string().optional(),

  // ═══════════════════════════════════════════════════════════════
  // PART 12: ADDITIONAL QUESTIONS (Yes/No)
  // ═══════════════════════════════════════════════════════════════
  // General Eligibility
  q_claimed_us_citizen: z.string().optional(),
  q_voted_in_us: z.string().optional(),
  q_failed_to_file_taxes: z.string().optional(),
  q_owe_taxes: z.string().optional(),
  q_title_of_nobility: z.string().optional(),

  // Affiliations
  q_communist_party: z.string().optional(),
  q_terrorist_org: z.string().optional(),
  q_genocide: z.string().optional(),
  q_torture: z.string().optional(),

  // Moral Character
  q_arrested: z.string().optional(),
  q_habitual_drunkard: z.string().optional(),
  q_prostitution: z.string().optional(),
  q_illegal_gambling: z.string().optional(),
  q_failed_child_support: z.string().optional(),
  
  // Military
  q_served_us_military: z.string().optional(),
  q_deserted_military: z.string().optional(),
});

type FormData = z.infer<typeof n400Schema>;

// ═══════════════════════════════════════════════════════════════
// STEP DEFINITIONS
// ═══════════════════════════════════════════════════════════════
const STEPS = [
  { id: 1, section: "ELIGIBILITY", title: "How do you qualify for citizenship?", part: "Part 1" },
  { id: 2, section: "IDENTITY", title: "Tell us about yourself.", part: "Part 2" },
  { id: 3, section: "IMMIGRATION STATUS", title: "Your immigration information.", part: "Part 2" },
  { id: 4, section: "CONTACT", title: "How can we reach you?", part: "Part 4" },
  { id: 5, section: "RESIDENCE", title: "Where do you live?", part: "Part 5" },
  { id: 6, section: "BIOGRAPHIC", title: "Physical characteristics.", part: "Part 7" },
  { id: 7, section: "EMPLOYMENT", title: "Your work history.", part: "Part 8" },
  { id: 8, section: "TRAVEL", title: "Time outside the US.", part: "Part 9" },
  { id: 9, section: "MARITAL HISTORY", title: "Your marriage information.", part: "Part 10" },
  { id: 10, section: "CHILDREN", title: "Information about your children.", part: "Part 11" },
  { id: 11, section: "BACKGROUND", title: "Important eligibility questions.", part: "Part 12" },
  { id: 12, section: "REVIEW", title: "Review your application.", part: "" },
  { id: 13, section: "COMPLETE", title: "You're all set!", part: "" },
];

// ═══════════════════════════════════════════════════════════════
// OPTIONS DATA
// ═══════════════════════════════════════════════════════════════
const ELIGIBILITY_OPTIONS = [
  { value: "5year", label: "I have been a lawful permanent resident for at least 5 years" },
  { value: "3year_marriage", label: "I have been married to and living with a U.S. citizen for at least 3 years" },
  { value: "military_current", label: "I am a current member of the U.S. Armed Forces" },
  { value: "military_former", label: "I was formerly a member of the U.S. Armed Forces" },
  { value: "other", label: "Other basis for eligibility" },
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
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

  // Get fields to validate for each step
  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1: return ["eligibility_basis"];
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

        // ═══════════════════════════════════════════════════════════════
        // PART 2: INFORMATION ABOUT YOU
        // ═══════════════════════════════════════════════════════════════
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        has_used_other_names: data.has_used_other_names,
        other_names: data.other_names ? JSON.stringify(data.other_names) : undefined,
        date_of_birth: data.date_of_birth,
        country_of_birth: data.country_of_birth,
        country_of_citizenship: data.country_of_citizenship,
        gender: data.gender,

        // Identification Numbers
        a_number: data.a_number,
        uscis_account_number: data.uscis_account_number,
        ssn: data.ssn,

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

        // Mailing Address (conditional - only if different from residence)
        mailing_same_as_residence: data.mailing_same_as_residence,
        ...(data.mailing_same_as_residence === "no" && {
          mailing_street_address: data.mailing_street_address,
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

        // ═══════════════════════════════════════════════════════════════
        // PART 9: TIME OUTSIDE THE US
        // ═══════════════════════════════════════════════════════════════
        total_days_outside_us: data.total_days_outside_us,
        trips_over_6_months: data.trips_over_6_months,

        // ═══════════════════════════════════════════════════════════════
        // PART 10: MARITAL HISTORY
        // ═══════════════════════════════════════════════════════════════
        marital_status: data.marital_status,
        times_married: data.times_married,

        // Spouse Information (conditional - only if married)
        ...(data.marital_status === "married" && {
          spouse_first_name: data.spouse_first_name,
          spouse_middle_name: data.spouse_middle_name,
          spouse_last_name: data.spouse_last_name,
          spouse_date_of_birth: data.spouse_date_of_birth,
          spouse_date_of_marriage: data.spouse_date_of_marriage,
          spouse_is_us_citizen: data.spouse_is_us_citizen,
          spouse_a_number: data.spouse_a_number,
          spouse_country_of_birth: data.spouse_country_of_birth,
          spouse_current_employer: data.spouse_current_employer,
        }),

        // ═══════════════════════════════════════════════════════════════
        // PART 11: CHILDREN
        // ═══════════════════════════════════════════════════════════════
        total_children: data.total_children,

        // ═══════════════════════════════════════════════════════════════
        // PART 12: BACKGROUND QUESTIONS
        // ═══════════════════════════════════════════════════════════════
        // General Eligibility
        q_claimed_us_citizen: data.q_claimed_us_citizen,
        q_voted_in_us: data.q_voted_in_us,
        q_failed_to_file_taxes: data.q_failed_to_file_taxes,
        q_owe_taxes: data.q_owe_taxes,
        q_title_of_nobility: data.q_title_of_nobility,

        // Affiliations
        q_communist_party: data.q_communist_party,
        q_terrorist_org: data.q_terrorist_org,
        q_genocide: data.q_genocide,
        q_torture: data.q_torture,

        // Moral Character
        q_arrested: data.q_arrested,
        q_habitual_drunkard: data.q_habitual_drunkard,
        q_prostitution: data.q_prostitution,
        q_illegal_gambling: data.q_illegal_gambling,
        q_failed_child_support: data.q_failed_child_support,

        // Military
        q_served_us_military: data.q_served_us_military,
        q_deserted_military: data.q_deserted_military,
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

  // Helper component for Yes/No radio buttons
  const YesNoField = ({ name, label }: { name: keyof FormData; label: string }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
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
    </div>
  );

  return (
    <div className="app-wrapper">
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
      <div className="main-container">
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
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 2: IDENTITY */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">Your current legal name (as it appears on your green card)</label>
                  <div className="form-row-thirds">
                    <div>
                      <input type="text" className="form-input" placeholder="First Name" {...register("first_name")} />
                      {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}
                    </div>
                    <div>
                      <input type="text" className="form-input" placeholder="Middle Name" {...register("middle_name")} />
                    </div>
                    <div>
                      <input type="text" className="form-input" placeholder="Last Name" {...register("last_name")} />
                      {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}
                    </div>
                  </div>
                </div>

                <YesNoField name="has_used_other_names" label="Have you used any other names (maiden name, alias, nickname)?" />

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ maxWidth: "200px" }} {...register("date_of_birth")} />
                  {errors.date_of_birth && <p className="error-message">{errors.date_of_birth.message}</p>}
                </div>

                <div className="form-row-equal">
                  <div className="form-group">
                    <label className="form-label">Country of Birth</label>
                    <select className="form-select" {...register("country_of_birth")}>
                      <option value="">Select...</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country_of_birth && <p className="error-message">{errors.country_of_birth.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country of Citizenship</label>
                    <select className="form-select" {...register("country_of_citizenship")}>
                      <option value="">Select...</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country_of_citizenship && <p className="error-message">{errors.country_of_citizenship.message}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
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
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 3: IMMIGRATION STATUS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <>
                <div className="form-group">
                  <label className="form-label">Alien Registration Number (A-Number)</label>
                  <input type="text" className="form-input" placeholder="A-XXXXXXXXX" style={{ maxWidth: "250px" }} {...register("a_number")} />
                  <p className="helper-text">Found on your green card (9 digits after "A")</p>
                </div>

                <div className="form-group">
                  <label className="form-label">USCIS Online Account Number (if any)</label>
                  <input type="text" className="form-input" placeholder="12-digit number" style={{ maxWidth: "250px" }} {...register("uscis_account_number")} />
                </div>

                <div className="form-group">
                  <label className="form-label">Social Security Number</label>
                  <input type="text" className="form-input" placeholder="XXX-XX-XXXX" style={{ maxWidth: "200px" }} {...register("ssn")} />
                </div>

                <div className="form-group">
                  <label className="form-label">Date You Became a Lawful Permanent Resident</label>
                  <input type="text" className="form-input" placeholder="MM/DD/YYYY" style={{ maxWidth: "200px" }} {...register("date_became_permanent_resident")} />
                  <p className="helper-text">Found on your green card as "Resident Since"</p>
                  {errors.date_became_permanent_resident && <p className="error-message">{errors.date_became_permanent_resident.message}</p>}
                </div>

                <YesNoField name="request_disability_accommodations" label="Do you request an accommodation because of a disability?" />
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
            {/* STEP 5: RESIDENCE */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 5 && (
              <>
                <div className="form-group">
                  <label className="form-label">Current Physical Address</label>
                  <div className="form-row" style={{ gridTemplateColumns: "1fr 120px" }}>
                    <input type="text" className="form-input" placeholder="Street Address" {...register("street_address")} />
                    <input type="text" className="form-input" placeholder="Apt/Ste/Flr" {...register("apt_ste_flr")} />
                  </div>
                  {errors.street_address && <p className="error-message">{errors.street_address.message}</p>}
                </div>

                <div className="form-row-thirds">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" placeholder="City" {...register("city")} />
                    {errors.city && <p className="error-message">{errors.city.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select className="form-select" {...register("state")}>
                      <option value="">Select...</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="error-message">{errors.state.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input type="text" className="form-input" placeholder="94102" {...register("zip_code")} />
                    {errors.zip_code && <p className="error-message">{errors.zip_code.message}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Date you started living at this address</label>
                  <input type="text" className="form-input" placeholder="MM/YYYY" style={{ maxWidth: "150px" }} {...register("residence_from")} />
                </div>

                <YesNoField name="mailing_same_as_residence" label="Is your mailing address the same as your physical address?" />

                {watchedData.mailing_same_as_residence === "no" && (
                  <div style={{ marginTop: "16px", padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                    <div className="form-group">
                      <label className="form-label">Mailing Address</label>
                      <input type="text" className="form-input" placeholder="Street Address" {...register("mailing_street_address")} />
                    </div>
                    <div className="form-row-thirds">
                      <input type="text" className="form-input" placeholder="City" {...register("mailing_city")} />
                      <select className="form-select" {...register("mailing_state")}>
                        <option value="">State</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="text" className="form-input" placeholder="ZIP" {...register("mailing_zip_code")} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 6: BIOGRAPHIC */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 6 && (
              <>
                <div className="form-group">
                  <label className="form-label">Ethnicity</label>
                  <div className="radio-group">
                    {ETHNICITIES.map(e => (
                      <div key={e.value} className="radio-option">
                        <input type="radio" id={`eth-${e.value}`} value={e.value} {...register("ethnicity")} />
                        <label htmlFor={`eth-${e.value}`} className="radio-label">{e.label}</label>
                      </div>
                    ))}
                  </div>
                  {errors.ethnicity && <p className="error-message">{errors.ethnicity.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Race (select one)</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {RACES.map(r => (
                      <label key={r.value} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input type="radio" value={r.value} {...register("race")} style={{ accentColor: "var(--dark)" }} />
                        <span>{r.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.race && <p className="error-message">{errors.race.message}</p>}
                </div>

                <div className="form-row-equal">
                  <div className="form-group">
                    <label className="form-label">Height</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <select className="form-select" style={{ width: "80px" }} {...register("height_feet")}>
                        {[3,4,5,6,7].map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                      <span>ft</span>
                      <select className="form-select" style={{ width: "80px" }} {...register("height_inches")}>
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                      <span>in</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (lbs)</label>
                    <input type="number" className="form-input" placeholder="150" style={{ maxWidth: "100px" }} {...register("weight")} />
                  </div>
                </div>

                <div className="form-row-equal">
                  <div className="form-group">
                    <label className="form-label">Eye Color</label>
                    <select className="form-select" {...register("eye_color")}>
                      <option value="">Select...</option>
                      {EYE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hair Color</label>
                    <select className="form-select" {...register("hair_color")}>
                      <option value="">Select...</option>
                      {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 7: EMPLOYMENT */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 7 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px" }}>
                  Provide your current or most recent employment information.
                </p>

                <div className="form-row-equal">
                  <div className="form-group">
                    <label className="form-label">Employer Name</label>
                    <input type="text" className="form-input" placeholder="Company name" {...register("current_employer")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Occupation</label>
                    <input type="text" className="form-input" placeholder="Job title" {...register("current_occupation")} />
                  </div>
                </div>

                <div className="form-row-thirds">
                  <div className="form-group">
                    <label className="form-label">Employer City</label>
                    <input type="text" className="form-input" placeholder="City" {...register("employer_city")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select className="form-select" {...register("employer_state")}>
                      <option value="">Select...</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date From</label>
                    <input type="text" className="form-input" placeholder="MM/YYYY" {...register("employment_from")} />
                  </div>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 8: TRAVEL */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 8 && (
              <>
                <div className="form-group">
                  <label className="form-label">How many total days have you spent outside the United States in the last 5 years?</label>
                  <input type="number" className="form-input" placeholder="0" style={{ maxWidth: "120px" }} {...register("total_days_outside_us")} />
                  <p className="helper-text">Add up all the days from all your trips</p>
                </div>

                <YesNoField name="trips_over_6_months" label="Have you taken any trip outside the United States that lasted 6 months or more?" />

                {watchedData.trips_over_6_months === "yes" && (
                  <div style={{ marginTop: "16px", padding: "16px", background: "#FEF3C7", borderRadius: "8px", border: "1px solid #F59E0B" }}>
                    <p style={{ color: "#92400E", fontSize: "14px" }}>
                      ⚠️ Trips of 6 months or more may affect your continuous residence. You may need to provide additional documentation.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 9: MARITAL HISTORY */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 9 && (
              <>
                <div className="form-group">
                  <label className="form-label">Current Marital Status</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {["Single", "Married", "Divorced", "Widowed", "Separated", "Annulled"].map(status => (
                      <label key={status} className="radio-option" style={{ flex: "0 0 auto" }}>
                        <input type="radio" value={status.toLowerCase()} {...register("marital_status")} />
                        <span className="radio-label" style={{ padding: "10px 20px" }}>{status}</span>
                      </label>
                    ))}
                  </div>
                  {errors.marital_status && <p className="error-message">{errors.marital_status.message}</p>}
                </div>

                {watchedData.marital_status && watchedData.marital_status !== "single" && (
                  <div className="form-group">
                    <label className="form-label">How many times have you been married?</label>
                    <select className="form-select" style={{ maxWidth: "100px" }} {...register("times_married")}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                )}

                {watchedData.marital_status === "married" && (
                  <div style={{ marginTop: "24px", padding: "24px", background: "var(--bg)", borderRadius: "12px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Current Spouse Information</h3>

                    <div className="form-row-thirds">
                      <div className="form-group">
                        <label className="form-label">Spouse's First Name</label>
                        <input type="text" className="form-input" {...register("spouse_first_name")} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Middle Name</label>
                        <input type="text" className="form-input" {...register("spouse_middle_name")} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input type="text" className="form-input" {...register("spouse_last_name")} />
                      </div>
                    </div>

                    <div className="form-row-equal">
                      <div className="form-group">
                        <label className="form-label">Spouse's Date of Birth</label>
                        <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register("spouse_date_of_birth")} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Marriage</label>
                        <input type="text" className="form-input" placeholder="MM/DD/YYYY" {...register("spouse_date_of_marriage")} />
                      </div>
                    </div>

                    <div className="form-row-equal">
                      <div className="form-group">
                        <label className="form-label">Spouse's Country of Birth</label>
                        <select className="form-select" {...register("spouse_country_of_birth")}>
                          <option value="">Select...</option>
                          <option value="United States">United States</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Spouse's A-Number (if any)</label>
                        <input type="text" className="form-input" placeholder="A-XXXXXXXXX" {...register("spouse_a_number")} />
                      </div>
                    </div>

                    <YesNoField name="spouse_is_us_citizen" label="Is your spouse a U.S. citizen?" />

                    <div className="form-group">
                      <label className="form-label">Spouse's Current Employer</label>
                      <input type="text" className="form-input" {...register("spouse_current_employer")} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 10: CHILDREN */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 10 && (
              <>
                <div className="form-group">
                  <label className="form-label">How many children do you have?</label>
                  <p className="helper-text" style={{ marginBottom: "12px" }}>
                    Include all living children (biological, adopted, stepchildren) regardless of age, location, or marital status.
                  </p>
                  <select className="form-select" style={{ maxWidth: "100px" }} {...register("total_children")}>
                    {[0,1,2,3,4,5,6,7,8,9,"10+"].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {watchedData.total_children && parseInt(watchedData.total_children) > 0 && (
                  <div style={{ marginTop: "16px", padding: "16px", background: "var(--bg)", borderRadius: "8px" }}>
                    <p style={{ fontSize: "14px", color: "var(--gray)" }}>
                      In the full application, you would enter details for each child (name, date of birth, A-Number, address, etc.)
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 11: BACKGROUND QUESTIONS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 11 && (
              <>
                <p className="helper-text" style={{ marginBottom: "24px" }}>
                  Answer the following questions honestly. Answering "Yes" does not automatically disqualify you.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <YesNoField name="q_claimed_us_citizen" label="Have you EVER claimed to be a U.S. citizen (in writing or any other way)?" />
                  <YesNoField name="q_voted_in_us" label="Have you EVER voted in any Federal, state, or local election in the United States?" />
                  <YesNoField name="q_failed_to_file_taxes" label="Have you EVER failed to file a Federal, state, or local tax return since you became a lawful permanent resident?" />
                  <YesNoField name="q_owe_taxes" label="Do you owe any Federal, state, or local taxes that are overdue?" />
                  <YesNoField name="q_title_of_nobility" label="Do you have any title of nobility in a foreign country?" />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "8px 0" }} />
                  
                  <YesNoField name="q_communist_party" label="Have you EVER been a member of the Communist Party?" />
                  <YesNoField name="q_terrorist_org" label="Have you EVER been associated with any terrorist organization?" />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "8px 0" }} />
                  
                  <YesNoField name="q_arrested" label="Have you EVER been arrested, cited, or detained by any law enforcement officer?" />
                  <YesNoField name="q_habitual_drunkard" label="Have you EVER been a habitual drunkard?" />
                  <YesNoField name="q_illegal_gambling" label="Have you EVER been involved in illegal gambling?" />
                  <YesNoField name="q_failed_child_support" label="Have you EVER failed to support your dependents or pay child support?" />
                  
                  <hr style={{ border: "none", borderTop: "1px solid var(--light-gray)", margin: "8px 0" }} />
                  
                  <YesNoField name="q_served_us_military" label="Have you EVER served in the U.S. Armed Forces?" />
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STEP 12: REVIEW */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 12 && (
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
            {/* STEP 13: COMPLETE */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep === 13 && (
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
    </div>
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
