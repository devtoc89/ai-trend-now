import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import { range } from "es-toolkit";
import type { MetadataRoute } from "next/types";
import { NEWS_PAGE_SIZE } from "#consts/global";
import { getPostIdsActionCache, getPostListAndCountActionCache } from "#layer/action/post.action";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { totalCount } = await getPostListAndCountActionCache(PostCategoryEnum.PAPER, 0, NEWS_PAGE_SIZE);
  const pageCnt = Math.ceil(totalCount / NEWS_PAGE_SIZE);
  const sitemapFromPosts: MetadataRoute.Sitemap = range(1, pageCnt + 1).map((page) => {
    return {
      url: `https://ai-trend-now.stream/post/paper/page/${page}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.5,
    };
  });
  const sitemapFromPostDetail: MetadataRoute.Sitemap = (await getPostIdsActionCache(PostCategoryEnum.PAPER)).map(
    (id) => ({
      url: `https://ai-trend-now.stream/post/paper/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );
  return [...sitemapFromPostDetail, ...sitemapFromPosts];
}
