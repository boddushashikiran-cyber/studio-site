export type ServiceType =
  | "web-design"
  | "development"
  | "branding"
  | "3d-animation";

export const SERVICES: { id: ServiceType; label: string; blurb: string }[] = [
  {
    id: "web-design",
    label: "Web Design",
    blurb: "New site design, from wireframe to finished UI.",
  },
  {
    id: "development",
    label: "Development",
    blurb: "Front-end build, integrations, performance work.",
  },
  {
    id: "branding",
    label: "Branding",
    blurb: "Identity, typography systems, visual language.",
  },
  {
    id: "3d-animation",
    label: "3D / Animation",
    blurb: "WebGL scenes, motion systems, interactive visuals.",
  },
];

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

/** Next 14 calendar days, weekends excluded, as ISO date strings. */
export function getUpcomingDates(count = 14): { iso: string; label: string; weekday: string }[] {
  const out: { iso: string; label: string; weekday: string }[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day === 0 || day === 6) continue; // skip weekends

    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return out;
}
