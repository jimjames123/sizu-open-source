import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchProjects from "./tools/search-projects";
import getProject from "./tools/get-project";
import listMyProjects from "./tools/list-my-projects";
import listOpportunities from "./tools/list-opportunities";
import listOrganizations from "./tools/list-organizations";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "sizu",
  title: "sizu",
  version: "0.1.0",
  instructions:
    "Tools for SIZU, a platform for impact projects, organizations and funding opportunities in Uganda. Use search_projects and get_project to explore projects, list_my_projects for the signed-in organization's own projects, list_organizations for registered organizations, and list_opportunities for grants and donations.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchProjects, getProject, listMyProjects, listOrganizations, listOpportunities],
});
