#!/usr/bin/env python3
"""
Comprehensive N-400 PDF Test
Tests ALL fields from the intake form schema.

Run with: python3 test_comprehensive.py
"""

from app import map_form_data_to_pdf_fields, fill_pdf
from pypdf import PdfReader
import os
import json

# ═══════════════════════════════════════════════════════════════
# COMPREHENSIVE TEST DATA - ALL INTAKE FORM FIELDS
# ═══════════════════════════════════════════════════════════════

COMPREHENSIVE_TEST_DATA = {
    # ═══════════════════════════════════════════════════════════════
    # PART 1: ELIGIBILITY
    # ═══════════════════════════════════════════════════════════════
    "eligibility_basis": "5year",
    "other_basis_reason": "",
    "uscis_field_office": "",

    # ═══════════════════════════════════════════════════════════════
    # PART 2: INFORMATION ABOUT YOU
    # ═══════════════════════════════════════════════════════════════
    # Current Legal Name
    "first_name": "Maria",
    "middle_name": "Elena",
    "last_name": "Rodriguez",
    
    # Name Change
    "wants_name_change": "no",
    "new_name_first": "",
    "new_name_middle": "",
    "new_name_last": "",
    
    # Other Names
    "has_used_other_names": "yes",
    "other_names": [
        {"family_name": "Garcia", "given_name": "Maria", "middle_name": "E"}
    ],
    
    # Personal Information
    "date_of_birth": "1985-03-15",
    "country_of_birth": "Mexico",
    "country_of_citizenship": "Mexico",
    "gender": "female",
    
    # Parent Citizenship
    "parent_us_citizen_before_18": "no",
    
    # Identification Numbers
    "a_number": "123456789",
    "uscis_account_number": "USC9876543210",
    "ssn": "123-45-6789",
    
    # Social Security Update
    "ssa_wants_card": "no",
    "ssa_consent_disclosure": "yes",
    
    # Green Card Information
    "date_became_permanent_resident": "2019-06-20",
    
    # Disability Accommodations
    "request_disability_accommodations": "no",

    # ═══════════════════════════════════════════════════════════════
    # PART 4: CONTACT INFORMATION
    # ═══════════════════════════════════════════════════════════════
    "daytime_phone": "555-123-4567",
    "mobile_phone": "555-987-6543",
    "email": "maria.rodriguez@email.com",

    # ═══════════════════════════════════════════════════════════════
    # PART 5: RESIDENCE INFORMATION
    # ═══════════════════════════════════════════════════════════════
    "street_address": "1234 Sunset Boulevard",
    "apt_ste_flr": "Apt 5B",
    "city": "Los Angeles",
    "state": "CA",
    "zip_code": "90028",
    "residence_from": "06/20/2019",
    "residence_to": "Present",
    
    # Mailing Address
    "mailing_same_as_residence": "yes",
    "mailing_street_address": "",
    "mailing_apt_ste_flr": "",
    "mailing_in_care_of": "",
    "mailing_city": "",
    "mailing_state": "",
    "mailing_zip_code": "",

    # ═══════════════════════════════════════════════════════════════
    # PART 7: BIOGRAPHIC INFORMATION
    # ═══════════════════════════════════════════════════════════════
    "ethnicity": "hispanic",
    "race": "white",
    "height_feet": "5",
    "height_inches": "6",
    "weight": "145",
    "eye_color": "brown",
    "hair_color": "black",

    # ═══════════════════════════════════════════════════════════════
    # PART 8: EMPLOYMENT
    # ═══════════════════════════════════════════════════════════════
    "current_employer": "Tech Solutions Inc.",
    "current_occupation": "Software Engineer",
    "employer_city": "Los Angeles",
    "employer_state": "CA",
    "employer_zip_code": "90001",
    "employment_from": "01/15/2020",
    "employment_to": "Present",

    # ═══════════════════════════════════════════════════════════════
    # PART 9: TIME OUTSIDE US
    # ═══════════════════════════════════════════════════════════════
    "total_days_outside_us": "45",
    "trips_over_6_months": "no",
    "trips": [
        {
            "date_left_us": "12/20/2023",
            "date_returned_us": "01/05/2024",
            "countries_traveled": "Mexico"
        },
        {
            "date_left_us": "07/01/2022",
            "date_returned_us": "07/15/2022",
            "countries_traveled": "Canada"
        }
    ],

    # ═══════════════════════════════════════════════════════════════
    # PART 10: MARITAL HISTORY
    # ═══════════════════════════════════════════════════════════════
    "marital_status": "married",
    "times_married": "1",
    "spouse_is_military_member": "no",
    "spouse_first_name": "Carlos",
    "spouse_middle_name": "Antonio",
    "spouse_last_name": "Rodriguez",
    "spouse_date_of_birth": "1983-07-22",
    "spouse_date_of_marriage": "2010-09-15",
    "spouse_is_us_citizen": "yes",
    "spouse_citizenship_by_birth": "no",
    "spouse_date_became_citizen": "2015-05-10",
    "spouse_address_same_as_applicant": "yes",
    "spouse_a_number": "987654321",
    "spouse_times_married": "1",
    "spouse_country_of_birth": "Mexico",
    "spouse_current_employer": "City Hospital",

    # ═══════════════════════════════════════════════════════════════
    # PART 11: CHILDREN
    # ═══════════════════════════════════════════════════════════════
    "total_children": "2",
    "children": [
        {
            "first_name": "Sofia",
            "last_name": "Rodriguez",
            "date_of_birth": "2012-04-18",
            "residence": "resides_with_me",
            "relationship": "biological_daughter"
        },
        {
            "first_name": "Miguel",
            "last_name": "Rodriguez",
            "date_of_birth": "2015-08-25",
            "residence": "resides_with_me",
            "relationship": "biological_son"
        }
    ],
    "providing_support_for_children": "yes",

    # ═══════════════════════════════════════════════════════════════
    # PART 12: ADDITIONAL QUESTIONS - All answered "no" for clean test
    # ═══════════════════════════════════════════════════════════════
    # General Eligibility
    "q_claimed_us_citizen": "no",
    "q_voted_in_us": "no",
    "q_failed_to_file_taxes": "no",
    "q_nonresident_alien_tax": "no",
    "q_owe_taxes": "no",
    "q_title_of_nobility": "no",
    "q_willing_to_give_up_titles": "",
    
    # Affiliations
    "q_communist_party": "no",
    "q_advocated_overthrow": "no",
    "q_terrorist_org": "no",
    "q_genocide": "no",
    "q_torture": "no",
    "q_killing_person": "no",
    "q_sexual_contact_nonconsent": "no",
    "q_severely_injuring": "no",
    "q_religious_persecution": "no",
    "q_harm_race_religion": "no",
    
    # Weapons and Violence
    "q_used_weapon_explosive": "no",
    "q_kidnapping_assassination_hijacking": "no",
    "q_threatened_weapon_violence": "no",
    
    # Military/Police Service
    "q_military_police_service": "no",
    "q_armed_group": "no",
    "q_detention_facility": "no",
    "q_group_used_weapons": "no",
    "q_used_weapon_against_person": "no",
    "q_threatened_weapon_use": "no",
    "q_weapons_training": "no",
    "q_sold_provided_weapons": "no",
    "q_recruited_under_15": "no",
    "q_used_under_15_hostilities": "no",
    
    # Crimes and Offenses
    "q_arrested": "no",
    "q_committed_crime_not_arrested": "no",
    "q_completed_probation": "no",
    
    # Moral Character
    "q_habitual_drunkard": "no",
    "q_prostitution": "no",
    "q_controlled_substances": "no",
    "q_marriage_fraud": "no",
    "q_polygamy": "no",
    "q_helped_illegal_entry": "no",
    "q_illegal_gambling": "no",
    "q_failed_child_support": "no",
    "q_misrepresentation_public_benefits": "no",
    
    # Immigration Violations
    "q_false_info_us_government": "no",
    "q_lied_us_government": "no",
    "q_removed_deported": "no",
    "q_removal_proceedings": "no",
    
    # Selective Service (male applicant would have "yes")
    "q_male_18_26_lived_us": "no",  # Female applicant
    "q_registered_selective_service": "",
    "selective_service_number": "",
    "selective_service_date": "",
    
    # Military Service
    "q_left_us_avoid_draft": "no",
    "q_applied_military_exemption": "no",
    "q_served_us_military": "no",
    "q_current_military_member": "no",
    "q_scheduled_deploy": "no",
    "q_stationed_outside_us": "no",
    "q_former_military_outside_us": "no",
    "q_discharged_because_alien": "no",
    "q_court_martialed": "no",
    "q_deserted_military": "no",
    
    # Oath of Allegiance - All "yes"
    "q_support_constitution": "yes",
    "q_understand_oath": "yes",
    "q_unable_oath_disability": "no",
    "q_willing_take_oath": "yes",
    "q_willing_bear_arms": "yes",
    "q_willing_noncombatant": "yes",
    "q_willing_work_national_importance": "yes",

    # ═══════════════════════════════════════════════════════════════
    # FEE REDUCTION
    # ═══════════════════════════════════════════════════════════════
    "fee_reduction_requested": "no",
    "household_income": "",
    "household_size": "",
    "household_income_earners": "",
    "is_head_of_household": "",
    "head_of_household_name": "",

    # ═══════════════════════════════════════════════════════════════
    # APPLICANT SIGNATURE
    # ═══════════════════════════════════════════════════════════════
    "applicant_signature": "Maria Elena Rodriguez",
    "signature_date": "01/27/2026",

    # ═══════════════════════════════════════════════════════════════
    # INTERPRETER (not used)
    # ═══════════════════════════════════════════════════════════════
    "used_interpreter": "no",
    "interpreter_first_name": "",
    "interpreter_last_name": "",
    "interpreter_business_name": "",
    "interpreter_phone": "",
    "interpreter_mobile": "",
    "interpreter_email": "",
    "interpreter_language": "",
    "interpreter_signature": "",
    "interpreter_signature_date": "",

    # ═══════════════════════════════════════════════════════════════
    # PREPARER (not used - self-prepared)
    # ═══════════════════════════════════════════════════════════════
    "used_preparer": "no",
    "preparer_first_name": "",
    "preparer_last_name": "",
    "preparer_business_name": "",
    "preparer_phone": "",
    "preparer_mobile": "",
    "preparer_email": "",
    "preparer_signature": "",
    "preparer_signature_date": "",
}


def run_comprehensive_test():
    """Run comprehensive PDF generation test."""
    print("=" * 70)
    print("COMPREHENSIVE N-400 PDF GENERATION TEST")
    print("=" * 70)
    
    # Count input fields
    field_count = sum(1 for v in COMPREHENSIVE_TEST_DATA.values() 
                     if v and not isinstance(v, list))
    array_count = sum(1 for v in COMPREHENSIVE_TEST_DATA.values() 
                     if isinstance(v, list) and v)
    
    print(f"\n📋 Input Data:")
    print(f"   - Scalar fields: {field_count}")
    print(f"   - Array fields: {array_count}")
    
    # Map to PDF fields
    pdf_fields = map_form_data_to_pdf_fields(COMPREHENSIVE_TEST_DATA)
    print(f"\n📄 PDF Field Mappings: {len(pdf_fields)} fields")
    
    # Verify against actual PDF
    template_path = "templates/n-400.pdf"
    reader = PdfReader(template_path)
    reader.decrypt('')
    actual_pdf_fields = set(reader.get_fields().keys())
    
    matched = []
    unmatched = []
    
    for field_name, value in pdf_fields.items():
        if field_name in actual_pdf_fields:
            matched.append((field_name, value))
        else:
            unmatched.append((field_name, value))
    
    print(f"\n✓ Matched fields: {len(matched)}/{len(pdf_fields)}")
    if unmatched:
        print(f"✗ Unmatched fields: {len(unmatched)}")
        for f, v in unmatched[:10]:
            print(f"   - {f.split('.')[-1]}")
    
    # Show filled fields by section
    print("\n" + "-" * 70)
    print("FIELDS BEING FILLED:")
    print("-" * 70)
    
    sections = {
        "Part 1 - Eligibility": [],
        "Part 2 - Personal Info": [],
        "Part 4 - Contact": [],
        "Part 5 - Residence": [],
        "Part 7 - Biographic": [],
        "Part 8 - Employment": [],
        "Part 10 - Marital": [],
        "Part 11 - Children": [],
        "Part 12 - Contact Info": [],
    }
    
    for field_name, value in sorted(matched):
        short = field_name.split('.')[-1]
        val_display = str(value)[:25] + "..." if len(str(value)) > 25 else str(value)
        
        if "Part1" in field_name or "Eligibility" in field_name:
            sections["Part 1 - Eligibility"].append(f"{short} = {val_display}")
        elif "P2_" in field_name or "Line1_Alien" in field_name or "SSN" in field_name:
            sections["Part 2 - Personal Info"].append(f"{short} = {val_display}")
        elif "P4_" in field_name:
            sections["Part 5 - Residence"].append(f"{short} = {val_display}")
        elif "P7_" in field_name and "Employer" not in field_name:
            sections["Part 7 - Biographic"].append(f"{short} = {val_display}")
        elif "P7_" in field_name or "Employer" in field_name or "Occupation" in field_name:
            sections["Part 8 - Employment"].append(f"{short} = {val_display}")
        elif "P10_" in field_name or "Married" in field_name or "P5_" in field_name:
            sections["Part 10 - Marital"].append(f"{short} = {val_display}")
        elif "P11_" in field_name or "Children" in field_name:
            sections["Part 11 - Children"].append(f"{short} = {val_display}")
        elif "P12_" in field_name or "Phone" in field_name or "Email" in field_name:
            sections["Part 12 - Contact Info"].append(f"{short} = {val_display}")
    
    for section, fields in sections.items():
        if fields:
            print(f"\n{section}:")
            for f in fields:
                print(f"  • {f}")
    
    # Generate PDF
    print("\n" + "-" * 70)
    print("GENERATING PDF...")
    print("-" * 70)
    
    pdf_bytes = fill_pdf(template_path, pdf_fields)
    
    # Save to test-output folder
    os.makedirs("test-output", exist_ok=True)
    output_path = "test-output/N-400_COMPREHENSIVE_ALL_FIELDS.pdf"
    
    with open(output_path, 'wb') as f:
        f.write(pdf_bytes)
    
    print(f"\n✅ PDF saved to: {output_path}")
    print(f"   File size: {len(pdf_bytes) / 1024:.1f} KB")
    
    # Also save the test data as JSON for reference
    json_path = "test-output/test_data.json"
    with open(json_path, 'w') as f:
        json.dump(COMPREHENSIVE_TEST_DATA, f, indent=2)
    print(f"   Test data: {json_path}")
    
    print("\n" + "=" * 70)
    print("TEST COMPLETE - Open the PDF to verify all fields!")
    print("=" * 70)


if __name__ == "__main__":
    run_comprehensive_test()
