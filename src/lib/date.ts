// "2025-06-01" → "2025年6月1日"
export function DateFormatForHappenedOn(happenedOn: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(happenedOn));
}

// "2025-06-01T12:34:56Z" → "2025-06-01 12:34"
export function DateFormatForUpdatedAt(updatedAt: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(updatedAt));
}

// "2025-06-01T00:00:00Z" → "2025-06-01"（input[type="date"] の value 形式）
export function toDateInputValue (happened_on: string) {
  return new Date(happened_on).toLocaleDateString("sv-SE");
}