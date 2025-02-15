"use server";

import type { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import type { AiContentExt, AiContentMeta } from "@repo/types/model/ai.model";
import { unstable_cache } from "next/cache";
import {
  type RetrievePostItem,
  retrievePostIdList,
  retrievePostItem,
  retrievePostList,
  retrievePostTotalCount,
} from "#layer/service/post.service";

export type PostListViewList = Omit<AiContentExt, "isError" | "content" | "metadata"> & {
  id: string;
  createdAt: string;
  metadata?: AiContentMeta;
};

export type PostItemViewItem = Omit<AiContentExt, "isError"> & {
  id: string;
  createdAt: string;
};

function postItemToViewItem(post: RetrievePostItem): PostItemViewItem {
  return {
    id: post.id,
    title: post.postDetail?.title || "",
    content: (post.postDetail?.content || "")
      .replace(/\)(\*{1,3})/g, ")$1 ")
      // .replace(/(\n+)/g, "\n")
      // .replace(/\n\s\n\s/gi, "\n\n&nbsp;\n\n")
      // .replace(/\*\*/gi, "@$_%!\^")
      // .replace(/\**\*/gi, "/")
      // .replace(/@\$_%!\^/gi, "**")
      // .replace(/<\/?u>/gi, "*")
      .replaceAll("<br>", "\n"),
    metadata: (post.postMeta?.metadata as AiContentMeta) || undefined,
    summary: post.postDetail?.summary || "",
    createdAt: post.createdAt.toISOString(),
  };
}

function postListToViewList(post: RetrievePostItem): PostListViewList {
  return {
    id: post.id,
    title: post.postDetail?.title || "",
    summary: post.postDetail?.summary || "",
    metadata: post.postMeta?.metadata as AiContentMeta | undefined,
    createdAt: post.createdAt.toISOString(),
  };
}

export async function getPostItemAction({ id }: { id: string }): Promise<PostItemViewItem | null> {
  const resItem = await retrievePostItem({ id });
  if (!resItem.success) {
    return null;
  }

  return postItemToViewItem(resItem.data);
}

export async function getPostListAction({
  page,
  pageSize,
  category,
}: { page: number; pageSize: number; category: PostCategoryEnum }): Promise<PostListViewList[]> {
  const listRes = await retrievePostList({ category, page, pageSize });
  if (!listRes.success) {
    return [];
  }

  return listRes.data.map<PostListViewList>(postListToViewList);
}
export async function getPostTotalCountAction({ category }: { category: PostCategoryEnum }): Promise<number> {
  const contRes = await retrievePostTotalCount({ category });
  if (!contRes.success) {
    return 1;
  }

  return contRes.data;
}
export async function getPostIdsAction({ category }: { category: PostCategoryEnum }): Promise<string[]> {
  const contRes = await retrievePostIdList({ category });
  if (!contRes.success) {
    return [];
  }

  return contRes.data;
}

export const getPostListActionCache = async (category: PostCategoryEnum, page: number, pageSize: number) => {
  const { list } = await getPostListAndCountActionCache(category, page, pageSize);
  return list;
};

export const getPostTotalCountActionCache = async (category: PostCategoryEnum, page: number, pageSize: number) => {
  const { totalCount } = await getPostListAndCountActionCache(category, page, pageSize);
  return totalCount;
};

export const getPostListAndCountActionCache = unstable_cache(
  async (category: PostCategoryEnum, page: number, pageSize: number) => ({
    list: await getPostListAction({ category, page, pageSize }),
    totalCount: await getPostTotalCountAction({ category }),
  }),
  [`${getPostListAction.name}_${getPostTotalCountAction.name}`],
  {
    revalidate: 120,
  },
);

export const getPostItemActionCache = unstable_cache(
  async (id) => await getPostItemAction({ id }),
  [getPostItemAction.name],
  {
    revalidate: 3600,
  },
);

export const getPostIdsActionCache = unstable_cache(
  async (category) => await getPostIdsAction({ category }),
  [getPostIdsAction.name],
  {
    revalidate: 3600,
  },
);
