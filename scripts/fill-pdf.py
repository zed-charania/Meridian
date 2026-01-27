#!/usr/bin/env python3
"""
N-400 PDF Form Filler
Uses pypdf to fill the N-400 form with sample data.

Run with: python3 scripts/fill-pdf.py
"""

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject
import os
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
    
    # Get all field names for reference
    fields = reader.get_fields()
    print(f"✓ Found {len(fields)} fields in PDF\n")
    
    # Track results
    filled = 0
    not_found = 0
    
    print("Filling fields:")
    for field_name, value in field_data.items():
        if field_name in fields:
            try:
                writer.update_page_form_field_values(
                    writer.pages[0],  # Will try on all pages
                    {field_name: value},
                    auto_regenerate=False
                )
                print(f"  ✓ {field_name} = {value[:30] if len(value) > 30 else value}")
                filled += 1
            except Exception as e:
                print(f"  ✗ {field_name}: {e}")
                not_found += 1
        else:
            # Try partial match
            matches = [f for f in fields.keys() if field_name.split('.')[-1] in f]
            if matches:
                print(f"  ? {field_name} not found, but similar: {matches[0]}")
            else:
                print(f"  ✗ {field_name} not found")
            not_found += 1
    
    print(f"\n📊 Summary:")
    print(f"  ✓ Filled: {filled}")
    print(f"  ✗ Not found: {not_found}")
    
    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        writer.write(f)
    
    print(f"\n✅ Saved to: {output_path}")
    return filled, not_found


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
    
    input_pdf = "templates/n-400.pdf"
    output_pdf = "test-output/N-400_Test_Python.pdf"
    
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        list_fields(input_pdf, "test-output/pdf-fields-python.json")
    else:
        fill_pdf(input_pdf, output_pdf, SAMPLE_DATA)
