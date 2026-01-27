/**
 * List all PDF form fields
 * Run with: npx tsx scripts/list-pdf-fields.ts
 */

import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

async function listPDFFields() {
  const templatePath = path.join(process.cwd(), "templates", "n-400.pdf");
  
  if (!fs.existsSync(templatePath)) {
    console.error("❌ N-400 template not found");
    process.exit(1);
  }

  console.log("📄 Loading PDF from:", templatePath);
  console.log("📊 File size:", (fs.statSync(templatePath).size / 1024 / 1024).toFixed(2), "MB\n");

  const templateBytes = fs.readFileSync(templatePath);
  
  const pdfDoc = await PDFDocument.load(templateBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  console.log("📑 PDF Info:");
  console.log("  - Pages:", pdfDoc.getPageCount());
  console.log("  - Title:", pdfDoc.getTitle() || "(none)");
  console.log("  - Author:", pdfDoc.getAuthor() || "(none)");
  console.log("");

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log(`📋 Found ${fields.length} form fields:\n`);

  if (fields.length === 0) {
    console.log("⚠️  No AcroForm fields found!");
    console.log("");
    console.log("This could mean:");
    console.log("  1. The PDF uses XFA forms (not supported by pdf-lib)");
    console.log("  2. The PDF is flattened (fields converted to static content)");
    console.log("  3. The PDF is not the fillable version from USCIS");
    console.log("");
    console.log("💡 Try downloading the fillable N-400 from:");
    console.log("   https://www.uscis.gov/n-400");
    return;
  }

  // Group fields by type
  const textFields: string[] = [];
  const checkboxes: string[] = [];
  const radioGroups: string[] = [];
  const dropdowns: string[] = [];
  const others: string[] = [];

  fields.forEach((field) => {
    const name = field.getName();
    const type = field.constructor.name;

    switch (type) {
      case "PDFTextField":
        textFields.push(name);
        break;
      case "PDFCheckBox":
        checkboxes.push(name);
        break;
      case "PDFRadioGroup":
        radioGroups.push(name);
        break;
      case "PDFDropdown":
        dropdowns.push(name);
        break;
      default:
        others.push(`${name} (${type})`);
    }
  });

  if (textFields.length > 0) {
    console.log(`\n📝 TEXT FIELDS (${textFields.length}):`);
    textFields.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  if (checkboxes.length > 0) {
    console.log(`\n☐ CHECKBOXES (${checkboxes.length}):`);
    checkboxes.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  if (radioGroups.length > 0) {
    console.log(`\n○ RADIO GROUPS (${radioGroups.length}):`);
    radioGroups.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  if (dropdowns.length > 0) {
    console.log(`\n▼ DROPDOWNS (${dropdowns.length}):`);
    dropdowns.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  if (others.length > 0) {
    console.log(`\n❓ OTHER (${others.length}):`);
    others.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  // Save field list to file
  const outputPath = path.join(process.cwd(), "test-output", "pdf-fields.json");
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify({
    totalFields: fields.length,
    textFields,
    checkboxes,
    radioGroups,
    dropdowns,
    others,
  }, null, 2));

  console.log(`\n✅ Field list saved to: ${outputPath}`);
}

listPDFFields().catch(console.error);
