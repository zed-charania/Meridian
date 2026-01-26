"use server";

import { supabaseAdmin, N400FormData } from "@/lib/supabase";

export interface FormSubmissionResult {
  success: boolean;
  data?: N400FormData;
  error?: string;
}

/**
 * Submit N-400 form data to Supabase
 */
export async function submitN400Form(formData: N400FormData): Promise<FormSubmissionResult> {
  try {
    // Add metadata
    const dataWithMetadata = {
      ...formData,
      status: "submitted",
      updated_at: new Date().toISOString(),
    };

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from("n400_forms")
      .insert([dataWithMetadata])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as N400FormData,
    };
  } catch (err) {
    console.error("Form submission error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

/**
 * Get the latest N-400 form submission
 */
export async function getLatestN400Form(): Promise<FormSubmissionResult> {
  try {
    const { data, error } = await supabaseAdmin
      .from("n400_forms")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as N400FormData,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

/**
 * Get an N-400 form by ID
 */
export async function getN400FormById(id: string): Promise<FormSubmissionResult> {
  try {
    const { data, error } = await supabaseAdmin
      .from("n400_forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as N400FormData,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}
