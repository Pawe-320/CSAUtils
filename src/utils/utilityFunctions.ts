export function dateUnix(
  operator: "+" | "-" | null,
  modifier: string | null,
  isForDiscord: boolean = true,
  format: "d" | "D" | "t" | "T" | "f" | "F" | "s" | "S" | "R" = "f",
  baseDate: Date | number = new Date(), // Added this parameter
) {
  const msMap: Record<string, number> = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
  };

  // Convert baseDate to ms (handles both Date objects from Mongo and raw numbers)
  let timeValue = baseDate instanceof Date ? baseDate.getTime() : baseDate;

  // 1. Calculate the modification if a modifier is provided (e.g., "7d")
  if (modifier && typeof modifier === "string") {
    const value = parseInt(modifier);
    const unit = modifier.slice(-1).toLowerCase();
    const msToAdd = value * (msMap[unit] || 0);

    if (operator === "+") timeValue += msToAdd;
    else if (operator === "-") timeValue -= msToAdd;
  }

  // 2. Return either Discord Format or raw Epoch
  if (isForDiscord) {
    const unixSeconds = Math.floor(timeValue / 1000);
    return `<t:${unixSeconds}:${format}>`;
  }

  return timeValue;
}
