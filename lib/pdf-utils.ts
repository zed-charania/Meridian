/**
 * N-400 PDF Field Mapping
 * 
 * Maps intake form data to official USCIS N-400 PDF field names.
 * Field names extracted from the actual N-400 PDF using pypdf.
 */

// ═══════════════════════════════════════════════════════════════
// INTAKE FORM DATA INTERFACE
// ═══════════════════════════════════════════════════════════════
export interface IntakeFormData {
  // ═══════════════════════════════════════════════════════════════
  // PART 1: ELIGIBILITY
  // ═══════════════════════════════════════════════════════════════
  eligibility_basis: string;

  // ═══════════════════════════════════════════════════════════════
  // PART 2: INFORMATION ABOUT YOU
  // ═══════════════════════════════════════════════════════════════
  // Current Legal Name
  first_name: string;
  middle_name?: string;
  last_name: string;

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
  ethnicity: string;
  race: string;
  height_feet: string;
  height_inches?: string;
  weight: string;
  eye_color: string;
  hair_color: string;

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
  spouse_first_name?: string;
  spouse_middle_name?: string;
  spouse_last_name?: string;
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
}

// ═══════════════════════════════════════════════════════════════
// N-400 PDF FIELD NAMES
// ═══════════════════════════════════════════════════════════════
export const N400_FIELDS = {
  // Part 1 - Eligibility (checkboxes)
  eligibility: {
    fiveYears: "form1[0].#subform[0].Part1_Eligibility[0]",
    threeYearsMarried: "form1[0].#subform[0].Part1_Eligibility[1]",
    military: "form1[0].#subform[0].Part1_Eligibility[2]",
    militaryFormer: "form1[0].#subform[0].Part1_Eligibility[3]",
    militarySpouse: "form1[0].#subform[0].Part1_Eligibility[4]",
    other: "form1[0].#subform[0].Part1_Eligibility[6]",
  },

  // Part 2 - Personal Information
  personal: {
    alienNumber: "form1[0].#subform[0].#area[0].Line1_AlienNumber[0]",
    familyName: "form1[0].#subform[0].P2_Line1_FamilyName[0]",
    givenName: "form1[0].#subform[0].P2_Line1_GivenName[0]",
    middleName: "form1[0].#subform[0].P2_Line1_MiddleName[0]",
    dateOfBirth: "form1[0].#subform[1].P2_Line8_DateOfBirth[0]",
    genderMale: "form1[0].#subform[1].P2_Line7_Gender[0]",
    genderFemale: "form1[0].#subform[1].P2_Line7_Gender[1]",
    countryOfBirth: "form1[0].#subform[1].P2_Line10_CountryOfBirth[0]",
    countryOfNationality: "form1[0].#subform[1].P2_Line11_CountryOfNationality[0]",
    dateBecamePR: "form1[0].#subform[1].P2_Line9_DateBecamePermanentResident[0]",
    uscisAccountNumber: "form1[0].#subform[1].P2_Line6_USCISELISAcctNumber[0]",
    ssn: "form1[0].#subform[1].Line12b_SSN[0]",
  },

  // Part 4 - Address
  address: {
    streetNumber: "form1[0].#subform[2].P4_Line1_Number[0]",
    streetName: "form1[0].#subform[2].P4_Line1_StreetName[0]",
    city: "form1[0].#subform[2].P4_Line1_City[0]",
    state: "form1[0].#subform[2].P4_Line1_State[0]",
    zipCode: "form1[0].#subform[2].P4_Line1_ZipCode[0]",
    country: "form1[0].#subform[2].P4_Line1_Country[0]",
    residenceFrom: "form1[0].#subform[2].P4_Line1_DatesofResidence[0]",
  },

  // Part 7 - Biographic Information
  biographic: {
    ethnicityHispanic: "form1[0].#subform[2].P7_Line1_Ethnicity[0]",
    ethnicityNotHispanic: "form1[0].#subform[2].P7_Line1_Ethnicity[1]",
    raceWhite: "form1[0].#subform[2].P7_Line2_Race[0]",
    raceAsian: "form1[0].#subform[2].P7_Line2_Race[1]",
    raceBlack: "form1[0].#subform[2].P7_Line2_Race[2]",
    raceNative: "form1[0].#subform[2].P7_Line2_Race[3]",
    racePacific: "form1[0].#subform[2].P7_Line2_Race[4]",
    heightFeet: "form1[0].#subform[2].P7_Line3_HeightFeet[0]",
    heightInches: "form1[0].#subform[2].P7_Line3_HeightInches[0]",
    weight1: "form1[0].#subform[2].P7_Line4_Pounds1[0]",
    weight2: "form1[0].#subform[2].P7_Line4_Pounds2[0]",
    weight3: "form1[0].#subform[2].P7_Line4_Pounds3[0]",
    eyeBlack: "form1[0].#subform[2].P7_Line5_Eye[0]",
    eyeBlue: "form1[0].#subform[2].P7_Line5_Eye[1]",
    eyeBrown: "form1[0].#subform[2].P7_Line5_Eye[2]",
    eyeGray: "form1[0].#subform[2].P7_Line5_Eye[3]",
    eyeGreen: "form1[0].#subform[2].P7_Line5_Eye[4]",
    eyeHazel: "form1[0].#subform[2].P7_Line5_Eye[5]",
    eyeMaroon: "form1[0].#subform[2].P7_Line5_Eye[6]",
    eyePink: "form1[0].#subform[2].P7_Line5_Eye[7]",
    eyeUnknown: "form1[0].#subform[2].P7_Line5_Eye[8]",
    hairBald: "form1[0].#subform[2].P7_Line6_Hair[0]",
    hairBlack: "form1[0].#subform[2].P7_Line6_Hair[1]",
    hairBlond: "form1[0].#subform[2].P7_Line6_Hair[2]",
    hairBrown: "form1[0].#subform[2].P7_Line6_Hair[3]",
    hairGray: "form1[0].#subform[2].P7_Line6_Hair[4]",
    hairRed: "form1[0].#subform[2].P7_Line6_Hair[5]",
    hairSandy: "form1[0].#subform[2].P7_Line6_Hair[6]",
    hairWhite: "form1[0].#subform[2].P7_Line6_Hair[7]",
    hairUnknown: "form1[0].#subform[2].P7_Line6_Hair[8]",
  },

  // Part 8 - Employment
  employment: {
    employerName1: "form1[0].#subform[4].P7_EmployerName1[0]",
    occupation1: "form1[0].#subform[4].P7_OccupationFieldStudy1[0]",
    city1: "form1[0].#subform[4].P7_City1[0]",
    state1: "form1[0].#subform[4].P7_State1[0]",
    from1: "form1[0].#subform[4].P7_From1[0]",
  },

  // Part 10 - Marital Status
  marital: {
    single: "form1[0].#subform[3].P10_Line1_MaritalStatus[0]",
    married: "form1[0].#subform[3].P10_Line1_MaritalStatus[1]",
    divorced: "form1[0].#subform[3].P10_Line1_MaritalStatus[2]",
    widowed: "form1[0].#subform[3].P10_Line1_MaritalStatus[3]",
    annulled: "form1[0].#subform[3].P10_Line1_MaritalStatus[4]",
    separated: "form1[0].#subform[3].P10_Line1_MaritalStatus[5]",
    timesMarried: "form1[0].#subform[3].Part9Line3_TimesMarried[0]",
    spouseFamilyName: "form1[0].#subform[3].P10_Line4a_FamilyName[0]",
    spouseGivenName: "form1[0].#subform[3].P10_Line4a_GivenName[0]",
    spouseMiddleName: "form1[0].#subform[3].P10_Line4a_MiddleName[0]",
    spouseDateOfBirth: "form1[0].#subform[3].P10_Line4d_DateofBirth[0]",
    spouseDateOfMarriage: "form1[0].#subform[3].P10_Line4e_DateEnterMarriage[0]",
    spouseIsCitizenYes: "form1[0].#subform[3].P10_Line5_Citizen[0]",
    spouseIsCitizenNo: "form1[0].#subform[3].P10_Line5_Citizen[1]",
    spouseEmployer: "form1[0].#subform[4].P10_Line4g_Employer[0]",
  },

  // Part 11 - Children
  children: {
    totalChildren: "form1[0].#subform[4].P11_Line1_TotalChildren[0]",
  },

  // Part 12 - Background Questions
  background: {
    claimedCitizenYes: "form1[0].#subform[8].P9_Line22a[0]",
    claimedCitizenNo: "form1[0].#subform[8].P9_Line22a[1]",
    votedYes: "form1[0].#subform[8].Pt9_Line22b[0]",
    votedNo: "form1[0].#subform[8].Pt9_Line22b[1]",
  },

  // Part 13 - Contact
  contact: {
    phone: "form1[0].#subform[10].P12_Line3_Telephone[0]",
    mobile: "form1[0].#subform[10].P12_Line3_Mobile[0]",
    email: "form1[0].#subform[10].P12_Line5_Email[0]",
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Parse a full legal name into first, middle, and last name parts
 */
export function parseFullName(fullName: string): {
  firstName: string;
  middleName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], middleName: "", lastName: "" };
  } else if (parts.length === 2) {
    return { firstName: parts[0], middleName: "", lastName: parts[1] };
  } else {
    return {
      firstName: parts[0],
      middleName: parts.slice(1, -1).join(" "),
      lastName: parts[parts.length - 1],
    };
  }
}

/**
 * Format date to MM/DD/YYYY (USCIS standard)
 */
export function formatDateForUSCIS(dateString: string): string {
  if (!dateString) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  }
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  return dateString;
}

/**
 * Split weight into 3 digits for PDF fields
 */
function splitWeight(weight: string): { w1: string; w2: string; w3: string } {
  const w = weight.padStart(3, "0");
  return { w1: w[0], w2: w[1], w3: w[2] };
}

// ═══════════════════════════════════════════════════════════════
// MAIN MAPPING FUNCTION
// ═══════════════════════════════════════════════════════════════

export function mapIntakeFormToN400(data: IntakeFormData): Record<string, string | boolean> {
  const formattedDOB = formatDateForUSCIS(data.date_of_birth);
  const formattedPRDate = formatDateForUSCIS(data.date_became_permanent_resident);
  const { w1, w2, w3 } = splitWeight(data.weight || "0");

  const mapping: Record<string, string | boolean> = {};

  // ═══════════════════════════════════════════════════════════════
  // PART 1: ELIGIBILITY
  // ═══════════════════════════════════════════════════════════════
  const eligibilityMap: Record<string, string> = {
    "5year": N400_FIELDS.eligibility.fiveYears,
    "3year_marriage": N400_FIELDS.eligibility.threeYearsMarried,
    "military_current": N400_FIELDS.eligibility.military,
    "military_former": N400_FIELDS.eligibility.militaryFormer,
    "military_spouse": N400_FIELDS.eligibility.militarySpouse,
    "other": N400_FIELDS.eligibility.other,
  };
  if (eligibilityMap[data.eligibility_basis]) {
    mapping[eligibilityMap[data.eligibility_basis]] = true;
  }

  // ═══════════════════════════════════════════════════════════════
  // PART 2: PERSONAL INFORMATION
  // ═══════════════════════════════════════════════════════════════
  mapping[N400_FIELDS.personal.familyName] = data.last_name;
  mapping[N400_FIELDS.personal.givenName] = data.first_name;
  mapping[N400_FIELDS.personal.middleName] = data.middle_name || "";
  mapping[N400_FIELDS.personal.dateOfBirth] = formattedDOB;
  mapping[N400_FIELDS.personal.countryOfBirth] = data.country_of_birth;
  mapping[N400_FIELDS.personal.countryOfNationality] = data.country_of_citizenship;
  mapping[N400_FIELDS.personal.dateBecamePR] = formattedPRDate;
  mapping[N400_FIELDS.personal.ssn] = data.ssn || "";
  mapping[N400_FIELDS.personal.alienNumber] = data.a_number || "";
  mapping[N400_FIELDS.personal.uscisAccountNumber] = data.uscis_account_number || "";

  // Gender
  if (data.gender === "male") {
    mapping[N400_FIELDS.personal.genderMale] = true;
  } else if (data.gender === "female") {
    mapping[N400_FIELDS.personal.genderFemale] = true;
  }

  // ═══════════════════════════════════════════════════════════════
  // PART 4: ADDRESS
  // ═══════════════════════════════════════════════════════════════
  mapping[N400_FIELDS.address.streetName] = data.street_address;
  mapping[N400_FIELDS.address.city] = data.city;
  mapping[N400_FIELDS.address.zipCode] = data.zip_code;
  mapping[N400_FIELDS.address.country] = "United States";
  if (data.residence_from) {
    mapping[N400_FIELDS.address.residenceFrom] = data.residence_from;
  }

  // ═══════════════════════════════════════════════════════════════
  // PART 7: BIOGRAPHIC INFORMATION
  // ═══════════════════════════════════════════════════════════════
  // Ethnicity
  if (data.ethnicity === "hispanic") {
    mapping[N400_FIELDS.biographic.ethnicityHispanic] = true;
  } else {
    mapping[N400_FIELDS.biographic.ethnicityNotHispanic] = true;
  }

  // Race
  const raceMap: Record<string, string> = {
    white: N400_FIELDS.biographic.raceWhite,
    asian: N400_FIELDS.biographic.raceAsian,
    black: N400_FIELDS.biographic.raceBlack,
    native: N400_FIELDS.biographic.raceNative,
    pacific: N400_FIELDS.biographic.racePacific,
  };
  if (raceMap[data.race]) {
    mapping[raceMap[data.race]] = true;
  }

  // Weight (split into 3 digits)
  mapping[N400_FIELDS.biographic.weight1] = w1;
  mapping[N400_FIELDS.biographic.weight2] = w2;
  mapping[N400_FIELDS.biographic.weight3] = w3;

  // Eye Color
  const eyeMap: Record<string, string> = {
    Black: N400_FIELDS.biographic.eyeBlack,
    Blue: N400_FIELDS.biographic.eyeBlue,
    Brown: N400_FIELDS.biographic.eyeBrown,
    Gray: N400_FIELDS.biographic.eyeGray,
    Green: N400_FIELDS.biographic.eyeGreen,
    Hazel: N400_FIELDS.biographic.eyeHazel,
    Maroon: N400_FIELDS.biographic.eyeMaroon,
    Pink: N400_FIELDS.biographic.eyePink,
    Unknown: N400_FIELDS.biographic.eyeUnknown,
  };
  if (eyeMap[data.eye_color]) {
    mapping[eyeMap[data.eye_color]] = true;
  }

  // Hair Color
  const hairMap: Record<string, string> = {
    Bald: N400_FIELDS.biographic.hairBald,
    Black: N400_FIELDS.biographic.hairBlack,
    Blond: N400_FIELDS.biographic.hairBlond,
    Brown: N400_FIELDS.biographic.hairBrown,
    Gray: N400_FIELDS.biographic.hairGray,
    Red: N400_FIELDS.biographic.hairRed,
    Sandy: N400_FIELDS.biographic.hairSandy,
    White: N400_FIELDS.biographic.hairWhite,
    Unknown: N400_FIELDS.biographic.hairUnknown,
  };
  if (hairMap[data.hair_color]) {
    mapping[hairMap[data.hair_color]] = true;
  }

  // ═══════════════════════════════════════════════════════════════
  // PART 8: EMPLOYMENT
  // ═══════════════════════════════════════════════════════════════
  if (data.current_employer) {
    mapping[N400_FIELDS.employment.employerName1] = data.current_employer;
  }
  if (data.current_occupation) {
    mapping[N400_FIELDS.employment.occupation1] = data.current_occupation;
  }
  if (data.employer_city) {
    mapping[N400_FIELDS.employment.city1] = data.employer_city;
  }
  if (data.employer_state) {
    mapping[N400_FIELDS.employment.state1] = data.employer_state;
  }
  if (data.employment_from) {
    mapping[N400_FIELDS.employment.from1] = data.employment_from;
  }

  // ═══════════════════════════════════════════════════════════════
  // PART 10: MARITAL STATUS
  // ═══════════════════════════════════════════════════════════════
  const maritalMap: Record<string, string> = {
    single: N400_FIELDS.marital.single,
    married: N400_FIELDS.marital.married,
    divorced: N400_FIELDS.marital.divorced,
    widowed: N400_FIELDS.marital.widowed,
    annulled: N400_FIELDS.marital.annulled,
    separated: N400_FIELDS.marital.separated,
  };
  if (maritalMap[data.marital_status]) {
    mapping[maritalMap[data.marital_status]] = true;
  }

  if (data.times_married) {
    mapping[N400_FIELDS.marital.timesMarried] = data.times_married;
  }

  // Spouse Information (if married)
  if (data.marital_status === "married") {
    if (data.spouse_last_name) {
      mapping[N400_FIELDS.marital.spouseFamilyName] = data.spouse_last_name;
    }
    if (data.spouse_first_name) {
      mapping[N400_FIELDS.marital.spouseGivenName] = data.spouse_first_name;
    }
    if (data.spouse_middle_name) {
      mapping[N400_FIELDS.marital.spouseMiddleName] = data.spouse_middle_name;
    }
    if (data.spouse_date_of_birth) {
      mapping[N400_FIELDS.marital.spouseDateOfBirth] = formatDateForUSCIS(data.spouse_date_of_birth);
    }
    if (data.spouse_date_of_marriage) {
      mapping[N400_FIELDS.marital.spouseDateOfMarriage] = formatDateForUSCIS(data.spouse_date_of_marriage);
    }
    if (data.spouse_is_us_citizen === "yes") {
      mapping[N400_FIELDS.marital.spouseIsCitizenYes] = true;
    } else if (data.spouse_is_us_citizen === "no") {
      mapping[N400_FIELDS.marital.spouseIsCitizenNo] = true;
    }
    if (data.spouse_current_employer) {
      mapping[N400_FIELDS.marital.spouseEmployer] = data.spouse_current_employer;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PART 11: CHILDREN
  // ═══════════════════════════════════════════════════════════════
  mapping[N400_FIELDS.children.totalChildren] = data.total_children || "0";

  // ═══════════════════════════════════════════════════════════════
  // PART 12: BACKGROUND QUESTIONS
  // ═══════════════════════════════════════════════════════════════
  if (data.q_claimed_us_citizen === "yes") {
    mapping[N400_FIELDS.background.claimedCitizenYes] = true;
  } else {
    mapping[N400_FIELDS.background.claimedCitizenNo] = true;
  }

  if (data.q_voted_in_us === "yes") {
    mapping[N400_FIELDS.background.votedYes] = true;
  } else {
    mapping[N400_FIELDS.background.votedNo] = true;
  }

  // ═══════════════════════════════════════════════════════════════
  // PART 13: CONTACT
  // ═══════════════════════════════════════════════════════════════
  mapping[N400_FIELDS.contact.phone] = data.daytime_phone;
  if (data.mobile_phone) {
    mapping[N400_FIELDS.contact.mobile] = data.mobile_phone;
  }
  mapping[N400_FIELDS.contact.email] = data.email;

  return mapping;
}
