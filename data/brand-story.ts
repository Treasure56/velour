import { brandStory as media } from "@/lib/media";

export type BrandStat = {
  value: number;
  suffix: string;
  label: string;
};

export const brandStory = {
  eyebrow: "Our standard",
  heading: { lead: "Not all hair is", emphasis: "created equal." },
  body:
    "Velour hair is 100% raw and single-donor, with every cuticle kept intact and aligned in one direction. That means no tangling, no shedding and hair that can be coloured, styled and worn for years. Ethically sourced, carefully selected and finished by hand.",
  link: { label: "Our Story", href: "/our-story" },
  stats: [
    { value: 2, suffix: "+", label: "Years lifespan" },
    { value: 100, suffix: "%", label: "Raw virgin hair" },
    { value: 48, suffix: "h", label: "Lagos delivery" },
  ] satisfies BrandStat[],
  image: media.craft,
} as const;
