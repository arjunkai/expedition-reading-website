import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/site";

describe("SITE config", () => {
  it("exposes the canonical site URL without a trailing slash", () => {
    expect(SITE.url).toBe("https://expeditionreading.org");
  });

  it("exposes the organization name", () => {
    expect(SITE.name).toBe("Expedition Reading");
  });

  it("exposes the tagline", () => {
    expect(SITE.tagline).toBe("Every child deserves a chance to learn.");
  });

  it("exposes the contact email", () => {
    expect(SITE.contactEmail).toBe("contact@expeditionreading.org");
  });

  it("exposes a nav array with the primary pages in order", () => {
    expect(SITE.nav.map((n) => n.href)).toEqual([
      "/about",
      "/what-we-do",
      "/partners",
      "/get-involved",
    ]);
  });
});
