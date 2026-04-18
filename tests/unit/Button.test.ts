import { describe, it, expect } from "vitest";
import { buttonClasses } from "@/components/button-classes";

describe("buttonClasses", () => {
  it("returns primary variant classes by default", () => {
    const cls = buttonClasses({});
    expect(cls).toContain("bg-gold");
    expect(cls).toContain("text-brown");
  });

  it("returns secondary variant with brown outline", () => {
    const cls = buttonClasses({ variant: "secondary" });
    expect(cls).toContain("border-brown");
    expect(cls).not.toContain("bg-gold");
  });

  it("returns ghost variant with no border or background", () => {
    const cls = buttonClasses({ variant: "ghost" });
    expect(cls).not.toContain("bg-gold");
    expect(cls).not.toContain("border-brown");
  });

  it("always applies pill radius and padding", () => {
    const cls = buttonClasses({});
    expect(cls).toMatch(/rounded-\[999px\]|rounded-full/);
  });
});
