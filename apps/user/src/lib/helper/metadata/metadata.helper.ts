import type { Metadata } from "next";
import { GLOBAL_TITLE } from "#consts/global";
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

export async function generatePagePostListMetadata({
  postListFetcher,
}: {
  postListFetcher: () => Promise<PostListViewList[] | null>;
}): Promise<Metadata> {
  const postList = await postListFetcher();

  const title = GLOBAL_TITLE;
  const description = (postList ?? []).map((v) => v.summary).join("|") ?? GLOBAL_TITLE;
  const keywords = (postList ?? []).map((v) => v.title).join(", ") ?? "ai";

  return {
    ...commonMetadata(),
    title,
    description,
    keywords,
  };
}

export async function commonMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://ai-trend-now.stream/"),
    title: GLOBAL_TITLE,
    description:
      "내가 편히 보는 AI 뉴스'는 AI 관련 최신 트렌드를 편안하게 읽고 이해할 수 있도록 도와주는 서비스입니다. 이 프로젝트는 인공지능과 기술의 발전에 관심 있는 독자들이 관련 뉴스를 쉽게 접할 수 있도록 설계되었습니다. 복잡한 기술 용어와 장황한 설명 대신, 핵심 내용을 한눈에 파악할 수 있는 요약과 친근한 해설을 제공합니다.",
    generator: "Next.js",
    applicationName: "ai-news-prototype",
    referrer: "origin-when-cross-origin",
    keywords: ["ai", "news", "column"],
    authors: [{ name: "devtoc", url: "devtoc89@gmail.com" }],
    creator: "devtoc",
    publisher: "devtoc",
    category: "ai",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
