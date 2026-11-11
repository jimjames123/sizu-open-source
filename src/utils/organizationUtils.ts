// Organization labels must come from the project's linked account, not unrelated metadata.
// An explicitly named implementer is a separate attribute and must not overwrite ownership.
export const determineOrganizationName = (project: any): string => {
  if (!project) return "Unknown Organization";
  const linkedProfile = project.profiles;
  const linkedName = Array.isArray(linkedProfile)
    ? linkedProfile[0]?.organization_name
    : linkedProfile?.organization_name;
  if (typeof linkedName === "string" && linkedName.trim()) return linkedName.trim();
  // Public listings cannot read other accounts' profiles under RLS.
  // This label is copied from the project's linked profile into public project metadata.
  const publicName = project?.metadata?.organizationDisplayName;
  if (typeof publicName === "string" && publicName.trim()) return publicName.trim();
  return "Unknown Organization";
};

export const determineProjectImplementer = (project: any): string | null => {
  const value = project?.metadata?.projectImplementer;
  return typeof value === "string" && value.trim() ? value.trim() : null;
};

export const normalizeStatus = (status: string): string => {
  if (!status) return "unknown";
  const normalized = status.toLowerCase();
  if (normalized === "in-progress" || normalized === "in_progress") return "active";
  return normalized.replace(/\s+/g, "_");
};

export const debugOrganizationData = (project: any): void => {
  if (!project) return;
  console.log("Project organization resolution", {
    projectId: project.id,
    organizationId: project.organization_id,
    linkedOrganization: determineOrganizationName(project),
    explicitImplementer: determineProjectImplementer(project),
  });
};
