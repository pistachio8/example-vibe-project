import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchConcepts } from "@/lib/api/fetch-client";
import { postFeedback } from "@/lib/api/feedback-client";
import { AppError } from "@/lib/errors";

describe("lib/api/fetch-client — fetchConcepts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("성공: /api/concepts를 호출하고 concepts 배열을 반환한다", async () => {
    const mockConcepts = [
      { slug: "agent-loop", title: "에이전트 루프" },
      { slug: "rag", title: "RAG" },
    ];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ concepts: mockConcepts }),
    });

    const result = await fetchConcepts();

    expect(global.fetch).toHaveBeenCalledWith("/api/concepts");
    expect(result).toEqual(mockConcepts);
  });

  it("실패: res.ok가 false이면 status를 포함한 에러를 throw한다", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchConcepts()).rejects.toThrow("fetchConcepts failed: 500");
  });

  it("실패: throw된 에러가 AppError 인스턴스이고 status·code가 설정된다", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    await expect(fetchConcepts()).rejects.toBeInstanceOf(AppError);
    await expect(fetchConcepts()).rejects.toMatchObject({
      status: 503,
      code: "fetch_failed",
    });
  });
});

describe("lib/api/feedback-client — postFeedback", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("성공: /api/feedback로 payload를 전송하고 data를 반환한다", async () => {
    const payload = { conceptSlug: "agent-loop", rating: 5, comment: "좋아요" };
    const mockData = { success: true };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await postFeedback(payload);

    expect(global.fetch).toHaveBeenCalledWith("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(mockData);
  });

  it("실패: res.ok가 false이면 AppError를 throw하고 status·code가 설정된다", async () => {
    const payload = { conceptSlug: "agent-loop", rating: 5, comment: "좋아요" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 501,
    });

    await expect(postFeedback(payload)).rejects.toBeInstanceOf(AppError);
    await expect(postFeedback(payload)).rejects.toMatchObject({
      status: 501,
      code: "feedback_failed",
    });
  });
});
