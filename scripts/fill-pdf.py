#!/usr/bin/env python3
"""
N-400 PDF Form Filler
Uses pypdf to fill the N-400 form with sample data.

Run with: python3 scripts/fill-pdf.py
"""

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, BooleanObject
import os
import sys
import json

# Sample test data
SAMPLE_DATA = {
    # Part 1 - Eligibility
    "form1[0].#subform[0].Part1_Eligibility[0]": "/Yes",  # 5-year residency
    
    # Part 2 - Personal Info
    "form1[0].#subform[0].P2_Line1_FamilyName[0]": "Rodriguez",
    "form1[0].#subform[0].P2_Line1_GivenName[0]": "Maria",
    "form1[0].#subform[0].P2_Line1_MiddleName[0]": "Elena",
    
    # Alien Number
    "form1[0].#subform[0].#area[0].Line1_AlienNumber[0]": "123456789",
    "form1[0].#subform[1].#area[1].Line1_AlienNumber[1]": "123456789",
    
    # Date of Birth
    "form1[0].#subform[1].P2_Line8_DateOfBirth[0]": "03/15/1985",
    
    # Country of Birth
    "form1[0].#subform[1].P2_Line10_CountryOfBirth[0]": "Mexico",
    
    # Country of Nationality
    "form1[0].#subform[1].P2_Line11_CountryOfNationality[0]": "Mexico",
    
    # Date became permanent resident
    "form1[0].#subform[1].P2_Line9_DateBecamePermanentResident[0]": "06/20/2019",
    
    # SSN
    "form1[0].#subform[1].Line12b_SSN[0]": "123-45-6789",
    
    # USCIS Account Number
    "form1[0].#subform[1].P2_Line6_USCISELISAcctNumber[0]": "USC1234567890",
    
    # Gender - Female
    "form1[0].#subform[1].P2_Line7_Gender[1]": "/1",  # Female checkbox
}


def get_realistic_intake_data():
    """Return a realistic intake payload that respects conditional logic."""
    return {
        # Part 1 - Eligibility
        "eligibility_basis": "5year",

        # Part 2 - Personal Info
        "last_name": "Johnson",
        "first_name": "Alicia",
        "middle_name": "Marie",
        "has_used_other_names": "yes",
        "other_names": [
            {"family_name": "Johnson", "given_name": "Alicia", "middle_name": "M."},
            {"family_name": "Williams", "given_name": "Alicia", "middle_name": "Marie"},
        ],
        "wants_name_change": "yes",
        "new_name_last": "Johnson-Williams",
        "new_name_first": "Alicia",
        "new_name_middle": "Marie",
        "uscis_account_number": "USC1234567890",
        "gender": "female",
        "date_of_birth": "1989-07-22",
        "date_became_permanent_resident": "2018-05-14",
        "country_of_birth": "Brazil",
        "country_of_citizenship": "Brazil",
        "request_disability_accommodations": "no",
        "disability_prevents_english": "no",
        "ssa_wants_card": "yes",
        "ssn": "123-45-6789",
        "ssa_consent_disclosure": "yes",
        "a_number": "A123456789",

        # Part 4 - Address
        "street_address": "742 Evergreen Terrace",
        "apt_type": "apt",
        "apt_ste_flr": "4B",
        "city": "Seattle",
        "state": "WA",
        "zip_code": "98101",
        "residence_province": "Test Province",
        "residence_postal_code": "002233",
        "residence_from": "06/2019",
        "mailing_same_as_residence": "no",
        "mailing_apt_type": "ste",
        "mailing_in_care_of": "John Johnson",
        "mailing_street_address": "PO Box 12345",
        "mailing_city": "Seattle",
        "mailing_state": "WA",
        "mailing_zip_code": "98111",
        "mailing_province": "Test Province",
        "mailing_postal_code": "0001111",
        "mailing_country": "United States",

        "residence_addresses": [
            {
                "street_address": "742 Evergreen Terrace",
                "city": "Seattle",
                "state": "WA",
                "zip_code": "98101",
                "country": "United States",
                "dates_from": "2019-06-01",
                "dates_to": "Present",
            },
            {
                "street_address": "1200 Rue Sherbrooke O",
                "city": "Montreal",
                "province": "QC",
                "postal_code": "H3G 1H8",
                "country": "Canada",
                "dates_from": "2017-01-10",
                "dates_to": "2019-05-15",
            },
        ],

        # Part 7 - Biographic
        "ethnicity": "hispanic",
        "race": "white",
        "height_feet": "5",
        "height_inches": "6",
        "weight": "135",
        "eye_color": "Brown",
        "hair_color": "Black",

        # Part 10 - Marital History
        "marital_status": "married",
        "times_married": "1",
        "spouse_is_military_member": "no",
        "spouse_last_name": "Johnson",
        "spouse_first_name": "Mark",
        "spouse_middle_name": "David",
        "spouse_date_of_birth": "1987-03-05",
        "spouse_date_of_marriage": "2013-09-21",
        "spouse_is_us_citizen": "yes",
        "spouse_citizenship_by_birth": "yes",
        "spouse_address_same_as_applicant": "yes",
        "spouse_a_number": "",
        "spouse_times_married": "1",
        "spouse_current_employer": "Sound Health",

        # Part 11 - Children
        "total_children": "2",
        "children": [
            {
                "first_name": "Liam",
                "last_name": "Johnson",
                "date_of_birth": "2015-02-10",
                "residence": "resides_with_me",
                "relationship": "biological son or daughter",
                "support": "yes",
            },
            {
                "first_name": "Mia",
                "last_name": "Johnson",
                "date_of_birth": "2018-11-30",
                "residence": "resides_with_me",
                "relationship": "biological son or daughter",
                "support": "yes",
            },
        ],
        "providing_support_for_children": "yes",

        # Part 8 - Employment
        "employment_history": [
            {
                "employer_or_school": "Northwest Tech",
                "occupation_or_field": "Product Manager",
                "city": "Seattle",
                "state": "WA",
                "zip_code": "98104",
                "country": "United States",
                "dates_from": "08/2020",
                "dates_to": "Present",
            },
            {
                "employer_or_school": "Bright Consulting",
                "occupation_or_field": "Business Analyst",
                "city": "Bellevue",
                "state": "WA",
                "zip_code": "98004",
                "country": "United States",
                "dates_from": "07/2018",
                "dates_to": "07/2020",
            },
        ],

        # Part 9 - Travel
        "total_days_outside_us": "14",
        "trips_over_6_months": "no",
        "trips": [
            {
                "date_left_us": "2022-12-10",
                "date_returned_us": "2022-12-24",
                "countries_traveled": "Brazil",
            },
            {
                "date_left_us": "2023-07-01",
                "date_returned_us": "2023-07-10",
                "countries_traveled": "Canada",
            },
        ],

        # Part 12 - Background (mostly "no")
        "q_claimed_us_citizen": "no",
        "q_voted_in_us": "no",
        "q_failed_to_file_taxes": "no",
        "q_owe_taxes": "no",
        "q_communist_party": "no",
        "q_terrorist_org": "no",
        "q_used_weapon_explosive": "no",
        "q_kidnapping_assassination_hijacking": "no",
        "q_threatened_weapon_violence": "no",
        "q_torture": "no",
        "q_genocide": "no",
        "q_killing_person": "no",
        "q_severely_injuring": "no",
        "q_sexual_contact_nonconsent": "no",
        "q_religious_persecution": "no",
        "q_harm_race_religion": "no",
        "q_military_police_service": "no",
        "q_armed_group": "no",
        "q_detention_facility": "no",
        "q_group_used_weapons": "no",
        "q_used_weapon_against_person": "no",
        "q_threatened_weapon_use": "no",
        "q_sold_provided_weapons": "no",
        "q_weapons_training": "no",
        "q_recruited_under_15": "no",
        "q_used_under_15_hostilities": "no",
        "q_committed_crime_not_arrested": "no",
        "q_arrested": "no",
        "q_false_info_us_government": "no",
        "q_lied_us_government": "no",
        "q_removed_deported": "no",
        "q_male_18_26_lived_us": "no",
        "q_served_us_military": "no",
        "q_court_martialed": "no",
        "q_discharged_because_alien": "no",
        "q_deserted_military": "no",
        "q_prostitution": "no",
        "q_controlled_substances": "no",
        "q_illegal_gambling": "no",
        "q_failed_child_support": "no",
        "q_support_constitution": "yes",
        "q_willing_take_oath": "yes",
        "q_willing_bear_arms": "no",

        # Contact + signature
        "daytime_phone": "206-555-0142",
        "mobile_phone": "206-555-0199",
        "email": "alicia.johnson@example.com",
        "signature_date": "2026-01-15",
        "applicant_signature": "Alicia M. Johnson",

        # Fee reduction / interpreter / preparer
        "fee_reduction_requested": "no",
        "used_interpreter": "no",
        "used_preparer": "no",

        "additional_information": [
            {
                "page_number": "5",
                "part_number": "6",
                "item_number": "1",
                "explanation": "Address history includes a prior residence in Canada.  Please see details above.",
            },
            {
                "page_number": "9",
                "part_number": "12",
                "item_number": "31",
                "explanation": "Applicant affirms willingness to support the Constitution.  No additional details.",
            },
        ],
    }


def get_all_field_names(reader):
    """Extract all field names from the PDF."""
    fields = reader.get_fields()
    if fields:
        return list(fields.keys())
    return []


def fill_pdf(input_path, output_path, field_data):
    """Fill PDF form fields with the provided data."""
    print(f"📄 Loading PDF from: {input_path}")
    
    reader = PdfReader(input_path)
    
    # Decrypt if needed
    if reader.is_encrypted:
        reader.decrypt('')
        print("✓ Decrypted PDF")
    
    writer = PdfWriter()
    writer.append(reader)

    # Hint to PDF viewers that they should regenerate appearances
    try:
        if "/AcroForm" in writer._root_object:
            acro_form = writer._root_object["/AcroForm"]
            acro_form.update(
                {NameObject("/NeedAppearances"): BooleanObject(True)}
            )
    except Exception as e:
        print(f"⚠️ Could not set NeedAppearances: {e}")
    
    # Get all field names for reference
    fields = reader.get_fields() or {}
    print(f"✓ Found {len(fields)} fields in PDF\n")
    
    print("Filling fields on all pages:")
    # First, use the helper for text and choice fields (they render fine).
    for page_index, page in enumerate(writer.pages):
        try:
            writer.update_page_form_field_values(
                page,
                field_data,
                auto_regenerate=True,
            )
            print(f"  ✓ Applied text/choice mapping on page {page_index + 1}")
        except Exception as e:
            print(f"  ✗ Error applying fields on page {page_index + 1}: {e}")

    def normalize_name(field_name: str) -> str:
        """Normalize a full field name to align with widget /T values."""
        # Many N-400 fields look like:
        #   form1[0].#subform[0].Part1_Eligibility[0]
        # but the widget /T is just "Part1_Eligibility[0]".
        return field_name.split(".")[-1]

    # Then, explicitly set checkbox/radio button values at the AcroForm level
    def set_button_values(field_objs, mapping):
        if not field_objs:
            return
        for field_ref in field_objs:
            field = field_ref.get_object()
            field_type = field.get("/FT")
            name = field.get("/T")

            # If this is a button and we have a target value, set /V and /AS
            if field_type == "/Btn" and name in mapping:
                on_value = mapping[name]
                if isinstance(on_value, str):
                    on_value = NameObject(on_value)
                try:
                    field.update({
                        NameObject("/V"): on_value,
                        NameObject("/AS"): on_value,
                    })
                    print(f"  ✓ Set button {name} to {on_value}")
                except Exception as e:
                    print(f"  ✗ Failed to set button {name}: {e}")

            # Recurse into kids (for radio groups / nested fields)
            kids = field.get("/Kids")
            if kids:
                set_button_values(kids, mapping)

    try:
        acro_form = writer._root_object.get("/AcroForm")
        if hasattr(acro_form, "get_object"):
            acro_form = acro_form.get_object()
        if acro_form:
            fields_array = acro_form.get("/Fields")
            if fields_array:
                # Build mapping keyed by normalized names so widget /T matches
                btn_mapping = {}
                for full_name, value in field_data.items():
                    field_def = fields.get(full_name)
                    if not field_def:
                        continue
                    if field_def.get("/FT") != "/Btn":
                        continue
                    norm = normalize_name(full_name)
                    btn_mapping[norm] = value

                set_button_values(fields_array, btn_mapping)
    except Exception as e:
        print(f"⚠️ Failed to apply explicit button values: {e}")
    
    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        writer.write(f)
    
    print(f"\n✅ Saved to: {output_path}")


def build_full_sample_data(reader):
    """
    Build sample data that touches every field in the N-400 PDF.
    
    - Text fields: short placeholder that varies per field
    - Choice fields: simple placeholder
    - Buttons/checkboxes: best-effort on-value ("/Yes")
    
    This is for testing that all PDF fields render something, not
    for producing a legally meaningful N-400.
    """
    fields = reader.get_fields() or {}
    data = {}
    text_counter = 1

    for name, field in fields.items():
        field_type = field.get('/FT', 'unknown')

        if field_type == '/Tx':
            data[name] = f"Sample {text_counter}"
            text_counter += 1
        elif field_type == '/Ch':
            # Choice fields (dropdown/list). Some N-400 fields are free-text,
            # others have export values; a simple string usually shows up.
            data[name] = "Sample"
        elif field_type == '/Btn':
            # Buttons: checkboxes / radios. We try to find a real "on" value
            # from the field's state list or appearance dictionary.
            on_value = None

            # 1) Prefer explicit state list if present (XFA forms often use this)
            states = field.get('/_States_')
            if isinstance(states, list):
                options = [s for s in states if s != NameObject('/Off')]
                if options:
                    on_value = options[0]

            # 2) Use existing default value if already set and not Off
            if not on_value:
                current_value = field.get('/V')
                if current_value and current_value != NameObject('/Off'):
                    on_value = current_value

            # 3) Otherwise, inspect appearance states for a non-Off key
            if not on_value:
                ap = field.get('/AP')
                if isinstance(ap, dict):
                    normal = ap.get('/N') or ap.get('/D')
                    if isinstance(normal, dict):
                        # keys are names like /Yes, /1, /On, /Off
                        options = [k for k in normal.keys() if k != NameObject('/Off')]
                        if options:
                            on_value = options[0]

            # 4) Fallback if we couldn't infer anything
            if not on_value:
                on_value = NameObject('/Yes')

            # Store as a proper NameObject so /V and /AS get correct type
            if not isinstance(on_value, NameObject):
                on_value = NameObject(str(on_value))
            data[name] = on_value

    return data


def list_fields(input_path, output_json=None):
    """List all fields in the PDF."""
    reader = PdfReader(input_path)
    if reader.is_encrypted:
        reader.decrypt('')
    
    fields = reader.get_fields()
    
    # Categorize fields
    text_fields = []
    buttons = []
    choices = []
    
    for name, field in fields.items():
        field_type = field.get('/FT', 'unknown')
        if field_type == '/Tx':
            text_fields.append(name)
        elif field_type == '/Btn':
            buttons.append(name)
        elif field_type == '/Ch':
            choices.append(name)
    
    print(f"\n📝 TEXT FIELDS ({len(text_fields)}):")
    for f in text_fields[:20]:
        print(f"  {f}")
    if len(text_fields) > 20:
        print(f"  ... and {len(text_fields) - 20} more")
    
    print(f"\n☐ BUTTONS/CHECKBOXES ({len(buttons)}):")
    for f in buttons[:20]:
        print(f"  {f}")
    if len(buttons) > 20:
        print(f"  ... and {len(buttons) - 20} more")
    
    if output_json:
        with open(output_json, 'w') as f:
            json.dump({
                'text_fields': text_fields,
                'buttons': buttons,
                'choices': choices,
            }, f, indent=2)
        print(f"\n✅ Field list saved to: {output_json}")


if __name__ == "__main__":
    import sys
    
    # Expect to be run from the repo root
    input_pdf = "pdf-api/templates/n-400.pdf"
    output_pdf = "test-output/N-400_Test_Python.pdf"
    
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        list_fields(input_pdf, "test-output/pdf-fields-python.json")
    else:
        # Use realistic data and the same mapping logic as the API
        script_dir = os.path.dirname(os.path.abspath(__file__))
        pdf_api_dir = os.path.abspath(os.path.join(script_dir, "..", "pdf-api"))
        if pdf_api_dir not in sys.path:
            sys.path.insert(0, pdf_api_dir)

        from app import map_form_data_to_pdf_fields

        intake_data = get_realistic_intake_data()
        field_data = map_form_data_to_pdf_fields(intake_data)

        # Fill the PDF with mapped data
        fill_pdf(input_pdf, output_pdf, field_data)
