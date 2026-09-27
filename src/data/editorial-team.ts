export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  /** Areas this person covers, e.g. "Data centres", "Grid & networks" */
  beats: string[];
  /** Verifiable background: employers, qualifications, publications. Only add facts you can stand behind. */
  background?: string[];
  email?: string;
  /** Public profile links (LinkedIn, X, personal site) used for schema.org sameAs */
  links?: { label: string; url: string }[];
  imageUrl?: string;
};

/**
 * Named profiles for the editorial team.
 * Only add facts that can be stood behind publicly.
 */
export const EDITORIAL_TEAM: TeamMember[] = [
  {
    slug: "peter-flynn",
    name: "Peter Flynn",
    role: "Editor",
    bio: "Peter Flynn runs and edits AI Energy Intelligence UK. He is responsible for what the site publishes: the editorial standards it works to, the assumptions behind its calculators and reports, and the final sign-off on news stories held in the review queue.",
    beats: ["Editorial oversight", "AI & energy", "UK data centres", "Corrections"],
    email: "info@aienergyintelligence.co.uk",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/energyuk/" },
      { label: "X (Twitter)", url: "https://x.com/peterjohnflynn" },
    ],
  },
];
