import type { Metadata } from "next";
import { GLOBAL_TITLE } from "#consts/global";
import { getPostItemActionCache } from "#layer/action/post.action";
import PostDetailPage from "#layer/ui/pages/PostDetailPage/(server)/PostDetailPage";
import { generateCommonMetadata } from "#lib/helper/seo/metadata.helper";

export const revalidate = 3600;
export const dynamicParams = true;
export const runtime = "edge";

const DESCRIPTION_MAX_LENGTH = 140;

async function generatePagePostMetadata({
  id,
}: {
  id: string;
}): Promise<Metadata> {
  const post = await getPostItemActionCache(id);

  const title = post?.title ? `${post.title}` : GLOBAL_TITLE;
  const description = post?.summary ? `${`${post.summary.substring(0, DESCRIPTION_MAX_LENGTH)}...`}` : GLOBAL_TITLE;
  const keywords = (post?.metadata?.keywords || ["ai"]).join(",");

  return {
    ...generateCommonMetadata({ title, description, keywords }),
  };
}

async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostDetailPage id={id} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return await generatePagePostMetadata({ id });
}
export default page;
