import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import { range } from "es-toolkit";
import { unstable_cache } from "next/cache";
import type { MetadataRoute } from "next/types";
import { NEWS_PAGE_SIZE } from "#consts/global";
import { getPostTotalCountAction } from "#layer/action/post.action";

const sitemap = unstable_cache(
  async () => {
    const totalCount = await getPostTotalCountAction({ category: PostCategoryEnum.PAPER });
    const pageCnt = Math.min(Math.ceil(totalCount / NEWS_PAGE_SIZE), 5000);

    const sitemapFromPosts: MetadataRoute.Sitemap = range(1, pageCnt + 1).map((page) => {
      return {
        url: `https://ai-trend-now.stream/post/paper/page/${page}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.5,
      };
    });
    return sitemapFromPosts;
  },
  ["sitemap"],
  {
    revalidate: 3600,
  },
);

export default sitemap;
