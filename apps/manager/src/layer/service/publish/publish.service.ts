"use server";

import { createId } from "@paralleldrive/cuid2";
import type { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import type { AiContentMeta } from "@repo/types/model/ai.model";
import AiPostRepository from "#layer/repository/ai-post/ai.post.repo";
import OriginalPostRepository from "#layer/repository/original-post/original.post.repo";
import PostRepository from "#layer/repository/post/post.repo";
import OriginalPostAndAiPostRelationRepository from "#layer/repository/relations/original.post.ai.post.relation.repo";
import { writePostByAi } from "#layer/service/ai/ai.writer";
import { serviceWrapper } from "#lib/helper/service/service.helper";
import { getPrismaClient } from "#lib/instance/prisma/manager.prisma.instance";
import { getUserPrismaClient } from "#lib/instance/prisma/user.prisma.instance";

export async function autoPublishByCategory(postCategoryList: PostCategoryEnum[], aiPostCategory: PostCategoryEnum) {
  const managerPrisma = getPrismaClient();
  const userPrisma = getUserPrismaClient();

  const sources = await OriginalPostRepository.select.manyForPublishByCategory(managerPrisma, postCategoryList);

  return await serviceWrapper(
    autoPublishByCategory.name,
    async () => {
      if (!sources[0]) throw new Error("there is no post to publish.");
      const originalPost = sources[0];

      if (!originalPost.originalPostSource || !originalPost.originalPostMeta)
        throw new Error("there is no post to publish.");

      await OriginalPostRepository.update.autoStatus(managerPrisma, originalPost.id);

      const originalPostSource = originalPost.originalPostSource;
      const originalPostMeta = originalPost.originalPostMeta;

      const aiContent = await writePostByAi(aiPostCategory, [{ originalPostSource, originalPostMeta }]);

      const aiPostId = createId();
      await managerPrisma.$transaction(async (tx) => {
        const aiPost = await AiPostRepository.insert.createByAiContent(tx, aiPostId, aiContent, aiPostCategory);
        const relation = await OriginalPostAndAiPostRelationRepository.insert.create(tx, [originalPost.id], aiPostId);
        return { aiPost, relation };
      });

      await PostRepository.insert.createByAiContent(userPrisma, aiPostId, aiPostId, aiContent, aiPostCategory);
      await AiPostRepository.update.publishStatus(managerPrisma, aiPostId);

      return { id: aiPostId };
    },
    async () => {
      const originalPost = sources[0];
      if (!originalPost || !originalPost.originalPostSource || !originalPost.originalPostMeta) return;
      await OriginalPostRepository.update.autoStatus(managerPrisma, originalPost.id, false);
    },
  );
}

export async function publishAiPost(aiPostId: string) {
  const managerPrisma = getPrismaClient();
  const id = createId();

  return await serviceWrapper(publishAiPost.name, async () => {
    const aiPost = await AiPostRepository.select.oneForPublish(managerPrisma, aiPostId);

    if (!aiPost) throw new Error("AI Post not found");
    const userPrisma = getUserPrismaClient();

    // TODO: AI Image 생성
    const res = await PostRepository.insert.createByAiContent(
      userPrisma,
      id,
      aiPost.id,
      {
        title: aiPost.title,
        content: aiPost.content,
        summary: aiPost.summary,
        metadata: aiPost.metadata as AiContentMeta,
      },
      aiPost.category as PostCategoryEnum,
    );
    await AiPostRepository.update.publishStatus(managerPrisma, aiPostId);
    return { id: res.id };
  });
}
