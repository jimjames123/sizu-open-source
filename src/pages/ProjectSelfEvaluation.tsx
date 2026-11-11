import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Project = { id: string; name: string };
type Report = { id: string; project_id: string; reporting_period_start: string; reporting_period_end: string; target_beneficiaries: number; reached_beneficiaries: number; outcomes: string; barriers: string; evidence_summary: string; next_steps: string; status: string; reviewer_notes: string | null };
const empty = { reporting_period_start: "", reporting_period_end: "", target_beneficiaries: "", reached_beneficiaries: "", outcomes: "", barriers: "", evidence_summary: "", next_steps: "" };
const ProjectSelfEvaluation = () => {
 const { toast } = useToast();
 const [projects, setProjects] = useState<Project[]>([]);
 const [projectId, setProjectId] = useState("");
 const [reports, setReports] = useState<Report[]>([]);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [values, setValues] = useState(empty);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState("");
 const stats = useMemo(() => {
   const t=Number(values.target_beneficiaries), r=Number(values.reached_beneficiaries);
   return values.target_beneficiaries !== "" && values.reached_beneficiaries !== "" && t>0 && r>=0 ? Math.round(r/t*100) : null;
 }, [values.target_beneficiaries,values.reached_beneficiaries]);
 useEffect(() => {
   let active=true;
   void (async () => {
     const {data:auth}=await supabase.auth.getUser();
     if(!active)return;
     if(!auth.user){setError("Please sign in.");setLoading(false);return;}
     const {data,error:e}=await supabase.from("projects").select("id,name").eq("organization_id",auth.user.id).contains("metadata",{femtech:true});
     if(!active)return;
     if(e)setError(e.message);else {setProjects(data??[]);if(data?.[0])setProjectId(data[0].id);}
     setLoading(false);
   })();
   return()=>{active=false;};
 },[]);
 useEffect(()=>{
   if(!projectId){setReports([]);return;}
   let active=true;
   void (async()=>{
     const {data,error:e}=await supabase.from("femtech_reports" as any).select("*").eq("project_id",projectId).order("reporting_period_end",{ascending:false});
     if(!active)return;
     if(e)setError(e.message);else {setReports((data??[]) as unknown as Report[]);setError("");}
   })();
   return()=>{active=false;};
 },[projectId]);
 const change=(key:keyof typeof empty,value:string)=>setValues(v=>({...v,[key]:value}));
 const save=async(submit:boolean)=>{
   if(!projectId || !values.reporting_period_start || !values.reporting_period_end || values.reporting_period_end<values.reporting_period_start ||
     values.target_beneficiaries==="" || values.reached_beneficiaries==="" ||
     !Number.isInteger(Number(values.target_beneficiaries)) || !Number.isInteger(Number(values.reached_beneficiaries)) ||
     Number(values.target_beneficiaries)<0 || Number(values.reached_beneficiaries)<0){
     toast({title:"Check report fields",description:"Select a project, valid dates and nonnegative whole-number beneficiary counts.",variant:"destructive"});return;
   }
   setSaving(true);
   const {data:auth}=await supabase.auth.getUser();
   if(!auth.user){setSaving(false);return;}
   const payload={project_id:projectId,reporting_period_start:values.reporting_period_start,reporting_period_end:values.reporting_period_end,
     target_beneficiaries:Number(values.target_beneficiaries),reached_beneficiaries:Number(values.reached_beneficiaries),
     outcomes:values.outcomes,barriers:values.barriers,evidence_summary:values.evidence_summary,next_steps:values.next_steps,status:submit?"submitted":"draft"};
   const query=editingId ? supabase.from("femtech_reports" as any).update(payload).eq("id",editingId) :
     supabase.from("femtech_reports" as any).insert({...payload,created_by:auth.user.id,status:"draft"});
   const {error:e}=await query;
   if(e){toast({title:"Report not saved",description:e.message,variant:"destructive"});}
   else if(submit && !editingId){
     // New reports must first be inserted as drafts due to database RLS.
     const {data:latest}=await supabase.from("femtech_reports" as any).select("id").eq("project_id",projectId).eq("created_by",auth.user.id).eq("reporting_period_start",values.reporting_period_start).eq("reporting_period_end",values.reporting_period_end).single();
     if(latest){const {error:submitError}=await supabase.from("femtech_reports" as any).update({status:"submitted"}).eq("id",(latest as any).id);
       if(submitError)toast({title:"Draft saved, submission failed",description:submitError.message,variant:"destructive"});
       else toast({title:"Report submitted",description:"Your self-reported results are awaiting review."});}
   } else toast({title:submit?"Report submitted":"Draft saved",description:submit?"Self-reported results are awaiting review.":"You can return to edit this draft."});
   if(!e){setEditingId(null);setValues(empty);const {data}=await supabase.from("femtech_reports" as any).select("*").eq("project_id",projectId).order("reporting_period_end",{ascending:false});setReports((data??[]) as unknown as Report[]);}
   setSaving(false);
 };
 const edit=(r:Report)=>{setEditingId(r.id);setValues({reporting_period_start:r.reporting_period_start,reporting_period_end:r.reporting_period_end,target_beneficiaries:String(r.target_beneficiaries),reached_beneficiaries:String(r.reached_beneficiaries),outcomes:r.outcomes,barriers:r.barriers,evidence_summary:r.evidence_summary,next_steps:r.next_steps});};
 return <DashboardLayout title="FemTech monitoring and evaluation" description="Record aggregate results and submit them for review.">
  <div className="max-w-3xl space-y-6">
   <p className="rounded-md border bg-muted p-4 text-sm">Figures are self-reported until independently verified. Do not enter names, medical histories, patient records or other identifying beneficiary information.</p>
   {loading && <p>Loading projects…</p>}
   {error && <p role="alert" className="text-destructive">{error}</p>}
   {!loading && projects.length===0 && <p>No FemTech projects are associated with your account. <Link className="underline" to="/dashboard/projects/add">Add a project</Link>.</p>}
   {projects.length>0 && <label className="block text-sm font-medium">FemTech project
    <select className="mt-2 w-full rounded-md border bg-background p-3" value={projectId} onChange={e=>{setProjectId(e.target.value);setEditingId(null);setValues(empty);}}>
      {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
    </select></label>}
   {projectId && <section className="space-y-4 rounded-xl border bg-card p-6">
    <h2 className="text-xl font-semibold">{editingId?"Edit report":"New reporting period"}</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {(["reporting_period_start","reporting_period_end"] as const).map(k=><label key={k} className="text-sm font-medium">{k==="reporting_period_start"?"Period start":"Period end"}<input type="date" className="mt-2 w-full rounded-md border bg-background p-3" value={values[k]} onChange={e=>change(k,e.target.value)}/></label>)}
      {(["target_beneficiaries","reached_beneficiaries"] as const).map(k=><label key={k} className="text-sm font-medium">{k==="target_beneficiaries"?"Target beneficiaries":"Beneficiaries reached"}<input type="number" min="0" step="1" className="mt-2 w-full rounded-md border bg-background p-3" value={values[k]} onChange={e=>change(k,e.target.value)}/></label>)}
    </div>
    {stats!==null && <p className="rounded-md bg-muted p-3 text-sm"><strong>{stats}%</strong> of stated target reached. This is not a verified impact measure.</p>}
    {([["outcomes","What changed for beneficiaries?"],["barriers","Barriers or unintended effects"],["evidence_summary","Non-identifying evidence summary (no patient data)"],["next_steps","Planned improvements"]] as const).map(([key,label])=><label key={key} className="block text-sm font-medium">{label}<textarea rows={3} className="mt-2 w-full rounded-md border bg-background p-3" value={values[key]} onChange={e=>change(key,e.target.value)}/></label>)}
    <div className="flex flex-wrap gap-3"><button disabled={saving} type="button" className="rounded-md border px-4 py-2 disabled:opacity-50" onClick={()=>void save(false)}>Save draft</button><button disabled={saving} type="button" className="rounded-md bg-sizu-red px-4 py-2 text-white disabled:opacity-50" onClick={()=>void save(true)}>Submit for review</button></div>
   </section>}
   {reports.length>0 && <section className="space-y-3"><h2 className="text-xl font-semibold">Reporting history</h2>{reports.map(r=><article key={r.id} className="rounded-md border p-4"><p className="font-medium">{r.reporting_period_start} to {r.reporting_period_end}</p><p className="text-sm">Status: {r.status.replace(/_/g," ")} · Reached: {r.reached_beneficiaries} / {r.target_beneficiaries}</p>{r.reviewer_notes && <p className="mt-2 text-sm">Reviewer feedback: {r.reviewer_notes}</p>}{(r.status==="draft"||r.status==="needs_revision")&&<button className="mt-3 text-sm text-sizu-red underline" onClick={()=>edit(r)}>Edit report</button>}</article>)}</section>}
   <Link className="text-sizu-red underline" to="/dashboard/femtech">Back to FemTech initiatives</Link>
  </div>
 </DashboardLayout>;
};
export default ProjectSelfEvaluation;
