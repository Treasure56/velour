import { Bestsellers } from "@/components/home/bestsellers";
import { BrandStory } from "@/components/home/brand-story";
import { Newsletter } from "@/components/home/newsletter";
import { Hero } from "@/components/home/hero";
import { HolidayBanner } from "@/components/home/holiday-banner";
import { ShopByTexture } from "@/components/home/textures";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopByTexture />
      <HolidayBanner />
      <Bestsellers />
      <BrandStory />
      {/* <Newsletter /> */}
    </>
  );
}
