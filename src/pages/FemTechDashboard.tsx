import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

type Project = { id: string; name: string; status: string | null; metadata: { femtech?: boolean; femtechFocus?: string } | null };
const FemTechDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !auth.user) { setError("Sign in to manage your FemTech projects."); setLoading(false); return; }
      const { data, error: queryError } = await supabase.from("projects")
        .select("id,name,status,metadata")
        .eq("organization_id", auth.user.id)
        .contains("metadata", { femtech: true });
      if (!active) return;
      if (queryError) setError(queryError.message);
      else setProjects((data ?? []) as Project[]);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, []);
  return (
    <DashboardLayout title="My FemTech initiatives" description="Manage initiatives identified as FemTech in your project submissions.">
      <div className="max-w-4xl space-y-6">
        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Submit a FemTech initiative</h2>
          <p className="mt-2 text-sm text-muted-foreground">Use the standard project submission form and select the FemTech classification. Existing project eligibility and subscription rules still apply.</p>
          <Link to="/dashboard/projects/add" className="mt-4 inline-block rounded-md bg-sizu-red px-4 py-2 font-medium text-white">Add project</Link>
        </div>
        {loading && <p role="status">Loading your initiatives…</p>}
        {error && <p role="alert" className="text-destructive">{error}</p>}
        {!loading && !error && projects.length === 0 && <p>No FemTech initiatives are associated with this account yet. You can add one using the project form.</p>}
        {projects.map(project => (
          <article key={project.id} className="rounded-lg border bg-card p-5">
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Status: {project.status || "Not specified"}{project.metadata?.femtechFocus ? ` · Focus: ${project.metadata.femtechFocus}` : ""}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link to={`/dashboard/projects/edit/${project.id}`} className="text-sizu-red underline">Edit initiative</Link>
              <Link to={`/projects/${project.id}`} className="text-sizu-red underline">View public project</Link>
              <Link to="/dashboard/self-evaluation" className="text-sizu-red underline">Open self-evaluation prototype</Link>
            </div>
          </article>
        ))}
        <p className="text-xs text-muted-foreground">Self-evaluation is a preview only: results are not saved, independently verified, or linked to a specific initiative yet. Do not enter beneficiary-identifying or medical information.</p>
      </div>
    </DashboardLayout>
  );
};
export default FemTechDashboard;
