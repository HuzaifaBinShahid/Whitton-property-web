import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Download, Mail, X, Loader2, FileText, ImageIcon, CheckCircle2 } from "lucide-react";
import type { ComplianceDocument, Photo } from "@/types/db";
import { getDocUrl, getPhotoUrl } from "@/lib/supabase";
import { buildGmailUrl, copyRichHtmlToClipboard } from "../buildGmailUrl";
import { useLogSentEmail } from "@/features/stats/hooks";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  photos: Photo[];
  documents: ComplianceDocument[];
  subject: string;
  propertyId?: string;
  unitId?: string;
};

async function urlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  let type = blob.type;
  if (!type || type === "application/octet-stream") {
    if (filename.endsWith(".pdf")) type = "application/pdf";
    else if (filename.endsWith(".png")) type = "image/png";
    else type = "image/jpeg";
  }
  return new File([blob], filename, { type });
}

function sanitizeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9_\-.]/g, "_");
}

export function ComposeModal({ open, onClose, photos, documents, subject, propertyId, unitId }: Props) {
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const log = useLogSentEmail();
  const totalCount = photos.length + documents.length;

  const handleNativeShare = async () => {
    setSharing(true);
    const toastId = toast.loading("Preparing photos & documents for email attachments...");
    try {
      const files: File[] = [];
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        const url = getPhotoUrl(p.storage_path);
        const ext = p.storage_path.split(".").pop() || "jpg";
        const label = p.label || p.position || `photo_${i + 1}`;
        try { files.push(await urlToFile(url, sanitizeFilename(`${label}.${ext}`))); } catch {}
      }
      for (let i = 0; i < documents.length; i++) {
        const d = documents[i];
        const url = getDocUrl(d.storage_path);
        const ext = d.storage_path.split(".").pop() || "pdf";
        try { files.push(await urlToFile(url, sanitizeFilename(`${d.name}.${ext}`))); } catch {}
      }
      toast.dismiss(toastId);
      if (files.length === 0) { toast.error("Could not prepare files for sharing"); setSharing(false); return; }
      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({ title: subject, text: `Attached: ${subject}`, files });
        toast.success("Shared email with attached files!");
        await log.mutateAsync({ property_id: propertyId ?? null, unit_id: unitId ?? null, subject: subject || null, photo_count: totalCount });
        onClose();
      } else {
        toast.error("Native attachment share not supported. Downloading files...");
        await handleDownloadAll();
      }
    } catch (e) {
      if (!(e instanceof Error && e.name === "AbortError")) toast.error("Sharing failed.");
    } finally { setSharing(false); }
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
    const toastId = toast.loading("Downloading selected photos & documents...");
    try {
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        const a = document.createElement("a");
        a.href = getPhotoUrl(p.storage_path);
        a.download = sanitizeFilename(`${p.label || p.position || "photo_" + (i + 1)}.${p.storage_path.split(".").pop() || "jpg"}`);
        a.target = "_blank";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        await new Promise((r) => setTimeout(r, 250));
      }
      for (let i = 0; i < documents.length; i++) {
        const d = documents[i];
        const a = document.createElement("a");
        a.href = getDocUrl(d.storage_path);
        a.download = sanitizeFilename(`${d.name}.${d.storage_path.split(".").pop() || "pdf"}`);
        a.target = "_blank";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        await new Promise((r) => setTimeout(r, 250));
      }
      toast.dismiss(toastId);
      toast.success("Downloaded files to phone/device!");
    } catch { toast.dismiss(toastId); toast.error("Download failed"); } finally { setDownloading(false); }
  };

  const handleGmailWeb = async () => {
    const built = buildGmailUrl({ subject, photos, docs: documents });
    await copyRichHtmlToClipboard(built.html, built.body);
    window.open(built.url, "_blank", "noopener,noreferrer");
    toast.success("Opened Gmail. Press Cmd+V / Ctrl+V in body to paste visual images.");
    await log.mutateAsync({ property_id: propertyId ?? null, unit_id: unitId ?? null, subject: subject || null, photo_count: totalCount });
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
        <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="w-full max-w-lg bg-white dark:bg-surface-dark rounded-t-2xl sm:rounded-2xl border border-gray-100 dark:border-border-dark shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-border-dark flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Send Photos & Documents</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{totalCount} item{totalCount === 1 ? "" : "s"} selected ({photos.length} photo{photos.length === 1 ? "" : "s"}, {documents.length} doc{documents.length === 1 ? "" : "s"})</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4 overflow-y-auto space-y-2 bg-gray-50/50 dark:bg-bg-dark/40 max-h-48">
            {photos.map((p, idx) => (
              <div key={p.id} className="flex items-center space-x-3 p-2 bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl text-xs">
                <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate flex-1 font-medium text-gray-700 dark:text-gray-300">{p.label || p.position || `Photo ${idx + 1}`}</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Image</span>
              </div>
            ))}
            {documents.map((d) => (
              <div key={d.id} className="flex items-center space-x-3 p-2 bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-xl text-xs">
                <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate flex-1 font-medium text-gray-700 dark:text-gray-300">{d.name}</span>
                <span className="text-[10px] text-amber-500 font-semibold uppercase">PDF / Doc</span>
              </div>
            ))}
          </div>
          <div className="p-4 sm:p-5 space-y-3">
            <button onClick={handleNativeShare} disabled={sharing || downloading} className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-between shadow-lg transition-all cursor-pointer disabled:opacity-50">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">{sharing ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Share2 className="w-5 h-5 text-white" />}</div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5">Send via Mobile Mail App <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-medium">Recommended</span></div>
                  <div className="text-xs text-blue-100 mt-0.5">Attaches actual image files & PDFs directly into email draft</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-blue-200" />
            </button>
            <button onClick={handleDownloadAll} disabled={sharing || downloading} className="w-full p-3.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-medium text-sm flex items-center justify-between cursor-pointer disabled:opacity-50">
              <div className="flex items-center space-x-3 text-left">
                <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="font-semibold text-xs sm:text-sm">Download All Files to Phone/PC</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">Saves files directly to attach in any app</div>
                </div>
              </div>
            </button>
            <button onClick={handleGmailWeb} disabled={sharing || downloading} className="w-full p-3 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-xs flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-red-500" /><span>Open Web Gmail (With HTML Image Clipboard)</span></div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
