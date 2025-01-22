// import "@repo/ui/globals.css";
import "./globals.css";

import RootLayer from "#layer/ui/layouts/root/RootLayer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { Metadata } from "next/types";
import { ARTICLE_LIST_PAGE_TITLE, GLOBAL_DESCRIPTION } from "#consts/global";
import { commonMetadata } from "#lib/helper/metadata/metadata.helper";
export const metadata: Metadata = await commonMetadata({
  title: ARTICLE_LIST_PAGE_TITLE,
  description: GLOBAL_DESCRIPTION,
  keywords: ["AI 뉴스", "기술 트렌드", "AI 트렌드 요약"].join(", "),
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayer lang="ko">
      {children}
      <ToastContainer />
    </RootLayer>
  );
}
