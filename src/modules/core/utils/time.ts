/**
 * Wait for a given amount of milliseconds.
 * Used for dev purposes.
 *
 * @param ms - milliseconds to wait for
 * @returns Promise that resolves after given amount of milliseconds
 */
const wait = (ms: number = 150) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export {wait};
