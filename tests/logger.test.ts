import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "@/lib/logger";

describe("lib/logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logger.info는 console.log를 호출한다", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info({ module: "auth", event: "login" });
    expect(spy).toHaveBeenCalledOnce();
  });

  it("logger.warn은 console.warn을 호출한다", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn({ module: "auth", event: "retry" });
    expect(spy).toHaveBeenCalledOnce();
  });

  it("logger.error는 console.error를 호출한다", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error({ module: "auth", event: "fail" });
    expect(spy).toHaveBeenCalledOnce();
  });

  it("출력 문자열은 유효한 JSON이고 level·module·event·추가 필드를 포함한다", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info({ module: "payment", event: "charged", amount: 9900 });
    const parsed = JSON.parse(spy.mock.calls[0][0]);
    expect(parsed.level).toBe("info");
    expect(parsed.module).toBe("payment");
    expect(parsed.event).toBe("charged");
    expect(parsed.amount).toBe(9900);
  });

  it("출력 JSON에 ISO 형식의 ts 필드가 존재한다", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info({ module: "test", event: "ping" });
    const parsed = JSON.parse(spy.mock.calls[0][0]);
    expect(parsed.ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});
