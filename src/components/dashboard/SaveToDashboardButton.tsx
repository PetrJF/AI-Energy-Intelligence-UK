import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Save, Check, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { saveCalculation } from "@/lib/dashboard.functions";
import { Button } from "@/components/ui/button";

export function SaveToDashboardButton({
  toolSlug,
  toolName,
  inputs,
  resultSummary,
  className = "",
}: {
  toolSlug: string;
  toolName: string;
  inputs?: Record<string, unknown>;
  resultSummary?: Record<string, unknown>;
  className?: string;
}) {
  const { user, loading } = useAuth();
  const save = useServerFn(saveCalculation);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm" className={className}>
        <Link to="/login" search={{ redirect: window.location.pathname }}>
          <LogIn className="mr-1.5 h-4 w-4" /> Sign in to save
        </Link>
      </Button>
    );
  }

  const onSave = async () => {
    setBusy(true);
    try {
      await save({
        data: {
          toolSlug,
          toolName,
          inputs: inputs ?? {},
          resultSummary: resultSummary ?? {},
        },
      });
      setSaved(true);
      toast.success("Saved to your dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="outline" size="sm" className={className} onClick={onSave} disabled={busy || saved}>
      {saved ? (
        <>
          <Check className="mr-1.5 h-4 w-4 text-electric" /> Saved
        </>
      ) : (
        <>
          <Save className="mr-1.5 h-4 w-4" /> {busy ? "Saving…" : "Save to dashboard"}
        </>
      )}
    </Button>
  );
}
