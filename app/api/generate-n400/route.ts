import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase";
import { mapIntakeFormToN400, IntakeFormData } from "@/lib/pdf-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, flatten = false } = body;

    // Fetch form data from Supabase
    let dbData;

    if (formId) {
      const { data, error } = await supabaseAdmin
        .from("n400_forms")
        .select("*")
        .eq("id", formId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 });
      }
      dbData = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("n400_forms")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "No form submissions found" }, { status: 404 });
      }
      dbData = data;
    }

    // Transform DB data to intake form format
    const intakeData: IntakeFormData = {
      // ═══════════════════════════════════════════════════════════════
      // PART 1: ELIGIBILITY
      // ═══════════════════════════════════════════════════════════════
      eligibility_basis: dbData.eligibility_basis || "5year",
      other_basis_reason: dbData.other_basis_reason,

      // ═══════════════════════════════════════════════════════════════
      // PART 2: INFORMATION ABOUT YOU
      // ═══════════════════════════════════════════════════════════════
      first_name: dbData.first_name || "",
      middle_name: dbData.middle_name || "",
      last_name: dbData.last_name || "",
      has_used_other_names: dbData.has_used_other_names || "no",
      date_of_birth: dbData.date_of_birth || "",
      country_of_birth: dbData.country_of_birth || "",
      country_of_citizenship: dbData.country_of_citizenship || "",
      gender: dbData.gender || "",

      // Identification Numbers
      a_number: dbData.a_number || "",
      uscis_account_number: dbData.uscis_account_number || "",
      ssn: dbData.ssn || "",

      // Green Card Information
      date_became_permanent_resident: dbData.date_became_permanent_resident || "",

      // ═══════════════════════════════════════════════════════════════
      // PART 4: CONTACT INFORMATION
      // ═══════════════════════════════════════════════════════════════
      daytime_phone: dbData.daytime_phone || "",
      mobile_phone: dbData.mobile_phone || "",
      email: dbData.email || "",

      // ═══════════════════════════════════════════════════════════════
      // PART 5: RESIDENCE INFORMATION
      // ═══════════════════════════════════════════════════════════════
      street_address: dbData.street_address || "",
      apt_ste_flr: dbData.apt_ste_flr || "",
      city: dbData.city || "",
      state: dbData.state || "",
      zip_code: dbData.zip_code || "",
      residence_from: dbData.residence_from || "",

      // ═══════════════════════════════════════════════════════════════
      // PART 7: BIOGRAPHIC INFORMATION
      // ═══════════════════════════════════════════════════════════════
      ethnicity: dbData.ethnicity || "not_hispanic",
      race: dbData.race || "white",
      height_feet: dbData.height_feet || "5",
      height_inches: dbData.height_inches || "6",
      weight: dbData.weight || "150",
      eye_color: dbData.eye_color || "Brown",
      hair_color: dbData.hair_color || "Black",

      // ═══════════════════════════════════════════════════════════════
      // PART 8: EMPLOYMENT
      // ═══════════════════════════════════════════════════════════════
      current_employer: dbData.current_employer || "",
      current_occupation: dbData.current_occupation || "",
      employer_city: dbData.employer_city || "",
      employer_state: dbData.employer_state || "",
      employment_from: dbData.employment_from || "",

      // ═══════════════════════════════════════════════════════════════
      // PART 9: TIME OUTSIDE THE US
      // ═══════════════════════════════════════════════════════════════
      total_days_outside_us: dbData.total_days_outside_us || "",
      trips_over_6_months: dbData.trips_over_6_months || "no",

      // ═══════════════════════════════════════════════════════════════
      // PART 10: MARITAL HISTORY
      // ═══════════════════════════════════════════════════════════════
      marital_status: dbData.marital_status || "single",
      times_married: dbData.times_married || "",
      spouse_first_name: dbData.spouse_first_name || "",
      spouse_middle_name: dbData.spouse_middle_name || "",
      spouse_last_name: dbData.spouse_last_name || "",
      spouse_date_of_birth: dbData.spouse_date_of_birth || "",
      spouse_date_of_marriage: dbData.spouse_date_of_marriage || "",
      spouse_is_us_citizen: dbData.spouse_is_us_citizen || "",
      spouse_a_number: dbData.spouse_a_number || "",
      spouse_country_of_birth: dbData.spouse_country_of_birth || "",
      spouse_current_employer: dbData.spouse_current_employer || "",

      // ═══════════════════════════════════════════════════════════════
      // PART 11: CHILDREN
      // ═══════════════════════════════════════════════════════════════
      total_children: dbData.total_children || "0",

      // ═══════════════════════════════════════════════════════════════
      // PART 12: BACKGROUND QUESTIONS
      // ═══════════════════════════════════════════════════════════════
      // General Eligibility
      q_claimed_us_citizen: dbData.q_claimed_us_citizen || "no",
      q_voted_in_us: dbData.q_voted_in_us || "no",
      q_failed_to_file_taxes: dbData.q_failed_to_file_taxes || "no",
      q_owe_taxes: dbData.q_owe_taxes || "no",
      q_title_of_nobility: dbData.q_title_of_nobility || "no",

      // Affiliations
      q_communist_party: dbData.q_communist_party || "no",
      q_terrorist_org: dbData.q_terrorist_org || "no",
      q_genocide: dbData.q_genocide || "no",
      q_torture: dbData.q_torture || "no",

      // Moral Character
      q_arrested: dbData.q_arrested || "no",
      q_habitual_drunkard: dbData.q_habitual_drunkard || "no",
      q_prostitution: dbData.q_prostitution || "no",
      q_illegal_gambling: dbData.q_illegal_gambling || "no",
      q_failed_child_support: dbData.q_failed_child_support || "no",

      // Military
      q_served_us_military: dbData.q_served_us_military || "no",
      q_deserted_military: dbData.q_deserted_military || "no",
    };

    // Load the N-400 PDF template
    const templatePath = path.join(process.cwd(), "templates", "n-400.pdf");

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        {
          error: "N-400 template not found",
          hint: "Download from https://www.uscis.gov/n-400 and place in templates/n-400.pdf",
        },
        { status: 500 }
      );
    }

    const templateBytes = fs.readFileSync(templatePath);

    // Load with ignoreEncryption for government forms
    const pdfDoc = await PDFDocument.load(templateBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    // Get the form
    const form = pdfDoc.getForm();

    // Get field mappings
    const fieldMappings = mapIntakeFormToN400(intakeData);

    // Fill in the form fields
    for (const [fieldName, value] of Object.entries(fieldMappings)) {
      try {
        if (typeof value === "boolean" && value === true) {
          // Handle checkbox fields
          try {
            const checkbox = form.getCheckBox(fieldName);
            checkbox.check();
          } catch {
            // Try as radio button
            try {
              const radio = form.getRadioGroup(fieldName);
              radio.select(radio.getOptions()[0]);
            } catch {
              // Field might not exist or have different type
            }
          }
        } else if (typeof value === "string" && value) {
          // Handle text fields
          try {
            const textField = form.getTextField(fieldName);
            textField.setText(value);
          } catch {
            // Try as dropdown
            try {
              const dropdown = form.getDropdown(fieldName);
              const options = dropdown.getOptions();
              const match = options.find(
                (opt) =>
                  opt.toLowerCase().includes(value.toLowerCase()) ||
                  value.toLowerCase().includes(opt.toLowerCase())
              );
              if (match) {
                dropdown.select(match);
              }
            } catch {
              console.warn(`Could not fill field: ${fieldName}`);
            }
          }
        }
      } catch (err) {
        console.warn(`Field error for ${fieldName}:`, err);
      }
    }

    // Optionally flatten (makes fields non-editable)
    if (flatten) {
      form.flatten();
    }

    // Save the filled PDF
    const pdfBytes = await pdfDoc.save();

    // Generate filename
    const filename = `N-400_${intakeData.last_name}_${intakeData.first_name}.pdf`.replace(/\s+/g, "_");

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to inspect PDF fields (for development)
export async function GET() {
  try {
    const templatePath = path.join(process.cwd(), "templates", "n-400.pdf");

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        {
          error: "N-400 template not found",
          hint: "Add n-400.pdf to the templates folder",
        },
        { status: 404 }
      );
    }

    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes, {
      ignoreEncryption: true,
    });
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const fieldInfo = fields.map((field) => ({
      name: field.getName(),
      type: field.constructor.name,
    }));

    return NextResponse.json({
      fieldCount: fields.length,
      fields: fieldInfo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to read PDF fields",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
