"use server";

import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import { NEWS_PAGE_SIZE } from "#consts/global";
import { type PostListViewList, getPostListAndCountActionCache } from "#layer/action/post.action";
import NoValidUrl from "#layer/ui/components/common/(server)/InvalidUrl/InvalidUrl";
import NoData from "#layer/ui/components/common/(server)/NoData/NoData";
import PostListPageContent from "#layer/ui/pages/PostListPage/(server)/PostListPageContent";

import type { WebSite, WithContext } from "schema-dts";

function generateJsonLdEntities(list: PostListViewList[]): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI 논문 번역 요약 서비스",
    url: "https://ai-trend-now.stream/post/paper",
    description: "AI 논문을 번역하고 요약하여 최신 연구 동향을 쉽게 이해할 수 있도록 제공하는 서비스입니다.",
    publisher: {
      "@type": "Organization",
      name: "AI TREND NOW",
      logo: {
        "@type": "ImageObject",
        url: "https://ai-trend-now.stream/no_image.webp",
        width: "256px",
        height: "256px",
      },
    },
    author: {
      "@type": "Person",
      name: "devtoc",
      email: "mailto:devtoc89@gmail.com",
    },
    inLanguage: "ko",
    mainEntity: {
      "@type": "CollectionPage",
      name: "최신 AI 논문 요약",
      hasPart: list.map((v) => ({
        "@type": "Article",
        headline: v.title,
        url: `https://ai-trend-now.stream/post/paper/${v.id}`,
        datePublished: v.createdAt,
        dateModified: v.createdAt,
        description: v.summary,
        image: "https://ai-trend-now.stream/no_image.webp",
        author: {
          "@type": "Person",
          name: "devtoc",
        },
      })),
    },
  };
}

async function PostListPage({
  pageString,
  urlPath,
  category = PostCategoryEnum.COLUMN,
}: {
  pageString: string;
  urlPath: string;
  category: PostCategoryEnum;
}) {
  if (!pageString || pageString.match(/^[0-9]+$/) === null) return <NoValidUrl />;

  const page = Number(pageString) - 1;

  if (page < 0) return <NoValidUrl />;
  const { list, totalCount } = await getPostListAndCountActionCache(category, page, NEWS_PAGE_SIZE);

  // TODO: NO Data components.
  if (!list || list.length === 0) return <NoData />;

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLdEntities(list)) }}
      />
      <PostListPageContent
        list={list}
        page={page + 1}
        pageSize={NEWS_PAGE_SIZE}
        pageTotalCount={totalCount}
        urlPath={urlPath}
      />
    </>
  );
}

export default PostListPage;
