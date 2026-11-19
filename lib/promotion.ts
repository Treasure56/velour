import { cacheLife } from "next/cache";
import { holidayPromotion, type Promotion } from "@/data/promotions";

/**
 * The live promotion, or null when it's switched off or has ended.
 * Reading the clock during prerender isn't allowed with Cache Components, so the answer is
 * cached and refreshed hourly: the page stays static, and an ended sale disappears within an hour.
 */
export async function getActivePromotion(): Promise<Promotion | null> {
  "use cache";
  cacheLife("hours");

  if (!holidayPromotion.active) return null;
  return Date.now() < Date.parse(holidayPromotion.endDate) ? holidayPromotion : null;
}
