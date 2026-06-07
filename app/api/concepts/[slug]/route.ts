import { NextResponse } from "next/server";
import { findConcept } from "@/lib/concepts";
import { logger } from "@/lib/logger";
import { AppError, errorResponse } from "@/lib/errors";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const concept = findConcept(slug);
  if (!concept) {
    logger.warn({ module: "concepts", event: "not_found", slug });
    const error = new AppError("concept not found", {
      status: 404,
      code: "not_found",
    });
    return errorResponse(error);
  }
  return NextResponse.json({ concept });
}
