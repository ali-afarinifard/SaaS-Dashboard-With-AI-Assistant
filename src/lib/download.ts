import { toast } from "@/components/ui/toast";

export function downloadCSV(title: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Download started", `${title} is downloading`);
}