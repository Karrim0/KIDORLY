import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeHeroCopy } from "./hero-copy";

test("hero copy rejects known placeholder content", () => {
  assert.equal(sanitizeHeroCopy("kareem", "cta", "Shop now"), "Shop now");
  assert.equal(sanitizeHeroCopy("كريم", "cta", "تسوق الآن"), "تسوق الآن");
  assert.equal(sanitizeHeroCopy("تيستو تفاح", "title", "منتجات مميزة"), "منتجات مميزة");
});

test("hero copy keeps valid admin content", () => {
  assert.equal(sanitizeHeroCopy("Discover the collection", "cta", "Shop now"), "Discover the collection");
});
