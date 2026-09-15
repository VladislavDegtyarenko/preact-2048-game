const DEFAULT_ANIMATION_DURATION = 200;
const FAST_ANIMATION_DURATION = DEFAULT_ANIMATION_DURATION / 1.5;

const FAST_ANIMATIONS_SEARCH_PARAM = "fastAnimations";
const isFastAnimations = new URLSearchParams(window.location.search).has(
  FAST_ANIMATIONS_SEARCH_PARAM,
);

export const ANIMATION_DURATION = isFastAnimations
  ? FAST_ANIMATION_DURATION
  : DEFAULT_ANIMATION_DURATION; // in ms
