import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, Sparkles, ShieldCheck } from "lucide-react";

export type DuplicateCandidate = {
  project: {
    id: string;
    name: string;
    brief: string;
    sector?: string;
    location?: string;
  };
  similarity: number;
  verdict: "likely_duplicate" | "partial_overlap" | "distinct";
  reasons: string[];
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isChecking: boolean;
  candidates: DuplicateCandidate[];
  onProceed: () => void;
  onCancel: () => void;
}

const verdictBadge = (v: DuplicateCandidate["verdict"]) => {
  const map = {
    likely_duplicate: { label: "Likely duplicate", variant: "destructive" as const },
    partial_overlap: { label: "Partial overlap", variant: "secondary" as const },
    distinct: { label: "Distinct", variant: "outline" as const },
  };
  const m = map[v] ?? map.partial_overlap;
  return <Badge variant={m.variant}>{m.label}</Badge>;
};

const DuplicateCheckDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  isChecking,
  candidates,
  onProceed,
  onCancel,
}) => {
  const hasMatches = candidates.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sizu-red" />
            Duplication check
          </DialogTitle>
          <DialogDescription>
            SIZU AI scans existing projects to help avoid redundant work before you submit.
          </DialogDescription>
        </DialogHeader>

        {isChecking ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Comparing your project against existing initiatives…</p>
          </div>
        ) : !hasMatches ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <ShieldCheck className="h-10 w-10 text-emerald-500" />
            <p className="font-medium text-gray-900">No similar projects found</p>
            <p className="text-sm text-gray-600">You can safely proceed with submission.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                We found {candidates.length} potentially similar project{candidates.length > 1 ? "s" : ""}.
                Review them before submitting — consider collaborating instead of duplicating.
              </p>
            </div>
            {candidates.map((c) => (
              <div key={c.project.id} className="rounded-md border border-gray-200 p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-900">{c.project.name}</h4>
                  <div className="flex items-center gap-2 shrink-0">
                    {verdictBadge(c.verdict)}
                    <span className="text-xs text-gray-500">
                      {(c.similarity * 100).toFixed(0)}% match
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{c.project.brief}</p>
                <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                  {c.project.sector && <span className="rounded bg-gray-100 px-2 py-0.5">{c.project.sector}</span>}
                  {c.project.location && <span className="rounded bg-gray-100 px-2 py-0.5">{c.project.location}</span>}
                </div>
                {c.reasons?.length > 0 && (
                  <ul className="text-xs text-gray-600 list-disc list-inside">
                    {c.reasons.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isChecking}>
            Revise project
          </Button>
          <Button onClick={onProceed} disabled={isChecking}>
            {hasMatches ? "Proceed anyway" : "Submit project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateCheckDialog;
