import { describe, expect, it } from "vitest";
import { catalogs, normalizeLocale, supportedLocales, translate } from "./i18n";

describe("catalogues de traduction", () => {
  it("contiennent exactement les mêmes clés", () => {
    const reference = Object.keys(catalogs.fr).sort();
    for (const locale of supportedLocales) expect(Object.keys(catalogs[locale]).sort()).toEqual(reference);
  });

  it("ne contiennent aucune traduction vide ni variable non résolue", () => {
    for (const locale of supportedLocales) for (const value of Object.values(catalogs[locale])) expect(value.trim()).not.toBe("");
  });

  it("interpole les valeurs", () => expect(translate("media.items", { count: 12 }, "en")).toBe("12 item(s)"));

  it.each([["fr-FR", "fr"], ["en_US", "en"], ["es-MX", "es"], ["de-DE", "de"], ["it-IT", "en"]] as const)(
    "normalise %s vers %s", (input, expected) => expect(normalizeLocale(input)).toBe(expected),
  );
});
