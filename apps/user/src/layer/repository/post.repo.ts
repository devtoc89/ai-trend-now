import type { PostBase, PostDetail, PostMeta, Prisma as UserPrisma } from "@prisma/client/user/index.js";
import type { PostCategoryEnum } from "@repo/types/enums/post.category.enum";

export type RetrievePostList = Array<
  Pick<PostBase, "id" | "createdAt"> & {
    postMeta: Pick<PostMeta, "metadata"> | null;
    postDetail: Pick<PostDetail, "title" | "content"> | null;
  }
>;

class _select {
  public static ids(tx: UserPrisma.TransactionClient, category: PostCategoryEnum, pageSize = 400) {
    return tx.postBase.findMany({
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
      where: {
        isDeleted: false,
        postMeta: {
          category,
        },
      },
    });
  }

  public static liveCount(tx: UserPrisma.TransactionClient, category: PostCategoryEnum) {
    return tx.postBase.aggregate({
      _count: true,
      where: {
        isDeleted: false,
        postMeta: {
          category,
        },
      },
    });
  }

  public static one(tx: UserPrisma.TransactionClient, id: string) {
    return tx.postBase.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
        postMeta: {
          isNot: null,
        },
        postDetail: {
          isNot: null,
        },
      },
      select: {
        id: true,
        createdAt: true,
        postMeta: {
          select: {
            metadata: true,
          },
        },
        postDetail: {
          select: {
            title: true,
            content: true,
            summary: true,
          },
        },
      },
    });
  }
  public static many(tx: UserPrisma.TransactionClient, category: PostCategoryEnum, page: number, pageSize = 5) {
    return tx.postBase.findMany({
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isDeleted: false,
        postMeta: {
          category,
        },
      },
      select: {
        id: true,
        createdAt: true,
        postMeta: {
          select: {
            metadata: true,
          },
        },
        postDetail: {
          select: {
            title: true,
            content: true,
            summary: true,
          },
        },
      },
    });
  }
}

class _insert {}

class _update {}

class _delete {}

export default class PostRepository {
  public static readonly select = _select;
  public static readonly insert = _insert;
  public static readonly update = _update;
  public static readonly delete = _delete;
}
