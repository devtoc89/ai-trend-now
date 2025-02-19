import { type PostItemViewItem, getPostItemActionCache } from "#layer/action/post.action";
import NoData from "#layer/ui/components/common/(server)/NoData/NoData";
import PostDetailPageContent from "#layer/ui/pages/PostDetailPage/(server)/PostDetailPageContent";

import type { ScholarlyArticle, WithContext } from "schema-dts";

function generateJsonLdEntities(item: PostItemViewItem): WithContext<ScholarlyArticle> {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: item.title,
    name: item.title,
    url: `https://ai-trend-now.stream/post/paper/${item.id}`,
    description: item.summary,
    datePublished: item.createdAt,
    dateModified: item.metadata.references[0]?.lastUpdatedAt || item.createdAt,
    author: item.metadata.references
      .flatMap((v) => v.authors)
      .map((v) => ({
        "@type": "Person",
        name: v?.name,
      })),
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
    image: {
      "@type": "ImageObject",
      url: "https://ai-trend-now.stream/no_image.webp",
      width: "256px",
      height: "256px",
    },
    citation: {
      "@type": "ScholarlyArticle",
      name: item.metadata.references[0]?.source,
      url: item.metadata.references[0]?.url,
    },
    keywords: item?.metadata?.keywords || ["ai"],
    mainEntityOfPage: `https://ai-trend-now.stream/post/paper/${item.id}`,
  };
}

async function PostDetailPage({ id }: { id: string }) {
  const post = await getPostItemActionCache(id);

  if (!post) return <NoData />;

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLdEntities(post)) }}
      />
      <PostDetailPageContent post={post} />
    </>
  );
}

export default PostDetailPage;
