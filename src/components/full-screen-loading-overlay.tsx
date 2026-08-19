import { Spinner } from "@/components/kibo-ui/spinner";

export function FullScreenLoadingOverlay() {
  return (
    <div role="status" aria-live="polite" aria-label="読み込み中" className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <Spinner variant="bars" className="size-10 text-accent" aria-hidden="true" />
    </div>
  );
}
