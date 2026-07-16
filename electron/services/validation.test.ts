import { describe, expect, it } from "vitest";
import { secureUrl, validateDownloadRequest } from "./validation";

const request = { url: "https://example.com/video", title: "Exemple", mode: "video", outputDir: "C:\\Downloads" };

describe("secureUrl", () => {
  it("normalise une URL HTTPS", () => expect(secureUrl(" https://example.com/a ")).toBe("https://example.com/a"));
  it.each(["http://example.com", "https://user:pass@example.com", "not-an-url"])("refuse %s", (value) => expect(() => secureUrl(value)).toThrow());
});

describe("validateDownloadRequest", () => {
  it.each(["video", "mp3", "m4a", "wav", "thumbnail"])("accepte le mode %s", (mode) => expect(validateDownloadRequest({ ...request, mode }).mode).toBe(mode));
  it("borne la taille des collections", () => {
    expect(validateDownloadRequest({ ...request, maxItems: 0 }).maxItems).toBe(1);
    expect(validateDownloadRequest({ ...request, maxItems: 5000 }).maxItems).toBe(1000);
  });
  it("refuse un mode inconnu", () => expect(() => validateDownloadRequest({ ...request, mode: "exe" })).toThrow("Format"));
  it("refuse un identifiant de format suspect", () => expect(() => validateDownloadRequest({ ...request, formatId: "1; calc" })).toThrow("Qualité"));
});
