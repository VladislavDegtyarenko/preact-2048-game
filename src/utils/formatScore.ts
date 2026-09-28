const SCORE_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

/** Formats a score with commas between groups of three digits. */
export const formatScore = (score: number): string => {
  return SCORE_FORMATTER.format(score);
};
