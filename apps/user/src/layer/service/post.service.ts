"use server";

import type { PostBase, PostDetail, PostMeta } from "@prisma/client/user/index.js";
import type { ResponseTypeDTO } from "@repo/types/dto/response/response.dto";
import type { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import PostRepository from "#layer/repository/post.repo";
import { serviceWrapper } from "#lib/helper/service/service.helper";
import { getPrismaClient } from "#lib/instance/prisma/prisma.instance";

export type RetrievePostItem = Pick<PostBase, "id" | "createdAt"> & {
  postMeta: Pick<PostMeta, "metadata"> | null;
  postDetail: Pick<PostDetail, "title" | "content" | "summary"> | null;
};
export type RetrievePostList = Array<RetrievePostItem>;

export async function retrievePostItem({ id }: { id: string }): Promise<ResponseTypeDTO<RetrievePostItem>> {
  const prisma = getPrismaClient();
  return await serviceWrapper(retrievePostItem.name, async () => {
    return await PostRepository.select.one(prisma, id);
  });
}

export async function retrievePostList({
  page,
  pageSize = 5,
  category,
}: { page: number; pageSize?: number; category: PostCategoryEnum }): Promise<ResponseTypeDTO<RetrievePostList>> {
  const prisma = getPrismaClient();
  return await serviceWrapper(retrievePostList.name, async () => {
    return await PostRepository.select.many(prisma, category, page, pageSize);
  });
}

export async function retrievePostTotalCount({
  category,
}: { category: PostCategoryEnum }): Promise<ResponseTypeDTO<number>> {
  const prisma = getPrismaClient();
  return await serviceWrapper(retrievePostTotalCount.name, async () => {
    return (await PostRepository.select.liveCount(prisma, category))._count;
  });
}

export async function retrievePostIdList({
  category,
}: { category: PostCategoryEnum }): Promise<ResponseTypeDTO<string[]>> {
  const prisma = getPrismaClient();
  return await serviceWrapper(retrievePostIdList.name, async () => {
    return (await PostRepository.select.ids(prisma, category)).map((v) => v.id);
  });
}
