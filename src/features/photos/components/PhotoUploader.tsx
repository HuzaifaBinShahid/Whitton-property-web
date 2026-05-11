import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type Props = {
  onFiles: (files: File[]) => void;
  uploading?: boolean;
};

export function PhotoUploader({ onFiles, uploading }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const pickFiles = () => inputRef.current?.click();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length > 0) onFiles(files);
  };

  const onDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(false);
  };
  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files ?? []).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (files.length > 0) onFiles(files);
  };

  return (
    <>
      <button
        type="button"
        onClick={pickFiles}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        disabled={uploading}
        className={cn(
          'group aspect-square w-full rounded-tile border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all',
          dragOver
            ? 'border-accent bg-accent/5 dark:border-accent-dark dark:bg-accent-dark/5 scale-[1.02]'
            : 'border-border dark:border-border-dark hover:border-accent/60 dark:hover:border-accent-dark/60',
          uploading && 'opacity-60',
        )}
      >
        {uploading ? (
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-accent" />
        ) : (
          <ImagePlus
            size={22}
            strokeWidth={1.75}
            className="text-muted dark:text-muted-dark group-hover:text-accent dark:group-hover:text-accent-dark transition-colors"
          />
        )}
        <span className="text-[12px] font-semibold text-muted dark:text-muted-dark">
          {uploading ? 'Uploading…' : 'Add photos'}
        </span>
        <span className="text-[11px] text-muted/70 dark:text-muted-dark/70">
          {dragOver ? 'Drop to upload' : 'Click or drop'}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleChange}
      />
    </>
  );
}
