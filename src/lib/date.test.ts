import { describe, expect, it } from "vitest";
import {
  DateFormatForHappenedOn,
  DateFormatForUpdatedAt,
  toDateInputValue,
} from "./date";

describe("DateFormatForHappenedOn", () => {
  it("日付文字列を日本語表記に変換する", () => {
    expect(DateFormatForHappenedOn("2025-06-01")).toBe("2025年6月1日");
  });
});

describe("DateFormatForUpdatedAt", () => {
  it("UTCのISO文字列をJSTのsv-SE形式に変換する", () => {
    // UTC 15:00 → JST 翌日00:00
    expect(DateFormatForUpdatedAt("2025-06-01T15:00:00Z")).toBe(
      "2025-06-02 00:00",
    );
  });
});

describe("toDateInputValue", () => {
  it("UTCのISO文字列をJSTのinput[type=date]用の値に変換する", () => {
    // UTC 15:00 → JST 翌日
    expect(toDateInputValue("2025-06-01T15:00:00Z")).toBe("2025-06-02");
  });
});
