import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import { range } from "es-toolkit";
import type { MetadataRoute } from "next/types";
import { NEWS_PAGE_SIZE } from "#consts/global";
import { getPostTotalCountAction } from "#layer/action/post.action";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const totalCount = await getPostTotalCountAction({ category: PostCategoryEnum.PAPER });
  const pageCnt = Math.max(Math.ceil(totalCount / NEWS_PAGE_SIZE), 50000);

  const sitemapFromPosts: MetadataRoute.Sitemap = range(1, pageCnt + 1).map((page) => {
    return {
      url: `https://ai-trend-now.stream/post/paper/page/${page}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    };
  });

  return [...sitemapFromPosts];
}
