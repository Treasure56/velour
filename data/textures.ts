import { textures as textureMedia } from "@/lib/media";

export type TextureSlug = keyof typeof textureMedia;

export type Texture = {
  name: string;
  slug: TextureSlug;
  tagline: string;
  image: string;
  /** Hover video. May not exist on disk yet; the section checks before rendering it. */
  video?: string;
};

export const textures: Texture[] = [
  { name: "Raw Straight", slug: "straight", tagline: "Sleek. Silky. Timeless.", ...textureMedia.straight },
  { name: "Body Wave", slug: "body-wave", tagline: "Soft waves, effortless volume.", ...textureMedia["body-wave"] },
  { name: "Deep Wave", slug: "deep-wave", tagline: "Defined ripples, rich texture.", ...textureMedia["deep-wave"] },
  { name: "Kinky Curly", slug: "kinky-curly", tagline: "Full, bold, natural.", ...textureMedia["kinky-curly"] },
];

export const textureHref = (slug: TextureSlug) => `/shop?texture=${slug}`;
