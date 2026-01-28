# N-400 Intake Form - Complete Reference

This document contains all intake form fields, questions, guidance copy, and metadata for the Meridian N-400 application.

---

## Form Steps Overview

| Step | Part | Section | Title |
|------|------|---------|-------|
| 1 | Part 1 | ELIGIBILITY | How do you qualify for citizenship? |
| 2 | Part 2 | INFORMATION ABOUT YOU | Tell us about yourself. |
| 3 | Part 3 | BIOGRAPHIC INFORMATION | Physical characteristics. |
| 4 | Part 4 | CONTACT | How can we reach you? |
| 5 | Part 4 | RESIDENCE | Where do you live? |
| 6 | Part 5 | MARITAL HISTORY | Your marriage information. |
| 7 | Part 6 | CHILDREN | Information about your children. |
| 8 | Part 7 | EMPLOYMENT | Your work history. |
| 9 | Part 8 | TRAVEL | Time outside the US. |
| 10 | Part 9 | BACKGROUND | Important eligibility questions. |
| 11 | Part 10 | FEE REDUCTION | Request for fee reduction (optional). |
| 12 | Part 11 | SIGNATURE | Certification and signature. |
| 13 | Part 12 | INTERPRETER | Interpreter information (if applicable). |
| 14 | Part 13 | PREPARER | Preparer information (if applicable). |
| 15 | Part 14 | ADDITIONAL INFO | Additional information. |
| 16 | — | REVIEW | Review your application. |
| 17 | — | COMPLETE | You're all set! |

---

## Meridian Guidance Pattern

Each question screen supports these optional copy elements:
- **Part label**: e.g., "Part 9 • Additional Information"
- **H1 question title**: Plain English (without changing meaning)
- **Intent text**: One-sentence "Why USCIS asks this" (descriptive only)
- **Guardrail text**: Reassurance like "You can review this later before finalizing"
- **USCIS wording toggle**: Shows the official question text

**Content Guidelines:**
- Use neutral language: "USCIS uses this to assess..." or "This section captures..."
- No advice or steering (no "traffic tickets don't count" etc.)
- No examples with specific guidance
- Keep intent descriptive, not instructional

---

## PART 1: ELIGIBILITY

**Step 1 Guidance:**
- **Title:** How do you qualify for citizenship?
- **Intent:** USCIS uses this to determine which naturalization requirements apply to your application.
- **Guardrail:** You can review and change your selection before submitting.

### Fields

#### a_number
- **Label:** Enter your 9-digit A-Number
- **Type:** Text input
- **USCIS Text:** Alien Registration Number (A-Number)
- **Intent:** USCIS uses this to locate your immigration file and verify your permanent resident status.
- **Guardrail:** Your A-Number is on your green card, after the letter "A".
- **Validation:** Optional

#### eligibility_basis
- **Label:** Select the basis for your eligibility
- **Type:** Radio buttons
- **USCIS Text:** You are applying on the basis of:
- **Intent:** USCIS uses this to determine which residency and physical presence requirements apply to you.
- **Guardrail:** Most applicants select the first option (5-year lawful permanent resident).
- **Validation:** Required

**Options:**
| Value | Label |
|-------|-------|
| 5year | General Provision - I have been a lawful permanent resident for at least 5 years |
| 3year_marriage | Spouse of U.S. Citizen - I have been married to and living with a U.S. citizen for at least 3 years |
| vawa | VAWA - Eligibility for the Spouse, Former Spouse, or Child of a U.S. Citizen under the Violence Against Women Act |
| qualified_employment | Spouse of U.S. Citizen in Qualified Employment Outside the United States |
| military_current | Military Service During Period of Hostilities - I am a current member of the U.S. Armed Forces |
| military_former | At Least One Year of Honorable Military Service - I was formerly a member of the U.S. Armed Forces |
| other | Other basis for eligibility |

#### other_basis_reason
- **Label:** Please specify your basis for eligibility
- **Type:** Textarea
- **USCIS Text:** Other (explain):
- **Intent:** USCIS uses this to evaluate eligibility under less common provisions of the Immigration and Nationality Act.
- **Show when:** eligibility_basis === "other"

#### uscis_field_office
- **Label:** Select USCIS Field Office for Interview
- **Type:** Select dropdown
- **USCIS Text:** If your residential address is outside the United States and you are filing under INA section 319(b), select the USCIS field office in the United States where you would like to have your naturalization interview.
- **Intent:** USCIS uses this to schedule your interview at a convenient U.S. location.
- **Show when:** eligibility_basis === "qualified_employment"

---

## PART 2: INFORMATION ABOUT YOU

### Current Legal Name
| Field | Label | Type | Required |
|-------|-------|------|----------|
| last_name | Family Name (Last Name) | Text | Yes |
| first_name | Given Name (First Name) | Text | Yes |
| middle_name | Middle Name (if applicable) | Text | No |

### Name Change
| Field | Label | Type |
|-------|-------|------|
| wants_name_change | Do you want to legally change your name? | Yes/No |
| new_name_first | New First Name | Text (if yes) |
| new_name_middle | New Middle Name | Text (if yes) |
| new_name_last | New Last Name | Text (if yes) |

### Other Names Used
| Field | Label | Type |
|-------|-------|------|
| has_used_other_names | Have you used other names since birth? | Yes/No |
| other_names | Array of {family_name, given_name, middle_name} | Dynamic array |

**Tooltip:** Include all names you have used, including maiden names, previous married names, aliases, or any other names used in official documents.

### Personal Information
| Field | Label | Type | Required |
|-------|-------|------|----------|
| date_of_birth | Date of Birth | Date (MM/DD/YYYY) | Yes |
| country_of_birth | Country of Birth | Select | Yes |
| country_of_citizenship | Country of Citizenship | Select | Yes |
| gender | Gender | Radio (male/female) | Yes |

### Parent Citizenship
| Field | Label | Type |
|-------|-------|------|
| parent_us_citizen_before_18 | Was either of your parents a U.S. citizen before you turned 18? | Yes/No |

### Identification Numbers
| Field | Label | Type | Validation |
|-------|-------|------|------------|
| a_number | Alien Registration Number | Text | Optional |
| uscis_account_number | USCIS Online Account Number | Text | Optional |
| ssn | Social Security Number | Text | Optional |

### Social Security Update
| Field | Label | Type |
|-------|-------|------|
| ssa_wants_card | Do you want SSA to issue you an original or replacement Social Security card? | Yes/No |
| ssa_consent_disclosure | Do you consent to USCIS disclosing your naturalization to SSA? | Yes/No |

### Green Card Information
| Field | Label | Type | Required |
|-------|-------|------|----------|
| date_became_permanent_resident | Date you became a lawful permanent resident | Date | Yes |

### Disability Accommodations
| Field | Label | Type |
|-------|-------|------|
| request_disability_accommodations | Do you request disability accommodations? | Yes/No |

---

## PART 3: BIOGRAPHIC INFORMATION

| Field | Label | Type | Options | Required |
|-------|-------|------|---------|----------|
| ethnicity | Ethnicity | Radio | Hispanic or Latino, Not Hispanic or Latino | Yes |
| race | Race | Radio | White, Asian, Black or African American, American Indian or Alaska Native, Native Hawaiian or Pacific Islander | Yes |
| height_feet | Height (feet) | Select | 1-8 | Yes |
| height_inches | Height (inches) | Select | 0-11 | No |
| weight | Weight (pounds) | Text | — | Yes |
| eye_color | Eye Color | Select | Black, Blue, Brown, Gray, Green, Hazel, Maroon, Pink, Unknown | Yes |
| hair_color | Hair Color | Select | Bald, Black, Blond, Brown, Gray, Red, Sandy, White, Unknown | Yes |

---

## PART 4: CONTACT INFORMATION

| Field | Label | Type | Required |
|-------|-------|------|----------|
| daytime_phone | Daytime Phone Number | Text | Yes |
| mobile_phone | Mobile Phone Number | Text | No |
| email | Email Address | Email | Yes |

---

## PART 5: RESIDENCE INFORMATION

### Current Address
| Field | Label | Type | Required |
|-------|-------|------|----------|
| street_address | Street Number and Name | Text | Yes |
| apt_ste_flr | Apt/Ste/Flr | Text | No |
| city | City or Town | Text | Yes |
| state | State | Select (US states) | Yes |
| zip_code | ZIP Code | Text | Yes |
| residence_from | Date From | Date | No |
| residence_to | Date To | Date | No |

### Residence History (5 years)
| Field | Type |
|-------|------|
| residence_addresses | Array of address objects with dates |

### Mailing Address
| Field | Label | Type |
|-------|-------|------|
| mailing_same_as_residence | Is mailing address same as residence? | Yes/No |
| mailing_street_address | Street Address | Text (if different) |
| mailing_apt_ste_flr | Apt/Ste/Flr | Text |
| mailing_in_care_of | In Care Of Name | Text |
| mailing_city | City | Text |
| mailing_state | State | Select |
| mailing_zip_code | ZIP Code | Text |

---

## PART 6: MARITAL HISTORY

| Field | Label | Type | Options |
|-------|-------|------|---------|
| marital_status | Current Marital Status | Radio | Single Never Married, Married, Divorced, Widowed, Separated, Annulled |
| times_married | How many times have you been married? | Text | — |

### Current Spouse Information (if married)
| Field | Label | Type |
|-------|-------|------|
| spouse_is_military_member | Is your spouse a member of the U.S. Armed Forces? | Yes/No |
| spouse_last_name | Spouse's Family Name | Text |
| spouse_first_name | Spouse's Given Name | Text |
| spouse_middle_name | Spouse's Middle Name | Text |
| spouse_date_of_birth | Spouse's Date of Birth | Date |
| spouse_date_of_marriage | Date of Marriage | Date |
| spouse_is_us_citizen | Is your spouse a U.S. citizen? | Yes/No |
| spouse_citizenship_by_birth | Did your spouse obtain citizenship by birth? | Yes/No |
| spouse_date_became_citizen | Date spouse became citizen | Date |
| spouse_address_same_as_applicant | Does spouse live at same address? | Yes/No |
| spouse_a_number | Spouse's A-Number | Text |
| spouse_times_married | How many times has your spouse been married? | Text |
| spouse_country_of_birth | Spouse's Country of Birth | Select |
| spouse_current_employer | Spouse's Current Employer | Text |

---

## PART 7: CHILDREN

| Field | Label | Type |
|-------|-------|------|
| total_children | Total number of children | Text |
| providing_support_for_children | Are you providing support for your children? | Yes/No |

### Children Array
Each child entry contains:
| Field | Label | Type |
|-------|-------|------|
| first_name | Child's First Name | Text |
| last_name | Child's Last Name | Text |
| date_of_birth | Child's Date of Birth | Date |
| residence | Where does child reside? | Radio: resides with me, does not reside with me, unknown/missing |
| relationship | Relationship | Radio: biological son/daughter, stepchild, legally adopted |

---

## PART 8: EMPLOYMENT

### Employment History Array
Each entry contains:
| Field | Label | Type |
|-------|-------|------|
| employer_or_school | Employer or School Name | Text |
| occupation_or_field | Occupation or Field of Study | Text |
| city | City | Text |
| state | State | Select |
| zip_code | ZIP Code | Text |
| country | Country | Select |
| province | Province (if outside US) | Text |
| postal_code | Postal Code (if outside US) | Text |
| dates_from | Date From | Date |
| dates_to | Date To | Date |

### Current Employment (shortcut fields)
| Field | Label |
|-------|-------|
| current_employer | Current Employer Name |
| current_occupation | Current Occupation |
| employer_city | Employer City |
| employer_state | Employer State |
| employer_zip_code | Employer ZIP Code |
| employment_from | Employment Start Date |
| employment_to | Employment End Date |

---

## PART 9: TIME OUTSIDE THE US (Travel)

| Field | Label | Type |
|-------|-------|------|
| total_days_outside_us | Total days outside US in last 5 years | Text |
| trips_over_6_months | Any trips over 6 months? | Yes/No |

### Trips Array
Each trip contains:
| Field | Label | Type |
|-------|-------|------|
| date_left_us | Date Left US | Date |
| date_returned_us | Date Returned to US | Date |
| countries_traveled | Countries Visited | Text |

---

## PART 9: BACKGROUND QUESTIONS (Additional Information)

**Step 10 Guidance:**
- **Title:** Important eligibility questions
- **Intent:** USCIS uses these questions to assess eligibility requirements related to naturalization criteria.
- **Guardrail:** Answer honestly. Some "Yes" answers may require additional information later in the form.

**EVER Callout (persistent):**
> In USCIS forms, 'EVER' signals broad time and location scope.

---

### General Eligibility (Items 1-5)

#### q_claimed_us_citizen
- **Item:** 1
- **Plain English:** Have you ever claimed to be a U.S. citizen?
- **USCIS Text:** Have you EVER claimed to be a U.S. citizen (in writing or any other way)?
- **Intent:** USCIS uses this to assess whether you have made false claims to U.S. citizenship.
- **Explanation Required:** Yes

#### q_voted_in_us
- **Item:** 2
- **Plain English:** Have you ever registered to vote or voted in a U.S. election?
- **USCIS Text:** Have you EVER registered to vote or voted in any Federal, state, or local election in the United States?
- **Intent:** USCIS uses this to assess compliance with voting eligibility requirements.
- **Explanation Required:** Yes

#### q_failed_to_file_taxes
- **Item:** 3
- **Plain English:** Have you ever failed to file a tax return?
- **USCIS Text:** Have you EVER failed to file a Federal, state, or local tax return since you became a lawful permanent resident?
- **Intent:** USCIS uses this to assess compliance with tax obligations.
- **Explanation Required:** Yes

#### q_nonresident_alien_tax
- **Item:** 4
- **Plain English:** Did you call yourself a "nonresident alien" on a tax return?
- **USCIS Text:** Since you became a lawful permanent resident, have you called yourself a "nonresident alien" on a Federal, state, or local tax return or decided not to file a tax return because you considered yourself to be a nonresident?
- **Intent:** USCIS uses this to verify continuous residence status.
- **Explanation Required:** Yes

#### q_owe_taxes
- **Item:** 5
- **Plain English:** Do you currently owe overdue taxes?
- **USCIS Text:** Do you currently owe any overdue Federal, state, or local taxes in the United States?
- **Intent:** USCIS uses this to assess compliance with financial obligations.
- **Explanation Required:** Yes

---

### Affiliations and Associations (Items 6-8)

#### q_communist_party
- **Item:** 6
- **Plain English:** Have you ever been associated with a Communist or totalitarian party?
- **USCIS Text:** Have you EVER been a member of, involved in, or in any way associated with any Communist or totalitarian party anywhere in the world?
- **Intent:** USCIS uses this to assess affiliations relevant to naturalization eligibility.
- **Explanation Required:** Yes

#### q_advocated_overthrow
- **Item:** 7
- **Plain English:** Have you ever advocated the overthrow of the U.S. government?
- **USCIS Text:** Have you EVER advocated (supported and promoted) the overthrow by force or violence or other unconstitutional means of the Government of the United States or all forms of law?
- **Intent:** USCIS uses this to assess affiliations and activities relevant to eligibility.
- **Explanation Required:** Yes

#### q_terrorist_org
- **Item:** 8
- **Plain English:** Have you ever supported a group that used weapons against people?
- **USCIS Text:** Have you EVER been a member of, involved in, or in any way associated with, or have you EVER provided money, a thing of value, services or labor, or any other assistance or support to a group that used a weapon against any person, or threatened to do so?
- **Intent:** USCIS uses this to assess affiliations relevant to national security and eligibility.
- **Explanation Required:** Yes

---

### Violence and Harm (Items 9.a-9.j)

#### q_used_weapon_explosive
- **Item:** 9.a
- **Plain English:** Have you ever used a weapon or explosive with intent to harm?
- **USCIS Text:** Have you EVER used a weapon or explosive with intent to harm another person or cause damage to property?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_kidnapping_assassination_hijacking
- **Item:** 9.b
- **Plain English:** Have you ever engaged in kidnapping, assassination, or hijacking?
- **USCIS Text:** Have you EVER engaged (participated) in kidnapping, assassination, or hijacking or sabotage of an airplane, ship, vehicle, or other mode of transportation?
- **Intent:** USCIS uses this to assess conduct relevant to eligibility.
- **Explanation Required:** Yes

#### q_threatened_weapon_violence
- **Item:** 9.c
- **Plain English:** Have you ever threatened or planned violence with weapons?
- **USCIS Text:** Have you EVER threatened, attempted (tried), conspired (planned with others), prepared, planned, advocated for, or incited (encouraged) others to commit any of the acts listed above?
- **Intent:** USCIS uses this to assess conduct relevant to eligibility.
- **Explanation Required:** Yes

#### q_genocide
- **Item:** 9.d
- **Plain English:** Have you ever participated in genocide?
- **USCIS Text:** Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in genocide?
- **Intent:** USCIS uses this to assess conduct relevant to persecutor bar provisions.
- **Explanation Required:** Yes

#### q_torture
- **Item:** 9.e
- **Plain English:** Have you ever participated in torture?
- **USCIS Text:** Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in torture?
- **Intent:** USCIS uses this to assess conduct relevant to persecutor bar provisions.
- **Explanation Required:** Yes

#### q_killing_person
- **Item:** 9.f
- **Plain English:** Have you ever participated in killing or trying to kill someone?
- **USCIS Text:** Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in killing or trying to kill any person?
- **Intent:** USCIS uses this to assess conduct relevant to eligibility.
- **Explanation Required:** Yes

#### q_sexual_contact_nonconsent
- **Item:** 9.g
- **Plain English:** Have you ever had non-consensual sexual contact with someone?
- **USCIS Text:** Have you EVER had any kind of sexual contact or activity with any person who did not consent (did not agree) or was unable to consent (could not agree), or was being forced or threatened by you or by someone else?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_severely_injuring
- **Item:** 9.h
- **Plain English:** Have you ever intentionally and severely injured someone?
- **USCIS Text:** Have you EVER intentionally and severely injuring or trying to injure any person?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_religious_persecution
- **Item:** 9.i
- **Plain English:** Have you ever prevented someone from practicing their religion?
- **USCIS Text:** Have you EVER not let someone practice his or her religion?
- **Intent:** USCIS uses this to assess conduct relevant to persecutor bar provisions.
- **Explanation Required:** Yes

#### q_harm_race_religion
- **Item:** 9.j
- **Plain English:** Have you ever harmed someone because of their background or beliefs?
- **USCIS Text:** Have you EVER caused harm or suffering to any person because of his or her race, religion, national origin, membership in a particular social group, or political opinion?
- **Intent:** USCIS uses this to assess conduct relevant to persecutor bar provisions.
- **Explanation Required:** Yes

---

### Military and Police Service (Items 10-14)

#### q_military_police_service
- **Item:** 10.a
- **Plain English:** Have you ever served in a military or police unit?
- **USCIS Text:** Have you EVER served in, been a member of, assisted (helped), or participated in any military or police unit?
- **Intent:** USCIS uses this to assess your background for eligibility purposes.
- **Explanation Required:** Yes

#### q_armed_group
- **Item:** 10.b
- **Plain English:** Have you ever been part of an armed group?
- **USCIS Text:** Have you EVER served in, been a member of, assisted (helped), or participated in any armed group (a group that carries weapons), for example: paramilitary unit, self-defense unit, vigilante unit, rebel group, or guerrilla group?
- **Intent:** USCIS uses this to assess affiliations relevant to eligibility.
- **Explanation Required:** Yes

#### q_detention_facility
- **Item:** 10.c
- **Plain English:** Have you ever worked in a detention facility?
- **USCIS Text:** Have you EVER worked, volunteered, or otherwise served in a place where people were detained (forced to stay), for example, a prison, jail, prison camp, detention facility, or labor camp?
- **Intent:** USCIS uses this to assess background relevant to persecutor bar provisions.
- **Explanation Required:** Yes

#### q_group_used_weapons
- **Item:** 10.d
- **Plain English:** Were you ever part of a group that used weapons?
- **USCIS Text:** Were you EVER a part of any group, or did you EVER help any group, unit, or organization that used a weapon against any person, or threatened to do so?
- **Intent:** USCIS uses this to assess affiliations relevant to eligibility.
- **Explanation Required:** Yes

#### q_used_weapon_against_person
- **Item:** 10.e
- **Plain English:** Did you use a weapon against another person?
- **USCIS Text:** If you answered "Yes" to Item Number 10.d., when you were part of this group, or when you helped this group, did you ever use a weapon against another person?
- **Show when:** q_group_used_weapons === "yes"
- **Explanation Required:** Yes

#### q_threatened_weapon_use
- **Item:** 10.f
- **Plain English:** Did you threaten to use a weapon against another person?
- **USCIS Text:** If you answered "Yes" to Item Number 10.d., when you were part of this group, or when you helped this group, did you ever threaten another person that you would use a weapon against that person?
- **Show when:** q_group_used_weapons === "yes"
- **Explanation Required:** Yes

#### q_weapons_training
- **Item:** 11
- **Plain English:** Have you ever received weapons or military training?
- **USCIS Text:** Have you EVER received any weapons training, paramilitary training, or other military-type training?
- **Intent:** USCIS uses this to assess background relevant to eligibility.
- **Explanation Required:** Yes

#### q_sold_provided_weapons
- **Item:** 12
- **Plain English:** Have you ever sold or provided weapons?
- **USCIS Text:** Have you EVER sold, provided, or transported weapons, or assisted any person in selling, providing, or transporting weapons, which you knew or believed would be used against another person?
- **Intent:** USCIS uses this to assess conduct relevant to eligibility.
- **Explanation Required:** Yes

#### q_recruited_under_15
- **Item:** 13
- **Plain English:** Have you ever recruited someone under 15 for an armed group?
- **USCIS Text:** Have you EVER recruited (asked), enlisted (signed up), conscripted (required to join), or used any person under 15 years of age to serve in or help an armed group?
- **Intent:** USCIS uses this to assess conduct relevant to child soldier provisions.
- **Explanation Required:** Yes

#### q_used_under_15_hostilities
- **Item:** 14
- **Plain English:** Have you ever used someone under 15 in hostilities?
- **USCIS Text:** Have you EVER used any person under 15 years of age to take part in hostilities or attempted or worked with others to do so?
- **Intent:** USCIS uses this to assess conduct relevant to child soldier provisions.
- **Explanation Required:** Yes

---

### Crimes and Offenses (Items 15-16)

#### q_committed_crime_not_arrested
- **Item:** 15.a
- **Plain English:** Have you ever committed a crime for which you were not arrested?
- **USCIS Text:** Have you EVER committed, agreed to commit, asked someone else to commit, helped commit, or tried to commit a crime or offense for which you were NOT arrested?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_arrested
- **Item:** 15.b
- **Plain English:** Have you ever been arrested, cited, or detained?
- **USCIS Text:** Have you EVER been arrested, cited, detained or confined by any law enforcement officer, military official (in the U.S. or elsewhere), or immigration official for any reason, or been charged with a crime or offense?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

**If Yes to 15.a or 15.b, capture crime details:**

| Field | Label |
|-------|-------|
| date_of_crime | Date of Crime |
| date_of_conviction | Date of Conviction |
| crime_description | Crime Description |
| place_of_crime | Place of Crime (City, State, Country) |
| result_disposition | Result/Disposition |
| sentence | Sentence |

**Important Note:** User must disclose crimes even if records are sealed, expunged, or cleared.

#### q_completed_probation
- **Item:** 16
- **Plain English:** Have you completed your probation or parole?
- **USCIS Text:** If you received a suspended sentence, were placed on probation, or were paroled, have you completed your suspended sentence, probation, or parole?
- **Show when:** q_arrested === "yes"

---

### Moral Character (Items 17-25)

#### q_prostitution
- **Item:** 17
- **Plain English:** Have you ever engaged in prostitution?
- **USCIS Text:** Have you EVER engaged in prostitution, attempted to procure or import prostitutes or persons for the purpose of prostitution, or received any proceeds or money from prostitution?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_controlled_substances
- **Item:** 18
- **Plain English:** Have you ever sold or trafficked controlled substances?
- **USCIS Text:** Have you EVER manufactured, cultivated, produced, distributed, dispensed, sold, or smuggled (trafficked) any controlled substances, illegal drugs, narcotics, or drug paraphernalia in violation of any law or regulation?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_marriage_fraud
- **Item:** 19
- **Plain English:** Have you ever married to obtain an immigration benefit?
- **USCIS Text:** Have you EVER married someone in order to obtain an immigration benefit?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_polygamy
- **Item:** 20
- **Plain English:** Have you been married to more than one person at the same time?
- **USCIS Text:** Have you EVER been married to more than one person at the same time?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_helped_illegal_entry
- **Item:** 21
- **Plain English:** Have you ever helped someone enter the U.S. illegally?
- **USCIS Text:** Have you EVER helped anyone to enter, or try to enter, the United States illegally?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_illegal_gambling
- **Item:** 22
- **Plain English:** Have you ever gambled illegally or received income from illegal gambling?
- **USCIS Text:** Have you EVER gambled illegally or received income from illegal gambling?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_failed_child_support
- **Item:** 23
- **Plain English:** Have you ever failed to pay child support or alimony?
- **USCIS Text:** Have you EVER failed to support your dependents (pay child support) or to pay alimony (court-ordered financial support after divorce or separation)?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_misrepresentation_public_benefits
- **Item:** 24
- **Plain English:** Have you ever misrepresented information to obtain public benefits?
- **USCIS Text:** Have you EVER made any misrepresentation to obtain any public benefit in the United States?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_habitual_drunkard
- **Item:** 25
- **Plain English:** Have you ever been a habitual drunkard?
- **USCIS Text:** Have you EVER been a habitual drunkard?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

---

### Immigration Violations (Items 26-29)

#### q_false_info_us_government
- **Item:** 26
- **Plain English:** Have you ever given false information to U.S. government officials?
- **USCIS Text:** Have you EVER given any U.S. Government officials any information or documentation that was false, fraudulent, or misleading?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_lied_us_government
- **Item:** 27
- **Plain English:** Have you ever lied to U.S. government officials?
- **USCIS Text:** Have you EVER lied to any U.S. Government officials to gain entry or admission into the United States or to gain immigration benefits while in the United States?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_removed_deported
- **Item:** 28
- **Plain English:** Have you ever been removed or deported from the U.S.?
- **USCIS Text:** Have you EVER been removed, excluded, or deported from the United States?
- **Intent:** USCIS uses this to assess eligibility and continuous residence.
- **Explanation Required:** Yes

#### q_removal_proceedings
- **Item:** 29
- **Plain English:** Have you ever been placed in removal or deportation proceedings?
- **USCIS Text:** Have you EVER been placed in removal, exclusion, rescission, or deportation proceedings?
- **Intent:** USCIS uses this to assess eligibility and immigration history.
- **Explanation Required:** Yes

---

### Selective Service (Items 30-31)

#### q_male_18_26_lived_us
- **Item:** 30
- **Plain English:** Are you a male who lived in the U.S. between ages 18-26?
- **USCIS Text:** Are you a male who lived in the United States at any time between your 18th and 26th birthdays?
- **Intent:** USCIS uses this to determine if Selective Service registration requirements apply.

#### q_registered_selective_service
- **Item:** 31
- **Plain English:** Did you register for the Selective Service?
- **USCIS Text:** Did you register with the Selective Service?
- **Show when:** q_male_18_26_lived_us === "yes"

**If registered:**
| Field | Label |
|-------|-------|
| selective_service_number | Selective Service Number |
| selective_service_date | Date Registered |

---

### Military Service (Items 32-38)

#### q_left_us_avoid_draft
- **Item:** 32
- **Plain English:** Did you leave the U.S. to avoid being drafted?
- **USCIS Text:** Did you EVER leave the United States to avoid being drafted into the U.S. armed forces?
- **Intent:** USCIS uses this as part of its eligibility review.
- **Explanation Required:** Yes

#### q_applied_military_exemption
- **Item:** 33
- **Plain English:** Have you ever applied for a military service exemption?
- **USCIS Text:** Have you EVER applied for any kind of exemption from military service in the U.S. armed forces?
- **Intent:** USCIS uses this to assess eligibility based on prior exemption claims.
- **Explanation Required:** Yes

#### q_served_us_military
- **Item:** 34
- **Plain English:** Have you ever served in the U.S. armed forces?
- **USCIS Text:** Have you EVER served in the U.S. armed forces?
- **Intent:** USCIS uses this to determine military-related eligibility provisions.

**If served (show Items 35-38):**

#### q_current_military_member
- **Item:** 35.a
- **Plain English:** Are you currently a member of the U.S. armed forces?
- **Show when:** q_served_us_military === "yes"

#### q_scheduled_deploy
- **Item:** 35.b
- **Plain English:** Are you scheduled to deploy outside the U.S. within 3 months?
- **Show when:** q_current_military_member === "yes"

#### q_stationed_outside_us
- **Item:** 35.c
- **Plain English:** Are you currently stationed outside the U.S.?
- **Show when:** q_current_military_member === "yes"

#### q_former_military_outside_us
- **Item:** 35.d
- **Plain English:** Are you a former military member living outside the U.S.?
- **Show when:** q_current_military_member === "no"

#### q_discharged_because_alien
- **Item:** 36
- **Plain English:** Were you discharged because you were an alien?
- **USCIS Text:** Have you EVER been discharged from training or service in the U.S. armed forces because you were an alien?
- **Show when:** q_served_us_military === "yes"
- **Explanation Required:** Yes

#### q_court_martialed
- **Item:** 37
- **Plain English:** Were you court-martialed or received a dishonorable discharge?
- **USCIS Text:** Have you EVER been court-martialed or have you received a discharge characterized as other than honorable, bad conduct, or dishonorable, while in the U.S. armed forces?
- **Show when:** q_served_us_military === "yes"
- **Explanation Required:** Yes

#### q_deserted_military
- **Item:** 38
- **Plain English:** Have you ever deserted from the U.S. armed forces?
- **USCIS Text:** Have you EVER deserted from the U.S. armed forces?
- **Show when:** q_served_us_military === "yes"
- **Explanation Required:** Yes

---

### Title of Nobility (Items 39-40)

#### q_title_of_nobility
- **Item:** 39.a
- **Plain English:** Do you have a hereditary title or order of nobility?
- **USCIS Text:** Do you now have, or did you EVER have, a hereditary title or an order of nobility in any foreign country?
- **Intent:** USCIS uses this to assess willingness to renounce foreign titles.

#### q_willing_to_give_up_titles
- **Item:** 39.b
- **Plain English:** Are you willing to give up your titles at the naturalization ceremony?
- **USCIS Text:** If you answered "Yes" to Item Number 39.a., are you willing to give up any inherited titles or orders of nobility that you have in a foreign country at your naturalization ceremony?
- **Show when:** q_title_of_nobility === "yes"

**If has titles, capture:**
| Field | Label |
|-------|-------|
| q_titles_list | List all titles and orders of nobility |

---

### Oath of Allegiance (Items 40-46)

#### q_support_constitution
- **Item:** 40
- **Plain English:** Do you support the U.S. Constitution and form of government?
- **USCIS Text:** Do you support the Constitution and form of government of the United States?
- **Intent:** USCIS uses this to assess your attachment to the principles of the U.S. Constitution.

#### q_understand_oath
- **Item:** 41
- **Plain English:** Do you understand the full Oath of Allegiance?
- **USCIS Text:** Do you understand the full Oath of Allegiance to the United States?
- **Intent:** USCIS uses this to verify understanding of citizenship responsibilities.

#### q_unable_oath_disability
- **Item:** 42
- **Plain English:** Are you unable to take the Oath due to a disability?
- **USCIS Text:** Are you unable to take the Oath of Allegiance because of a physical or developmental disability or mental impairment?
- **Intent:** USCIS uses this to determine if oath modifications may apply.

**If able to take oath (q_unable_oath_disability === "no"), show Items 43-46:**

#### q_willing_take_oath
- **Item:** 43
- **Plain English:** Are you willing to take the full Oath of Allegiance?
- **USCIS Text:** Are you willing to take the full Oath of Allegiance to the United States?

#### q_willing_bear_arms
- **Item:** 44
- **Plain English:** Are you willing to bear arms if required by law?
- **USCIS Text:** If the law requires it, are you willing to bear arms (carry weapons) on behalf of the United States?

#### q_willing_noncombatant
- **Item:** 45
- **Plain English:** Are you willing to perform noncombatant services if required?
- **USCIS Text:** If the law requires it, are you willing to perform noncombatant services (do something that does not include fighting in a war) in the U.S. armed forces?

#### q_willing_work_national_importance
- **Item:** 46
- **Plain English:** Are you willing to perform work of national importance if required?
- **USCIS Text:** If the law requires it, are you willing to perform work of national importance under civilian direction (do non-military work that the U.S. Government says is important to the country)?

---

## PART 10: FEE REDUCTION

| Field | Label | Type |
|-------|-------|------|
| fee_reduction_requested | Do you qualify for a fee reduction? | Yes/No |
| household_income | Total household income | Text (currency) |
| household_size | Household size | Number |
| household_income_earners | Number of income earners | Number |
| is_head_of_household | Are you the head of household? | Yes/No |
| head_of_household_name | Name of head of household | Text (if not applicant) |

---

## PART 14: ADDITIONAL INFORMATION

Structure for capturing explanations:
```typescript
interface AdditionalInfoEntry {
  page: number;           // N-400 page number
  part: number;           // Part number (e.g., 9)
  item: string;           // Item number (e.g., "15.b")
  explanation_text: string; // User's explanation
}
```

---

## Reference Data

### US States
AL, AK, AZ, AR, CA, CO, CT, DE, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY, DC

### Countries (Common)
Mexico, China, India, Philippines, Vietnam, El Salvador, Cuba, Dominican Republic, Korea, Guatemala, Canada, United Kingdom, Jamaica, Colombia, Haiti, Honduras, Brazil, Peru, Ecuador, Pakistan, Nigeria, Bangladesh, Other

### USCIS Field Offices
Atlanta GA, Baltimore MD, Boston MA, Buffalo NY, Charlotte NC, Chicago IL, Dallas TX, Denver CO, Detroit MI, El Paso TX, Hartford CT, Houston TX, Jacksonville FL, Kansas City MO, Las Vegas NV, Los Angeles CA, Louisville KY, Memphis TN, Miami FL, Milwaukee WI, Newark NJ, New Orleans LA, New York NY, Oklahoma City OK, Omaha NE, Philadelphia PA, Phoenix AZ, Portland OR, Sacramento CA, Saint Louis MO, Saint Paul MN, Salt Lake City UT, San Antonio TX, San Diego CA, San Francisco CA, San Jose CA, Seattle WA, Tampa FL, Washington DC, Other

---

*Document generated for Meridian N-400 intake form reference.*
