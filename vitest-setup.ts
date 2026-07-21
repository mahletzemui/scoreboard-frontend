/**
 * Defines global vitest behaviors for tests.
 */

// --------------------------------------------------------------------------------

/**
 * Cleans up tests to ensure isolation.
 */
afterEach(() =>
{
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});
