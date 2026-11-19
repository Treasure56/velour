/**
 * Single source of truth for every media path on the site.
 * Swap a file in /public/media and update its entry here; components never hardcode paths.
 */

export type MediaImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const placeholders = {
  portrait01: {
    src: "/media/placeholders/portrait-01.jpg",
    width: 1200,
    height: 1500,
    alt: "Soft cream and champagne tonal placeholder",
  },
  portrait02: {
    src: "/media/placeholders/portrait-02.jpg",
    width: 1200,
    height: 1500,
    alt: "Warm mocha tonal placeholder",
  },
  landscape01: {
    src: "/media/placeholders/landscape-01.jpg",
    width: 1800,
    height: 1200,
    alt: "Pale ivory tonal placeholder",
  },
  landscape02: {
    src: "/media/placeholders/landscape-02.jpg",
    width: 1800,
    height: 1200,
    alt: "Deep espresso tonal placeholder",
  },
  square01: {
    src: "/media/placeholders/square-01.jpg",
    width: 1400,
    height: 1400,
    alt: "Blush tonal placeholder",
  },
} as const satisfies Record<string, MediaImage>;

/**
 * Hero film. Source master: /public/media/video/hero video.mp4 (1280×720, never served).
 * Encoded with ffmpeg, no filters or colour changes:
 * - desktop: full frame 1280×720 (H.264 CRF 20 slow +faststart, VP9 CRF 24)
 * - mobile:  right-hand 720×720 crop (model side), H.264 CRF 20
 */
export const hero = {
  poster: {
    src: "/media/hero/hero-poster.jpg",
    width: 1280,
    height: 720,
    alt: "",
  },
  video: {
    desktopWebm: "/media/hero/hero-1280.webm",
    desktopMp4: "/media/hero/hero-1280.mp4",
    mobileMp4: "/media/hero/hero-mobile.mp4",
  },
} as const;

/**
 * Texture cards: 4:5 image + optional hover video per texture slug.
 * Drop real files in /public/media/textures with these names; a missing video is skipped
 * automatically (the card shows the image only).
 */
const textureMedia = (slug: string) => ({
  image: `/media/textures/${slug}.jpg`,
  video: `/media/textures/${slug}.mp4`,
});

export const textures = {
  straight: textureMedia("straight"),
  "body-wave": textureMedia("body-wave"),
  "deep-wave": textureMedia("deep-wave"),
  "kinky-curly": textureMedia("kinky-curly"),
} as const;

/** Brand story image (user-supplied). */
export const brandStory = {
  craft: {
    src: "/media/brand-story/craft.jpg",
    width: 1122,
    height: 1402,
    alt: "Hands holding a glossy raw straight bundle tied with a champagne satin bow",
  },
} as const satisfies Record<string, MediaImage>;

export const media = {
  placeholders,
  hero,
  textures,
  brandStory,
} as const;
