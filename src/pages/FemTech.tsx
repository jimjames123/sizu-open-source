import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

type FemTechProject = {
  id: string;
  name: string;
  brief: string | null;
  image: string | null;
  sector: string | null;
  location: string | null;
  metadata: { femtech?: boolean; femtechReviewStatus?: string; organizationDisplayName?: string } | null;
};

const FemTech = () => {
  const [projects, setProjects] = useState<FemTechProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id,name,brief,sector,location,image,metadata")
        .contains("metadata", { femtech: true });
      if (!active) return;
      if (error) setError("FemTech projects could not be loaded. Please try again later.");
      else setProjects((data ?? []) as FemTechProject[]);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => {
    const unique = new Map<string, FemTechProject>();
    for (const project of projects) {
      // Two existing Palabek entries describe the same initiative.
      const key = project.name.trim().toLocaleLowerCase().replace(/\s+/g, " ");
      if (!unique.has(key)) unique.set(key, project);
    }
    const query = search.trim().toLocaleLowerCase();
    return [...unique.values()].filter((project) =>
      [project.name, project.brief, project.location, project.metadata?.organizationDisplayName]
        .some((value) => (value ?? "").toLocaleLowerCase().includes(query))
    );
  }, [projects, search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 pt-36 pb-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-sizu-red">SIZU • FemTech Hub</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Women's health innovation and community impact</h1>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
          Discover initiatives supporting menstrual health, reproductive health, nutrition and women's well-being in Uganda.
          SIZU is developing tools to help organizations report outcomes and support evidence-based evaluation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/dashboard/femtech" className="rounded-md border border-sizu-red px-4 py-2 font-semibold text-sizu-red">Manage your FemTech initiatives</Link>
          <Link to="/dashboard/projects/add" className="rounded-md bg-sizu-red px-4 py-2 font-semibold text-white">Submit an initiative</Link>
        </div>
        <section className="mt-12 grid gap-5 md:grid-cols-3" aria-label="FemTech focus areas">
          {[
            ["Discover", "Find initiatives addressing women's and girls' health needs."],
            ["Measure", "Track reported reach and outcomes as evaluation tools are introduced."],
            ["Improve", "Use independently reviewed findings to inform future decisions."]
          ].map(([title, description]) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-muted-foreground">{description}</p>
            </div>
          ))}
        </section>
        <a href="#femtech-projects" className="mt-8 inline-block rounded-md bg-sizu-red px-5 py-3 font-semibold text-white hover:opacity-90">
          Explore FemTech projects
        </a>
        <section id="femtech-projects" className="mt-16 scroll-mt-28" aria-label="FemTech projects">
          <h2 className="text-3xl font-bold">FemTech-related initiatives</h2>
          <p className="mt-3 text-muted-foreground">Projects provisionally classified from their submitted descriptions. Classification does not imply independent verification or endorsement.</p>
          <label htmlFor="femtech-search" className="mt-6 block text-sm font-medium">Search initiatives</label>
          <input id="femtech-search" value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, location or organization"
            className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-foreground" />
          {loading && <p className="mt-6" role="status">Loading initiatives…</p>}
          {error && <p className="mt-6 text-destructive" role="alert">{error}</p>}
          {!loading && !error && visible.length === 0 && <p className="mt-6">No matching initiatives found.</p>}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {visible.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-xl border border-border bg-card">
                {project.image && <img src={project.image} alt={project.name} loading="lazy" className="h-48 w-full object-cover" />}
                <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Women's & girls' health • Provisional</p>
                <h3 className="mt-2 text-xl font-semibold">{project.name}</h3>
                {project.metadata?.organizationDisplayName && <p className="mt-2 text-sm font-medium">{project.metadata.organizationDisplayName}</p>}
                {project.location && <p className="mt-1 text-sm text-muted-foreground">{project.location}</p>}
                {project.brief && <p className="mt-3 text-sm text-muted-foreground">{project.brief}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
        <p className="mt-10 text-sm text-muted-foreground">
          Dedicated FemTech submissions and independent verification are under development.
          Information shown on SIZU is not a substitute for professional medical advice.
        </p>
      </main>
      <Footer />
    </div>
  );
};
export default FemTech;
