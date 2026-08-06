// Parse numbers typed in Brazilian format: "877,21" / "6.085,77" / "6085.77"
export function parseBRNumber(input: string | number): number {
  if (typeof input === "number") return isFinite(input) ? input : 0;
  let s = (input ?? "").toString().trim().replace(/[^\d.,-]/g, "");
  if (!s) return 0;

  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    // The rightmost separator is the decimal one
    if (lastComma > lastDot) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (lastComma > -1) {
    // Comma only: decimal separator if it has 1-2 digits after it, else thousands
    const decimals = s.length - lastComma - 1;
    s = decimals > 0 && decimals <= 2 ? s.replace(",", ".") : s.replace(/,/g, "");
  } else if (lastDot > -1) {
    const decimals = s.length - lastDot - 1;
    if (decimals === 3) s = s.replace(/\./g, "");
  }

  const n = parseFloat(s);
  return isFinite(n) ? n : 0;
}

// Display a number for editing in Brazilian format ("6.085,77")
export function formatBRNumber(value: number): string {
  if (value === null || value === undefined || !isFinite(value)) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
