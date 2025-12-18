// This file is executed before each test file.
// Good for configuring jest-dom, global mocks, or resetting states between files.

import { afterEach, expect } from 'vitest';

// `cleanup` -> Cleans the DOM is updated after each test to ensure that one test does not affect another.
import { cleanup } from '@testing-library/react';

import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(async () => {
  cleanup();

  // It ensures that the tests are independent and free from "garbage" from previous runs.
  vi.resetAllMocks();

  //   await clearDatabaseFunction();
});
