/**
 * Meridian Guidance Pattern - Question Metadata
 * 
 * This module contains the structured metadata for each question in the N-400 intake.
 * Each entry supports the guidance pattern: plain English title, USCIS text, intent, guardrail.
 * 
 * IMPORTANT: This file uses neutral, descriptive language only.
 * - No advice or steering (no "traffic tickets don't count" etc.)
 * - Use phrasing like "USCIS uses this to assess..." or "This section captures..."
 */

import type { StepMetadata, QuestionMetadata } from './types/guidance';

// ═══════════════════════════════════════════════════════════════
// PART 1: ELIGIBILITY
// ═══════════════════════════════════════════════════════════════

export const PART_1_METADATA: StepMetadata = {
  id: 1,
  section: 'ELIGIBILITY',
  title: 'How do you qualify for citizenship?',
  part: 'Part 1',
  intent: 'USCIS uses this to determine which naturalization requirements apply to your application.',
  guardrail: 'You can review and change your selection before submitting.',
  questions: [
    {
      id: 'a_number',
      part: 'Part 1',
      item: 'A-Number',
      title: 'Enter your 9-digit A-Number',
      uscis_text: 'Alien Registration Number (A-Number)',
      intent: 'USCIS uses this to locate your immigration file and verify your permanent resident status.',
      guardrail: 'Your A-Number is on your green card, after the letter "A".',
    },
    {
      id: 'eligibility_basis',
      part: 'Part 1',
      item: '1',
      title: 'Select the basis for your eligibility',
      uscis_text: 'You are applying on the basis of:',
      intent: 'USCIS uses this to determine which residency and physical presence requirements apply to you.',
      guardrail: 'Choose the option that matches how you are filing. You can review and update this later.',
      explanation_required: false,
    },
    {
      id: 'other_basis_reason',
      part: 'Part 1',
      item: '1.h',
      title: 'Describe your eligibility basis',
      uscis_text: 'Other (explain):',
      intent: 'USCIS uses this to evaluate eligibility under less common provisions of the Immigration and Nationality Act.',
      show_when: { field: 'eligibility_basis', value: 'other' },
    },
    {
      id: 'uscis_field_office',
      part: 'Part 1',
      item: '2',
      title: 'Select your preferred interview location',
      uscis_text: 'If your residential address is outside the United States and you are filing under INA section 319(b), select the USCIS field office in the United States where you would like to have your naturalization interview.',
      intent: 'USCIS uses this to schedule your interview at a convenient U.S. location.',
      show_when: { field: 'eligibility_basis', value: 'qualified_employment' },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 2: INFORMATION ABOUT YOU
// ═══════════════════════════════════════════════════════════════

export const PART_2_METADATA: StepMetadata = {
  id: 2,
  section: 'INFORMATION ABOUT YOU',
  title: 'Tell us about yourself.',
  part: 'Part 2',
  intent: 'USCIS uses identity details to match your records and verify your history.',
  guardrail: 'Enter information exactly as it appears on your documents.',
  questions: [
    {
      id: 'last_name',
      part: 'Part 2',
      item: '1.a',
      title: 'Family name (last name)',
      uscis_text: 'Family Name (Last Name)',
      intent: 'USCIS uses your legal name to match your records.',
      guardrail: 'Enter the name exactly as shown on official documents.',
    },
    {
      id: 'first_name',
      part: 'Part 2',
      item: '1.b',
      title: 'Given name (first name)',
      uscis_text: 'Given Name (First Name)',
      intent: 'USCIS uses your legal name to match your records.',
      guardrail: 'Enter the name exactly as shown on official documents.',
    },
    {
      id: 'middle_name',
      part: 'Part 2',
      item: '1.c',
      title: 'Middle name (if any)',
      uscis_text: 'Middle Name (if any)',
      intent: 'USCIS uses your legal name to match your records.',
      guardrail: 'Leave blank if you do not have a middle name.',
    },
    {
      id: 'has_used_other_names',
      part: 'Part 2',
      item: '2',
      title: 'Have you used other names since birth?',
      uscis_text: 'Have you used other names since birth?',
      intent: 'USCIS uses this to match your records across different names.',
      guardrail: 'List any other names you have used in official records.',
    },
    {
      id: 'wants_name_change',
      part: 'Part 2',
      item: '3',
      title: 'Would you like to legally change your name?',
      uscis_text: 'Would you like to legally change your name?',
      intent: 'USCIS uses this to determine whether a name change request is included.',
      guardrail: 'You can review this decision before submission.',
    },
    {
      id: 'uscis_account_number',
      part: 'Part 2',
      item: '4',
      title: 'USCIS online account number (if any)',
      uscis_text: 'USCIS Online Account Number',
      intent: 'USCIS uses this to link your online account to your application.',
      guardrail: 'Leave blank if you do not have one.',
    },
    {
      id: 'gender',
      part: 'Part 2',
      item: '5',
      title: 'Sex',
      uscis_text: 'Sex',
      intent: 'USCIS uses this as a biographic identifier.',
      guardrail: 'Select the option that appears on your documents.',
    },
    {
      id: 'date_of_birth',
      part: 'Part 2',
      item: '6',
      title: 'Date of birth',
      uscis_text: 'Date of Birth',
      intent: 'USCIS uses this to verify your identity.',
      guardrail: 'Use MM/DD/YYYY.',
    },
    {
      id: 'date_became_permanent_resident',
      part: 'Part 2',
      item: '7',
      title: 'Permanent resident since',
      uscis_text: 'Date You Became a Lawful Permanent Resident',
      intent: 'USCIS uses this to confirm residence timelines.',
      guardrail: 'Use the “Resident Since” date on your green card.',
    },
    {
      id: 'country_of_birth',
      part: 'Part 2',
      item: '8',
      title: 'Country of birth',
      uscis_text: 'Country of Birth',
      intent: 'USCIS uses this as a biographic identifier.',
      guardrail: 'Select the country shown on your documents.',
    },
    {
      id: 'country_of_citizenship',
      part: 'Part 2',
      item: '9',
      title: 'Country of citizenship',
      uscis_text: 'Country of Citizenship or Nationality',
      intent: 'USCIS uses this to confirm nationality details.',
      guardrail: 'If you have more than one, list others in Part 14.',
    },
    {
      id: 'parent_us_citizen_before_18',
      part: 'Part 2',
      item: '10',
      title: 'Was your parent a U.S. citizen before your 18th birthday?',
      uscis_text: 'Was your mother or father (including adoptive mother or father) a U.S. citizen before your 18th birthday?',
      intent: 'USCIS uses this to determine whether a different process applies.',
      guardrail: 'See the Instructions for details on how this is evaluated.',
    },
    {
      id: 'request_disability_accommodations',
      part: 'Part 2',
      item: '11',
      title: 'Do you need disability accommodations?',
      uscis_text: 'Do you have a physical or developmental disability or mental impairment that prevents you from demonstrating your knowledge and understanding of the English language or civics requirements for naturalization?',
      intent: 'USCIS uses this to identify accommodation requests and related documentation.',
      guardrail: 'Follow the Instructions to determine required documentation.',
    },
    {
      id: 'ssa_wants_card',
      part: 'Part 2',
      item: '12.a',
      title: 'Do you want SSA to issue you a Social Security card?',
      uscis_text: 'Do you want the Social Security Administration (SSA) to issue you an original or replacement Social Security card and update your immigration status with the SSA if and when you are naturalized?',
      intent: 'USCIS uses this to coordinate with SSA if you request a card.',
      guardrail: 'This selection only applies if you want SSA to issue or replace a card.',
    },
    {
      id: 'ssa_consent_disclosure',
      part: 'Part 2',
      item: '12.c',
      title: 'Do you consent to disclosure of information to SSA?',
      uscis_text: 'I authorize disclosure of information from this application and USCIS systems to the SSA as required for the purpose of assigning me an SSN, issuing me an original or replacement Social Security card, and updating my immigration status with the SSA.',
      intent: 'USCIS uses this consent to share information with SSA if requested.',
      guardrail: 'You can review this before submitting.',
      show_when: { field: 'ssa_wants_card', value: 'yes' },
    },
    {
      id: 'ssn',
      part: 'Part 2',
      item: '12.b',
      title: 'Social Security number (if any)',
      uscis_text: 'Social Security Number (if any)',
      intent: 'USCIS uses this to coordinate with SSA if requested.',
      guardrail: 'Leave blank if you do not have a number.',
      show_when: { field: 'ssa_wants_card', value: 'yes' },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 3: BIOGRAPHIC INFORMATION
// ═══════════════════════════════════════════════════════════════

export const PART_3_METADATA: StepMetadata = {
  id: 3,
  section: 'BIOGRAPHIC INFORMATION',
  title: 'Physical characteristics.',
  part: 'Part 3',
  intent: 'USCIS uses biographic details to conduct required background checks.',
  guardrail: 'Select the options that best describe you.',
  questions: [
    {
      id: 'ethnicity',
      part: 'Part 3',
      item: '1',
      title: 'Ethnicity',
      uscis_text: 'Ethnicity',
      intent: 'USCIS uses this as a standard biographic category.',
      guardrail: 'Select one option.',
    },
    {
      id: 'race',
      part: 'Part 3',
      item: '2',
      title: 'Race',
      uscis_text: 'Race',
      intent: 'USCIS uses this as a standard biographic category.',
      guardrail: 'Select all that apply.',
    },
    {
      id: 'height_feet',
      part: 'Part 3',
      item: '3',
      title: 'Height',
      uscis_text: 'Height',
      intent: 'USCIS uses this as a biographic identifier.',
      guardrail: 'Use feet and inches.',
    },
    {
      id: 'weight',
      part: 'Part 3',
      item: '4',
      title: 'Weight',
      uscis_text: 'Weight (Pounds)',
      intent: 'USCIS uses this as a biographic identifier.',
      guardrail: 'Enter your current weight in pounds.',
    },
    {
      id: 'eye_color',
      part: 'Part 3',
      item: '5',
      title: 'Eye color',
      uscis_text: 'Eye Color',
      intent: 'USCIS uses this as a biographic identifier.',
      guardrail: 'Select one option.',
    },
    {
      id: 'hair_color',
      part: 'Part 3',
      item: '6',
      title: 'Hair color',
      uscis_text: 'Hair Color',
      intent: 'USCIS uses this as a biographic identifier.',
      guardrail: 'Select one option.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 4: CONTACT
// ═══════════════════════════════════════════════════════════════

export const PART_4_CONTACT_METADATA: StepMetadata = {
  id: 4,
  section: 'CONTACT',
  title: 'How can we reach you?',
  part: 'Part 4',
  intent: 'USCIS uses contact details to reach you about your application.',
  guardrail: 'Provide the best ways to contact you.',
  questions: [
    {
      id: 'daytime_phone',
      part: 'Part 4',
      item: '1',
      title: 'Daytime phone number',
      uscis_text: "Applicant's Daytime Telephone Number",
      intent: 'USCIS uses this to contact you if needed.',
      guardrail: 'Use a number you check regularly.',
    },
    {
      id: 'mobile_phone',
      part: 'Part 4',
      item: '2',
      title: 'Mobile phone number (if any)',
      uscis_text: "Applicant's Mobile Telephone Number (if any)",
      intent: 'USCIS uses this as an additional contact option.',
      guardrail: 'Leave blank if not applicable.',
    },
    {
      id: 'email',
      part: 'Part 4',
      item: '3',
      title: 'Email address (if any)',
      uscis_text: "Applicant's Email Address (if any)",
      intent: 'USCIS may contact you by email about your application.',
      guardrail: 'Use an email address you check regularly.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 4: RESIDENCE
// ═══════════════════════════════════════════════════════════════

export const PART_4_METADATA: StepMetadata = {
  id: 5,
  section: 'RESIDENCE',
  title: 'Where do you live?',
  part: 'Part 4',
  intent: 'USCIS uses address information to evaluate residence requirements and send notices.',
  guardrail: 'Provide your current physical and mailing addresses as requested.',
  questions: [
    {
      id: 'street_address',
      part: 'Part 4',
      item: '1.a',
      title: 'Street number and name',
      uscis_text: 'Street Number and Name',
      intent: 'USCIS uses your physical address to verify residence.',
      guardrail: 'Use your current physical address.',
    },
    {
      id: 'apt_ste_flr',
      part: 'Part 4',
      item: '1.b',
      title: 'Apt/Ste/Flr (if any)',
      uscis_text: 'Apt/Ste/Flr',
      intent: 'USCIS uses this to complete your address.',
      guardrail: 'Leave blank if not applicable.',
    },
    {
      id: 'city',
      part: 'Part 4',
      item: '1.c',
      title: 'City or town',
      uscis_text: 'City or Town',
      intent: 'USCIS uses this to complete your address.',
      guardrail: 'Enter your current city or town.',
    },
    {
      id: 'state',
      part: 'Part 4',
      item: '1.d',
      title: 'State or province',
      uscis_text: 'State or Province',
      intent: 'USCIS uses this to complete your address.',
      guardrail: 'Select the applicable state or province.',
    },
    {
      id: 'zip_code',
      part: 'Part 4',
      item: '1.e',
      title: 'ZIP or postal code',
      uscis_text: 'ZIP Code / Postal Code',
      intent: 'USCIS uses this to complete your address.',
      guardrail: 'Enter the current ZIP or postal code.',
    },
    {
      id: 'residence_from',
      part: 'Part 4',
      item: '1.f',
      title: 'Dates of residence from',
      uscis_text: 'Dates of Residence: From',
      intent: 'USCIS uses this to verify residence timelines.',
      guardrail: 'Use MM/DD/YYYY.',
    },
    {
      id: 'residence_to',
      part: 'Part 4',
      item: '1.g',
      title: 'Dates of residence to',
      uscis_text: 'Dates of Residence: To',
      intent: 'USCIS uses this to verify residence timelines.',
      guardrail: 'Use MM/DD/YYYY or PRESENT.',
    },
    {
      id: 'mailing_same_as_residence',
      part: 'Part 4',
      item: '2',
      title: 'Is your current physical address also your current mailing address?',
      uscis_text: 'Is your current physical address also your current mailing address?',
      intent: 'USCIS uses this to determine where to send notices.',
      guardrail: 'If different, provide your mailing address.',
    },
    {
      id: 'mailing_street_address',
      part: 'Part 4',
      item: '3.a',
      title: 'Mailing street number and name',
      uscis_text: 'Mailing Street Number and Name',
      intent: 'USCIS uses this to send notices if your mailing address differs.',
      guardrail: 'Only required if your mailing address is different.',
      show_when: { field: 'mailing_same_as_residence', value: 'no' },
    },
    {
      id: 'mailing_apt_ste_flr',
      part: 'Part 4',
      item: '3.b',
      title: 'Mailing Apt/Ste/Flr (if any)',
      uscis_text: 'Mailing Apt/Ste/Flr',
      intent: 'USCIS uses this to complete your mailing address.',
      guardrail: 'Leave blank if not applicable.',
      show_when: { field: 'mailing_same_as_residence', value: 'no' },
    },
    {
      id: 'mailing_in_care_of',
      part: 'Part 4',
      item: '3.c',
      title: 'In care of name (if any)',
      uscis_text: 'In Care Of Name',
      intent: 'USCIS uses this to deliver mail to the right recipient.',
      guardrail: 'Leave blank if not applicable.',
      show_when: { field: 'mailing_same_as_residence', value: 'no' },
    },
    {
      id: 'mailing_city',
      part: 'Part 4',
      item: '3.d',
      title: 'Mailing city or town',
      uscis_text: 'Mailing City or Town',
      intent: 'USCIS uses this to complete your mailing address.',
      guardrail: 'Only required if your mailing address is different.',
      show_when: { field: 'mailing_same_as_residence', value: 'no' },
    },
    {
      id: 'mailing_state',
      part: 'Part 4',
      item: '3.e',
      title: 'Mailing state or province',
      uscis_text: 'Mailing State or Province',
      intent: 'USCIS uses this to complete your mailing address.',
      guardrail: 'Only required if your mailing address is different.',
      show_when: { field: 'mailing_same_as_residence', value: 'no' },
    },
    {
      id: 'mailing_zip_code',
      part: 'Part 4',
      item: '3.f',
      title: 'Mailing ZIP or postal code',
      uscis_text: 'Mailing ZIP Code / Postal Code',
      intent: 'USCIS uses this to complete your mailing address.',
      guardrail: 'Only required if your mailing address is different.',
      show_when: { field: 'mailing_same_as_residence', value: 'no' },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 5: MARITAL HISTORY
// ═══════════════════════════════════════════════════════════════

export const PART_5_METADATA: StepMetadata = {
  id: 6,
  section: 'MARITAL HISTORY',
  title: 'Your marriage information.',
  part: 'Part 5',
  intent: 'USCIS uses marital history to confirm eligibility and household details.',
  guardrail: 'Answer based on your current status and prior marriages.',
  questions: [
    {
      id: 'marital_status',
      part: 'Part 5',
      item: '1',
      title: 'Current marital status',
      uscis_text: 'What is your current marital status?',
      intent: 'USCIS uses this to determine which additional questions apply.',
      guardrail: 'Select the option that matches your current status.',
    },
    {
      id: 'times_married',
      part: 'Part 5',
      item: '3',
      title: 'How many times have you been married?',
      uscis_text: 'How many times have you been married?',
      intent: 'USCIS uses this to understand your prior marriages.',
      guardrail: 'Include current and prior marriages as instructed.',
    },
    {
      id: 'spouse_is_military_member',
      part: 'Part 5',
      item: '2',
      title: 'If you are currently married, is your spouse a current member of the U.S. armed forces?',
      uscis_text: 'If you are currently married, is your spouse a current member of the U.S. armed forces?',
      intent: 'USCIS uses this to apply the correct eligibility rules.',
      guardrail: 'Only answer if you are currently married.',
    },
    {
      id: 'spouse_address_same_as_applicant',
      part: 'Part 5',
      item: '4.d',
      title: "Is your current spouse's present physical address the same as your physical address?",
      uscis_text: "Is your current spouse's present physical address the same as your physical address?",
      intent: 'USCIS uses this to confirm household address details.',
      guardrail: 'If different, provide the address in Part 14.',
    },
    {
      id: 'spouse_is_us_citizen',
      part: 'Part 5',
      item: '5.a',
      title: 'When did your current spouse become a U.S. citizen?',
      uscis_text: 'Is your current spouse a U.S. citizen?',
      intent: 'USCIS uses this to confirm eligibility criteria tied to a U.S. citizen spouse.',
      guardrail: 'Answer based on your spouse’s citizenship status.',
    },
    {
      id: 'spouse_citizenship_by_birth',
      part: 'Part 5',
      item: '5.b',
      title: 'How did your spouse become a U.S. citizen?',
      uscis_text: 'Was your spouse a citizen by birth?',
      intent: 'USCIS uses this to record the basis of your spouse’s citizenship.',
      guardrail: 'If not by birth, provide the date in the next item.',
      show_when: { field: 'spouse_is_us_citizen', value: 'yes' },
    },
    {
      id: 'spouse_times_married',
      part: 'Part 5',
      item: '7',
      title: 'How many times has your current spouse been married?',
      uscis_text: 'How many times has your current spouse been married?',
      intent: 'USCIS uses this to understand your spouse’s marriage history.',
      guardrail: 'Include current and prior marriages as instructed.',
    },
    {
      id: 'spouse_current_employer',
      part: 'Part 5',
      item: '8',
      title: "Spouse's current employer",
      uscis_text: "Current Spouse's Current Employer or Company",
      intent: 'USCIS uses this to capture spouse employment details when required.',
      guardrail: 'Provide the employer or company name.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 6: CHILDREN
// ═══════════════════════════════════════════════════════════════

export const PART_6_METADATA: StepMetadata = {
  id: 7,
  section: 'CHILDREN',
  title: 'Information about your children.',
  part: 'Part 6',
  intent: 'USCIS uses children information for family and eligibility context.',
  guardrail: 'Include all required children entries.',
  questions: [
    {
      id: 'total_children',
      part: 'Part 6',
      item: '1',
      title: 'Total number of children',
      uscis_text: 'Indicate your total number of children under 18 years of age.',
      intent: 'USCIS uses this to determine how many child entries are needed.',
      guardrail: 'Enter the total number of children under 18.',
    },
    {
      id: 'providing_support_for_children',
      part: 'Part 6',
      item: '8',
      title: 'Are you providing support for your son or daughter?',
      uscis_text: 'Only answer Item Number 8 if you are filing under Part 1, Item Number 1.d.',
      intent: 'USCIS uses this to confirm eligibility criteria for certain filings.',
      guardrail: 'Answer this only if the form instructs you to.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 8: TRAVEL
// ═══════════════════════════════════════════════════════════════

export const PART_8_METADATA: StepMetadata = {
  id: 9,
  section: 'TRAVEL',
  title: 'Time outside the US.',
  part: 'Part 8',
  intent: 'USCIS uses travel history to evaluate time outside the United States.',
  guardrail: 'List trips for the required period.',
  questions: [
    {
      id: 'total_days_outside_us',
      part: 'Part 8',
      item: '3',
      title: 'Total days outside the United States',
      uscis_text: 'Total Days Outside United States',
      intent: 'USCIS uses this to evaluate total time abroad.',
      guardrail: 'Add up days from all listed trips.',
    },
    {
      id: 'trips_over_6_months',
      part: 'Part 8',
      item: '2',
      title: 'Have you taken any trip outside the United States that lasted more than 6 months?',
      uscis_text: 'Have you taken any trip outside the United States that lasted more than 6 months?',
      intent: 'USCIS uses this to determine whether additional evidence is needed.',
      guardrail: 'If yes, review the Instructions for required evidence.',
      explanation_required: true,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 10: FEE REDUCTION
// ═══════════════════════════════════════════════════════════════

export const PART_10_METADATA: StepMetadata = {
  id: 11,
  section: 'FEE REDUCTION',
  title: 'Request for fee reduction (optional).',
  part: 'Part 10',
  intent: 'USCIS uses this section to determine whether a reduced fee is requested.',
  guardrail: 'You can request a reduced fee if applicable.',
  questions: [
    {
      id: 'fee_reduction_requested',
      part: 'Part 10',
      item: '1',
      title: 'Are you requesting a reduced fee?',
      uscis_text: 'My household income is less than or equal to 400% of the Federal Poverty Guidelines.',
      intent: 'USCIS uses this to determine whether to collect reduced fee details.',
      guardrail: 'Provide details only if you are requesting a reduced fee.',
    },
    {
      id: 'household_income',
      part: 'Part 10',
      item: '2',
      title: 'Total household income',
      uscis_text: 'Total household income',
      intent: 'USCIS uses this to evaluate the reduced fee request.',
      guardrail: 'Use the amount described in the Instructions.',
      show_when: { field: 'fee_reduction_requested', value: 'yes' },
    },
    {
      id: 'household_size',
      part: 'Part 10',
      item: '3',
      title: 'Household size',
      uscis_text: 'My household size is',
      intent: 'USCIS uses this to evaluate the reduced fee request.',
      guardrail: 'Count household members as defined in the Instructions.',
      show_when: { field: 'fee_reduction_requested', value: 'yes' },
    },
    {
      id: 'household_income_earners',
      part: 'Part 10',
      item: '4',
      title: 'Household income earners',
      uscis_text: 'Total number of household members earning income including yourself',
      intent: 'USCIS uses this to evaluate the reduced fee request.',
      guardrail: 'Include yourself and other income earners.',
      show_when: { field: 'fee_reduction_requested', value: 'yes' },
    },
    {
      id: 'is_head_of_household',
      part: 'Part 10',
      item: '5.a',
      title: 'Are you the head of household?',
      uscis_text: 'Are you the head of household?',
      intent: 'USCIS uses this to capture household context for the request.',
      guardrail: 'If no, provide the name of the head of household.',
      show_when: { field: 'fee_reduction_requested', value: 'yes' },
    },
    {
      id: 'head_of_household_name',
      part: 'Part 10',
      item: '5.b',
      title: 'Name of head of household',
      uscis_text: 'Name of head of household',
      intent: 'USCIS uses this to identify the head of household for the request.',
      guardrail: 'Provide the full name.',
      show_when: { field: 'is_head_of_household', value: 'no' },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 12: INTERPRETER
// ═══════════════════════════════════════════════════════════════

export const PART_12_METADATA: StepMetadata = {
  id: 13,
  section: 'INTERPRETER',
  title: 'Interpreter information (if applicable).',
  part: 'Part 12',
  intent: 'USCIS uses interpreter information if someone translated the application for you.',
  guardrail: 'Only complete this section if an interpreter was used.',
  questions: [
    {
      id: 'used_interpreter',
      part: 'Part 12',
      item: '1',
      title: 'Did you use an interpreter to complete this application?',
      uscis_text: 'Did you use an interpreter to complete this application?',
      intent: 'USCIS uses this to determine whether interpreter details are required.',
      guardrail: 'If yes, provide interpreter details below.',
    },
    {
      id: 'interpreter_last_name',
      part: 'Part 12',
      item: '1.a',
      title: "Interpreter's family name",
      uscis_text: "Interpreter's Family Name (Last Name)",
      intent: 'USCIS uses this to identify the interpreter.',
      guardrail: 'Enter the interpreter’s legal name.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
    {
      id: 'interpreter_first_name',
      part: 'Part 12',
      item: '1.b',
      title: "Interpreter's given name",
      uscis_text: "Interpreter's Given Name (First Name)",
      intent: 'USCIS uses this to identify the interpreter.',
      guardrail: 'Enter the interpreter’s legal name.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
    {
      id: 'interpreter_business_name',
      part: 'Part 12',
      item: '2',
      title: "Interpreter's business or organization",
      uscis_text: "Interpreter's Business or Organization Name",
      intent: 'USCIS uses this to identify the interpreter’s organization.',
      guardrail: 'Leave blank if not applicable.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
    {
      id: 'interpreter_phone',
      part: 'Part 12',
      item: '3',
      title: "Interpreter's daytime phone",
      uscis_text: "Interpreter's Daytime Telephone Number",
      intent: 'USCIS may contact the interpreter if needed.',
      guardrail: 'Use a number the interpreter checks.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
    {
      id: 'interpreter_mobile',
      part: 'Part 12',
      item: '4',
      title: "Interpreter's mobile phone (if any)",
      uscis_text: "Interpreter's Mobile Telephone Number (if any)",
      intent: 'USCIS may contact the interpreter if needed.',
      guardrail: 'Leave blank if not applicable.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
    {
      id: 'interpreter_email',
      part: 'Part 12',
      item: '5',
      title: "Interpreter's email (if any)",
      uscis_text: "Interpreter's Email Address (if any)",
      intent: 'USCIS may contact the interpreter by email if needed.',
      guardrail: 'Leave blank if not applicable.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
    {
      id: 'interpreter_language',
      part: 'Part 12',
      item: '6',
      title: 'Language of interpretation',
      uscis_text: 'Language in which interpreter is fluent',
      intent: 'USCIS uses this to document the language used.',
      guardrail: 'Enter the language the interpreter used.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
    {
      id: 'interpreter_signature',
      part: 'Part 12',
      item: '7',
      title: "Interpreter's signature",
      uscis_text: "Interpreter's Signature",
      intent: 'USCIS requires interpreter certification.',
      guardrail: 'Type the interpreter’s full name to sign.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
    {
      id: 'interpreter_signature_date',
      part: 'Part 12',
      item: '8',
      title: "Interpreter's signature date",
      uscis_text: 'Date of Signature',
      intent: 'USCIS uses this to date the interpreter certification.',
      guardrail: 'Use MM/DD/YYYY.',
      show_when: { field: 'used_interpreter', value: 'yes' },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 13: PREPARER
// ═══════════════════════════════════════════════════════════════

export const PART_13_METADATA: StepMetadata = {
  id: 14,
  section: 'PREPARER',
  title: 'Preparer information (if applicable).',
  part: 'Part 13',
  intent: 'USCIS uses preparer information if someone else completed the application for you.',
  guardrail: 'Only complete this section if a preparer assisted you.',
  questions: [
    {
      id: 'used_preparer',
      part: 'Part 13',
      item: '1',
      title: 'Did someone other than you prepare this application?',
      uscis_text: 'Did someone other than you prepare this application?',
      intent: 'USCIS uses this to determine whether preparer details are required.',
      guardrail: 'If yes, provide preparer details below.',
    },
    {
      id: 'preparer_last_name',
      part: 'Part 13',
      item: '1.a',
      title: "Preparer's family name",
      uscis_text: "Preparer's Family Name (Last Name)",
      intent: 'USCIS uses this to identify the preparer.',
      guardrail: 'Enter the preparer’s legal name.',
      show_when: { field: 'used_preparer', value: 'yes' },
    },
    {
      id: 'preparer_first_name',
      part: 'Part 13',
      item: '1.b',
      title: "Preparer's given name",
      uscis_text: "Preparer's Given Name (First Name)",
      intent: 'USCIS uses this to identify the preparer.',
      guardrail: 'Enter the preparer’s legal name.',
      show_when: { field: 'used_preparer', value: 'yes' },
    },
    {
      id: 'preparer_business_name',
      part: 'Part 13',
      item: '2',
      title: "Preparer's business or organization",
      uscis_text: "Preparer's Business or Organization Name",
      intent: 'USCIS uses this to identify the preparer’s organization.',
      guardrail: 'Leave blank if not applicable.',
      show_when: { field: 'used_preparer', value: 'yes' },
    },
    {
      id: 'preparer_phone',
      part: 'Part 13',
      item: '3',
      title: "Preparer's daytime phone",
      uscis_text: "Preparer's Daytime Telephone Number",
      intent: 'USCIS may contact the preparer if needed.',
      guardrail: 'Use a number the preparer checks.',
      show_when: { field: 'used_preparer', value: 'yes' },
    },
    {
      id: 'preparer_mobile',
      part: 'Part 13',
      item: '4',
      title: "Preparer's mobile phone (if any)",
      uscis_text: "Preparer's Mobile Telephone Number (if any)",
      intent: 'USCIS may contact the preparer if needed.',
      guardrail: 'Leave blank if not applicable.',
      show_when: { field: 'used_preparer', value: 'yes' },
    },
    {
      id: 'preparer_email',
      part: 'Part 13',
      item: '5',
      title: "Preparer's email (if any)",
      uscis_text: "Preparer's Email Address (if any)",
      intent: 'USCIS may contact the preparer by email if needed.',
      guardrail: 'Leave blank if not applicable.',
      show_when: { field: 'used_preparer', value: 'yes' },
    },
    {
      id: 'preparer_signature',
      part: 'Part 13',
      item: '6',
      title: "Preparer's signature",
      uscis_text: "Preparer's Signature",
      intent: 'USCIS requires preparer certification.',
      guardrail: 'Type the preparer’s full name to sign.',
      show_when: { field: 'used_preparer', value: 'yes' },
    },
    {
      id: 'preparer_signature_date',
      part: 'Part 13',
      item: '7',
      title: "Preparer's signature date",
      uscis_text: 'Date of Signature',
      intent: 'USCIS uses this to date the preparer certification.',
      guardrail: 'Use MM/DD/YYYY.',
      show_when: { field: 'used_preparer', value: 'yes' },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PART 9: ADDITIONAL INFORMATION ABOUT YOU (Background Questions)
// ═══════════════════════════════════════════════════════════════

/**
 * Standard guardrail for Part 9 questions
 */
const PART_9_GUARDRAIL = 'You can review this later before finalizing.';

/**
 * Part 9 sections with their questions organized by category
 */
export const PART_9_METADATA: StepMetadata = {
  id: 10,
  section: 'BACKGROUND',
  title: 'Important eligibility questions',
  part: 'Part 9',
  intent: 'USCIS uses these questions to assess eligibility requirements related to naturalization criteria.',
  guardrail: 'Answer honestly. Some "Yes" answers may require additional information later in the form.',
  callout: {
    type: 'ever',
    text: 'In USCIS forms, \'EVER\' signals broad time and location scope.',
  },
  questions: [
    // ═══════════════════════════════════════════════════════════════
    // General Eligibility (Items 1-5)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_claimed_us_citizen',
      part: 'Part 9',
      item: '1',
      title: 'Have you ever claimed to be a U.S. citizen?',
      uscis_text: 'Have you EVER claimed to be a U.S. citizen (in writing or any other way)?',
      intent: 'USCIS uses this to assess whether you have made false claims to U.S. citizenship.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_voted_in_us',
      part: 'Part 9',
      item: '2',
      title: 'Have you ever registered to vote or voted in a U.S. election?',
      uscis_text: 'Have you EVER registered to vote or voted in any Federal, state, or local election in the United States?',
      intent: 'USCIS uses this to assess compliance with voting eligibility requirements.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_failed_to_file_taxes',
      part: 'Part 9',
      item: '3',
      title: 'Have you ever failed to file a tax return?',
      uscis_text: 'Have you EVER failed to file a Federal, state, or local tax return since you became a lawful permanent resident?',
      intent: 'USCIS uses this to assess compliance with tax obligations.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_nonresident_alien_tax',
      part: 'Part 9',
      item: '4',
      title: 'Did you call yourself a "nonresident alien" on a tax return?',
      uscis_text: 'Since you became a lawful permanent resident, have you called yourself a "nonresident alien" on a Federal, state, or local tax return or decided not to file a tax return because you considered yourself to be a nonresident?',
      intent: 'USCIS uses this to verify continuous residence status.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_owe_taxes',
      part: 'Part 9',
      item: '5',
      title: 'Do you currently owe overdue taxes?',
      uscis_text: 'Do you currently owe any overdue Federal, state, or local taxes in the United States?',
      intent: 'USCIS uses this to assess compliance with financial obligations.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Affiliations and Associations (Items 6-8)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_communist_party',
      part: 'Part 9',
      item: '6',
      title: 'Have you ever been associated with a Communist or totalitarian party?',
      uscis_text: 'Have you EVER been a member of, involved in, or in any way associated with any Communist or totalitarian party anywhere in the world?',
      intent: 'USCIS uses this to assess affiliations relevant to naturalization eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_advocated_overthrow',
      part: 'Part 9',
      item: '7',
      title: 'Have you ever advocated the overthrow of the U.S. government?',
      uscis_text: 'Have you EVER advocated (supported and promoted) the overthrow by force or violence or other unconstitutional means of the Government of the United States or all forms of law?',
      intent: 'USCIS uses this to assess affiliations and activities relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_terrorist_org',
      part: 'Part 9',
      item: '8',
      title: 'Have you ever supported a group that used weapons against people?',
      uscis_text: 'Have you EVER been a member of, involved in, or in any way associated with, or have you EVER provided money, a thing of value, services or labor, or any other assistance or support to a group that used a weapon against any person, or threatened to do so?',
      intent: 'USCIS uses this to assess affiliations relevant to national security and eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Violence and Harm (Items 9.a-9.j)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_used_weapon_explosive',
      part: 'Part 9',
      item: '9.a',
      title: 'Have you ever used a weapon or explosive with intent to harm?',
      uscis_text: 'Have you EVER used a weapon or explosive with intent to harm another person or cause damage to property?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_kidnapping_assassination_hijacking',
      part: 'Part 9',
      item: '9.b',
      title: 'Have you ever engaged in kidnapping, assassination, or hijacking?',
      uscis_text: 'Have you EVER engaged (participated) in kidnapping, assassination, or hijacking or sabotage of an airplane, ship, vehicle, or other mode of transportation?',
      intent: 'USCIS uses this to assess conduct relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_threatened_weapon_violence',
      part: 'Part 9',
      item: '9.c',
      title: 'Have you ever threatened or planned violence with weapons?',
      uscis_text: 'Have you EVER threatened, attempted (tried), conspired (planned with others), prepared, planned, advocated for, or incited (encouraged) others to commit any of the acts listed above?',
      intent: 'USCIS uses this to assess conduct relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_genocide',
      part: 'Part 9',
      item: '9.d',
      title: 'Have you ever participated in genocide?',
      uscis_text: 'Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in genocide?',
      intent: 'USCIS uses this to assess conduct relevant to persecutor bar provisions.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_torture',
      part: 'Part 9',
      item: '9.e',
      title: 'Have you ever participated in torture?',
      uscis_text: 'Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in torture?',
      intent: 'USCIS uses this to assess conduct relevant to persecutor bar provisions.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_killing_person',
      part: 'Part 9',
      item: '9.f',
      title: 'Have you ever participated in killing or trying to kill someone?',
      uscis_text: 'Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in killing or trying to kill any person?',
      intent: 'USCIS uses this to assess conduct relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_sexual_contact_nonconsent',
      part: 'Part 9',
      item: '9.g',
      title: 'Have you ever had non-consensual sexual contact with someone?',
      uscis_text: 'Have you EVER had any kind of sexual contact or activity with any person who did not consent (did not agree) or was unable to consent (could not agree), or was being forced or threatened by you or by someone else?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_severely_injuring',
      part: 'Part 9',
      item: '9.h',
      title: 'Have you ever intentionally and severely injured someone?',
      uscis_text: 'Have you EVER intentionally and severely injuring or trying to injure any person?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_religious_persecution',
      part: 'Part 9',
      item: '9.i',
      title: 'Have you ever prevented someone from practicing their religion?',
      uscis_text: 'Have you EVER not let someone practice his or her religion?',
      intent: 'USCIS uses this to assess conduct relevant to persecutor bar provisions.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_harm_race_religion',
      part: 'Part 9',
      item: '9.j',
      title: 'Have you ever harmed someone because of their background or beliefs?',
      uscis_text: 'Have you EVER caused harm or suffering to any person because of his or her race, religion, national origin, membership in a particular social group, or political opinion?',
      intent: 'USCIS uses this to assess conduct relevant to persecutor bar provisions.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Military and Police Service (Items 10-14)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_military_police_service',
      part: 'Part 9',
      item: '10.a',
      title: 'Have you ever served in a military or police unit?',
      uscis_text: 'Have you EVER served in, been a member of, assisted (helped), or participated in any military or police unit?',
      intent: 'USCIS uses this to assess your background for eligibility purposes.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_armed_group',
      part: 'Part 9',
      item: '10.b',
      title: 'Have you ever been part of an armed group?',
      uscis_text: 'Have you EVER served in, been a member of, assisted (helped), or participated in any armed group (a group that carries weapons), for example: paramilitary unit, self-defense unit, vigilante unit, rebel group, or guerrilla group?',
      intent: 'USCIS uses this to assess affiliations relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_detention_facility',
      part: 'Part 9',
      item: '10.c',
      title: 'Have you ever worked in a detention facility?',
      uscis_text: 'Have you EVER worked, volunteered, or otherwise served in a place where people were detained (forced to stay), for example, a prison, jail, prison camp, detention facility, or labor camp?',
      intent: 'USCIS uses this to assess background relevant to persecutor bar provisions.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_group_used_weapons',
      part: 'Part 9',
      item: '10.d',
      title: 'Were you ever part of a group that used weapons?',
      uscis_text: 'Were you EVER a part of any group, or did you EVER help any group, unit, or organization that used a weapon against any person, or threatened to do so?',
      intent: 'USCIS uses this to assess affiliations relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_used_weapon_against_person',
      part: 'Part 9',
      item: '10.e',
      title: 'Did you use a weapon against another person?',
      uscis_text: 'If you answered "Yes" to Item Number 10.d., when you were part of this group, or when you helped this group, did you ever use a weapon against another person?',
      intent: 'USCIS uses this to assess conduct relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_group_used_weapons', value: 'yes' },
      explanation_required: true,
    },
    {
      id: 'q_threatened_weapon_use',
      part: 'Part 9',
      item: '10.f',
      title: 'Did you threaten to use a weapon against another person?',
      uscis_text: 'If you answered "Yes" to Item Number 10.d., when you were part of this group, or when you helped this group, did you ever threaten another person that you would use a weapon against that person?',
      intent: 'USCIS uses this to assess conduct relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_group_used_weapons', value: 'yes' },
      explanation_required: true,
    },
    {
      id: 'q_weapons_training',
      part: 'Part 9',
      item: '11',
      title: 'Have you ever received weapons or military training?',
      uscis_text: 'Have you EVER received any weapons training, paramilitary training, or other military-type training?',
      intent: 'USCIS uses this to assess background relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_sold_provided_weapons',
      part: 'Part 9',
      item: '12',
      title: 'Have you ever sold or provided weapons?',
      uscis_text: 'Have you EVER sold, provided, or transported weapons, or assisted any person in selling, providing, or transporting weapons, which you knew or believed would be used against another person?',
      intent: 'USCIS uses this to assess conduct relevant to eligibility.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_recruited_under_15',
      part: 'Part 9',
      item: '13',
      title: 'Have you ever recruited someone under 15 for an armed group?',
      uscis_text: 'Have you EVER recruited (asked), enlisted (signed up), conscripted (required to join), or used any person under 15 years of age to serve in or help an armed group?',
      intent: 'USCIS uses this to assess conduct relevant to child soldier provisions.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_used_under_15_hostilities',
      part: 'Part 9',
      item: '14',
      title: 'Have you ever used someone under 15 in hostilities?',
      uscis_text: 'Have you EVER used any person under 15 years of age to take part in hostilities or attempted or worked with others to do so?',
      intent: 'USCIS uses this to assess conduct relevant to child soldier provisions.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Crimes and Offenses (Items 15-16)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_committed_crime_not_arrested',
      part: 'Part 9',
      item: '15.a',
      title: 'Have you ever committed a crime for which you were not arrested?',
      uscis_text: 'Have you EVER committed, agreed to commit, asked someone else to commit, helped commit, or tried to commit a crime or offense for which you were NOT arrested?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_arrested',
      part: 'Part 9',
      item: '15.b',
      title: 'Have you ever been arrested, cited, or detained?',
      uscis_text: 'Have you EVER been arrested, cited, detained or confined by any law enforcement officer, military official (in the U.S. or elsewhere), or immigration official for any reason, or been charged with a crime or offense?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_completed_probation',
      part: 'Part 9',
      item: '16',
      title: 'Have you completed your probation or parole?',
      uscis_text: 'If you received a suspended sentence, were placed on probation, or were paroled, have you completed your suspended sentence, probation, or parole?',
      intent: 'USCIS uses this to assess the status of any previous sentences.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_arrested', value: 'yes' },
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Moral Character (Items 17-25)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_prostitution',
      part: 'Part 9',
      item: '17',
      title: 'Have you ever engaged in prostitution?',
      uscis_text: 'Have you EVER engaged in prostitution, attempted to procure or import prostitutes or persons for the purpose of prostitution, or received any proceeds or money from prostitution?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_controlled_substances',
      part: 'Part 9',
      item: '18',
      title: 'Have you ever sold or trafficked controlled substances?',
      uscis_text: 'Have you EVER manufactured, cultivated, produced, distributed, dispensed, sold, or smuggled (trafficked) any controlled substances, illegal drugs, narcotics, or drug paraphernalia in violation of any law or regulation?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_marriage_fraud',
      part: 'Part 9',
      item: '19',
      title: 'Have you ever married to obtain an immigration benefit?',
      uscis_text: 'Have you EVER married someone in order to obtain an immigration benefit?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_polygamy',
      part: 'Part 9',
      item: '20',
      title: 'Have you been married to more than one person at the same time?',
      uscis_text: 'Have you EVER been married to more than one person at the same time?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_helped_illegal_entry',
      part: 'Part 9',
      item: '21',
      title: 'Have you ever helped someone enter the U.S. illegally?',
      uscis_text: 'Have you EVER helped anyone to enter, or try to enter, the United States illegally?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_illegal_gambling',
      part: 'Part 9',
      item: '22',
      title: 'Have you ever gambled illegally or received income from illegal gambling?',
      uscis_text: 'Have you EVER gambled illegally or received income from illegal gambling?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_failed_child_support',
      part: 'Part 9',
      item: '23',
      title: 'Have you ever failed to pay child support or alimony?',
      uscis_text: 'Have you EVER failed to support your dependents (pay child support) or to pay alimony (court-ordered financial support after divorce or separation)?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_misrepresentation_public_benefits',
      part: 'Part 9',
      item: '24',
      title: 'Have you ever misrepresented information to obtain public benefits?',
      uscis_text: 'Have you EVER made any misrepresentation to obtain any public benefit in the United States?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_habitual_drunkard',
      part: 'Part 9',
      item: '25',
      title: 'Have you ever been a habitual drunkard?',
      uscis_text: 'Have you EVER been a habitual drunkard?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Immigration Violations (Items 26-29)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_false_info_us_government',
      part: 'Part 9',
      item: '26',
      title: 'Have you ever given false information to U.S. government officials?',
      uscis_text: 'Have you EVER given any U.S. Government officials any information or documentation that was false, fraudulent, or misleading?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_lied_us_government',
      part: 'Part 9',
      item: '27',
      title: 'Have you ever lied to U.S. government officials?',
      uscis_text: 'Have you EVER lied to any U.S. Government officials to gain entry or admission into the United States or to gain immigration benefits while in the United States?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_removed_deported',
      part: 'Part 9',
      item: '28',
      title: 'Have you ever been removed or deported from the U.S.?',
      uscis_text: 'Have you EVER been removed, excluded, or deported from the United States?',
      intent: 'USCIS uses this to assess eligibility and continuous residence.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_removal_proceedings',
      part: 'Part 9',
      item: '29',
      title: 'Have you ever been placed in removal or deportation proceedings?',
      uscis_text: 'Have you EVER been placed in removal, exclusion, rescission, or deportation proceedings?',
      intent: 'USCIS uses this to assess eligibility and immigration history.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Selective Service (Items 30-31)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_male_18_26_lived_us',
      part: 'Part 9',
      item: '30',
      title: 'Are you a male who lived in the U.S. between ages 18-26?',
      uscis_text: 'Are you a male who lived in the United States at any time between your 18th and 26th birthdays?',
      intent: 'USCIS uses this to determine if Selective Service registration requirements apply.',
      guardrail: PART_9_GUARDRAIL,
    },
    {
      id: 'q_registered_selective_service',
      part: 'Part 9',
      item: '31',
      title: 'Did you register for the Selective Service?',
      uscis_text: 'Did you register with the Selective Service?',
      intent: 'USCIS uses this to verify compliance with Selective Service requirements.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_male_18_26_lived_us', value: 'yes' },
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Military Service (Items 32-38)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_left_us_avoid_draft',
      part: 'Part 9',
      item: '32',
      title: 'Did you leave the U.S. to avoid being drafted?',
      uscis_text: 'Did you EVER leave the United States to avoid being drafted into the U.S. armed forces?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_applied_military_exemption',
      part: 'Part 9',
      item: '33',
      title: 'Have you ever applied for a military service exemption?',
      uscis_text: 'Have you EVER applied for any kind of exemption from military service in the U.S. armed forces?',
      intent: 'USCIS uses this to assess eligibility based on prior exemption claims.',
      guardrail: PART_9_GUARDRAIL,
      explanation_required: true,
    },
    {
      id: 'q_served_us_military',
      part: 'Part 9',
      item: '34',
      title: 'Have you ever served in the U.S. armed forces?',
      uscis_text: 'Have you EVER served in the U.S. armed forces?',
      intent: 'USCIS uses this to determine military-related eligibility provisions.',
      guardrail: PART_9_GUARDRAIL,
    },
    {
      id: 'q_current_military_member',
      part: 'Part 9',
      item: '35.a',
      title: 'Are you currently a member of the U.S. armed forces?',
      uscis_text: 'Are you currently a member of the U.S. armed forces?',
      intent: 'USCIS uses this to coordinate with military naturalization procedures.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_served_us_military', value: 'yes' },
    },
    {
      id: 'q_scheduled_deploy',
      part: 'Part 9',
      item: '35.b',
      title: 'Are you scheduled to deploy outside the U.S. within 3 months?',
      uscis_text: 'Are you scheduled to deploy outside the United States, including to a vessel, within the next 3 months?',
      intent: 'USCIS uses this to expedite processing for deploying service members.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_current_military_member', value: 'yes' },
    },
    {
      id: 'q_stationed_outside_us',
      part: 'Part 9',
      item: '35.c',
      title: 'Are you currently stationed outside the U.S.?',
      uscis_text: 'Are you currently stationed outside the United States?',
      intent: 'USCIS uses this to coordinate interview scheduling.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_current_military_member', value: 'yes' },
    },
    {
      id: 'q_former_military_outside_us',
      part: 'Part 9',
      item: '35.d',
      title: 'Are you a former military member living outside the U.S.?',
      uscis_text: 'Are you a former member of the U.S. armed forces who is currently residing outside the United States?',
      intent: 'USCIS uses this to coordinate interview scheduling.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_current_military_member', value: 'no' },
    },
    {
      id: 'q_discharged_because_alien',
      part: 'Part 9',
      item: '36',
      title: 'Were you discharged because you were an alien?',
      uscis_text: 'Have you EVER been discharged from training or service in the U.S. armed forces because you were an alien?',
      intent: 'USCIS uses this to assess eligibility for military-related provisions.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_served_us_military', value: 'yes' },
      explanation_required: true,
    },
    {
      id: 'q_court_martialed',
      part: 'Part 9',
      item: '37',
      title: 'Were you court-martialed or received a dishonorable discharge?',
      uscis_text: 'Have you EVER been court-martialed or have you received a discharge characterized as other than honorable, bad conduct, or dishonorable, while in the U.S. armed forces?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_served_us_military', value: 'yes' },
      explanation_required: true,
    },
    {
      id: 'q_deserted_military',
      part: 'Part 9',
      item: '38',
      title: 'Have you ever deserted from the U.S. armed forces?',
      uscis_text: 'Have you EVER deserted from the U.S. armed forces?',
      intent: 'USCIS uses this as part of its eligibility review.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_served_us_military', value: 'yes' },
      explanation_required: true,
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Title of Nobility (Items 39-40)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_title_of_nobility',
      part: 'Part 9',
      item: '39.a',
      title: 'Do you have a hereditary title or order of nobility?',
      uscis_text: 'Do you now have, or did you EVER have, a hereditary title or an order of nobility in any foreign country?',
      intent: 'USCIS uses this to assess willingness to renounce foreign titles.',
      guardrail: PART_9_GUARDRAIL,
    },
    {
      id: 'q_willing_to_give_up_titles',
      part: 'Part 9',
      item: '39.b',
      title: 'Are you willing to give up your titles at the naturalization ceremony?',
      uscis_text: 'If you answered "Yes" to Item Number 39.a., are you willing to give up any inherited titles or orders of nobility that you have in a foreign country at your naturalization ceremony?',
      intent: 'USCIS uses this to verify willingness to renounce foreign allegiances.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_title_of_nobility', value: 'yes' },
    },
    
    // ═══════════════════════════════════════════════════════════════
    // Oath of Allegiance (Items 40-46)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'q_support_constitution',
      part: 'Part 9',
      item: '40',
      title: 'Do you support the U.S. Constitution and form of government?',
      uscis_text: 'Do you support the Constitution and form of government of the United States?',
      intent: 'USCIS uses this to assess your attachment to the principles of the U.S. Constitution.',
      guardrail: PART_9_GUARDRAIL,
    },
    {
      id: 'q_understand_oath',
      part: 'Part 9',
      item: '41',
      title: 'Do you understand the full Oath of Allegiance?',
      uscis_text: 'Do you understand the full Oath of Allegiance to the United States?',
      intent: 'USCIS uses this to verify understanding of citizenship responsibilities.',
      guardrail: PART_9_GUARDRAIL,
    },
    {
      id: 'q_unable_oath_disability',
      part: 'Part 9',
      item: '42',
      title: 'Are you unable to take the Oath due to a disability?',
      uscis_text: 'Are you unable to take the Oath of Allegiance because of a physical or developmental disability or mental impairment?',
      intent: 'USCIS uses this to determine if oath modifications may apply.',
      guardrail: PART_9_GUARDRAIL,
    },
    {
      id: 'q_willing_take_oath',
      part: 'Part 9',
      item: '43',
      title: 'Are you willing to take the full Oath of Allegiance?',
      uscis_text: 'Are you willing to take the full Oath of Allegiance to the United States?',
      intent: 'USCIS uses this to verify willingness to complete the oath requirement.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_unable_oath_disability', value: 'no' },
    },
    {
      id: 'q_willing_bear_arms',
      part: 'Part 9',
      item: '44',
      title: 'Are you willing to bear arms if required by law?',
      uscis_text: 'If the law requires it, are you willing to bear arms (carry weapons) on behalf of the United States?',
      intent: 'USCIS uses this as part of the oath of allegiance requirements.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_unable_oath_disability', value: 'no' },
    },
    {
      id: 'q_willing_noncombatant',
      part: 'Part 9',
      item: '45',
      title: 'Are you willing to perform noncombatant services if required?',
      uscis_text: 'If the law requires it, are you willing to perform noncombatant services (do something that does not include fighting in a war) in the U.S. armed forces?',
      intent: 'USCIS uses this as part of the oath of allegiance requirements.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_unable_oath_disability', value: 'no' },
    },
    {
      id: 'q_willing_work_national_importance',
      part: 'Part 9',
      item: '46',
      title: 'Are you willing to perform work of national importance if required?',
      uscis_text: 'If the law requires it, are you willing to perform work of national importance under civilian direction (do non-military work that the U.S. Government says is important to the country)?',
      intent: 'USCIS uses this as part of the oath of allegiance requirements.',
      guardrail: PART_9_GUARDRAIL,
      show_when: { field: 'q_unable_oath_disability', value: 'no' },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get question metadata by field ID
 */
export function getQuestionMetadata(
  stepMetadata: StepMetadata,
  fieldId: string
): QuestionMetadata | undefined {
  return stepMetadata.questions?.find(q => q.id === fieldId);
}

/**
 * Get all questions that require explanation when answered "Yes"
 */
export function getExplanationRequiredQuestions(
  stepMetadata: StepMetadata
): QuestionMetadata[] {
  return stepMetadata.questions?.filter(q => q.explanation_required) ?? [];
}

/**
 * Check if a question should be shown based on show_when condition
 */
export function shouldShowQuestion(
  question: QuestionMetadata,
  formValues: Record<string, string>
): boolean {
  if (!question.show_when) return true;
  
  const { field, value } = question.show_when;
  const currentValue = formValues[field];
  
  if (Array.isArray(value)) {
    return value.includes(currentValue);
  }
  
  return currentValue === value;
}
