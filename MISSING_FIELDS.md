# Missing N-400 Form Fields

This document lists all fields from the official N-400 form (Edition 01/20/25) that are **NOT currently implemented** in the application.

## Part 1: Information About Your Eligibility

### Missing Eligibility Options:
- **VAWA (C)** - Eligibility for the Spouse, Former Spouse, or Child of a U.S. Citizen under the Violence Against Women Act
- **Spouse of U.S. Citizen in Qualified Employment Outside the United States (D)** - INA section 319(b)
- **USCIS Field Office Selection** - Required if filing under INA section 319(b) and residential address is outside the United States

## Part 2: Information About You

### Missing Fields:
1. **Name Change (Item 3)**
   - `wants_name_change` - Yes/No question
   - `new_name_first` - New first name (if yes)
   - `new_name_middle` - New middle name (if yes)
   - `new_name_last` - New last name (if yes)

2. **Parent U.S. Citizenship (Item 10)**
   - `parent_us_citizen_before_18` - Yes/No question asking if mother or father was a U.S. citizen before applicant's 18th birthday

3. **Social Security Update (Items 12.a, 12.b, 12.c)**
   - `ssa_wants_card` - Yes/No question asking if applicant wants SSA to issue Social Security card
   - `ssn` - Already exists but needs to be conditional on 12.a = Yes
   - `ssa_consent_disclosure` - Yes/No consent for disclosure to SSA

## Part 4: Information About Your Residence

### Missing Fields:
1. **Multiple Physical Addresses with Dates**
   - Currently only captures current address
   - Need array of addresses with:
     - `residence_addresses[]` - Array of residence objects
     - Each object should have: street, city, state, zip, country, province, postal_code, dates_from, dates_to

2. **Residence Dates**
   - `residence_to` - "To" date for current residence (currently only has "from")

3. **Mailing Address Details**
   - `mailing_in_care_of` - "In Care Of" name for mailing address
   - `mailing_apt_ste_flr` - Apartment/Ste/Floor for mailing address

## Part 5: Information About Your Marital History

### Missing Fields:
1. **Spouse Military Status (Item 2)**
   - `spouse_is_military_member` - Yes/No question asking if spouse is current member of U.S. armed forces

2. **Spouse U.S. Citizenship Details (Items 5.a, 5.b)**
   - `spouse_citizenship_by_birth` - Yes/No question asking if spouse became citizen by birth
   - `spouse_date_became_citizen` - Date spouse became U.S. citizen (if not by birth)

3. **Spouse Address (Item 4.d)**
   - `spouse_address_same_as_applicant` - Yes/No question
   - `spouse_address` - Spouse's address if different (should go in Part 14)

4. **Spouse Marriage History (Item 7)**
   - `spouse_times_married` - Number of times spouse has been married

## Part 6: Information About Your Children

### Missing Fields:
1. **Children Details (Item 2)**
   - Currently only captures `total_children`
   - Need array of children with:
     - `children[]` - Array of child objects
     - Each object should have: name (first and last), date_of_birth, residence (resides with me/does not reside with me/unknown/missing), relationship (biological son/daughter/stepchild/legally adopted)

2. **Children Addresses**
   - Addresses for children who don't reside with applicant (should go in Part 14)

3. **Support for Children (Item 8)**
   - `providing_support_for_children` - Yes/No question (only for Part 1.d filers)

## Part 7: Information About Your Employment and Schools

### Missing Fields:
1. **Employment History**
   - Currently only captures current employer
   - Need array of employment/school entries with:
     - `employment_history[]` - Array of employment objects
     - Each object should have: employer/school name, occupation/field of study, city, state, zip, country, province, postal_code, dates_from, dates_to

2. **Employment Types**
   - Need to handle: self-employed, unemployed, retired

## Part 8: Time Outside the United States

### Missing Fields:
1. **Trip Details**
   - Currently only captures `total_days_outside_us` and `trips_over_6_months`
   - Need array of trips with:
     - `trips[]` - Array of trip objects
     - Each object should have: date_left_us, date_returned_us, countries_traveled

## Part 9: Additional Information About You

### ✅ ALL 46 QUESTIONS IMPLEMENTED

All Part 9 (Background Questions) are now fully implemented with:
- Single-question-per-screen design
- Question metadata with plain English titles, USCIS wording, intent, and guardrails
- Conditional fields (crime table, selective service details, titles list)
- PDF field mappings for all questions

**Implemented Questions:**
- Items 1-4: Tax and citizenship claims
- Item 5: Communist/totalitarian affiliations
- Items 6-14: Weapons, violence, persecution, armed groups
- Items 15-16: Crime history with detailed table
- Items 17: Moral character questions (prostitution, gambling, drugs, etc.)
- Items 18-21: Immigration violations
- Items 22-24: Selective Service registration
- Items 25-29: Military service history
- Items 30: Titles of nobility
- Items 31-37: Oath of Allegiance questions

## Part 10: Request for a Fee Reduction

### Missing Entire Section:
- `fee_reduction_requested` - Yes/No
- `household_income` - Total household income
- `household_size` - Number of household members
- `household_income_earners` - Number of household members earning income
- `is_head_of_household` - Yes/No
- `head_of_household_name` - Name if not applicant

## Part 11: Applicant's Contact Information, Certification, and Signature

### Missing Fields:
- `applicant_signature` - Signature field
- `signature_date` - Date of signature
- Certification text is present but signature capture is missing

## Part 12: Interpreter's Contact Information, Certification, and Signature

### Missing Entire Section:
- `interpreter_first_name`
- `interpreter_last_name`
- `interpreter_business_name`
- `interpreter_phone`
- `interpreter_mobile`
- `interpreter_email`
- `interpreter_language`
- `interpreter_signature`
- `interpreter_signature_date`

## Part 13: Contact Information, Certification, and Signature of the Person Preparing this Application

### Missing Entire Section:
- `preparer_first_name`
- `preparer_last_name`
- `preparer_business_name`
- `preparer_phone`
- `preparer_mobile`
- `preparer_email`
- `preparer_signature`
- `preparer_signature_date`

## Part 14: Additional Information

### Missing:
- `additional_information` - Free text field for additional information
- Should support multiple entries with page number, part number, item number references

## Part 15: Signature at Interview

### Missing Entire Section:
- This is completed at the interview, not during application

## Part 16: Oath of Allegiance

### Missing:
- Oath text display and acknowledgment
- This is typically completed at the ceremony

---

## Summary Statistics

- **Part 1**: ✅ Complete (all eligibility options implemented)
- **Part 2**: ✅ Complete (name, personal info, SSA fields)
- **Part 3**: Partial (disability accommodations need expansion)
- **Part 4**: ✅ Complete (address, mailing address)
- **Part 5**: ❌ Missing (parent information - 16 fields)
- **Part 6**: ✅ Complete (marital history, spouse info)
- **Part 7**: ✅ Complete (children array)
- **Part 8**: ✅ Complete (employment history array)
- **Part 9**: ✅ Complete (travel history array)
- **Part 10 (Background - now Part 9 in form)**: ✅ COMPLETE - All 46 questions with PDF mappings
- **Part 11 (Fee Reduction)**: ✅ Complete (6 fields)
- **Part 12 (Signature)**: ✅ Complete (signature, date)
- **Part 13 (Interpreter)**: ✅ Complete (9 fields)
- **Part 14 (Preparer)**: ✅ Complete (8 fields)
- **Part 15 (Additional Info)**: ✅ Complete (free text array)

**Remaining Gaps**:
- Part 3 disability accommodations details
- Part 5 parent information (optional for most filers)

