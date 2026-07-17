import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWhatsAppLink,
  getDiscountedPrice,
  getEffectiveDiscount,
  normalizeWhatsAppNumber,
  parseOptionalPrice,
} from "./utils";

test("product discounts take priority over category and global discounts", () => {
  assert.equal(getEffectiveDiscount(15, 20, 25), 15);
  assert.equal(getEffectiveDiscount(null, 20, 25), 20);
  assert.equal(getEffectiveDiscount(0, 0, 25), 25);
  assert.equal(getEffectiveDiscount(null, null, null), 0);
});

test("discounted prices are rounded to two decimal places", () => {
  assert.equal(getDiscountedPrice(999, 15), 849.15);
  assert.equal(getDiscountedPrice(100, 0), 100);
});

test("WhatsApp links only contain a normalized phone number and encoded message", () => {
  assert.equal(normalizeWhatsAppNumber("+20 (100) 123-4567"), "201001234567");
  assert.equal(
    buildWhatsAppLink("+20 100 123 4567", "مرحبا Kidorly"),
    "https://wa.me/201001234567?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20Kidorly",
  );
  assert.equal(buildWhatsAppLink("", "hello"), "#");
});

test("empty price filters stay undefined instead of becoming zero", () => {
  assert.equal(parseOptionalPrice(""), undefined);
  assert.equal(parseOptionalPrice("   "), undefined);
  assert.equal(parseOptionalPrice(undefined), undefined);
  assert.equal(parseOptionalPrice("250"), 250);
  assert.equal(parseOptionalPrice("-1"), undefined);
});
