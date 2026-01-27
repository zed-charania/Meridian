import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// PDF API URL - set in Vercel environment variables
const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:5000";

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

    // Call Python PDF API
    const pdfResponse = await fetch(`${PDF_API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dbData),
    });

    if (!pdfResponse.ok) {
      const errorData = await pdfResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: "PDF generation failed", details: errorData },
        { status: 500 }
      );
    }

    // Get PDF bytes from response
    const pdfBytes = await pdfResponse.arrayBuffer();

    // Generate filename
    const filename = `N-400_${dbData.last_name || "Unknown"}_${dbData.first_name || "Applicant"}.pdf`.replace(/\s+/g, "_");

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

// GET endpoint to check PDF API health
export async function GET() {
  try {
    const healthResponse = await fetch(`${PDF_API_URL}/health`);
    const healthData = await healthResponse.json();

    return NextResponse.json({
      status: "ok",
      pdf_api: healthData,
      pdf_api_url: PDF_API_URL,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        pdf_api: "unreachable",
        pdf_api_url: PDF_API_URL,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
