import type { Metadata } from "next";
import { ARTICLE_LIST_PAGE_TITLE, GLOBAL_TITLE } from "#consts/global";
import type { PostItemViewItem, PostListViewList } from "#layer/action/post.action";

const DESCRIPTION_MAX_LENGTH = 140;

export async function generatePagePostMetadata({
  postFetcher,
}: {
  postFetcher: () => Promise<PostItemViewItem | null>;
}): Promise<Metadata> {
  const post = await postFetcher();

  const title = post?.title ? `${post.title}` : GLOBAL_TITLE;
  const description = post?.summary ? `${`${post.summary.substring(0, DESCRIPTION_MAX_LENGTH)}...`}` : GLOBAL_TITLE;
  const keywords = (post?.metadata?.keywords || ["ai"]).join(",");

  return {
    ...commonMetadata({ title, description, keywords }),
  };
}
const DESCRIPTION_LIST_MAX_LENGTH = 10;

export async function generatePagePostListMetadata({
  postListFetcher,
}: {
  postListFetcher: () => Promise<PostListViewList[] | null>;
}): Promise<Metadata> {
  const postList = await postListFetcher();

  const title = ARTICLE_LIST_PAGE_TITLE;
  const description =
    (postList ?? [])
      .map((v) => `${v.metadata?.insights?.[0]?.substring(0, DESCRIPTION_LIST_MAX_LENGTH)}...`)
      .join("|") ?? GLOBAL_TITLE;

  const keywords =
    (postList ?? []).map((v) => v.title.replace(/^#\s*/, "").split(" ").slice(0, 2).join(" ")).join(", ") ?? "ai";

  return {
    ...commonMetadata({ title, description, keywords }),
  };
}

export function commonMetadata({
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
