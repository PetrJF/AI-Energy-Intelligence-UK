import { Download } from "lucide-react";

export function DownloadPdfButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-card hover:bg-accent transition"
    >
      <Download className="h-4 w-4 text-brand" />
      Download PDF report
    </button>
  );
}
