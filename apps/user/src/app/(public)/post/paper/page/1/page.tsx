import { NEWS_PAGE_SIZE, PAPER_ROOT_URL } from "#consts/global";
import { getPostListAndCountActionCache } from "#layer/action/post.action";
import PostListPage from "#layer/ui/pages/PostListPage/(server)/PostListPage";
import { generatePagePostListMetadata } from "#lib/helper/metadata/metadata.helper";
import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import type { Metadata } from "next/types";

export const revalidate = 120;
export const runtime = "edge";

async function page() {
  return <PostListPage pageString="1" urlPath={PAPER_ROOT_URL} category={PostCategoryEnum.PAPER} />;
}

export async function generateMetadata(): Promise<Metadata> {
  return await generatePagePostListMetadata({
    postListFetcher: async () => (await getPostListAndCountActionCache(PostCategoryEnum.PAPER, 0, NEWS_PAGE_SIZE)).list,
  });
}

export default page;
