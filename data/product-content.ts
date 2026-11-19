import type { Product } from "@/types/product";

/** Care steps shown in the product accordion. */
export function careSteps(product: Product): string[] {
  if (product.category === "hair-care") {
    return [
      "Use on clean, damp or dry hair as directed on the pack.",
      "Start with a small amount and build up, focusing on the mid-lengths and ends.",
      "Store in a cool, dry place away from direct sunlight.",
    ];
  }
  return [
    "Detangle gently from the ends up with a wide-tooth comb before washing.",
    "Wash every 7-10 wears with a sulphate-free shampoo and lukewarm water.",
    "Condition well, then let it air dry or use low heat with a heat protectant.",
    "Sleep in a silk bonnet or on a silk pillowcase to keep the hair smooth.",
  ];
}

export const shipping = {
  delivery: [
    { region: "Lagos", time: "24-48 hours" },
    { region: "Rest of Nigeria", time: "2-5 working days" },
    { region: "International", time: "5-10 working days" },
  ],
  returns:
    "Returns and exchanges are accepted within 7 days of delivery. Hair must be unworn, unwashed and uncut, with the lace and bundles intact and in the original Velour packaging.",
};

// SAMPLE CONTENT — replace with real reviews.
export const sampleReviews = [
  { name: "Adaeze", city: "Lagos", rating: 5, text: "Soft, full and exactly as pictured. The lace melted on the first install." },
  { name: "Kemi", city: "Abuja", rating: 5, text: "Beautifully packaged and arrived the next day. No shedding after three washes." },
  { name: "Ruth", city: "Enugu", rating: 4, text: "Lovely quality and easy to style. I would size up on length next time." },
];
