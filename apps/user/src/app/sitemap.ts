import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import { range } from "es-toolkit";
import { unstable_cache } from "next/cache";
import type { MetadataRoute } from "next/types";
import { getPostIdsAction } from "#layer/action/post.action";

const sitemap = unstable_cache(
  async () => {
    // const totalCount = await getPostTotalCountAction({ category: PostCategoryEnum.PAPER });
    // const pageCnt = Math.min(Math.ceil(totalCount / NEWS_PAGE_SIZE), 100);
    const ids = await getPostIdsAction({ category: PostCategoryEnum.PAPER });

    const sitemapFromPosts: MetadataRoute.Sitemap = range(1, 101).map((page) => ({
      url: `https://ai-trend-now.stream/post/paper/page/${page}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.5,
    }));

    const sitemapFromPostIds: MetadataRoute.Sitemap = ids.map((id) => ({
      url: `https://ai-trend-now.stream/post/paper/${id}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.5,
    }));

    return [...sitemapFromPostIds, ...sitemapFromPosts];
  },
  ["sitemap"],
  {
    revalidate: 3600,
  },
);

export default sitemap;
