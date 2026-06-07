import type { Concept } from "@/lib/concepts";
import { AppError } from "@/lib/errors";

export async function fetchConcepts(): Promise<Concept[]> {
  const res = await fetch("/api/concepts");
  if (!res.ok) {
    throw new AppError(`fetchConcepts failed: ${res.status}`, { status: res.status, code: "fetch_failed" });
  }
  const json = (await res.json()) as { concepts: Concept[] };
  return json.concepts;
}
