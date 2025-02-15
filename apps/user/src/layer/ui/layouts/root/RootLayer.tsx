import { cn } from "@repo/util/style/tailwind.util";
import type { Metadata } from "next/types";
import type React from "react";
import FontPretendard from "#app/fonts/FontPretendard";
import { GLOBAL_DESCRIPTION, GLOBAL_TITLE } from "#consts/global";
import { commonMetadata } from "#lib/helper/metadata/metadata.helper";

export const metadata: Metadata = commonMetadata({
  title: GLOBAL_TITLE,
  description: GLOBAL_DESCRIPTION,
  keywords: "AI, AI논문",
});

function RootLayer({
  className,
  children,
  lang = "ko",
}: Readonly<{ className?: string; children: React.ReactNode; lang?: string }>) {
  return (
    <html lang={lang}>
      <link rel="icon" href="/favicon.png" sizes="any" />
      <body
        className={cn(
          "antialiased lg:text-shadow-ssm dark:shadow-gray-300 dark:bg-slate-900 dark:text-white text-gray-950",
          FontPretendard.className,
          className,
        )}
      >
        {children}
      </body>
    </html>
  );
}

export default RootLayer;
