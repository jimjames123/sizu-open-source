import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, Plus, PauseCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  OPPORTUNITY_TYPES,
  OPPORTUNITY_SECTORS,
  OPPORTUNITY_REGIONS,
  OPPORTUNITY_SDGS,
  type Opportunity,
} from "@/constants/opportunities";

const emptyForm = {
  title: "",
  funder_name: "",
  opportunity_type: OPPORTUNITY_TYPES[0] as string,
  sector: OPPORTUNITY_SECTORS[0] as string,
  region: "National",
  sdg: "",
  amount_min: "",
  amount_max: "",
  currency: "USD",
  eligibility: "",
  description: "",
  application_link: "",
  deadline: "",
  status: "live",
};

const AdminOpportunities = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setItems((data || []) as Opportunity[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (o: Opportunity) => {
    setEditingId(o.id);
    setForm({
      title: o.title,
      funder_name: o.funder_name,
      opportunity_type: o.opportunity_type,
      sector: o.sector,
      region: o.region || "National",
      sdg: o.sdg || "",
      amount_min: o.amount_min != null ? String(o.amount_min) : "",
      amount_max: o.amount_max != null ? String(o.amount_max) : "",
      currency: o.currency,
      eligibility: o.eligibility || "",
      description: o.description || "",
      application_link: o.application_link,
      deadline: o.deadline || "",
      status: o.status,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.funder_name || !form.application_link) {
      toast({
        title: "Missing fields",
        description: "Title, funder and application link are required.",
        variant: "destructive",
      });
      return;
    }
    const payload = {
      title: form.title,
      funder_name: form.funder_name,
      opportunity_type: form.opportunity_type,
      sector: form.sector,
      region: form.region || null,
      sdg: form.sdg || null,
      amount_min: form.amount_min ? Number(form.amount_min) : null,
      amount_max: form.amount_max ? Number(form.amount_max) : null,
      currency: form.currency || "USD",
      eligibility: form.eligibility || null,
      description: form.description || null,
      application_link: form.application_link,
      deadline: form.deadline || null,
      status: form.status,
    };

    const { error } = editingId
      ? await supabase.from("opportunities").update(payload).eq("id", editingId)
      : await supabase.from("opportunities").insert(payload);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Opportunity updated" : "Opportunity added" });
      setOpen(false);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this opportunity? This cannot be undone.")) return;
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Opportunity deleted" });
      load();
    }
  };

  const handleArchive = async (id: string) => {
    const { error } = await supabase
      .from("opportunities")
      .update({ status: "archived" })
      .eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Archived" });
      load();
    }
  };

  return (
    <AdminLayout
      title="Opportunity Tracker"
      description="Publish grants, donations and funding calls shown on the public Opportunity Tracker."
    >
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Opportunities ({items.length})</h2>
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add opportunity
          </Button>
        </div>

        {loading ? (
          <p className="p-6 text-center text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-muted-foreground">No opportunities yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Funder</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium max-w-xs truncate">{o.title}</TableCell>
                  <TableCell>{o.funder_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{o.opportunity_type}</Badge>
                  </TableCell>
                  <TableCell>{o.sector}</TableCell>
                  <TableCell>
                    {o.deadline ? format(new Date(o.deadline), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={o.status === "live" ? "default" : "outline"}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {o.status === "live" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArchive(o.id)}
                          title="Archive"
                        >
                          <PauseCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => openEdit(o)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(o.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit opportunity" : "Add new opportunity"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Funder / donor name</Label>
              <Input
                value={form.funder_name}
                onChange={(e) => setForm({ ...form, funder_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select
                  value={form.opportunity_type}
                  onValueChange={(v) => setForm({ ...form, opportunity_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPPORTUNITY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sector</Label>
                <Select
                  value={form.sector}
                  onValueChange={(v) => setForm({ ...form, sector: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPPORTUNITY_SECTORS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Region</Label>
                <Select
                  value={form.region}
                  onValueChange={(v) => setForm({ ...form, region: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPPORTUNITY_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>SDG focus</Label>
                <Select
                  value={form.sdg || "none"}
                  onValueChange={(v) => setForm({ ...form, sdg: v === "none" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {OPPORTUNITY_SDGS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Currency</Label>
                <Input
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                />
              </div>
              <div>
                <Label>Min amount</Label>
                <Input
                  type="number"
                  value={form.amount_min}
                  onChange={(e) => setForm({ ...form, amount_min: e.target.value })}
                />
              </div>
              <div>
                <Label>Max amount</Label>
                <Input
                  type="number"
                  value={form.amount_max}
                  onChange={(e) => setForm({ ...form, amount_max: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Eligibility</Label>
              <Textarea
                rows={2}
                value={form.eligibility}
                onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              />
            </div>
            <div>
              <Label>Application link</Label>
              <Input
                type="url"
                placeholder="https://"
                value={form.application_link}
                onChange={(e) => setForm({ ...form, application_link: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingId ? "Save changes" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOpportunities;
