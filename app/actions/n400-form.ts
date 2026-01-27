"use server";

import { supabaseAdmin, N400FormData, N400FormRecord } from "@/lib/supabase";

export interface FormSubmissionResult {
  success: boolean;
  data?: N400FormData;
  error?: string;
}

/**
 * Submit N-400 form data to Supabase
 */
export async function submitN400Form(
  formData: N400FormData,
  accessToken?: string
): Promise<FormSubmissionResult> {
  try {
    if (!accessToken) {
      return { success: false, error: "Missing auth token" };
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !userData?.user) {
      return { success: false, error: "Unauthorized user" };
    }

    // Add metadata
    const dataWithMetadata: N400FormRecord = {
      user_id: userData.user.id,
      payload: formData,
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

    const payload = data?.payload ?? data;
    return {
      success: true,
      data: {
        ...(payload as N400FormData),
        id: data?.id,
        user_id: data?.user_id,
      },
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

    const payload = data?.payload ?? data;
    return {
      success: true,
      data: {
        ...(payload as N400FormData),
        id: data?.id,
        user_id: data?.user_id,
      },
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

    const payload = data?.payload ?? data;
    return {
      success: true,
      data: {
        ...(payload as N400FormData),
        id: data?.id,
        user_id: data?.user_id,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}
