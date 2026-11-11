import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
type Report = { id:string; project_id:string; reporting_period_start:string; reporting_period_end:string; target_beneficiaries:number; reached_beneficiaries:number; outcomes:string; barriers:string; evidence_summary:string; next_steps:string; status:string; reviewer_notes:string|null; reviewed_at:string|null };
export default function FemTechReviews(){
 const {toast}=useToast();
 const [reports,setReports]=useState<Report[]>([]);
 const [notes,setNotes]=useState<Record<string,string>>({});
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [authorized,setAuthorized]=useState(false);
 const [busy,setBusy]=useState<string|null>(null);
 const refresh=async()=>{
  const {data,error:e}=await supabase.from("femtech_reports" as any).select("*").in("status",["submitted","under_review"]).order("created_at",{ascending:true});
  if(e)setError(e.message);else {setReports((data??[]) as unknown as Report[]);setError("");}
 };
 useEffect(()=>{let active=true;void(async()=>{
  const {data:auth}=await supabase.auth.getUser();
  if(!auth.user){if(active){setError("Sign in as an administrator.");setLoading(false);}return;}
  const {data:admin,error:e}=await supabase.rpc("is_admin");
  if(!active)return;
  if(e || !admin){setError("Administrator access required.");setLoading(false);return;}
  setAuthorized(true);await refresh();if(active)setLoading(false);
 })();return()=>{active=false;};},[]);
 const review=async(r:Report,status:"under_review"|"verified"|"needs_revision")=>{
  if(status==="needs_revision" && !(notes[r.id]??r.reviewer_notes??"").trim()){toast({title:"Review feedback required",variant:"destructive"});return;}
  setBusy(r.id);
  const {data:auth}=await supabase.auth.getUser();
  if(!auth.user){setBusy(null);return;}
  const {error:e}=await supabase.from("femtech_reports" as any).update({status,reviewer_notes:notes[r.id]??r.reviewer_notes??null,reviewed_by:auth.user.id,reviewed_at:new Date().toISOString()}).eq("id",r.id);
  if(e)toast({title:"Review not saved",description:e.message,variant:"destructive"});
  else {toast({title:"Review saved",description:"Report status updated."});await refresh();}
  setBusy(null);
 };
 return <DashboardLayout title="FemTech report reviews" description="Review organization-submitted results; verification requires independent evidence checks.">
 <div className="max-w-4xl space-y-5">
 <p className="rounded-md border bg-muted p-4 text-sm">Reported numbers are unverified until reviewed. Confirm supporting evidence outside this screen before choosing Verify. Do not enter identifiable beneficiary or patient data.</p>
 {loading&&<p>Loading reports…</p>}
 {error&&<p role="alert" className="text-destructive">{error}</p>}
 {authorized&&!loading&&reports.length===0&&<p>No reports awaiting review.</p>}
 {authorized&&reports.map(r=><article key={r.id} className="space-y-3 rounded-lg border bg-card p-5">
 <h2 className="font-semibold">Project ID: {r.project_id}</h2>
 <p className="text-sm">Period: {r.reporting_period_start} to {r.reporting_period_end} · Status: {r.status.replace(/_/g," ")}</p>
 <p className="text-sm">Reported beneficiaries: {r.reached_beneficiaries} / {r.target_beneficiaries} target</p>
 <div className="space-y-2 text-sm"><p><strong>Outcomes:</strong> {r.outcomes||"Not supplied"}</p><p><strong>Barriers:</strong> {r.barriers||"Not supplied"}</p><p><strong>Evidence summary:</strong> {r.evidence_summary||"Not supplied"}</p><p><strong>Next steps:</strong> {r.next_steps||"Not supplied"}</p></div>
 <label className="block text-sm font-medium">Reviewer notes<textarea rows={3} className="mt-2 w-full rounded-md border bg-background p-3" value={notes[r.id]??r.reviewer_notes??""} onChange={e=>setNotes(n=>({...n,[r.id]:e.target.value}))}/></label>
 <div className="flex flex-wrap gap-2"><button disabled={busy!==null} className="rounded-md border px-3 py-2 disabled:opacity-50" onClick={()=>void review(r,"under_review")}>Mark under review</button><button disabled={busy!==null} className="rounded-md border px-3 py-2 disabled:opacity-50" onClick={()=>void review(r,"needs_revision")}>Request revision</button><button disabled={busy!==null} className="rounded-md bg-sizu-red px-3 py-2 text-white disabled:opacity-50" onClick={()=>void review(r,"verified")}>Verify report</button></div>
 </article>)}
 </div></DashboardLayout>;
}
