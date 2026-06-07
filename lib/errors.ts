import { NextResponse } from "next/server";

export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, opts: { status?: number; code?: string } = {}) {
    super(message);
    this.name = "AppError";
    this.status = opts.status ?? 500;
    this.code = opts.code ?? "internal_error";
  }
}

export function errorResponse(error: AppError) {
  return NextResponse.json({ error: error.code }, { status: error.status });
}
