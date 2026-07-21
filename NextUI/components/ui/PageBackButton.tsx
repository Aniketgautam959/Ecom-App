"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageBackButtonProps {
  className?: string;
  iconClassName?: string;
}

export default function PageBackButton({
  className = "mr-4",
  iconClassName = "w-6 h-6",
}: PageBackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className={className}
    >
      <ChevronLeft className={iconClassName} />
    </button>
  );
}
