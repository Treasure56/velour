import { cacheLife } from "next/cache";

/**
 * The current year for the footer. Cache Components won't read the clock during prerender
 * (not even in Client Components), so it's cached and refreshed daily: pages stay static and
 * the year rolls over within a day of New Year.
 */
export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
