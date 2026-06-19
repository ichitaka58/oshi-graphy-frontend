"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.back()} aria-label="戻る">
      <ChevronLeft />
    </button>
  );
}

export default BackButton;