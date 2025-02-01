import type {
  CrawlArxivParsedDTO,
  CrawlArxivParsedEntryDTO,
  CrawlArxivSearchParamsDTO,
} from "@repo/types/dto/crawl/arxiv/arxiv.crawl.dto";
import type {
  CrawlCommonParamsDTO,
  CrawlCommonResponseDTO,
  CreateManyOriginalPostListItemDTO,
} from "@repo/types/dto/crawl/common/common.crawl.dto";
import type { ResponseTypeDTO } from "@repo/types/dto/response/response.dto";
import { PostCategoryEnum } from "@repo/types/enums/post.category.enum";
import { getUniqueItems } from "#layer/domain/crawl/common/common.services";
import { fetchArxiv } from "#layer/domain/crawl/scholar/arxiv/arxiv.client";
import { arxivClientResponseParser } from "#layer/domain/crawl/scholar/arxiv/arxiv.parser";
import { serviceWrapper } from "#lib/helper/service/service.helper";
import { getPrismaClient } from "#lib/instance/prisma/prisma.instance";

const etcKey: Array<keyof CrawlArxivParsedEntryDTO> = ["author", "arxiv:primary_category", "arxiv:comment"];

/**
 * Fetches and parses data from the Arxiv API using the provided search parameters.
 *
 * @param searchParam - The search parameters used to query the Arxiv API.
 * @returns A promise that resolves to a success response with parsed Arxiv data,
 *          or an error response if the fetching or parsing fails.
 */
export async function fetchAndParseArxivData(
  searchParam: CrawlArxivSearchParamsDTO,
): Promise<ResponseTypeDTO<CrawlArxivParsedDTO>> {
  return await serviceWrapper(fetchAndParseArxivData.name, async () => {
    const response = await fetchArxiv(searchParam);
    if (!response.success || !response.data) throw new Error("No response from API");
    return arxivClientResponseParser(response.data);
  });
}

/**
 * Crawl arxiv and persist crawled data to database.
 *
 * @param searchParam Search parameter for crawling arxiv.
 * @returns Promise that resolves to a success response with crawled data if successful, or an error response on failure.
 */
export async function getArxivCrawlData(
  searchParam: CrawlCommonParamsDTO,
): Promise<ResponseTypeDTO<CrawlCommonResponseDTO>> {
  const prisma = getPrismaClient();
  return await serviceWrapper(getArxivCrawlData.name, async () => {
    const arxivData = await fetchAndParseArxivData(searchParam);

    if (!arxivData.success) {
      throw new Error(`Failed to fetch or parse Arxiv data. Reason: ${arxivData.error}`);
    }
    const originalList = arxivData.data.feed.entry;
    if (!originalList?.length) {
      throw new Error("No data found");
    }
    const uniqueItems = await getUniqueItems(
      prisma,
      originalList.sort((a, b) => b.id.localeCompare(a.id)),
    );

    return {
      meta: { source: "arxiv", category: PostCategoryEnum.PAPER },
      list: uniqueItems.map<CreateManyOriginalPostListItemDTO>((v) => ({
        id: v.id,
        url: v.id,
        title: v.title,
        content: v.summary,
        orgCreatedAt: v.published,
        orgUpdatedAt: v.updated,
        etc: etcKey.reduce<Partial<CrawlArxivParsedEntryDTO>>((pv, cv) => {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (pv as any)[cv] = v[cv];
          return pv;
        }, {}),
      })),
    };
  });
}
