import { supabase } from "../lib/supabase";

interface SubmitFeedbackParams {
  subject: string;
  message: string;
}

export const SubmitFeedback = async ({
  subject,
  message,
}: SubmitFeedbackParams) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.log("Auth error:", userError);
    return null;
  }

  if (!user) {
    console.log("You must be logged in.");
    return null;
  }

  const { data, error } = await supabase
    .from("technician_feedbacks")
    .insert({
      technician_id: user?.id,
      subject,
      message,
    })
    .select()
    .single();

  if (error) {
    console.log("Submit feedback error:", error);
    return null;
  }

  return data;
};