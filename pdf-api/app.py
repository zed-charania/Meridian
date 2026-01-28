"""
N-400 PDF Generation API
Hosted on Render, called by Next.js app on Vercel

Endpoints:
  POST /generate - Generate filled N-400 PDF from form data
  GET /health - Health check
  GET /fields - List PDF field names (debugging)
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, BooleanObject
import os
import io

app = Flask(__name__)
CORS(app)

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "templates", "n-400.pdf")


def format_date(date_str: str) -> str:
    """Convert date to MM/DD/YYYY format."""
    if not date_str:
        return ""
    if "/" in date_str and len(date_str) == 10:
        return date_str
    if "-" in date_str:
        parts = date_str.split("-")
        if len(parts) == 3:
            return f"{parts[1]}/{parts[2]}/{parts[0]}"
    return date_str


def map_form_data_to_pdf_fields(data: dict) -> dict:
    """
    Map intake form data to PDF field names with correct checkbox states.
    """
    fields = {}

    # Helper for Yes/No checkboxes
    def set_yes_no(field_base: str, value: str, yes_idx: int = 1, no_idx: int = 0):
        """Set Yes/No checkbox. Default: [0]=No, [1]=Yes. Some are reversed."""
        if value and value.lower() == "yes":
            fields[f"{field_base}[{yes_idx}]"] = "/Y"
        elif value and value.lower() == "no":
            fields[f"{field_base}[{no_idx}]"] = "/N"

    # ═══════════════════════════════════════════════════════════════
    # A-NUMBER (All 14 pages)
    # ═══════════════════════════════════════════════════════════════
    if data.get("a_number"):
        a_num = data["a_number"].replace("-", "").replace(" ", "")
        fields["form1[0].#subform[0].#area[0].Line1_AlienNumber[0]"] = a_num
        fields["form1[0].#subform[1].#area[1].Line1_AlienNumber[1]"] = a_num
        fields["form1[0].#subform[2].#area[2].Line1_AlienNumber[2]"] = a_num
        fields["form1[0].#subform[3].#area[3].Line1_AlienNumber[3]"] = a_num
        fields["form1[0].#subform[4].#area[4].Line1_AlienNumber[4]"] = a_num
        fields["form1[0].#subform[5].#area[6].Line1_AlienNumber[5]"] = a_num
        fields["form1[0].#subform[6].#area[7].Line1_AlienNumber[6]"] = a_num
        fields["form1[0].#subform[7].#area[8].Line1_AlienNumber[7]"] = a_num
        fields["form1[0].#subform[8].#area[9].Line1_AlienNumber[8]"] = a_num
        fields["form1[0].#subform[9].#area[10].Line1_AlienNumber[9]"] = a_num
        fields["form1[0].#subform[10].#area[11].Line1_AlienNumber[10]"] = a_num
        fields["form1[0].#subform[11].#area[12].Line1_AlienNumber[11]"] = a_num
        fields["form1[0].#subform[12].#area[13].Line1_AlienNumber[12]"] = a_num
        fields["form1[0].#subform[13].#area[14].Line1_AlienNumber[13]"] = a_num

    # ═══════════════════════════════════════════════════════════════
    # PART 1: ELIGIBILITY (Page 1)
    # ═══════════════════════════════════════════════════════════════
    eligibility = data.get("eligibility_basis", "")
    eligibility_map = {
        "5year": ("form1[0].#subform[0].Part1_Eligibility[2]", "/A"),
        "3year_marriage": ("form1[0].#subform[0].Part1_Eligibility[1]", "/B"),
        "vawa": ("form1[0].#subform[0].Part1_Eligibility[0]", "/C"),
        "spouse_qualified_employment": ("form1[0].#subform[0].Part1_Eligibility[6]", "/D"),
        "military_current": ("form1[0].#subform[0].Part1_Eligibility[3]", "/E"),
        "military_former": ("form1[0].#subform[0].Part1_Eligibility[4]", "/F"),
        "other": ("form1[0].#subform[0].Part1_Eligibility[5]", "/G"),
    }
    if eligibility in eligibility_map:
        field_name, value = eligibility_map[eligibility]
        fields[field_name] = value

    if eligibility == "other" and data.get("other_basis_reason"):
        fields["form1[0].#subform[0].Part1Line5_OtherExplain[0]"] = data["other_basis_reason"]

    # ═══════════════════════════════════════════════════════════════
    # PART 2: PERSONAL INFO (Pages 1-2)
    # ═══════════════════════════════════════════════════════════════
    # Name
    if data.get("last_name"):
        fields["form1[0].#subform[0].P2_Line1_FamilyName[0]"] = data["last_name"]
    if data.get("first_name"):
        fields["form1[0].#subform[0].P2_Line1_GivenName[0]"] = data["first_name"]
    if data.get("middle_name"):
        fields["form1[0].#subform[0].P2_Line1_MiddleName[0]"] = data["middle_name"]

    # Other Names (array or individual fields)
    if data.get("has_used_other_names") == "yes":
        other_names = data.get("other_names", [])
        name1 = other_names[0] if len(other_names) > 0 else {}
        if name1.get("family_name") or data.get("other_last_name_1"):
            fields["form1[0].#subform[0].Line2_FamilyName1[0]"] = name1.get("family_name") or data.get("other_last_name_1", "")
        if name1.get("given_name") or data.get("other_first_name_1"):
            fields["form1[0].#subform[0].Line3_GivenName1[0]"] = name1.get("given_name") or data.get("other_first_name_1", "")
        if name1.get("middle_name") or data.get("other_middle_name_1"):
            fields["form1[0].#subform[0].Line3_MiddleName1[0]"] = name1.get("middle_name") or data.get("other_middle_name_1", "")

        name2 = other_names[1] if len(other_names) > 1 else {}
        if name2.get("family_name") or data.get("other_last_name_2"):
            fields["form1[0].#subform[0].Line2_FamilyName2[0]"] = name2.get("family_name") or data.get("other_last_name_2", "")
        if name2.get("given_name") or data.get("other_first_name_2"):
            fields["form1[0].#subform[0].Line3_GivenName2[0]"] = name2.get("given_name") or data.get("other_first_name_2", "")
        if name2.get("middle_name") or data.get("other_middle_name_2"):
            fields["form1[0].#subform[0].Line3_MiddleName2[0]"] = name2.get("middle_name") or data.get("other_middle_name_2", "")

    # Name Change (Page 2)
    if data.get("wants_name_change") == "yes":
        fields["form1[0].#subform[1].P2_Line34_NameChange[1]"] = "/Y"
        if data.get("new_name_last"):
            fields["form1[0].#subform[1].Part2Line3_FamilyName[0]"] = data["new_name_last"]
        if data.get("new_name_first"):
            fields["form1[0].#subform[1].Part2Line4a_GivenName[0]"] = data["new_name_first"]
        if data.get("new_name_middle"):
            fields["form1[0].#subform[1].Part2Line4a_MiddleName[0]"] = data["new_name_middle"]
    elif data.get("wants_name_change") == "no":
        fields["form1[0].#subform[1].P2_Line34_NameChange[0]"] = "/N"

    # USCIS Account Number
    if data.get("uscis_account_number"):
        fields["form1[0].#subform[1].P2_Line6_USCISELISAcctNumber[0]"] = data["uscis_account_number"]

    # Gender - /M for male, /F for female
    gender = data.get("gender", "").lower()
    if gender == "male":
        fields["form1[0].#subform[1].P2_Line7_Gender[0]"] = "/M"
    elif gender == "female":
        fields["form1[0].#subform[1].P2_Line7_Gender[1]"] = "/F"

    # Date of Birth
    if data.get("date_of_birth"):
        fields["form1[0].#subform[1].P2_Line8_DateOfBirth[0]"] = format_date(data["date_of_birth"])

    # Date became permanent resident
    if data.get("date_became_permanent_resident"):
        fields["form1[0].#subform[1].P2_Line9_DateBecamePermanentResident[0]"] = format_date(data["date_became_permanent_resident"])

    # Countries
    if data.get("country_of_birth"):
        fields["form1[0].#subform[1].P2_Line10_CountryOfBirth[0]"] = data["country_of_birth"]
    if data.get("country_of_citizenship"):
        fields["form1[0].#subform[1].P2_Line11_CountryOfNationality[0]"] = data["country_of_citizenship"]

    # Q10 - Disability Accommodations
    if data.get("request_disability_accommodations") == "yes":
        fields["form1[0].#subform[1].P2_Line10_claimdisability[1]"] = "/Y"
    elif data.get("request_disability_accommodations") == "no":
        fields["form1[0].#subform[1].P2_Line10_claimdisability[0]"] = "/N"

    # Q11 - Disability preventing English/civics
    if data.get("disability_prevents_english") == "yes":
        fields["form1[0].#subform[1].P2_Line11_claimdisability[1]"] = "/Y"
    elif data.get("disability_prevents_english") == "no":
        fields["form1[0].#subform[1].P2_Line11_claimdisability[0]"] = "/N"

    # Q12.a - SSA Card
    if data.get("ssa_wants_card") == "yes":
        fields["form1[0].#subform[1].Line12a_Checkbox[1]"] = "/Y"
    elif data.get("ssa_wants_card") == "no":
        fields["form1[0].#subform[1].Line12a_Checkbox[0]"] = "/N"

    # Q12.b - SSN
    if data.get("ssn"):
        ssn_clean = data["ssn"].replace("-", "").replace(" ", "")
        fields["form1[0].#subform[1].Line12b_SSN[0]"] = ssn_clean

    # Q12.c - SSA Consent
    if data.get("ssa_consent_disclosure") == "yes":
        fields["form1[0].#subform[1].Line12\\.c_Checkbox[1]"] = "/Y"
    elif data.get("ssa_consent_disclosure") == "no":
        fields["form1[0].#subform[1].Line12\\.c_Checkbox[0]"] = "/N"

    # ═══════════════════════════════════════════════════════════════
    # PART 4: RESIDENCE (Page 3)
    # ═══════════════════════════════════════════════════════════════
    if data.get("street_address"):
        fields["form1[0].#subform[2].P4_Line1_StreetName[0]"] = data["street_address"]

    # Apt/Ste/Flr checkboxes
    apt_type = data.get("apt_type", "").lower()
    if apt_type == "apt":
        fields["form1[0].#subform[2].P4_Line1_Unit[2]"] = "/APT"
    elif apt_type == "ste":
        fields["form1[0].#subform[2].P4_Line1_Unit[1]"] = "/STE"
    elif apt_type == "flr":
        fields["form1[0].#subform[2].P4_Line1_Unit[0]"] = "/FLR"

    if data.get("apt_ste_flr"):
        fields["form1[0].#subform[2].P4_Line1_Number[0]"] = data["apt_ste_flr"]

    if data.get("city"):
        fields["form1[0].#subform[2].P4_Line1_City[0]"] = data["city"]

    if data.get("state"):
        state_val = f" {data['state'].upper()}" if not data['state'].startswith(' ') else data['state']
        fields["form1[0].#subform[2].P4_Line1_State[0]"] = state_val

    if data.get("zip_code"):
        fields["form1[0].#subform[2].P4_Line1_ZipCode[0]"] = data["zip_code"]
    if data.get("residence_province"):
        fields["form1[0].#subform[2].P4_Line1_Province[0]"] = data["residence_province"]
    if data.get("residence_postal_code"):
        fields["form1[0].#subform[2].P4_Line1_PostalCode[0]"] = data["residence_postal_code"]

    fields["form1[0].#subform[2].P4_Line1_Country[0]"] = "United States"

    # Residence dates (From / To)
    # Template appears to place the "From" box in index [1].
    if data.get("residence_from"):
        fields["form1[0].#subform[2].P4_Line1_DatesofResidence[1]"] = format_date(data["residence_from"])
    if data.get("residence_to"):
        to_val = data["residence_to"]
        # If "Present", leave the prefilled form value untouched
        if isinstance(to_val, str) and to_val.upper() != "PRESENT":
            fields["form1[0].#subform[2].P4_Line1_DatesofResidence[0]"] = format_date(to_val)

    # Mailing address fields (Part 4, Question 3)
    if data.get("mailing_same_as_residence") == "no":
        mailing_unit = data.get("mailing_apt_type", "").lower()
        if mailing_unit == "apt":
            fields["form1[0].#subform[3].P5_Line1b_Unit[2]"] = "/APT"
        elif mailing_unit == "ste":
            fields["form1[0].#subform[3].P5_Line1b_Unit[1]"] = "/STE"
        elif mailing_unit == "flr":
            fields["form1[0].#subform[3].P5_Line1b_Unit[0]"] = "/FLR"
        if data.get("mailing_apt_ste_flr"):
            fields["form1[0].#subform[3].P5_Line1b_Number[0]"] = data["mailing_apt_ste_flr"]
        if data.get("mailing_in_care_of"):
            fields["form1[0].#subform[3].P5_Line1b_InCareOfName[0]"] = data["mailing_in_care_of"]
        if data.get("mailing_street_address"):
            fields["form1[0].#subform[3].P5_Line1b_StreetName[0]"] = data["mailing_street_address"]
        if data.get("mailing_city"):
            fields["form1[0].#subform[3].P5_Line1b_City[0]"] = data["mailing_city"]
        if data.get("mailing_state"):
            fields["form1[0].#subform[3].P5_Line1b_State[0]"] = data["mailing_state"]
        if data.get("mailing_zip_code"):
            fields["form1[0].#subform[3].P5_Line1b_ZipCode[0]"] = data["mailing_zip_code"]
        if data.get("mailing_province"):
            fields["form1[0].#subform[3].P5_Line1b_Province[0]"] = data["mailing_province"]
        if data.get("mailing_postal_code"):
            fields["form1[0].#subform[3].P5_Line1b_PostalCode[0]"] = data["mailing_postal_code"]
        if data.get("mailing_country"):
            fields["form1[0].#subform[3].P5_Line1b_Country[0]"] = data["mailing_country"]

    # Previous physical addresses (Part 4.1 table)
    residence_addresses = data.get("residence_addresses", [])
    for i, address in enumerate(residence_addresses[:3]):
        idx = i + 1
        if address.get("street_address"):
            fields[f"form1[0].#subform[2].P4_Line3_PhysicalAddress{idx}[0]"] = address["street_address"]
        if address.get("city"):
            fields[f"form1[0].#subform[2].P4_Line3_CityTown{idx}[0]"] = address["city"]
        state_val = address.get("state") or address.get("province")
        if state_val:
            fields[f"form1[0].#subform[2].P4_Line3_State{idx}[0]"] = state_val
        zip_val = address.get("zip_code") or address.get("postal_code")
        if zip_val:
            fields[f"form1[0].#subform[2].P4_Line3_ZipCode{idx}[0]"] = zip_val
        if address.get("country"):
            fields[f"form1[0].#subform[2].P4_Line3_Country{idx}[0]"] = address["country"]

        if address.get("dates_from"):
            if idx == 1:
                fields["form1[0].#subform[2].P4_Line3_From1[0]"] = format_date(address["dates_from"])
            else:
                fields[f"form1[0].#subform[2].P4_Line3_From{idx}[0]"] = format_date(address["dates_from"])
        if address.get("dates_to"):
            if idx == 1:
                fields["form1[0].#subform[2].P4_Line3_From1[1]"] = format_date(address["dates_to"])
            else:
                fields[f"form1[0].#subform[2].P4_Line3_To{idx}[0]"] = format_date(address["dates_to"])

    # ═══════════════════════════════════════════════════════════════
    # PART 7: BIOGRAPHIC INFO (Page 3)
    # ═══════════════════════════════════════════════════════════════
    ethnicity = data.get("ethnicity", "").lower()
    if ethnicity == "hispanic":
        fields["form1[0].#subform[2].P7_Line1_Ethnicity[1]"] = "/Y"
    elif ethnicity in ["not_hispanic", "not hispanic"]:
        fields["form1[0].#subform[2].P7_Line1_Ethnicity[0]"] = "/N"

    race = data.get("race", "").lower()
    race_map = {
        "white": ("form1[0].#subform[2].P7_Line2_Race[4]", "/W"),
        "asian": ("form1[0].#subform[2].P7_Line2_Race[1]", "/A"),
        "black": ("form1[0].#subform[2].P7_Line2_Race[2]", "/B"),
        "native": ("form1[0].#subform[2].P7_Line2_Race[0]", "/I"),
        "pacific": ("form1[0].#subform[2].P7_Line2_Race[3]", "/A"),
    }
    if race in race_map:
        fields[race_map[race][0]] = race_map[race][1]

    if data.get("height_feet"):
        fields["form1[0].#subform[2].P7_Line3_HeightFeet[0]"] = str(data["height_feet"])
    if data.get("height_inches"):
        fields["form1[0].#subform[2].P7_Line3_HeightInches[0]"] = str(data["height_inches"])

    weight = data.get("weight", "")
    if weight:
        w = str(weight).zfill(3)
        fields["form1[0].#subform[2].P7_Line4_Pounds1[0]"] = w[0]
        fields["form1[0].#subform[2].P7_Line4_Pounds2[0]"] = w[1]
        fields["form1[0].#subform[2].P7_Line4_Pounds3[0]"] = w[2]

    eye_color = data.get("eye_color", "").lower()
    eye_map = {
        "brown": ("form1[0].#subform[2].P7_Line5_Eye[0]", "/BRO"),
        "blue": ("form1[0].#subform[2].P7_Line5_Eye[1]", "/BLU"),
        "green": ("form1[0].#subform[2].P7_Line5_Eye[2]", "/GRN"),
        "hazel": ("form1[0].#subform[2].P7_Line5_Eye[3]", "/HAZ"),
        "gray": ("form1[0].#subform[2].P7_Line5_Eye[4]", "/GRY"),
        "black": ("form1[0].#subform[2].P7_Line5_Eye[5]", "/BLK"),
        "pink": ("form1[0].#subform[2].P7_Line5_Eye[6]", "/PNK"),
        "maroon": ("form1[0].#subform[2].P7_Line5_Eye[7]", "/MAR"),
        "unknown": ("form1[0].#subform[2].P7_Line5_Eye[8]", "/XXX"),
    }
    if eye_color in eye_map:
        fields[eye_map[eye_color][0]] = eye_map[eye_color][1]

    hair_color = data.get("hair_color", "").lower()
    hair_map = {
        "bald": ("form1[0].#subform[2].P7_Line6_Hair[0]", "/BAL"),
        "sandy": ("form1[0].#subform[2].P7_Line6_Hair[1]", "/SDY"),
        "red": ("form1[0].#subform[2].P7_Line6_Hair[2]", "/RED"),
        "white": ("form1[0].#subform[2].P7_Line6_Hair[3]", "/WHI"),
        "gray": ("form1[0].#subform[2].P7_Line6_Hair[4]", "/GRY"),
        "blond": ("form1[0].#subform[2].P7_Line6_Hair[5]", "/BLN"),
        "brown": ("form1[0].#subform[2].P7_Line6_Hair[6]", "/BRO"),
        "black": ("form1[0].#subform[2].P7_Line6_Hair[7]", "/BLK"),
        "unknown": ("form1[0].#subform[2].P7_Line6_Hair[8]", "/XXX"),
    }
    if hair_color in hair_map:
        fields[hair_map[hair_color][0]] = hair_map[hair_color][1]

    # ═══════════════════════════════════════════════════════════════
    # PART 5: MARITAL STATUS (Page 4)
    # ═══════════════════════════════════════════════════════════════
    marital = data.get("marital_status", "").lower()
    marital_map = {
        "divorced": ("form1[0].#subform[3].P10_Line1_MaritalStatus[0]", "/D"),
        "single": ("form1[0].#subform[3].P10_Line1_MaritalStatus[1]", "/S"),
        "widowed": ("form1[0].#subform[3].P10_Line1_MaritalStatus[2]", "/W"),
        "married": ("form1[0].#subform[3].P10_Line1_MaritalStatus[3]", "/M"),
        "annulled": ("form1[0].#subform[3].P10_Line1_MaritalStatus[4]", "/A"),
        "separated": ("form1[0].#subform[3].P10_Line1_MaritalStatus[5]", "/E"),
    }
    if marital in marital_map:
        fields[marital_map[marital][0]] = marital_map[marital][1]

    # Q2 - Spouse military (P7_Line2_Forces: [0]=N, [1]=Y)
    if data.get("spouse_is_military_member") == "yes":
        fields["form1[0].#subform[3].P7_Line2_Forces[1]"] = "/Y"
    elif data.get("spouse_is_military_member") == "no":
        fields["form1[0].#subform[3].P7_Line2_Forces[0]"] = "/N"

    if data.get("times_married"):
        fields["form1[0].#subform[3].Part9Line3_TimesMarried[0]"] = str(data["times_married"])

    # Spouse info
    if marital == "married":
        if data.get("spouse_last_name"):
            fields["form1[0].#subform[3].P10_Line4a_FamilyName[0]"] = data["spouse_last_name"]
        if data.get("spouse_first_name"):
            fields["form1[0].#subform[3].P10_Line4a_GivenName[0]"] = data["spouse_first_name"]
        if data.get("spouse_middle_name"):
            fields["form1[0].#subform[3].P10_Line4a_MiddleName[0]"] = data["spouse_middle_name"]
        if data.get("spouse_date_of_birth"):
            fields["form1[0].#subform[3].P10_Line4d_DateofBirth[0]"] = format_date(data["spouse_date_of_birth"])
        if data.get("spouse_date_of_marriage"):
            fields["form1[0].#subform[3].P10_Line4e_DateEnterMarriage[0]"] = format_date(data["spouse_date_of_marriage"])

        # Spouse address same as applicant
        if data.get("spouse_address_same_as_applicant") == "yes":
            fields["form1[0].#subform[3].P10_Line5_Citizen[1]"] = "/Y"
            fields["form1[0].#subform[10].P10_Line1_Citizen[1]"] = "/Y"
        elif data.get("spouse_address_same_as_applicant") == "no":
            fields["form1[0].#subform[3].P10_Line5_Citizen[0]"] = "/N"
            fields["form1[0].#subform[10].P10_Line1_Citizen[0]"] = "/N"

        # Spouse citizenship by birth
        if data.get("spouse_citizenship_by_birth") == "yes":
            fields["form1[0].#subform[3].P10_Line5a_When[0]"] = "/B"
        elif data.get("spouse_citizenship_by_birth") == "no":
            fields["form1[0].#subform[3].P10_Line5a_When[1]"] = "/O"
            if data.get("spouse_date_became_citizen"):
                fields["form1[0].#subform[3].P10_Line5b_DateBecame[0]"] = format_date(data["spouse_date_became_citizen"])

        # Spouse A-number (Page 5)
        if data.get("spouse_a_number"):
            fields["form1[0].#subform[4].#area[5].P7_Line6_ANumber[0]"] = data["spouse_a_number"]

        # Spouse times married (Page 5 - Q7)
        if data.get("spouse_times_married"):
            fields["form1[0].#subform[4].P10_Line4g_Employer[0]"] = str(data["spouse_times_married"])

        # Spouse employer (Page 5 - Q8)
        if data.get("spouse_current_employer"):
            fields["form1[0].#subform[4].TextField1[0]"] = data["spouse_current_employer"]

    # ═══════════════════════════════════════════════════════════════
    # PART 6: CHILDREN (Page 5)
    # ═══════════════════════════════════════════════════════════════
    if data.get("total_children"):
        fields["form1[0].#subform[4].P11_Line1_TotalChildren[0]"] = str(data["total_children"])

    children = data.get("children", [])
    for i, child in enumerate(children[:3]):
        idx = i + 1
        if child.get("first_name") or child.get("last_name"):
            name = f"{child.get('first_name', '')} {child.get('last_name', '')}".strip()
            fields[f"form1[0].#subform[4].P7_EmployerName{idx}[0]"] = name
        if child.get("date_of_birth"):
            fields[f"form1[0].#subform[4].P7_From{idx}[0]"] = format_date(child["date_of_birth"])
        if child.get("residence"):
            fields[f"form1[0].#subform[4].P7_OccupationFieldStudy{idx}[0]"] = child["residence"]
        if child.get("relationship"):
            fields[f"form1[0].#subform[4].P7_OccupationFieldStudy{idx}[1]"] = child["relationship"]

        support_val = child.get("support") or data.get("providing_support_for_children")
        if support_val:
            if idx == 1:
                if support_val == "yes":
                    fields["form1[0].#subform[4].P9_Line5a[0]"] = "/Y"
                elif support_val == "no":
                    fields["form1[0].#subform[4].P9_Line5a[1]"] = "/N"
            elif idx == 2:
                if support_val == "yes":
                    fields["form1[0].#subform[4].P6_ChildTwo[1]"] = "/Y"
                elif support_val == "no":
                    fields["form1[0].#subform[4].P6_ChildTwo[0]"] = "/N"
            elif idx == 3:
                if support_val == "yes":
                    fields["form1[0].#subform[4].P6_ChildThree[1]"] = "/Y"
                elif support_val == "no":
                    fields["form1[0].#subform[4].P6_ChildThree[0]"] = "/N"

    # ═══════════════════════════════════════════════════════════════
    # PART 3: EMPLOYMENT (Page 5)
    # Uses P5_EmployerName for Name column, P7_ for other columns
    # ═══════════════════════════════════════════════════════════════
    employment_history = data.get("employment_history", [])

    # Employment 1
    emp1 = employment_history[0] if len(employment_history) > 0 else {}
    employer1 = emp1.get("employer_or_school") or data.get("current_employer", "")
    if employer1:
        fields["form1[0].#subform[4].P5_EmployerName1[0]"] = employer1
    occupation1 = emp1.get("occupation_or_field") or data.get("current_occupation", "")
    if occupation1:
        fields["form1[0].#subform[4].P7_OccupationFieldStudy1[2]"] = occupation1
    city1 = emp1.get("city") or data.get("employer_city", "")
    if city1:
        fields["form1[0].#subform[4].P7_City1[0]"] = city1
    state1 = emp1.get("state") or data.get("employer_state", "")
    if state1:
        fields["form1[0].#subform[4].P7_State1[0]"] = state1
    if emp1.get("zip_code"):
        fields["form1[0].#subform[4].P7_ZipCode1[0]"] = emp1["zip_code"]
    if emp1.get("country"):
        fields["form1[0].#subform[4].P7_Country1[0]"] = emp1["country"]
    from1 = emp1.get("dates_from") or data.get("employment_from", "")
    if from1:
        fields["form1[0].#subform[4].P7_From1[1]"] = format_date(from1)

    # Employment 2
    if len(employment_history) > 1:
        emp2 = employment_history[1]
        if emp2.get("employer_or_school"):
            fields["form1[0].#subform[4].P5_EmployerName2[0]"] = emp2["employer_or_school"]
        if emp2.get("occupation_or_field"):
            fields["form1[0].#subform[4].P7_OccupationFieldStudy2[2]"] = emp2["occupation_or_field"]
        if emp2.get("city"):
            fields["form1[0].#subform[4].P7_City2[0]"] = emp2["city"]
        if emp2.get("state"):
            fields["form1[0].#subform[4].P7_State2[0]"] = emp2["state"]
        if emp2.get("zip_code"):
            fields["form1[0].#subform[4].P7_ZipCode2[0]"] = emp2["zip_code"]
        if emp2.get("country"):
            fields["form1[0].#subform[4].P7_Country2[0]"] = emp2["country"]
        if emp2.get("dates_from"):
            fields["form1[0].#subform[4].P7_From2[1]"] = format_date(emp2["dates_from"])
        if emp2.get("dates_to"):
            fields["form1[0].#subform[4].P7_To2[0]"] = format_date(emp2["dates_to"])

    # Employment 3
    if len(employment_history) > 2:
        emp3 = employment_history[2]
        if emp3.get("employer_or_school"):
            fields["form1[0].#subform[4].P5_EmployerName3[0]"] = emp3["employer_or_school"]
        if emp3.get("occupation_or_field"):
            fields["form1[0].#subform[4].P7_OccupationFieldStudy3[2]"] = emp3["occupation_or_field"]
        if emp3.get("city"):
            fields["form1[0].#subform[4].P7_City3[0]"] = emp3["city"]
        if emp3.get("state"):
            fields["form1[0].#subform[4].P7_State3[0]"] = emp3["state"]
        if emp3.get("zip_code"):
            fields["form1[0].#subform[4].P7_ZipCode3[0]"] = emp3["zip_code"]
        if emp3.get("country"):
            fields["form1[0].#subform[4].P7_Country3[0]"] = emp3["country"]
        if emp3.get("dates_from"):
            fields["form1[0].#subform[4].P7_From3[1]"] = format_date(emp3["dates_from"])
        if emp3.get("dates_to"):
            fields["form1[0].#subform[4].P7_To3[0]"] = format_date(emp3["dates_to"])

    # ═══════════════════════════════════════════════════════════════
    # PART 4: TIME OUTSIDE US (Pages 5-6)
    # ═══════════════════════════════════════════════════════════════
    # Trips (up to 6)
    trips = data.get("trips", [])
    for i, trip in enumerate(trips[:6]):
        idx = i + 1
        if trip.get("date_left_us"):
            fields[f"form1[0].#subform[5].P8_Line1_DateLeft{idx}[0]"] = format_date(trip["date_left_us"])
        if trip.get("date_returned_us"):
            fields[f"form1[0].#subform[5].P8_Line1_DateReturn{idx}[0]"] = format_date(trip["date_returned_us"])
        if trip.get("countries_traveled"):
            if idx == 1:
                fields["form1[0].#subform[5].P9_Line1_Countries1[0]"] = trip["countries_traveled"]
            else:
                fields[f"form1[0].#subform[5].P8_Line1_Countries{idx}[0]"] = trip["countries_traveled"]

    # ═══════════════════════════════════════════════════════════════
    # PART 12: BACKGROUND QUESTIONS (Pages 6-10)
    # ═══════════════════════════════════════════════════════════════

    # --- Page 6 (subform[5]) ---
    set_yes_no("form1[0].#subform[5].P9_Line1", data.get("q_claimed_us_citizen", ""))
    set_yes_no("form1[0].#subform[5].P9_Line2", data.get("q_voted_in_us", ""))
    # Q3/Q4 have reversed states: [0]=Y, [1]=N
    set_yes_no("form1[0].#subform[5].P9_Line3", data.get("q_failed_to_file_taxes", ""), yes_idx=0, no_idx=1)
    set_yes_no("form1[0].#subform[5].P9_Line4", data.get("q_owe_taxes", ""), yes_idx=0, no_idx=1)
    # Q5 Communist/Totalitarian
    set_yes_no("form1[0].#subform[5].P9_5a", data.get("q_communist_party", ""), yes_idx=0, no_idx=1)
    set_yes_no("form1[0].#subform[5].P9_5b", data.get("q_terrorist_org", ""), yes_idx=0, no_idx=1)

    # --- Page 7 (subform[6]) Q6-Q14 ---
    # Q6.a - Used weapon
    set_yes_no("form1[0].#subform[6].P12_6a", data.get("q_used_weapon_explosive", ""))
    # Q6.b - Kidnapping (REVERSED: [0]=Y, [1]=N)
    set_yes_no("form1[0].#subform[6].P12_6b", data.get("q_kidnapping_assassination_hijacking", ""), yes_idx=0, no_idx=1)
    # Q6.c - Threatened violence
    set_yes_no("form1[0].#subform[6].P12_6c", data.get("q_threatened_weapon_violence", ""))

    # Q7.a - Torture
    set_yes_no("form1[0].#subform[6].P9_Line7a", data.get("q_torture", ""))
    # Q7.b - Genocide
    set_yes_no("form1[0].#subform[6].P9_Line7\\.b\\.", data.get("q_genocide", ""))
    # Q7.c - Killing
    set_yes_no("form1[0].#subform[6].P9_Line7\\.c", data.get("q_killing_person", ""))
    # Q7.d - Severe injury (using P11_7d)
    set_yes_no("form1[0].#subform[6].P11_7d", data.get("q_severely_injuring", ""))
    # Q7.e - Sexual contact
    set_yes_no("form1[0].#subform[6].P9_Line7\\.e", data.get("q_sexual_contact_nonconsent", ""))
    # Q7.f - Religious persecution
    set_yes_no("form1[0].#subform[6].P9_Line7\\.f", data.get("q_religious_persecution", ""))
    # Q7.g - Harm based on race/religion
    set_yes_no("form1[0].#subform[6].P9_Line7\\.g", data.get("q_harm_race_religion", ""))

    # Q8.a - Military/police service
    set_yes_no("form1[0].#subform[6].P9_Line8a", data.get("q_military_police_service", ""))
    # Q8.b - Armed group
    set_yes_no("form1[0].#subform[6].P9_Line8b", data.get("q_armed_group", ""))

    # Q9 - Detention facility
    set_yes_no("form1[0].#subform[6].P9_Line9", data.get("q_detention_facility", ""))

    # Q10.a - Group used weapons
    set_yes_no("form1[0].#subform[6].P9_Line10a", data.get("q_group_used_weapons", ""))
    # Q10.b - Used weapon against person
    set_yes_no("form1[0].#subform[6].P9_Line10b", data.get("q_used_weapon_against_person", ""))
    # Q10.c - Threatened weapon (REVERSED: [0]=Y, [1]=N)
    set_yes_no("form1[0].#subform[6].P9_Line10c", data.get("q_threatened_weapon_use", ""), yes_idx=0, no_idx=1)

    # Q11 - Sold/provided weapons
    set_yes_no("form1[0].#subform[6].P9_Line11", data.get("q_sold_provided_weapons", ""))
    # Q12 - Weapons training
    set_yes_no("form1[0].#subform[6].P9_Line12", data.get("q_weapons_training", ""))
    # Q13 - Recruited under 15
    set_yes_no("form1[0].#subform[6].P9_Line13", data.get("q_recruited_under_15", ""))
    # Q14 - Used under 15 in hostilities
    set_yes_no("form1[0].#subform[6].P9_Line14", data.get("q_used_under_15_hostilities", ""))

    # --- Page 8 (subform[7]) Q15-16, Q22 ---
    # Q15.a - Committed crime not arrested
    set_yes_no("form1[0].#subform[8].P12_Line20", data.get("q_committed_crime_not_arrested", ""))
    # Q15.b - Arrested
    set_yes_no("form1[0].#subform[8].P12_Line21", data.get("q_arrested", ""))

    # Q18 - False info to govt
    set_yes_no("form1[0].#subform[8].P12_Line23", data.get("q_false_info_us_government", ""))
    # Q19 - Lied to govt
    set_yes_no("form1[0].#subform[8].P12_Line24", data.get("q_lied_us_government", ""))
    # Q20 - Removed/deported
    set_yes_no("form1[0].#subform[8].P12_Line25", data.get("q_removed_deported", ""))

    # Q22.a - Male 18-26
    set_yes_no("form1[0].#subform[7].P12_Line16", data.get("q_male_18_26_lived_us", ""))

    # --- Page 9 (subform[9]) Q25-29, Q30-37 ---
    # Q25 - Served US military (REVERSED: [0]=Y, [1]=N)
    set_yes_no("form1[0].#subform[9].P12_Line33", data.get("q_served_us_military", ""), yes_idx=0, no_idx=1)
    # Q27 - Court martialed
    set_yes_no("form1[0].#subform[9].P12_Line27", data.get("q_court_martialed", ""))
    # Q28 - Discharged because alien
    set_yes_no("form1[0].#subform[9].P12_Line28", data.get("q_discharged_because_alien", ""))
    # Q29 - Deserted
    set_yes_no("form1[0].#subform[9].P12_Line34", data.get("q_deserted_military", ""))

    # Q17 - Prostitution (REVERSED: [0]=Y, [1]=N)
    set_yes_no("form1[0].#subform[9].P12_Line30a", data.get("q_prostitution", ""), yes_idx=0, no_idx=1)
    # Q17 - Controlled substances (REVERSED)
    set_yes_no("form1[0].#subform[9].P12_Line30b", data.get("q_controlled_substances", ""), yes_idx=0, no_idx=1)

    # Q17 - Gambling
    set_yes_no("form1[0].#subform[9].P12_Line31", data.get("q_illegal_gambling", ""))
    # Q17 - Failed child support (REVERSED: [0]=Y, [1]=N)
    set_yes_no("form1[0].#subform[9].P12_Line32", data.get("q_failed_child_support", ""), yes_idx=0, no_idx=1)

    # Q31 - Support constitution (REVERSED: [0]=Y, [1]=N)
    set_yes_no("form1[0].#subform[9].P12_Line35", data.get("q_support_constitution", ""), yes_idx=0, no_idx=1)
    # Q34 - Willing take oath
    set_yes_no("form1[0].#subform[9].P12_Line36", data.get("q_willing_take_oath", ""))
    # Q35 - Bear arms (REVERSED: [0]=Y, [1]=N)
    set_yes_no("form1[0].#subform[9].P12_Line37", data.get("q_willing_bear_arms", ""), yes_idx=0, no_idx=1)

    # ═══════════════════════════════════════════════════════════════
    # PART 13: CONTACT INFO (Page 11)
    # ═══════════════════════════════════════════════════════════════
    if data.get("daytime_phone"):
        fields["form1[0].#subform[10].P12_Line3_Telephone[0]"] = data["daytime_phone"]
    if data.get("mobile_phone"):
        fields["form1[0].#subform[10].P12_Line3_Mobile[0]"] = data["mobile_phone"]
    if data.get("email"):
        fields["form1[0].#subform[10].P12_Line5_Email[0]"] = data["email"]

    if data.get("signature_date"):
        fields["form1[0].#subform[10].P13_DateofSignature[0]"] = format_date(data["signature_date"])
    if data.get("applicant_signature"):
        fields["form1[0].#subform[10].P12_SignatureApplicant[0]"] = data["applicant_signature"]

    # Fee Reduction
    if data.get("fee_reduction_requested") == "yes":
        fields["form1[0].#subform[10].P10_Line1_Citizen[1]"] = "/Y"
    elif data.get("fee_reduction_requested") == "no":
        fields["form1[0].#subform[10].P10_Line1_Citizen[0]"] = "/N"

    if data.get("household_income"):
        fields["form1[0].#subform[10].P10_Line2_TotalHouseholdIn[0]"] = data["household_income"]
    if data.get("household_size"):
        fields["form1[0].#subform[10].P10_Line3_HouseHoldSize[0]"] = str(data["household_size"])
    if data.get("is_head_of_household") == "yes":
        fields["form1[0].#subform[10].P10_Line5a[1]"] = "/Y"
    elif data.get("is_head_of_household") == "no":
        fields["form1[0].#subform[10].P10_Line5a[0]"] = "/N"
    if data.get("head_of_household_name"):
        fields["form1[0].#subform[10].P10_Line5b_NameOfHousehold[0]"] = data["head_of_household_name"]

    # ═══════════════════════════════════════════════════════════════
    # PART 14: INTERPRETER (Page 12)
    # ═══════════════════════════════════════════════════════════════
    if data.get("used_interpreter") == "yes":
        if data.get("interpreter_last_name"):
            fields["form1[0].#subform[11].P14_Line1_nterpreterFamilyName[0]"] = data["interpreter_last_name"]
        if data.get("interpreter_first_name"):
            fields["form1[0].#subform[11].P14_Line1_nterpreterGivenName[0]"] = data["interpreter_first_name"]
        if data.get("interpreter_business_name"):
            fields["form1[0].#subform[11].P14_Line2_NameofBusinessorOrgName[0]"] = data["interpreter_business_name"]
        if data.get("interpreter_phone"):
            fields["form1[0].#subform[11].P14_Line4_Telephone[0]"] = data["interpreter_phone"]
        if data.get("interpreter_mobile"):
            fields["form1[0].#subform[11].P14_Line5_Mobile[0]"] = data["interpreter_mobile"]
        if data.get("interpreter_email"):
            fields["form1[0].#subform[11].P14_Line5_EmailAddress[0]"] = data["interpreter_email"]
        if data.get("interpreter_language"):
            fields["form1[0].#subform[11].P14_NameOfLanguage[0]"] = data["interpreter_language"]
        if data.get("interpreter_signature_date"):
            fields["form1[0].#subform[11].P14_DateofSignature[0]"] = format_date(data["interpreter_signature_date"])

    # ═══════════════════════════════════════════════════════════════
    # PART 15: PREPARER (Page 12)
    # ═══════════════════════════════════════════════════════════════
    if data.get("used_preparer") == "yes":
        if data.get("preparer_last_name"):
            fields["form1[0].#subform[11].P15_Line1_PreparerFamilyName[0]"] = data["preparer_last_name"]
        if data.get("preparer_first_name"):
            fields["form1[0].#subform[11].P15_Line1_PreparerGivenName[0]"] = data["preparer_first_name"]
        if data.get("preparer_business_name"):
            fields["form1[0].#subform[11].P15_Line2_NameofBusinessorOrgName[0]"] = data["preparer_business_name"]
        if data.get("preparer_phone"):
            fields["form1[0].#subform[11].P15_Line4_Telephone[0]"] = data["preparer_phone"]
        if data.get("preparer_mobile"):
            fields["form1[0].#subform[11].P15_Line5_Mobile[0]"] = data["preparer_mobile"]
        if data.get("preparer_email"):
            fields["form1[0].#subform[11].P15_Line6_Email[0]"] = data["preparer_email"]
        if data.get("preparer_signature_date"):
            fields["form1[0].#subform[11].P15_DateofSignature[0]"] = format_date(data["preparer_signature_date"])

    # ═══════════════════════════════════════════════════════════════
    # PART 16: ADDITIONAL INFORMATION (Pages 13-14)
    # ═══════════════════════════════════════════════════════════════
    additional_entries = data.get("additional_information", [])
    additional_field_sets = [
        ("P11_Line3A", "P11_Line3B", "P11_Line3C", "P11_Line3D"),
        ("P11_Line4A", "P11_Line4B", "P11_Line4C", "P11_Line4D"),
        ("P11_Line5A", "P11_Line5B", "P11_Line5C", "P11_Line5D"),
        ("P11_Line6A", "P11_Line6B", "P11_Line6C", "P11_Line6D"),
    ]
    for idx, entry in enumerate(additional_entries[:4]):
        page_field, part_field, item_field, explanation_field = additional_field_sets[idx]
        if entry.get("page_number"):
            fields[f"form1[0].#subform[12].{page_field}[0]"] = entry["page_number"]
        if entry.get("part_number"):
            fields[f"form1[0].#subform[12].{part_field}[0]"] = entry["part_number"]
        if entry.get("item_number"):
            fields[f"form1[0].#subform[12].{item_field}[0]"] = entry["item_number"]
        if entry.get("explanation"):
            fields[f"form1[0].#subform[12].{explanation_field}[0]"] = entry["explanation"]

    return fields


def fill_pdf(template_path: str, field_data: dict) -> bytes:
    """
    Fill PDF with form data and return bytes.

    This mirrors the working logic from scripts/fill-pdf.py:
    - Decrypts if needed
    - Sets /NeedAppearances so viewers render updated fields
    - Applies all fields across all pages via update_page_form_field_values
    """
    print(f"📄 Loading PDF from: {template_path}")

    reader = PdfReader(template_path)

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
    filled_count = 0

    # Apply mapping on every page
    for page_index, page in enumerate(writer.pages):
        try:
            writer.update_page_form_field_values(
                page,
                field_data,
                auto_regenerate=True,
            )
            print(f"  ✓ Applied mapping on page {page_index + 1}")
        except Exception as e:
            print(f"  ✗ Error applying fields on page {page_index + 1}: {e}")

    # Count how many of our target fields exist in the PDF
    for field_name in field_data.keys():
        if field_name in fields:
            filled_count += 1

    print(f"Filled up to {filled_count} of {len(field_data)} mapped fields")

    output = io.BytesIO()
    writer.write(output)
    output.seek(0)

    return output.getvalue()


@app.route("/health", methods=["GET"])
def health():
    template_exists = os.path.exists(TEMPLATE_PATH)
    return jsonify({"status": "healthy", "template_exists": template_exists})


@app.route("/generate", methods=["POST"])
def generate_pdf():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        if not os.path.exists(TEMPLATE_PATH):
            return jsonify({"error": "PDF template not found"}), 500

        print(f"Received {len(data)} fields from form")

        field_data = map_form_data_to_pdf_fields(data)
        print(f"Mapped to {len(field_data)} PDF fields")

        pdf_bytes = fill_pdf(TEMPLATE_PATH, field_data)

        last_name = data.get("last_name", "Unknown")
        first_name = data.get("first_name", "Applicant")
        filename = f"N-400_{last_name}_{first_name}.pdf".replace(" ", "_")

        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename
        )

    except Exception as e:
        print(f"Error generating PDF: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/fields", methods=["GET"])
def list_fields():
    if not os.path.exists(TEMPLATE_PATH):
        return jsonify({"error": "Template not found"}), 404

    reader = PdfReader(TEMPLATE_PATH)
    if reader.is_encrypted:
        reader.decrypt('')

    fields = reader.get_fields()
    field_names = list(fields.keys()) if fields else []

    return jsonify({
        "total_fields": len(field_names),
        "fields": field_names[:200],
    })


@app.route("/test", methods=["GET"])
def test_pdf():
    sample_data = {
        "eligibility_basis": "5year",
        "first_name": "Maria",
        "last_name": "Rodriguez",
        "a_number": "123456789",
    }

    field_data = map_form_data_to_pdf_fields(sample_data)
    pdf_bytes = fill_pdf(TEMPLATE_PATH, field_data)

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name="N-400_TEST.pdf"
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
