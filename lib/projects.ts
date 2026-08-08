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
    slug: "meridian-analytics",
    title: "Meridian Analytics",
    tags: ["Product", "Web App"],
    note: "REN_02",
    brief:
      "Meridian's dashboard had outgrown its original design — dense tables with no visual hierarchy, and a five-minute onboarding drop-off. They needed something a first-time user could read in ten seconds.",
    process:
      "We started in Figma with three layout directions, tested against Meridian's actual data (not lorem ipsum), and settled on a card-based system that surfaces the one number that matters per view before anything else.",
    build:
      "Rebuilt on Next.js with server components for the data-heavy views, Framer Motion for the transition between summary and drill-down states, and a lightweight charting layer over Recharts.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Recharts"],
    result:
      "Onboarding drop-off fell from five minutes to under ninety seconds in the first month post-launch.",
  },
  {
    slug: "fieldnote-app",
    title: "Fieldnote",
    tags: ["React Native", "Mobile"],
    note: "REN_03",
    brief:
      "Fieldnote's team needed an offline-first note-taking app for site inspectors working without reliable signal — sync had to be invisible, not a feature you think about.",
    process:
      "We mapped the inspector's actual workflow on paper first: what gets written down in the field vs. cleaned up back at a desk, before touching any UI.",
    build:
      "React Native with a local-first SQLite store and a background sync queue, wrapped in a UI intentionally closer to a physical notebook than a typical app.",
    stack: ["React Native", "Expo", "SQLite", "Supabase"],
    result:
      "Adopted by three inspection teams within the first quarter, with zero reported data-loss incidents from the offline queue.",
  },
  {
    slug: "lumen-branding",
    title: "Lumen",
    tags: ["Branding", "3D"],
    note: "REN_04",
    brief:
      "Lumen makes physical lighting hardware but had a visual identity that looked like a software startup. The brief: make the site feel like it's made of light.",
    process:
      "We built the identity around a single idea — every interactive element should behave like it's being lit, not just colored — and prototyped the hero interaction before any of the rest of the site.",
    build:
      "A WebGL hero scene in React Three Fiber with real-time lighting reacting to scroll position, paired with a restrained type system so the 3D work stays the focal point.",
    stack: ["Three.js", "React Three Fiber", "Next.js", "GSAP"],
    result:
      "Featured on two design-showcase sites within a week of launch; Lumen's founder reported it became their highest-converting sales asset.",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
