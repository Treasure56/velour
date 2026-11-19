import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-only: does a file exist under /public? Lets sections skip optional media (e.g. a hover
 * video that hasn't been added yet) instead of requesting a URL that would 404.
 * Evaluated when the page renders/prerenders, so add new files before building.
 */
export function publicFileExists(src: string) {
  return existsSync(path.join(process.cwd(), "public", src));
}
