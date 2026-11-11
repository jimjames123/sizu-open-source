export const OPPORTUNITY_TYPES = [
  "Grant",
  "Donation",
  "Fellowship",
  "Call for Proposals",
  "In-kind Support",
  "Conferences/Workshops",
] as const;

export const OPPORTUNITY_SECTORS = [
  "General",
  "Agriculture",
  "Education",
  "Health",
  "Environment & Climate",
  "Water & Sanitation",
  "Youth & Employment",
  "Gender & Inclusion",
  "Technology & Innovation",
  "Governance",
] as const;

export const OPPORTUNITY_REGIONS = [
  "National",
  "Central",
  "Western",
  "Eastern",
  "Northern",
] as const;

export const OPPORTUNITY_SDGS = [
  "SDG 1 - No Poverty",
  "SDG 2 - Zero Hunger",
  "SDG 3 - Good Health and Well-being",
  "SDG 4 - Quality Education",
  "SDG 5 - Gender Equality",
  "SDG 6 - Clean Water and Sanitation",
  "SDG 7 - Affordable and Clean Energy",
  "SDG 8 - Decent Work and Economic Growth",
  "SDG 9 - Industry, Innovation and Infrastructure",
  "SDG 10 - Reduced Inequalities",
  "SDG 11 - Sustainable Cities and Communities",
  "SDG 12 - Responsible Consumption and Production",
  "SDG 13 - Climate Action",
  "SDG 15 - Life on Land",
  "SDG 16 - Peace, Justice and Strong Institutions",
  "SDG 17 - Partnerships for the Goals",
] as const;

export interface Opportunity {
  id: string;
  title: string;
  funder_name: string;
  opportunity_type: string;
  sector: string;
  region: string | null;
  sdg: string | null;
  amount_min: number | null;
  amount_max: number | null;
  currency: string;
  eligibility: string | null;
  description: string | null;
  application_link: string;
  deadline: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const formatAmount = (o: Pick<Opportunity, "amount_min" | "amount_max" | "currency">) => {
  const { amount_min: min, amount_max: max, currency } = o;
  if (min == null && max == null) return "Amount not specified";
  if (min != null && max != null)
    return min === max
      ? `${currency} ${compact(min)}`
      : `${currency} ${compact(min)} – ${compact(max)}`;
  if (min != null) return `From ${currency} ${compact(min)}`;
  return `Up to ${currency} ${compact(max as number)}`;
};
