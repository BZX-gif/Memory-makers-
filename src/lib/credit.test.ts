import { describe, expect, it } from "vitest";
import { storeConfig } from "@/config/store";
import { developerCreditUrl, safeHttpUrl } from "@/lib/credit";

describe("developer credit", () => {
  it("stays plain text until a real URL is configured", () => {
    expect(developerCreditUrl(storeConfig.credit.url)).toBeNull();
    expect(developerCreditUrl("")).toBeNull();
    expect(developerCreditUrl("   ")).toBeNull();
    expect(developerCreditUrl(null)).toBeNull();
    expect(developerCreditUrl(undefined)).toBeNull();
  });

  it("never invents a destination from an incomplete value", () => {
    expect(safeHttpUrl("webpi")).toBeNull();
    expect(safeHttpUrl("instagram.com/webpi")).toBeNull();
    expect(safeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(safeHttpUrl("mailto:hello@webpi.example")).toBeNull();
  });

  it("accepts a configured website or social profile", () => {
    expect(developerCreditUrl("https://webpi.example")).toBe("https://webpi.example/");
    expect(developerCreditUrl(" https://www.instagram.com/webpi/ ")).toBe(
      "https://www.instagram.com/webpi/",
    );
  });

  it("keeps the credit label as the supplied brand signature", () => {
    expect(storeConfig.credit.label).toBe("WEBPI");
  });
});
