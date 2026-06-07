import { AppError } from "@/lib/errors";

export type FeedbackPayload = {
  conceptSlug: string;
  rating: number;
  comment?: string;
};

export async function postFeedback(payload: FeedbackPayload) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new AppError(`postFeedback failed: ${res.status}`, { status: res.status, code: "feedback_failed" });
  }
  return res.json();
}
