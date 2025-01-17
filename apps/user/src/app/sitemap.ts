import { range } from "es-toolkit";
import type { MetadataRoute } from "next/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // const { totalCount } = await getPostListAndCountActionCache(PostCategoryEnum.PAPER, 0, NEWS_PAGE_SIZE);
  // const pageCnt = Math.ceil(totalCount / NEWS_PAGE_SIZE);
  const pageCnt = 10;
  const sitemapFromPosts: MetadataRoute.Sitemap = range(1, pageCnt + 1).map((page) => {
    return {
      url: `https://ai-trend-now.stream/post/paper/page/${page}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    };
  });

  return [...sitemapFromPosts];
}
