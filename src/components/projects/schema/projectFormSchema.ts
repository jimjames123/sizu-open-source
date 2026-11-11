
import * as z from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  brief: z.string()
    .min(200, { message: "Brief description must be at least 200 characters" })
    .max(500, { message: "Brief description must be at most 500 characters" }),
  sector: z.string().min(1, { message: "Please select a sector" }),
  femtech: z.boolean().optional().default(false),
  femtechFocus: z.string().optional(),
  sdg: z.string().min(1, { message: "Please select an SDG goal" }),
  location: z.string().min(3, { message: "Please provide a location" }),
  targetGroups: z.string().min(3, { message: "Please specify target groups" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  status: z.string().min(1, { message: "Please select a status" }),
  images: z.array(z.string()).optional().default([]),
  coreObjectives: z.string().optional(),
  projectMilestones: z.string().optional(),
  projectDetails: z.string().optional(),
  region: z.string().optional(),
  district: z.string().optional(),
  parish: z.string().optional(),
  projectImplementer: z.string().optional(),
  projectTeamLead: z.string().optional(),
  implementersWebsite: z.string().optional().refine(
    (val) => !val || val.startsWith('http'), 
    { message: "Website must start with http:// or https://" }
  ),
  otherPartners: z.string().optional(),
  otherTargetGroup: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const sectorOptions = [
  "Agriculture",
  "Education",
  "Health",
  "Environment",
  "Economic Development",
  "Human Rights",
  "Water and Sanitation",
  "Energy",
  "Children and Youth",
  "Gender Equality",
  "Governance",
  "Humanitarian Aid",
  "Infrastructure",
  "Social Development",
  "Civic leadership",
  "Vocational skilling",
  "Entreprenuership",
  "Community development",
  "Technology & Innovation",
  "Other"
];

export const statusOptions = [
  "planning",
  "active", 
  "completed",
  "on_hold",
  "cancelled"
];

export const sdgOptions = [
  { value: "No Poverty", label: "SDG 1: No Poverty" },
  { value: "Zero Hunger", label: "SDG 2: Zero Hunger" },
  { value: "Good Health and Well-being", label: "SDG 3: Good Health and Well-being" },
  { value: "Quality Education", label: "SDG 4: Quality Education" },
  { value: "Gender Equality", label: "SDG 5: Gender Equality" },
  { value: "Clean Water and Sanitation", label: "SDG 6: Clean Water and Sanitation" },
  { value: "Affordable and Clean Energy", label: "SDG 7: Affordable and Clean Energy" },
  { value: "Decent Work and Economic Growth", label: "SDG 8: Decent Work and Economic Growth" },
  { value: "Industry, Innovation and Infrastructure", label: "SDG 9: Industry, Innovation and Infrastructure" },
  { value: "Reduced Inequality", label: "SDG 10: Reduced Inequality" },
  { value: "Sustainable Cities and Communities", label: "SDG 11: Sustainable Cities and Communities" },
  { value: "Responsible Consumption and Production", label: "SDG 12: Responsible Consumption and Production" },
  { value: "Climate Action", label: "SDG 13: Climate Action" },
  { value: "Life Below Water", label: "SDG 14: Life Below Water" },
  { value: "Life on Land", label: "SDG 15: Life on Land" },
  { value: "Peace, Justice and Strong Institutions", label: "SDG 16: Peace, Justice and Strong Institutions" },
  { value: "Partnerships for the Goals", label: "SDG 17: Partnerships for the Goals" },
];
