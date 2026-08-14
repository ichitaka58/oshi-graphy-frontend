import { Spinner } from "@/components/kibo-ui/spinner";

export function FullScreenLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <Spinner variant="bars" className="size-10 text-accent" />
    </div>
  );
}
