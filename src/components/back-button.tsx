"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <div className="flex items-center max-w-4xl mx-auto px-4 py-3 text-muted-foreground text-sm">
      <button type="button" onClick={() => router.back()} aria-label="戻る">
        <ChevronLeft />
      </button>
    </div>
  );
}

export default BackButton;