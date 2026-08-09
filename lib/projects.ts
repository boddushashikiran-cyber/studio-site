export type Project = {
  slug: string;
  title: string;
  tags: string[];
  note: string;
  brief: string;
  process: string;
  build: string;
  stack: string[];
  result: string;
  liveUrl?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "foundit-campus",
    title: "FoundIt Campus",
    tags: ["Product", "Web App"],
    note: "REN_02",
    brief:
      "Students losing and finding items on campus had no shared place to post about it — just scattered flyers and group chats. The brief: a simple board where a lost item and the person who found it can actually find each other.",
    process:
      "We mapped the real flow first: someone posts a lost or found item with a photo and description, browsers can message the poster without seeing their contact info directly, and once the item is reunited, the original poster deletes their own post.",
    build:
      "Built on Next.js with Supabase handling posts, photo uploads via Supabase Storage, and row-level security so a poster can only delete their own listing — never someone else's.",
    stack: ["Next.js", "Supabase", "Tailwind", "Framer Motion"],
    result:
      "Piloted across two campus dorm buildings in its first month, with the majority of posts marked resolved and removed by their original posters within a week.",
  },
  {
    slug: "the-nightshift",
    title: "The Nightshift",
    tags: ["Music", "Band Site"],
    note: "REN_03",
    brief:
      "The Nightshift needed a home online ahead of their first EP release — something that felt like their live shows, not a generic band-website template with a photo slider.",
    process:
      "We built the site around their actual live photography instead of stock band-site layouts, letting full-bleed images and short clips carry the mood rather than long paragraphs of bio text.",
    build:
      "A Next.js site with a scroll-driven photo gallery, an embedded audio player for early EP tracks, and a tour dates section pulling from a simple Supabase table the band can update themselves.",
    stack: ["Next.js", "Framer Motion", "Supabase"],
    result:
      "Launched two weeks ahead of the EP release, with the tour dates page becoming the band's most-shared link across their social channels.",
  },
  {
    slug: "chronos-watches",
    title: "Chronos",
    tags: ["E-Commerce", "Product"],
    note: "REN_04",
    brief:
      "Chronos makes mechanical watches with genuinely interesting engineering underneath, but their old site buried that story behind generic product photography. The brief: make the craftsmanship the hero.",
    process:
      "We studied how luxury watch brands typically over-explain in text, and went the opposite direction — a small number of feature call-outs, each tied to a specific, zoomed-in view of the mechanism or material.",
    build:
      "A Next.js storefront with a React Three Fiber scene letting visitors rotate the watch in 3D, with scroll-triggered call-outs highlighting the movement, case material, and strap construction one at a time.",
    stack: ["Next.js", "React Three Fiber", "Three.js", "Tailwind"],
    result:
      "Pre-order signups outpaced the brand's previous product launch by a wide margin in the first 48 hours after the new site went live.",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
