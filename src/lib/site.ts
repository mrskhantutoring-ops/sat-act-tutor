// Central site configuration. Edit the placeholders marked TODO
// with your real details (email, booking link, prices) before publishing.

export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Pro Minds",
  tutorName: "Pro Minds",
  tagline: "1-on-1 SAT & ACT coaching that meets you where you are.",
  // TODO: replace with your real contact email
  email: "hello@example.com",
  // TODO: replace with your real booking/scheduling link (e.g. Calendly)
  bookingUrl: "",
  // TODO: set your real prices
  pricing: [
    {
      name: "Single Session",
      price: "$XX",
      features: ["60-minute 1-on-1 session", "SAT or ACT focus", "Homework plan after every session"],
    },
    {
      name: "4-Session Pack",
      price: "$XXX",
      features: ["Four 60-minute sessions", "Personalized study plan", "Practice sets between sessions", "Progress check-ins"],
      featured: true,
    },
    {
      name: "Test-Day Sprint",
      price: "$XXX",
      features: ["Eight 60-minute sessions", "Full practice-test reviews", "Pacing & anxiety strategies", "Score-goal tracking"],
    },
  ],
};

export const SUBJECTS = [
  {
    id: "sat-math",
    name: "SAT Math",
    blurb: "44 questions · 70 minutes · calculator allowed throughout",
    domains: ["Algebra", "Advanced Math", "Problem-Solving and Data Analysis", "Geometry and Trigonometry"],
  },
  {
    id: "act-math",
    name: "ACT Math",
    blurb: "45 questions · 50 minutes · 4 answer choices",
    domains: ["Algebra", "Geometry", "Statistics & Probability", "Number & Quantity"],
  },
  {
    id: "sat-reading-writing",
    name: "SAT Reading & Writing",
    blurb: "54 questions · 64 minutes · short passages",
    domains: ["Information and Ideas", "Craft and Structure", "Expression of Ideas", "Standard English Conventions"],
  },
  {
    id: "act-english",
    name: "ACT English",
    blurb: "50 questions · 35 minutes · shorter passages",
    domains: ["Production of Writing", "Knowledge of Language", "Conventions of Standard English"],
  },
] as const;

export type SubjectId = (typeof SUBJECTS)[number]["id"];

export function subjectById(id: string) {
  return SUBJECTS.find((s) => s.id === id);
}
