import assert from "node:assert/strict";
import test from "node:test";
import { normalizeVaultPath, parseLinkTarget, slugifyHeading } from "../src/paths";

test("normalizes vault paths and rejects traversal", () => {
  assert.equal(normalizeVaultPath("/Projects\\Demo/note.md"), "Projects/Demo/note.md");
  assert.equal(normalizeVaultPath("../outside.md"), "");
  assert.equal(normalizeVaultPath("folder/../../outside.md"), "");
});

test("parses aliases and heading fragments", () => {
  assert.deepEqual(parseLinkTarget("Note#Section|Label"), { path: "Note", subpath: "Section" });
  assert.equal(slugifyHeading("État du sprint !"), "état-du-sprint");
});
