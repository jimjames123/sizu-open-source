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

const CATEGORIES = [
  "Business Registration",
  "Tax & Compliance",
  "Finance",
  "Legal",
  "Agriculture",
  "Health",
];

interface VitalInfoEntry {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  category: string;
  web_link: string;
  valid_until: string | null;
  status: string;
  last_updated: string;
}

const emptyForm = {
  title: "",
  summary: "",
  source_name: "",
  category: CATEGORIES[0],
  web_link: "",
  valid_until: "",
  status: "live",
};

const AdminVitalInfo = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<VitalInfoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vital_info")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setEntries((data || []) as VitalInfoEntry[]);
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

  const openEdit = (entry: VitalInfoEntry) => {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      summary: entry.summary,
      source_name: entry.source_name,
      category: entry.category,
      web_link: entry.web_link,
      valid_until: entry.valid_until || "",
      status: entry.status,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.summary || !form.source_name || !form.web_link) {
      toast({ title: "Missing fields", description: "Title, summary, source and link are required.", variant: "destructive" });
      return;
    }
    if (form.summary.length > 300) {
      toast({ title: "Summary too long", description: "Maximum 300 characters.", variant: "destructive" });
      return;
    }
    const payload = {
      title: form.title,
      summary: form.summary,
      source_name: form.source_name,
      category: form.category,
      web_link: form.web_link,
      valid_until: form.valid_until || null,
      status: form.status,
      last_updated: new Date().toISOString().slice(0, 10),
    };
    const { error } = editingId
      ? await supabase.from("vital_info").update(payload).eq("id", editingId)
      : await supabase.from("vital_info").insert(payload);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Entry updated" : "Entry added" });
      setOpen(false);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    const { error } = await supabase.from("vital_info").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Entry deleted" });
      load();
    }
  };

  const handleMarkExpired = async (id: string) => {
    const { error } = await supabase
      .from("vital_info")
      .update({ status: "expired", last_updated: new Date().toISOString().slice(0, 10) })
      .eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Marked as expired" });
      load();
    }
  };

  return (
    <AdminLayout
      title="Vital Info"
      description="Add, edit, or expire entries shown on the public Vital Info Hub."
    >
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Entries ({entries.length})</h2>
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add entry
          </Button>
        </div>

        {loading ? (
          <p className="p-6 text-center text-muted-foreground">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="p-6 text-center text-muted-foreground">No entries yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Valid until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium max-w-xs truncate">{e.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{e.category}</Badge>
                  </TableCell>
                  <TableCell>{e.source_name}</TableCell>
                  <TableCell>
                    {e.valid_until ? format(new Date(e.valid_until), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={e.status === "live" ? "default" : "outline"}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {e.status === "live" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkExpired(e.id)}
                          title="Mark expired"
                        >
                          <PauseCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => openEdit(e)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(e.id)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit entry" : "Add new entry"}</DialogTitle>
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
              <Label>Summary ({form.summary.length}/300)</Label>
              <Textarea
                value={form.summary}
                maxLength={300}
                rows={3}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Source name</Label>
                <Input
                  placeholder="e.g. URSB"
                  value={form.source_name}
                  onChange={(e) => setForm({ ...form, source_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Website link</Label>
              <Input
                type="url"
                placeholder="https://"
                value={form.web_link}
                onChange={(e) => setForm({ ...form, web_link: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Valid until</Label>
                <Input
                  type="date"
                  value={form.valid_until}
                  onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
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
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingId ? "Save changes" : "Add entry"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminVitalInfo;
