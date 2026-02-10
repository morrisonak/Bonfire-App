/**
 * Date utility functions for formatting and calculations
 */

/**
 * Format a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Dec 15, 2025")
 */
export function formatCloseDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Date TBD";
  }
}

/**
 * Get relative date description
 * @param dateString - ISO date string
 * @returns Relative date string (e.g., "in 3 days", "in 2 weeks")
 */
export function getRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      const absDays = Math.abs(diffInDays);
      if (absDays === 1) return "yesterday";
      if (absDays < 7) return `${absDays} days ago`;
      if (absDays < 30) return `${Math.floor(absDays / 7)} weeks ago`;
      return `${Math.floor(absDays / 30)} months ago`;
    }

    if (diffInDays === 0) return "today";
    if (diffInDays === 1) return "tomorrow";
    if (diffInDays < 7) return `in ${diffInDays} days`;
    if (diffInDays < 30) return `in ${Math.floor(diffInDays / 7)} weeks`;
    if (diffInDays < 365) return `in ${Math.floor(diffInDays / 30)} months`;
    return `in ${Math.floor(diffInDays / 365)} years`;
  } catch {
    return "";
  }
}

/**
 * Get number of days until a date
 * @param dateString - ISO date string
 * @returns Number of days (negative if past)
 */
export function getDaysUntilClose(dateString: string): number {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  } catch {
    return Infinity;
  }
}

/**
 * Check if a date is closing soon
 * @param dateString - ISO date string
 * @param days - Number of days to consider "soon" (default: 3)
 * @returns True if closing within the specified days
 */
export function isClosingSoon(dateString: string, days: number = 3): boolean {
  const daysUntil = getDaysUntilClose(dateString);
  return daysUntil >= 0 && daysUntil <= days;
}

/**
 * Format date with relative description
 * @param dateString - ISO date string
 * @returns Combined format: "Dec 15, 2025 (in 12 days)"
 */
export function formatDateWithRelative(dateString: string): string {
  const formatted = formatCloseDate(dateString);
  const relative = getRelativeDate(dateString);
  return relative ? `${formatted} (${relative})` : formatted;
}
