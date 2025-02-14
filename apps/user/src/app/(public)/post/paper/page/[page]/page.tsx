import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import type { Metadata } from "next";
import { NEWS_PAGE_SIZE, PAPER_ROOT_URL } from "#consts/global";
import { getPostListAndCountActionCache } from "#layer/action/post.action";
import PostListPage from "#layer/ui/pages/PostListPage/(server)/PostListPage";
import { generatePagePostListMetadata } from "#lib/helper/metadata/metadata.helper";

export const revalidate = 180;
export const dynamicParams = true;
export const runtime = "edge";
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

  return await generatePagePostListMetadata({
    postListFetcher: async () =>
      Number.isNaN(pageNum)
        ? []
        : (await getPostListAndCountActionCache(PostCategoryEnum.PAPER, pageNum - 1, NEWS_PAGE_SIZE)).list,
  });
}

export default page;
