"use client";

import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

function PageBackButton({ variant = "default" }: { variant?: "ghost" | "outline" | "default" }) {
  const router = useRouter();
  const handleOnClick = useCallback(() => {
    if (history?.length === 1) {
      router.push("/");
    } else {
      router.back();
    }
  }, [router]);
  return (
    <Button onClick={handleOnClick} variant={variant}>
      back
      <ArrowLeft />
    </Button>
  );
}

export default PageBackButton;
