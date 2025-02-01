import type { Prisma } from "@prisma/client/manager/index.js";
import type { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import { getCurrentTimeISOString } from "@repo/util/date/date.util";

class _select {
  public static manyForNewPostList(tx: Prisma.TransactionClient, page: number, pageSize: number) {
    return tx.originalPostBase.findMany({
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        originalPostMeta: {
          select: {
            source: true,
            category: true,
            url: true,
            orgCreatedAt: true,
          },
        },
        originalPostSource: {
          select: {
            title: true,
            content: true,
            createdAt: true,
          },
        },
        originalPostStatus: {
          select: {
            selectedFlg: true,
          },
        },
      },
    });
  }

  public static manyForSelectedPostList(tx: Prisma.TransactionClient, page: number, pageSize: number) {
    return tx.originalPostBase.findMany({
      skip: page * pageSize,
      take: pageSize,
      where: {
        originalPostStatus: {
          selectedFlg: true,
        },
      },
      orderBy: {
        originalPostStatus: {
          selectedAt: "desc",
        },
      },
      select: {
        id: true,
        originalPostMeta: {
          select: {
            source: true,
            category: true,
            url: true,
            orgCreatedAt: true,
          },
        },
        originalPostSource: {
          select: {
            title: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });
  }

  public static manyForRecent(tx: Prisma.TransactionClient) {
    return tx.originalPostSource.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        title: true,
        content: true,
        originalPostBase: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  public static manyForAiPost(
    tx: Prisma.TransactionClient,
    postIdList: string[],
    postCategoryList: PostCategoryEnum[],
  ) {
    return tx.originalPostSource.findMany({
      where: {
        postId: {
          in: postIdList,
        },
        ...(postCategoryList.length !== 0
          ? {
              originalPostBase: {
                originalPostMeta: {
                  category: { in: postCategoryList },
                },
              },
            }
          : {}),
      },
      select: {
        title: true,
        content: true,
        createdAt: true,
        originalPostBase: {
          select: {
            originalPostMeta: {
              select: {
                source: true,
                category: true,
                etc: true,
                url: true,
                orgCreatedAt: true,
                orgUpdatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  public static manyForPublishByCategory(tx: Prisma.TransactionClient, categoryList: PostCategoryEnum[]) {
    return tx.originalPostBase.findMany({
      where: {
        originalPostMeta: {
          category: { in: categoryList },
        },
        originalPostStatus: {
          autoFlg: false,
        },
      },
      orderBy: [{ createdAt: "asc" }, { originalPostMeta: { orgUpdatedAt: "asc" } }],
      take: 1,
      select: {
        id: true,
        originalPostSource: {
          select: {
            title: true,
            content: true,
            createdAt: true,
          },
        },
        originalPostMeta: {
          select: {
            source: true,
            category: true,
            orgCreatedAt: true,
            orgUpdatedAt: true,
            url: true,
            etc: true,
          },
        },
      },
    });
  }
}
class _insert {}

class _update {
  public static autoStatus(tx: Prisma.TransactionClient, postId: string, autoFlg = true) {
    return tx.originalPostStatus.update({
      where: {
        postId,
      },
      data: {
        autoFlg,
        autoAt: getCurrentTimeISOString(),
      },
    });
  }

  public static selectedStatus(tx: Prisma.TransactionClient, id: string, selectedFlg: boolean) {
    return tx.originalPostStatus.update({
      where: {
        postId: id,
      },
      data: {
        selectedFlg,
        selectedAt: getCurrentTimeISOString(),
      },
    });
  }
}

class _delete {}

export default class OriginalPostRepository {
  public static readonly select = _select;
  public static readonly insert = _insert;
  public static readonly update = _update;
  public static readonly delete = _delete;
}
