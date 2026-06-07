import { describe, it, expect, vi, afterEach } from "vitest";
import { GET as listGET } from "@/app/api/concepts/route";
import { GET as slugGET } from "@/app/api/concepts/[slug]/route";

describe("GET /api/concepts", () => {
  it("concepts 배열을 담은 200 응답을 반환한다", async () => {
    const res = await listGET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.concepts)).toBe(true);
    expect(body.concepts.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /api/concepts/[slug]", () => {
  const dummyReq = new Request("http://localhost/api/concepts/agent-loop");

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("존재하는 slug로 요청하면 concept 객체와 200을 반환한다", async () => {
    const res = await slugGET(dummyReq, {
      params: Promise.resolve({ slug: "agent-loop" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.concept.slug).toBe("agent-loop");
  });

  it("존재하지 않는 slug로 요청하면 404와 not_found 오류를 반환한다", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const res = await slugGET(dummyReq, {
      params: Promise.resolve({ slug: "does-not-exist" }),
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: "not_found" });
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it("존재하지 않는 slug일 때 raw console.log가 아닌 logger.warn(=console.warn) 경로를 탄다", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await slugGET(dummyReq, {
      params: Promise.resolve({ slug: "does-not-exist" }),
    });

    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledOnce();

    const parsed = JSON.parse(warnSpy.mock.calls[0][0]);
    expect(parsed.level).toBe("warn");
    expect(parsed.module).toBe("concepts");
    expect(parsed.event).toBe("not_found");
    expect(parsed.slug).toBe("does-not-exist");
  });
});
