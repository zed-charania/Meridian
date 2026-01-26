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

### Missing Questions (Items 1-37):
1. **Item 4** - Tax return questions (partially implemented)
   - `q_failed_to_file_taxes` - ✅ Exists
   - `q_owe_taxes` - ✅ Exists
   - Missing: "Since you became a lawful permanent resident, have you called yourself a 'nonresident alien' on a Federal, state, or local tax return or decided not to file a tax return because you considered yourself to be a nonresident?"

2. **Item 5.a** - Communist/totalitarian party membership
   - `q_communist_party` - ✅ Exists but needs to match exact wording

3. **Item 5.b** - Advocacy questions
   - Missing: Questions about advocating overthrow of government, world communism, totalitarian dictatorship, etc.

4. **Item 6.a-6.c** - Weapon/explosive use, kidnapping, assassination, hijacking, threats
   - Missing: All three sub-items

5. **Item 7.a-7.g** - Torture, genocide, killing, sexual contact, injury, religious persecution
   - `q_genocide` - ✅ Exists
   - `q_torture` - ✅ Exists
   - Missing: 7.c (killing), 7.d (sexual contact), 7.e (injury), 7.f (religious persecution), 7.g (harm based on race/religion)

6. **Item 8.a-8.b** - Military/police service, armed groups
   - Missing: Both questions

7. **Item 9** - Worked in detention facilities
   - Missing

8. **Item 10.a-10.c** - Groups using weapons
   - Missing: All three sub-items

9. **Item 11** - Weapons training
   - Missing

10. **Item 12** - Sold/provided/transported weapons
    - Missing

11. **Item 13** - Recruited/enlisted person under 15 for armed group
    - Missing

12. **Item 14** - Used person under 15 in hostilities
    - Missing

13. **Item 15.a-15.b** - Crimes and offenses (detailed table)
    - `q_arrested` - ✅ Exists but needs expansion
    - Missing: Detailed crime table with: date of crime, date of conviction, crime description, place, result/disposition, sentence
    - Missing: "Have you EVER committed, agreed to commit, asked someone else to commit, helped commit, or tried to commit a crime or offense for which you were NOT arrested?"

14. **Item 16** - Completed suspended sentence/probation/parole
    - Missing

15. **Item 17.a-17.h** - Various moral character questions
    - `q_prostitution` - ✅ Exists (17.a)
    - `q_illegal_gambling` - ✅ Exists (17.f)
    - `q_failed_child_support` - ✅ Exists (17.g)
    - Missing: 17.b (controlled substances), 17.c (marriage fraud), 17.d (polygamy), 17.e (helped illegal entry), 17.h (misrepresentation for public benefits)

16. **Item 18** - False/fraudulent information to U.S. Government
    - Missing

17. **Item 19** - Lied to U.S. Government officials
    - Missing

18. **Item 20** - Removed/deported from United States
    - Missing

19. **Item 21** - Placed in removal/rescission/deportation proceedings
    - Missing

20. **Item 22.a-22.c** - Selective Service Registration
    - Missing: All three items (male 18-26, registration status, registration number and date)

21. **Item 23** - Left U.S. to avoid draft
    - Missing

22. **Item 24** - Applied for military service exemption
    - Missing

23. **Item 25** - Served in U.S. armed forces
    - `q_served_us_military` - ✅ Exists

24. **Item 26.a-26.d** - Current/former military service details
    - Missing: All four sub-items (current member, scheduled to deploy, stationed outside U.S., former member residing outside U.S.)

25. **Item 27** - Discharged from training/service because alien
    - Missing

26. **Item 28** - Court-martialed or dishonorable discharge
    - Missing

27. **Item 29** - Deserted from U.S. armed forces
    - `q_deserted_military` - ✅ Exists

28. **Item 30.a-30.b** - Title of nobility
    - `q_title_of_nobility` - ✅ Exists (30.a)
    - Missing: 30.b (willing to give up titles)

29. **Item 31** - Support Constitution and form of Government
    - Missing

30. **Item 32** - Understand full Oath of Allegiance
    - Missing

31. **Item 33** - Unable to take Oath due to disability
    - Missing

32. **Item 34** - Willing to take full Oath of Allegiance
    - Missing

33. **Item 35** - Willing to bear arms
    - Missing

34. **Item 36** - Willing to perform noncombatant services
    - Missing

35. **Item 37** - Willing to perform work of national importance
    - Missing

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

- **Part 1**: 3 missing fields/options
- **Part 2**: 6 missing fields
- **Part 4**: 5+ missing fields (address arrays)
- **Part 5**: 4 missing fields
- **Part 6**: 2+ missing fields (children array)
- **Part 7**: 1+ missing fields (employment array)
- **Part 8**: 1+ missing fields (trips array)
- **Part 9**: ~50+ missing questions
- **Part 10**: Entire section missing (6 fields)
- **Part 11**: 2 missing fields (signature)
- **Part 12**: Entire section missing (9 fields)
- **Part 13**: Entire section missing (8 fields)
- **Part 14**: Missing (free text field)

**Total**: Approximately **90+ missing fields** across all parts of the form.

