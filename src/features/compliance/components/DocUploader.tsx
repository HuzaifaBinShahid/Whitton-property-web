import { useRef, useState, type ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ComplianceCategory } from '@/types/db';
import { useUploadDoc } from '../hooks';
import { complianceCategoryMeta } from '../categories';

type Props = {
  propertyId: string;
  category: ComplianceCategory;
  open: boolean;
  onClose: () => void;
};

export function DocUploader({ propertyId, category, open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const upload = useUploadDoc();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const reset = () => {
    setFile(null);
    setName('');
    setExpiry('');
  };

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && !name) setName(stripExt(f.name));
  };

  const submit = async () => {
    if (!file) {
      toast.error('Please choose a file');
      return;
    }
    try {
      await upload.mutateAsync({
        propertyId,
        category,
        file,
        name,
        expiryDate: expiry || null,
      });
      toast.success('Document uploaded');
      reset();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const meta = complianceCategoryMeta(category);

  return (
    <Modal
      open={open}
      onClose={() => {
        if (upload.isPending) return;
        reset();
        onClose();
      }}
      title={`Upload ${meta.label} document`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={upload.isPending}>
            Cancel
          </Button>
          <Button onClick={submit} loading={upload.isPending} disabled={!file}>
            Upload
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-card border-2 border-dashed border-border dark:border-border-dark p-4 flex items-center gap-3 hover:border-accent/60 dark:hover:border-accent-dark/60 transition-colors text-left"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
            <Upload size={18} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold truncate">
              {file ? file.name : 'Choose a PDF'}
            </div>
            <div className="text-[12px] text-muted dark:text-muted-dark">
              {file ? `${(file.size / 1024).toFixed(0)} KB` : 'PDF, max 10 MB recommended'}
            </div>
          </div>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={pick}
        />
        <Input
          label="Document name"
          placeholder="e.g. Gas safety certificate 2026"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
        />
        <Input
          label="Expiry date"
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
      </div>
    </Modal>
  );
}

function stripExt(name: string): string {
  return name.replace(/\.[a-z0-9]+$/i, '');
}
