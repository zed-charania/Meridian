/**
 * Script to inspect PDF form field names
 * 
 * Run with: npx ts-node scripts/inspect-pdf.ts
 * Or visit: http://localhost:3001/api/generate-n400 (GET request)
 */

import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

async function inspectPDF() {
  const templatePath = path.join(process.cwd(), "templates", "n-400.pdf");

  if (!fs.existsSync(templatePath)) {
    console.log("❌ No PDF found at templates/n-400.pdf");
    console.log("");
    console.log("To add the N-400 template:");
    console.log("1. Download from: https://www.uscis.gov/n-400");
    console.log("2. Save to: templates/n-400.pdf");
    return;
  }

  console.log("📄 Reading PDF from:", templatePath);
  console.log("");

  const pdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log(`Found ${fields.length} form fields:\n`);
  console.log("=".repeat(80));

  fields.forEach((field, index) => {
    const name = field.getName();
    const type = field.constructor.name;
    console.log(`${index + 1}. [${type}] ${name}`);
  });

  console.log("");
  console.log("=".repeat(80));
  console.log("");
  console.log("💡 Next steps:");
  console.log("1. Copy the field names you need");
  console.log("2. Update lib/pdf-utils.ts with the correct mappings");
  console.log("3. Test by submitting the form");
}

inspectPDF().catch(console.error);
