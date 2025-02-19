import type { Metadata } from "next";

export function generateCommonMetadata({
  title,
  description,
  keywords,
}: { title: string; description: string; keywords: string }): Metadata {
  return {
    metadataBase: new URL("https://ai-trend-now.stream/post/paper"),
    title,
    description,
    generator: "Next.js",
    applicationName: "ai-news-prototype",
    referrer: "origin-when-cross-origin",
    keywords,
    authors: [{ name: "devtoc", url: "mailto:devtoc89@gmail.com" }], // 이메일 URL 형식 수정
    creator: "devtoc",
    publisher: "devtoc",
    category: "AI 뉴스",
    openGraph: {
      title,
      description,
      url: "https://ai-trend-now.stream/post/paper",
      siteName: "AI TREND NOW",
      images: [
        {
          url: "https://ai-trend-now.stream/no_image.webp",
          width: 1200,
          height: 630,
          alt: "AI 트렌드 뉴스",
        },
      ],
      type: "website",
    }, // Open Graph 데이터 추가
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://ai-trend-now.stream/no_image.webp"],
    }, // Twitter 카드 데이터 추가
    other: { "naver-site-verification": "42a518cfb595016582aeac995ce784408f627c0f" },
  };
}
