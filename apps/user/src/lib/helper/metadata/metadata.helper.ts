import type { Metadata } from "next";
import { ARTICLE_LIST_PAGE_TITLE, GLOBAL_TITLE } from "#consts/global";
import type { PostItemViewItem, PostListViewList } from "#layer/action/post.action";

export async function generatePagePostMetadata({
  postFetcher,
}: {
  postFetcher: () => Promise<PostItemViewItem | null>;
}): Promise<Metadata> {
  const post = await postFetcher();

  const title = post?.title ? `${post.title} (${GLOBAL_TITLE})` : GLOBAL_TITLE;
  const description = post?.summary ? `${post.summary} (${GLOBAL_TITLE})` : GLOBAL_TITLE;
  const keywords = (post?.metadata?.keywords || ["ai"]).join(",");

  return {
    ...commonMetadata(),
    title,
    description,
    keywords,
  };
}
const DESCRIPTION_MAX_LENGTH = 30;

export async function generatePagePostListMetadata({
  postListFetcher,
}: {
  postListFetcher: () => Promise<PostListViewList[] | null>;
}): Promise<Metadata> {
  const postList = await postListFetcher();

  const title = ARTICLE_LIST_PAGE_TITLE;
  const description =
    (postList ?? []).map((v) => `${v.summary.substring(0, DESCRIPTION_MAX_LENGTH)}...`).join("|") ?? GLOBAL_TITLE;
  const keywords =
    (postList ?? []).map((v) => v.title.replace(/^#\s*/, "").split(" ").slice(0, 2).join(" ")).join(", ") ?? "ai";

  return {
    ...commonMetadata(),
    title,
    description,
    keywords,
  };
}

export async function commonMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://ai-trend-now.stream/post/paper"),
    title: ARTICLE_LIST_PAGE_TITLE, // SEO를 강화한 제목
    description:
      "'내가 편히 보는 AI 뉴스'는 AI 관련 최신 트렌드를 편안하게 읽고 이해할 수 있도록 도와주는 서비스입니다. 복잡한 기술 용어 대신 핵심 내용을 요약하여 독자들에게 전달하며, AI 윤리, 멀티모달 학습, GNSS 분석 등 최신 기술 동향을 제공합니다.", // 간결하고 핵심적인 설명
    generator: "Next.js",
    applicationName: "ai-news-prototype",
    referrer: "origin-when-cross-origin",
    // keywords: ["AI 윤리", "멀티모달 학습", "GNSS 분석", "AI 뉴스", "기술 트렌드", "AI 트렌드 요약"], // 구체적인 키워드 추가
    authors: [{ name: "devtoc", url: "mailto:devtoc89@gmail.com" }], // 이메일 URL 형식 수정
    creator: "devtoc",
    publisher: "devtoc",
    category: "AI 뉴스",
    openGraph: {
      title: ARTICLE_LIST_PAGE_TITLE,
      description:
        "'내가 편히 보는 AI 뉴스'는 최신 AI 트렌드와 논문을 요약해 제공하며, 복잡한 기술 용어 대신 핵심 내용을 쉽게 전달합니다.",
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
      title: ARTICLE_LIST_PAGE_TITLE,
      description:
        "'내가 편히 보는 AI 뉴스'는 최신 AI 트렌드와 논문을 요약해 제공하며, 복잡한 기술 용어 대신 핵심 내용을 쉽게 전달합니다.",
      images: ["https://ai-trend-now.stream/no_image.webp"],
    }, // Twitter 카드 데이터 추가
  };
}
