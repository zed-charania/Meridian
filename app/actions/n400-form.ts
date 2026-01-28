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
 * Save N-400 form data as a draft (insert or update latest draft)
 */
export async function saveN400Draft(
  formData: N400FormData,
  accessToken?: string
): Promise<FormSubmissionResult> {
  try {
    if (!accessToken) {
      return { success: false, error: "Missing auth token" }
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken)
    if (userError || !userData?.user) {
      return { success: false, error: "Unauthorized user" }
    }

    const { data: existingDrafts, error: draftError } = await supabaseAdmin
      .from("n400_forms")
      .select("id")
      .eq("user_id", userData.user.id)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(1)

    if (draftError) {
      return { success: false, error: draftError.message }
    }

    const draftPayload: N400FormRecord = {
      user_id: userData.user.id,
      payload: formData,
      status: "draft",
      updated_at: new Date().toISOString(),
    }

    const existingDraftId = existingDrafts?.[0]?.id
    const { data, error } = existingDraftId
      ? await supabaseAdmin
          .from("n400_forms")
          .update(draftPayload)
          .eq("id", existingDraftId)
          .select()
          .single()
      : await supabaseAdmin
          .from("n400_forms")
          .insert([draftPayload])
          .select()
          .single()

    if (error) {
      return { success: false, error: error.message }
    }

    const payload = data?.payload ?? data
    return {
      success: true,
      data: {
        ...(payload as N400FormData),
        id: data?.id,
        user_id: data?.user_id,
      },
    }
  } catch (err) {
    console.error("Draft save error:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    }
  }
}

/**
 * Get the latest N-400 draft for the current user
 */
export async function getLatestN400Draft(accessToken?: string): Promise<FormSubmissionResult> {
  try {
    if (!accessToken) {
      return { success: false, error: "Missing auth token" }
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken)
    if (userError || !userData?.user) {
      return { success: false, error: "Unauthorized user" }
    }

    const { data, error } = await supabaseAdmin
      .from("n400_forms")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(1)

    if (error) {
      return { success: false, error: error.message }
    }

    const latestDraft = data?.[0]
    if (!latestDraft) {
      return { success: false, error: "No draft found" }
    }

    const payload = latestDraft?.payload ?? latestDraft
    return {
      success: true,
      data: {
        ...(payload as N400FormData),
        id: latestDraft?.id,
        user_id: latestDraft?.user_id,
      },
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    }
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
