export const withDefaults = defaults => overrides => ({
  ...defaults,
  ...overrides
});
