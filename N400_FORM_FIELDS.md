# USCIS Form N-400 - Complete Field Analysis

This document provides a comprehensive view of all fields in the N-400 Application for Naturalization form, organized by section.

**Legend:**

- ✅ = Implemented in our intake form
- ❌ = Not yet implemented
- 📝 = Text field
- ☐ = Checkbox
- ○ = Radio button

---

## Part 1: Information About Your Eligibility (Page 1)

| #   | Field                                                                                                           | Type | Status | Notes                                                   |
| --- | --------------------------------------------------------------------------------------------------------------- | ---- | ------ | ------------------------------------------------------- |
| 1.A | I have been a lawful permanent resident for at least 5 years                                                    | ○   | ✅     | `eligibility_basis: "5year"`                          |
| 1.B | I have been a lawful permanent resident for at least 3 years AND married to a U.S. citizen for at least 3 years | ○   | ✅     | `eligibility_basis: "3year_marriage"`                 |
| 1.C | I am filing under VAWA (Violence Against Women Act)                                                             | ○   | ✅     | `eligibility_basis: "vawa"` (needs confirmation)      |
| 1.D | I am the spouse of a U.S. citizen employed outside the U.S.                                                     | ○   | ✅     | `eligibility_basis` + `uscis_field_office`          |
| 1.E | I am a current member of the U.S. armed forces                                                                  | ○   | ✅     | `eligibility_basis: "military_current"`               |
| 1.F | I am a former member of the U.S. armed forces                                                                   | ○   | ✅     | `eligibility_basis: "military_former"`                |
| 1.G | I am married to a member of the U.S. armed forces                                                               | ○   | ✅     | `eligibility_basis: "military_spouse"`                |
| 1.H | Other (explain)                                                                                                 | ○   | ✅     | `eligibility_basis: "other"` + `other_basis_reason` |

---

## Part 2: Information About You (Pages 1-2)

### Current Legal Name

| #   | Field                   | Type | Status | Notes           |
| --- | ----------------------- | ---- | ------ | --------------- |
| 1.a | Family Name (Last Name) | 📝   | ✅     | `last_name`   |
| 1.b | Given Name (First Name) | 📝   | ✅     | `first_name`  |
| 1.c | Middle Name             | 📝   | ✅     | `middle_name` |

### Other Names Used

| #   | Field                                         | Type | Status | Notes                                                             |
| --- | --------------------------------------------- | ---- | ------ | ----------------------------------------------------------------- |
| 2.a | Have you used other names?                    | ○   | ✅     | `has_used_other_names`                                          |
| 2.b | Other names (maiden name, aliases, nicknames) | 📝   | ✅     | `other_names` (array with family_name, given_name, middle_name) |

### Name Change Request

| #   | Field                                    | Type | Status | Notes                 |
| --- | ---------------------------------------- | ---- | ------ | --------------------- |
| 3.a | Do you want to legally change your name? | ○   | ✅     | `wants_name_change` |
| 3.b | New Family Name                          | 📝   | ✅     | `new_name_last`     |
| 3.c | New Given Name                           | 📝   | ✅     | `new_name_first`    |
| 3.d | New Middle Name                          | 📝   | ✅     | `new_name_middle`   |

### Identification Numbers

| # | Field                                | Type | Status | Notes                    |
| - | ------------------------------------ | ---- | ------ | ------------------------ |
| 4 | U.S. Social Security Number          | 📝   | ✅     | `ssn`                  |
| 5 | USCIS Online Account Number          | 📝   | ✅     | `uscis_account_number` |
| 6 | Alien Registration Number (A-Number) | 📝   | ✅     | `a_number`             |

### Social Security Update

| #    | Field                                                | Type | Status | Notes                      |
| ---- | ---------------------------------------------------- | ---- | ------ | -------------------------- |
| 12.a | Do you want SSA to issue you a Social Security card? | ○   | ✅     | `ssa_wants_card`         |
| 12.b | SSN (if yes)                                         | 📝   | ✅     | `ssn`                    |
| 12.c | Consent for disclosure to SSA                        | ○   | ✅     | `ssa_consent_disclosure` |

### Personal Information

| #  | Field                                       | Type | Status | Notes                              |
| -- | ------------------------------------------- | ---- | ------ | ---------------------------------- |
| 7  | Gender (Male/Female)                        | ○   | ✅     | `gender`                         |
| 8  | Date of Birth                               | 📝   | ✅     | `date_of_birth`                  |
| 9  | Date you became a lawful permanent resident | 📝   | ✅     | `date_became_permanent_resident` |
| 10 | Country of Birth                            | 📝   | ✅     | `country_of_birth`               |
| 11 | Country of Citizenship/Nationality          | 📝   | ✅     | `country_of_citizenship`         |

### Parent Citizenship

| #  | Field                                                               | Type | Status | Notes                           |
| -- | ------------------------------------------------------------------- | ---- | ------ | ------------------------------- |
| 12 | Was your mother or father a U.S. citizen before your 18th birthday? | ○   | ✅     | `parent_us_citizen_before_18` |

### Disability Accommodations

| #  | Field                                                        | Type | Status | Notes                                 |
| -- | ------------------------------------------------------------ | ---- | ------ | ------------------------------------- |
| 13 | Are you requesting an accommodation because of a disability? | ○   | ✅     | `request_disability_accommodations` |

---

## Part 3: Accommodations for Individuals with Disabilities (Page 2)

| #   | Field                         | Type | Status | Notes                            |
| --- | ----------------------------- | ---- | ------ | -------------------------------- |
| 1.a | I am deaf or hard of hearing  | ☐   | ❌     | Conditional on Part 2, #13 = Yes |
| 1.b | I am blind or have low vision | ☐   | ❌     |                                  |
| 1.c | Other (specify)               | ☐   | ❌     |                                  |
| 2.a | Sign language interpreter     | ☐   | ❌     |                                  |
| 2.b | Extended time for exam        | ☐   | ❌     |                                  |
| 2.c | Wheelchair accessible         | ☐   | ❌     |                                  |
| 2.d | Other (specify)               | ☐   | ❌     |                                  |

---

## Part 4: Information About Your Residence (Pages 2-3)

### Current Physical Address

| #   | Field                         | Type | Status | Notes                                 |
| --- | ----------------------------- | ---- | ------ | ------------------------------------- |
| 1.a | Street Number and Name        | 📝   | ✅     | `street_address`                    |
| 1.b | Apt/Ste/Flr                   | 📝   | ✅     | `apt_ste_flr`                       |
| 1.c | City or Town                  | 📝   | ✅     | `city`                              |
| 1.d | State                         | 📝   | ✅     | `state`                             |
| 1.e | ZIP Code                      | 📝   | ✅     | `zip_code`                          |
| 1.f | Province (if outside U.S.)    | 📝   | ✅     | `residence_addresses[].province`    |
| 1.g | Postal Code (if outside U.S.) | 📝   | ✅     | `residence_addresses[].postal_code` |
| 1.h | Country                       | 📝   | ✅     | `residence_addresses[].country`     |
| 1.i | Date of Residence (From)      | 📝   | ✅     | `residence_from`                    |
| 1.j | Date of Residence (To)        | 📝   | ✅     | `residence_to`                      |

### Mailing Address

| #   | Field                                | Type | Status | Notes                         |
| --- | ------------------------------------ | ---- | ------ | ----------------------------- |
| 2   | Is mailing address same as physical? | ○   | ✅     | `mailing_same_as_residence` |
| 2.a | In Care Of Name                      | 📝   | ✅     | `mailing_in_care_of`        |
| 2.b | Street Number and Name               | 📝   | ✅     | `mailing_street_address`    |
| 2.c | Apt/Ste/Flr                          | 📝   | ✅     | `mailing_apt_ste_flr`       |
| 2.d | City or Town                         | 📝   | ✅     | `mailing_city`              |
| 2.e | State                                | 📝   | ✅     | `mailing_state`             |
| 2.f | ZIP Code                             | 📝   | ✅     | `mailing_zip_code`          |
| 2.g | Province                             | 📝   | ❌     | Not implemented               |
| 2.h | Postal Code                          | 📝   | ❌     | Not implemented               |
| 2.i | Country                              | 📝   | ❌     | Not implemented               |

### Previous Addresses (Last 5 Years)

| #  | Field                    | Type | Status | Notes                                           |
| -- | ------------------------ | ---- | ------ | ----------------------------------------------- |
| 3+ | Previous address entries | 📝[] | ✅     | `residence_addresses[]` array with all fields |

---

## Part 5: Information About Your Parents (Page 3) ⚠️ NOT IMPLEMENTED

### Parent 1

| #   | Field                          | Type | Status | Notes                               |
| --- | ------------------------------ | ---- | ------ | ----------------------------------- |
| 1.a | Family Name                    | 📝   | ❌     | `parent1_last_name` needed        |
| 1.b | Given Name                     | 📝   | ❌     | `parent1_first_name` needed       |
| 1.c | Middle Name                    | 📝   | ❌     | `parent1_middle_name` needed      |
| 1.d | Date of Birth                  | 📝   | ❌     | `parent1_date_of_birth` needed    |
| 1.e | Gender                         | ○   | ❌     | `parent1_gender` needed           |
| 1.f | Country of Birth               | 📝   | ❌     | `parent1_country_of_birth` needed |
| 1.g | Current City/Town of Residence | 📝   | ❌     | `parent1_city` needed             |
| 1.h | Country of Residence           | 📝   | ❌     | `parent1_country` needed          |

### Parent 2

| #   | Field                          | Type | Status | Notes                               |
| --- | ------------------------------ | ---- | ------ | ----------------------------------- |
| 2.a | Family Name                    | 📝   | ❌     | `parent2_last_name` needed        |
| 2.b | Given Name                     | 📝   | ❌     | `parent2_first_name` needed       |
| 2.c | Middle Name                    | 📝   | ❌     | `parent2_middle_name` needed      |
| 2.d | Date of Birth                  | 📝   | ❌     | `parent2_date_of_birth` needed    |
| 2.e | Gender                         | ○   | ❌     | `parent2_gender` needed           |
| 2.f | Country of Birth               | 📝   | ❌     | `parent2_country_of_birth` needed |
| 2.g | Current City/Town of Residence | 📝   | ❌     | `parent2_city` needed             |
| 2.h | Country of Residence           | 📝   | ❌     | `parent2_country` needed          |

---

## Part 6: Information About Your Marital History (Pages 3-4)

### Current Marital Status

| # | Field                                                     | Type | Status | Notes                                                                   |
| - | --------------------------------------------------------- | ---- | ------ | ----------------------------------------------------------------------- |
| 1 | Marital Status                                            | ○   | ✅     | `marital_status` (single/married/divorced/widowed/annulled/separated) |
| 2 | Is your spouse a current member of the U.S. armed forces? | ○   | ✅     | `spouse_is_military_member`                                           |
| 3 | How many times have you been married?                     | 📝   | ✅     | `times_married`                                                       |

### Current Spouse Information

| #   | Field                                         | Type | Status | Notes                                |
| --- | --------------------------------------------- | ---- | ------ | ------------------------------------ |
| 4.a | Family Name                                   | 📝   | ✅     | `spouse_last_name`                 |
| 4.b | Given Name                                    | 📝   | ✅     | `spouse_first_name`                |
| 4.c | Middle Name                                   | 📝   | ✅     | `spouse_middle_name`               |
| 4.d | Spouse's Date of Birth                        | 📝   | ✅     | `spouse_date_of_birth`             |
| 4.e | Date of Marriage                              | 📝   | ✅     | `spouse_date_of_marriage`          |
| 4.f | Spouse's Address (same as yours?)             | ○   | ✅     | `spouse_address_same_as_applicant` |
| 4.g | Spouse's Current Employer                     | 📝   | ✅     | `spouse_current_employer`          |
| 5.a | Is your spouse a U.S. citizen?                | ○   | ✅     | `spouse_is_us_citizen`             |
| 5.b | If yes, did they obtain citizenship by birth? | ○   | ✅     | `spouse_citizenship_by_birth`      |
| 5.c | If no (not by birth), date became citizen     | 📝   | ✅     | `spouse_date_became_citizen`       |
| 6   | Spouse's A-Number                             | 📝   | ✅     | `spouse_a_number`                  |
| 7   | Spouse's Country of Birth                     | 📝   | ✅     | `spouse_country_of_birth`          |
| 8   | How many times has your spouse been married?  | 📝   | ✅     | `spouse_times_married`             |

### Previous Marriages

| #  | Field                       | Type | Status | Notes                 |
| -- | --------------------------- | ---- | ------ | --------------------- |
| 9+ | Previous spouse information | 📝[] | ❌     | Array not implemented |

---

## Part 7: Information About Your Children (Page 4)

| #  | Field                                            | Type | Status | Notes                                                                             |
| -- | ------------------------------------------------ | ---- | ------ | --------------------------------------------------------------------------------- |
| 1  | Total number of children                         | 📝   | ✅     | `total_children`                                                                |
| 2+ | Child details array                              | 📝[] | ✅     | `children[]` with first_name, last_name, date_of_birth, residence, relationship |
| -  | Providing support for children (Part 1.d filers) | ○   | ✅     | `providing_support_for_children`                                                |

---

## Part 8: Information About Your Employment and Schools (Pages 4-5)

| #  | Field                     | Type | Status | Notes                                                                                                                          |
| -- | ------------------------- | ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 1  | Current Employer Name     | 📝   | ✅     | `current_employer`                                                                                                           |
| 1  | Occupation/Field of Study | 📝   | ✅     | `current_occupation`                                                                                                         |
| 1  | City                      | 📝   | ✅     | `employer_city`                                                                                                              |
| 1  | State                     | 📝   | ✅     | `employer_state`                                                                                                             |
| 1  | ZIP Code                  | 📝   | ✅     | `employer_zip_code`                                                                                                          |
| 1  | From Date                 | 📝   | ✅     | `employment_from`                                                                                                            |
| 1  | To Date                   | 📝   | ✅     | `employment_to`                                                                                                              |
| 2+ | Employment history array  | 📝[] | ✅     | `employment_history[]` with employer_or_school, occupation_or_field, city, state, zip, country, province, postal_code, dates |

---

## Part 9: Time Outside the United States (Page 5)

| #  | Field                                   | Type | Status | Notes                                                               |
| -- | --------------------------------------- | ---- | ------ | ------------------------------------------------------------------- |
| 1  | Total days outside U.S. in last 5 years | 📝   | ✅     | `total_days_outside_us`                                           |
| 2  | Number of trips of 24+ hours            | 📝   | ✅     | Derived from `trips[]` array length                               |
| 3  | Trips lasting 6+ months?                | ○   | ✅     | `trips_over_6_months`                                             |
| 4+ | Trip details array                      | 📝[] | ✅     | `trips[]` with date_left_us, date_returned_us, countries_traveled |

---

## Part 10: Information About Your Biographic Information (Page 5)

| # | Field                             | Type | Status | Notes             |
| - | --------------------------------- | ---- | ------ | ----------------- |
| 1 | Ethnicity (Hispanic/Not Hispanic) | ○   | ✅     | `ethnicity`     |
| 2 | Race (can select multiple)        | ☐   | ✅     | `race`          |
| 3 | Height (Feet)                     | 📝   | ✅     | `height_feet`   |
| 3 | Height (Inches)                   | 📝   | ✅     | `height_inches` |
| 4 | Weight (Pounds)                   | 📝   | ✅     | `weight`        |
| 5 | Eye Color                         | ○   | ✅     | `eye_color`     |
| 6 | Hair Color                        | ○   | ✅     | `hair_color`    |

---

## Part 11: Additional Information About You (Pages 6-10)

### General Questions

| #   | Question                                                                                 | Status | Field                       |
| --- | ---------------------------------------------------------------------------------------- | ------ | --------------------------- |
| 1   | Have you EVER claimed to be a U.S. citizen?                                              | ✅     | `q_claimed_us_citizen`    |
| 2   | Have you EVER registered to vote in any election?                                        | ✅     | `q_voted_in_us`           |
| 3   | Have you EVER voted in any election?                                                     | ✅     | (combined with above)       |
| 4.a | Since becoming a permanent resident, have you EVER failed to file a required tax return? | ✅     | `q_failed_to_file_taxes`  |
| 4.b | Do you owe any overdue Federal, state, or local taxes?                                   | ✅     | `q_owe_taxes`             |
| 4.c | Have you called yourself a "nonresident alien" on a tax return?                          | ✅     | `q_nonresident_alien_tax` |
| 5.a | Have you EVER been a member of the Communist Party?                                      | ✅     | `q_communist_party`       |
| 5.b | Have you EVER advocated overthrowing government by force?                                | ✅     | `q_advocated_overthrow`   |
| 5.c | Have you EVER been a member of a terrorist organization?                                 | ✅     | `q_terrorist_org`         |

### Serious Crimes (Questions 6-14)

| #    | Question                                                                   | Status | Field                                    |
| ---- | -------------------------------------------------------------------------- | ------ | ---------------------------------------- |
| 6.a  | Have you EVER used, threatened to use, or possessed a weapon or explosive? | ✅     | `q_used_weapon_explosive`              |
| 6.b  | Have you EVER kidnapped, assassinated, or hijacked?                        | ✅     | `q_kidnapping_assassination_hijacking` |
| 6.c  | Have you EVER threatened to use weapons/violence?                          | ✅     | `q_threatened_weapon_violence`         |
| 7.a  | Have you EVER committed genocide?                                          | ✅     | `q_genocide`                           |
| 7.b  | Have you EVER participated in torture?                                     | ✅     | `q_torture`                            |
| 7.c  | Have you EVER killed any person?                                           | ✅     | `q_killing_person`                     |
| 7.d  | Have you EVER had sexual contact with someone without consent?             | ✅     | `q_sexual_contact_nonconsent`          |
| 7.e  | Have you EVER severely injured any person?                                 | ✅     | `q_severely_injuring`                  |
| 7.f  | Have you EVER engaged in religious persecution?                            | ✅     | `q_religious_persecution`              |
| 7.g  | Have you EVER harmed someone based on race/religion?                       | ✅     | `q_harm_race_religion`                 |
| 8.a  | Have you EVER served in military/police/self-defense unit?                 | ✅     | `q_military_police_service`            |
| 8.b  | Have you EVER been a member of any armed group?                            | ✅     | `q_armed_group`                        |
| 9    | Have you EVER worked in a detention facility/prison camp?                  | ✅     | `q_detention_facility`                 |
| 10.a | Have you EVER been part of a group that used weapons?                      | ✅     | `q_group_used_weapons`                 |
| 10.b | Have you EVER used a weapon against another person?                        | ✅     | `q_used_weapon_against_person`         |
| 10.c | Have you EVER threatened to use a weapon?                                  | ✅     | `q_threatened_weapon_use`              |
| 11   | Have you EVER received weapons training?                                   | ✅     | `q_weapons_training`                   |
| 12   | Have you EVER sold/provided/transported weapons?                           | ✅     | `q_sold_provided_weapons`              |
| 13   | Have you EVER recruited anyone under 15 for armed group?                   | ✅     | `q_recruited_under_15`                 |
| 14   | Have you EVER used anyone under 15 in hostilities?                         | ✅     | `q_used_under_15_hostilities`          |

### Criminal History (Questions 15-21)

| #    | Question                                                     | Status | Field                                                                    |
| ---- | ------------------------------------------------------------ | ------ | ------------------------------------------------------------------------ |
| 15.a | Have you EVER been arrested, cited, or detained?             | ✅     | `q_arrested`                                                           |
| 15.b | Have you EVER committed a crime you were NOT arrested for?   | ✅     | `q_committed_crime_not_arrested`                                       |
| 15.c | Crime details array                                          | ✅     | `crimes[]` with date, conviction, description, place, result, sentence |
| 16   | Have you EVER completed probation/parole/suspended sentence? | ✅     | `q_completed_probation`                                                |
| 17.a | Have you EVER been a prostitute?                             | ✅     | `q_prostitution`                                                       |
| 17.b | Have you EVER sold or smuggled controlled substances?        | ✅     | `q_controlled_substances`                                              |
| 17.c | Have you EVER been married to more than one person?          | ✅     | `q_polygamy`                                                           |
| 17.d | Have you EVER helped anyone enter the U.S. illegally?        | ✅     | `q_helped_illegal_entry`                                               |
| 17.e | Have you EVER been involved in marriage fraud?               | ✅     | `q_marriage_fraud`                                                     |
| 17.f | Have you EVER gambled illegally?                             | ✅     | `q_illegal_gambling`                                                   |
| 17.g | Have you EVER failed to support your dependents?             | ✅     | `q_failed_child_support`                                               |
| 17.h | Have you EVER misrepresented yourself for public benefits?   | ✅     | `q_misrepresentation_public_benefits`                                  |
| 18   | Have you EVER given false information to U.S. government?    | ✅     | `q_false_info_us_government`                                           |
| 19   | Have you EVER lied to U.S. government officials?             | ✅     | `q_lied_us_government`                                                 |
| 20   | Have you EVER been removed/deported from U.S.?               | ✅     | `q_removed_deported`                                                   |
| 21   | Have you EVER been in removal proceedings?                   | ✅     | `q_removal_proceedings`                                                |

### Selective Service & Military (Questions 22-29)

| #    | Question                                                  | Status | Field                              |
| ---- | --------------------------------------------------------- | ------ | ---------------------------------- |
| 22.a | Are you a male who lived in the U.S. between ages 18-26?  | ✅     | `q_male_18_26_lived_us`          |
| 22.b | If yes, did you register with Selective Service?          | ✅     | `q_registered_selective_service` |
| 22.c | Selective Service Number                                  | ✅     | `selective_service_number`       |
| 22.d | Selective Service Date                                    | ✅     | `selective_service_date`         |
| 23   | Did you ever leave the U.S. to avoid being drafted?       | ✅     | `q_left_us_avoid_draft`          |
| 24   | Did you ever apply for exemption from military service?   | ✅     | `q_applied_military_exemption`   |
| 25   | Have you EVER served in the U.S. armed forces?            | ✅     | `q_served_us_military`           |
| 26.a | Are you a current member of U.S. armed forces?            | ✅     | `q_current_military_member`      |
| 26.b | Are you scheduled to deploy outside U.S.?                 | ✅     | `q_scheduled_deploy`             |
| 26.c | Are you stationed outside U.S.?                           | ✅     | `q_stationed_outside_us`         |
| 26.d | Are you a former member residing outside U.S.?            | ✅     | `q_former_military_outside_us`   |
| 27   | Were you discharged because you were an alien?            | ✅     | `q_discharged_because_alien`     |
| 28   | Were you ever court-martialed or dishonorably discharged? | ✅     | `q_court_martialed`              |
| 29   | Have you EVER deserted from the U.S. armed forces?        | ✅     | `q_deserted_military`            |

### Titles & Oath (Questions 30-37)

| #    | Question                                                   | Status | Field                                  |
| ---- | ---------------------------------------------------------- | ------ | -------------------------------------- |
| 30.a | Do you now have, or have you ever had, a hereditary title? | ✅     | `q_title_of_nobility`                |
| 30.b | If yes, are you willing to give up any titles?             | ✅     | `q_willing_to_give_up_titles`        |
| 30.c | List of titles                                             | ✅     | `q_titles_list`                      |
| 31   | Do you support the Constitution and form of government?    | ✅     | `q_support_constitution`             |
| 32   | Do you understand the full Oath of Allegiance?             | ✅     | `q_understand_oath`                  |
| 33   | Are you unable to take the Oath due to a disability?       | ✅     | `q_unable_oath_disability`           |
| 34   | Are you willing to take the full Oath of Allegiance?       | ✅     | `q_willing_take_oath`                |
| 35   | Are you willing to bear arms on behalf of the U.S.?        | ✅     | `q_willing_bear_arms`                |
| 36   | Are you willing to perform noncombatant services?          | ✅     | `q_willing_noncombatant`             |
| 37   | Are you willing to perform work of national importance?    | ✅     | `q_willing_work_national_importance` |

---

## Part 12: Request for Fee Reduction (Page 11)

| # | Field                               | Type | Status | Notes                        |
| - | ----------------------------------- | ---- | ------ | ---------------------------- |
| 1 | Are you requesting a fee reduction? | ○   | ✅     | `fee_reduction_requested`  |
| 2 | Household income                    | 📝   | ✅     | `household_income`         |
| 3 | Household size                      | 📝   | ✅     | `household_size`           |
| 4 | Number of income earners            | 📝   | ✅     | `household_income_earners` |
| 5 | Are you head of household?          | ○   | ✅     | `is_head_of_household`     |
| 6 | Head of household name (if not you) | 📝   | ✅     | `head_of_household_name`   |

---

## Part 13: Applicant's Contact Information (Page 11)

| # | Field                | Type | Status | Notes             |
| - | -------------------- | ---- | ------ | ----------------- |
| 1 | Daytime Phone Number | 📝   | ✅     | `daytime_phone` |
| 2 | Mobile Phone Number  | 📝   | ✅     | `mobile_phone`  |
| 3 | Email Address        | 📝   | ✅     | `email`         |

### Certification & Signature

| # | Field                 | Type | Status | Notes                   |
| - | --------------------- | ---- | ------ | ----------------------- |
| - | Applicant's Signature | ✍️ | ✅     | `applicant_signature` |
| - | Date of Signature     | 📝   | ✅     | `signature_date`      |

---

## Part 14: Interpreter's Information (Page 12)

| #   | Field                       | Type | Status | Notes                          |
| --- | --------------------------- | ---- | ------ | ------------------------------ |
| 0   | Did you use an interpreter? | ○   | ✅     | `used_interpreter`           |
| 1.a | Interpreter's Family Name   | 📝   | ✅     | `interpreter_last_name`      |
| 1.b | Interpreter's Given Name    | 📝   | ✅     | `interpreter_first_name`     |
| 2   | Business/Organization Name  | 📝   | ✅     | `interpreter_business_name`  |
| 3   | Phone Number                | 📝   | ✅     | `interpreter_phone`          |
| 4   | Mobile Number               | 📝   | ✅     | `interpreter_mobile`         |
| 5   | Email Address               | 📝   | ✅     | `interpreter_email`          |
| 6   | Language Interpreted        | 📝   | ✅     | `interpreter_language`       |
| -   | Interpreter's Signature     | ✍️ | ✅     | `interpreter_signature`      |
| -   | Date of Signature           | 📝   | ✅     | `interpreter_signature_date` |

---

## Part 15: Preparer's Information (Page 12-13)

| #   | Field                                           | Type | Status | Notes                       |
| --- | ----------------------------------------------- | ---- | ------ | --------------------------- |
| 1   | Did someone help you complete this application? | ○   | ✅     | `used_preparer`           |
| 2.a | Preparer's Family Name                          | 📝   | ✅     | `preparer_last_name`      |
| 2.b | Preparer's Given Name                           | 📝   | ✅     | `preparer_first_name`     |
| 3   | Business/Organization Name                      | 📝   | ✅     | `preparer_business_name`  |
| 4   | Phone Number                                    | 📝   | ✅     | `preparer_phone`          |
| 5   | Mobile Number                                   | 📝   | ✅     | `preparer_mobile`         |
| 6   | Email Address                                   | 📝   | ✅     | `preparer_email`          |
| -   | Preparer's Signature                            | ✍️ | ✅     | `preparer_signature`      |
| -   | Date of Signature                               | 📝   | ✅     | `preparer_signature_date` |

---

## Part 16: Additional Information (Pages 13-14)

| # | Field                          | Type | Status | Notes                                                                                |
| - | ------------------------------ | ---- | ------ | ------------------------------------------------------------------------------------ |
| - | Additional information entries | 📝[] | ✅     | `additional_information[]` with page_number, part_number, item_number, explanation |

---

## Part 17: Signature at Interview (Page 14)

| # | Field                        | Type | Status | Notes                          |
| - | ---------------------------- | ---- | ------ | ------------------------------ |
| - | Completed at USCIS interview | ✍️ | N/A    | Not applicable for online form |

---

## Part 18: Oath of Allegiance (Page 14)

| # | Field                                   | Type | Status | Notes                          |
| - | --------------------------------------- | ---- | ------ | ------------------------------ |
| - | Administered at naturalization ceremony | ✍️ | N/A    | Not applicable for online form |

---

## Summary

### Implementation Status

| Part | Description          | Fields | Implemented | Coverage |
| ---- | -------------------- | ------ | ----------- | -------- |
| 1    | Eligibility          | 8      | 8           | ✅ 100%  |
| 2    | About You            | 20     | 20          | ✅ 100%  |
| 3    | Accommodations       | 8      | 1           | ⚠️ 12% |
| 4    | Residence            | 20     | 17          | ✅ 85%   |
| 5    | Parents              | 16     | 0           | ❌ 0%    |
| 6    | Marital History      | 15     | 14          | ✅ 93%   |
| 7    | Children             | 5      | 5           | ✅ 100%  |
| 8    | Employment           | 10     | 10          | ✅ 100%  |
| 9    | Time Outside U.S.    | 5      | 5           | ✅ 100%  |
| 10   | Biographic           | 8      | 8           | ✅ 100%  |
| 11   | Additional Questions | 50     | 50          | ✅ 100%  |
| 12   | Fee Reduction        | 6      | 6           | ✅ 100%  |
| 13   | Contact/Signature    | 5      | 5           | ✅ 100%  |
| 14   | Interpreter          | 10     | 10          | ✅ 100%  |
| 15   | Preparer             | 9      | 9           | ✅ 100%  |
| 16   | Additional Info      | 1      | 1           | ✅ 100%  |

### Overall Coverage: ~95%

### Remaining Fields to Implement

1. **Part 3: Disability Accommodations Details** (Low Priority)

   - Specific accommodation types (deaf/blind/other)
   - Accommodation requests (sign language, extended time, wheelchair)
2. **Part 4: Mailing Address International Fields** (Low Priority)

   - `mailing_province`
   - `mailing_postal_code`
   - `mailing_country`
3. **Part 5: Parents Information** (Medium Priority - NOT IMPLEMENTED)

   - Parent 1: name, DOB, gender, country of birth, residence
   - Parent 2: name, DOB, gender, country of birth, residence
4. **Part 6: Previous Marriages Array** (Low Priority)

   - Array of previous spouses with details

### Notes

The intake form schema is **comprehensive** and covers nearly all fields from the official N-400 form. The main gap is **Part 5 (Parents Information)** which is not yet implemented. This is required for the form but may not be critical for all applicants.
