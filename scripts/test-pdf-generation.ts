/**
 * Test PDF Generation Script
 * 
 * This script tests PDF generation directly without Supabase.
 * Run with: npx tsx scripts/test-pdf-generation.ts
 */

import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import { mapIntakeFormToN400, IntakeFormData } from "../lib/pdf-utils";

// Sample test data - a complete N-400 applicant
const sampleIntakeData: IntakeFormData = {
  // ═══════════════════════════════════════════════════════════════
  // PART 1: ELIGIBILITY
  // ═══════════════════════════════════════════════════════════════
  eligibility_basis: "5year",

  // ═══════════════════════════════════════════════════════════════
  // PART 2: INFORMATION ABOUT YOU
  // ═══════════════════════════════════════════════════════════════
  first_name: "Maria",
  middle_name: "Elena",
  last_name: "Rodriguez",
  has_used_other_names: "no",
  date_of_birth: "1985-03-15",
  country_of_birth: "Mexico",
  country_of_citizenship: "Mexico",
  gender: "female",

  // Identification Numbers
  a_number: "123456789",
  uscis_account_number: "USC1234567890",
  ssn: "123-45-6789",

  // Green Card Information
  date_became_permanent_resident: "2019-06-20",

  // ═══════════════════════════════════════════════════════════════
  // PART 4: CONTACT INFORMATION
  // ═══════════════════════════════════════════════════════════════
  daytime_phone: "555-123-4567",
  mobile_phone: "555-987-6543",
  email: "maria.rodriguez@email.com",

  // ═══════════════════════════════════════════════════════════════
  // PART 5: RESIDENCE INFORMATION
  // ═══════════════════════════════════════════════════════════════
  street_address: "1234 Main Street",
  apt_ste_flr: "Apt 5B",
  city: "Los Angeles",
  state: "CA",
  zip_code: "90001",
  residence_from: "06/20/2019",

  // ═══════════════════════════════════════════════════════════════
  // PART 7: BIOGRAPHIC INFORMATION
  // ═══════════════════════════════════════════════════════════════
  ethnicity: "hispanic",
  race: "white",
  height_feet: "5",
  height_inches: "6",
  weight: "145",
  eye_color: "Brown",
  hair_color: "Black",

  // ═══════════════════════════════════════════════════════════════
  // PART 8: EMPLOYMENT
  // ═══════════════════════════════════════════════════════════════
  current_employer: "Tech Solutions Inc.",
  current_occupation: "Software Engineer",
  employer_city: "Los Angeles",
  employer_state: "CA",
  employment_from: "01/15/2020",

  // ═══════════════════════════════════════════════════════════════
  // PART 9: TIME OUTSIDE THE US
  // ═══════════════════════════════════════════════════════════════
  total_days_outside_us: "45",
  trips_over_6_months: "no",

  // ═══════════════════════════════════════════════════════════════
  // PART 10: MARITAL HISTORY
  // ═══════════════════════════════════════════════════════════════
  marital_status: "married",
  times_married: "1",
  spouse_first_name: "Carlos",
  spouse_middle_name: "Antonio",
  spouse_last_name: "Rodriguez",
  spouse_date_of_birth: "1983-07-22",
  spouse_date_of_marriage: "2010-09-15",
  spouse_is_us_citizen: "yes",
  spouse_a_number: "987654321",
  spouse_country_of_birth: "Mexico",
  spouse_current_employer: "City Hospital",

  // ═══════════════════════════════════════════════════════════════
  // PART 11: CHILDREN
  // ═══════════════════════════════════════════════════════════════
  total_children: "2",

  // ═══════════════════════════════════════════════════════════════
  // PART 12: BACKGROUND QUESTIONS
  // ═══════════════════════════════════════════════════════════════
  q_claimed_us_citizen: "no",
  q_voted_in_us: "no",
  q_failed_to_file_taxes: "no",
  q_owe_taxes: "no",
  q_title_of_nobility: "no",
  q_communist_party: "no",
  q_terrorist_org: "no",
  q_genocide: "no",
  q_torture: "no",
  q_arrested: "no",
  q_habitual_drunkard: "no",
  q_prostitution: "no",
  q_illegal_gambling: "no",
  q_failed_child_support: "no",
  q_served_us_military: "no",
  q_deserted_military: "no",
};

async function testPDFGeneration() {
  console.log("🚀 Starting PDF generation test...\n");

  // Check template exists
  const templatePath = path.join(process.cwd(), "templates", "n-400.pdf");
  
  if (!fs.existsSync(templatePath)) {
    console.error("❌ N-400 template not found at:", templatePath);
    console.log("\n💡 Make sure n-400.pdf is in the templates/ folder");
    process.exit(1);
  }
  
  console.log("✓ Found PDF template");

  // Load PDF
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  });
  
  console.log("✓ Loaded PDF document");

  // Get form
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  console.log(`✓ Found ${fields.length} form fields in PDF\n`);

  // Get field mappings
  const fieldMappings = mapIntakeFormToN400(sampleIntakeData);
  console.log(`📋 Mapping ${Object.keys(fieldMappings).length} fields from intake data\n`);

  // Track results
  let successCount = 0;
  let failCount = 0;
  const failures: string[] = [];

  // Fill in the form fields
  for (const [fieldName, value] of Object.entries(fieldMappings)) {
    try {
      if (typeof value === "boolean" && value === true) {
        // Handle checkbox fields
        try {
          const checkbox = form.getCheckBox(fieldName);
          checkbox.check();
          successCount++;
          console.log(`  ✓ [Checkbox] ${fieldName}`);
        } catch {
          // Try as radio button
          try {
            const radio = form.getRadioGroup(fieldName);
            radio.select(radio.getOptions()[0]);
            successCount++;
            console.log(`  ✓ [Radio] ${fieldName}`);
          } catch {
            failCount++;
            failures.push(`${fieldName} (checkbox/radio not found)`);
            console.log(`  ✗ [Missing] ${fieldName}`);
          }
        }
      } else if (typeof value === "string" && value) {
        // Handle text fields
        try {
          const textField = form.getTextField(fieldName);
          textField.setText(value);
          successCount++;
          console.log(`  ✓ [Text] ${fieldName} = "${value.substring(0, 30)}${value.length > 30 ? '...' : ''}"`);
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
              successCount++;
              console.log(`  ✓ [Dropdown] ${fieldName} = "${match}"`);
            } else {
              failCount++;
              failures.push(`${fieldName} (dropdown option not found)`);
              console.log(`  ✗ [Dropdown] ${fieldName} - no matching option for "${value}"`);
            }
          } catch {
            failCount++;
            failures.push(`${fieldName} (field not found)`);
            console.log(`  ✗ [Missing] ${fieldName}`);
          }
        }
      }
    } catch (err) {
      failCount++;
      failures.push(`${fieldName} (error: ${err})`);
      console.log(`  ✗ [Error] ${fieldName}: ${err}`);
    }
  }

  // Summary
  console.log("\n" + "═".repeat(60));
  console.log("📊 SUMMARY");
  console.log("═".repeat(60));
  console.log(`  ✓ Successfully filled: ${successCount} fields`);
  console.log(`  ✗ Failed: ${failCount} fields`);
  console.log(`  📈 Success rate: ${((successCount / (successCount + failCount)) * 100).toFixed(1)}%`);

  if (failures.length > 0) {
    console.log("\n❌ Failed fields:");
    failures.forEach((f) => console.log(`  - ${f}`));
  }

  // Save the filled PDF
  const outputPath = path.join(process.cwd(), "test-output", "N-400_Test_Maria_Rodriguez.pdf");
  
  // Create output directory if needed
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  
  console.log("\n✅ PDF saved to:", outputPath);
  console.log("\n💡 Open the PDF to verify fields are filled correctly!");
}

testPDFGeneration().catch(console.error);
