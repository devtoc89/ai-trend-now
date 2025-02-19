import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import type { Metadata } from "next";
import { ARTICLE_LIST_PAGE_TITLE, GLOBAL_TITLE, NEWS_PAGE_SIZE, PAPER_ROOT_URL } from "#consts/global";
import { getPostListAndCountActionCache } from "#layer/action/post.action";
import PostListPage from "#layer/ui/pages/PostListPage/(server)/PostListPage";
import { generateCommonMetadata } from "#lib/helper/seo/metadata.helper";

export const revalidate = 180;
export const dynamicParams = true;
export const runtime = "edge";

const DESCRIPTION_LIST_MAX_LENGTH = 10;

async function generatePagePostListMetadata({
  pageNum,
}: {
  pageNum: number;
}): Promise<Metadata> {
  const postList = Number.isNaN(pageNum)
    ? []
    : (await getPostListAndCountActionCache(PostCategoryEnum.PAPER, pageNum - 1, NEWS_PAGE_SIZE)).list;

  const title = ARTICLE_LIST_PAGE_TITLE;
  const description =
    (postList ?? [])
      .map((v) => `${v.metadata?.insights?.[0]?.substring(0, DESCRIPTION_LIST_MAX_LENGTH)}...`)
      .join("|") ?? GLOBAL_TITLE;

  const keywords =
    (postList ?? []).map((v) => v.title.replace(/^#\s*/, "").split(" ").slice(0, 2).join(" ")).join(", ") ?? "ai";

  return {
    ...generateCommonMetadata({ title, description, keywords }),
  };
}

async function page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  return <PostListPage pageString={(await params).page} urlPath={PAPER_ROOT_URL} category={PostCategoryEnum.PAPER} />;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const pageNum = Number.parseInt((await params).page ?? 0);
  return await generatePagePostListMetadata({ pageNum });
}

export default page;
