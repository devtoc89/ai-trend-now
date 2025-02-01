// TODO: 크롤러와 관련된 코드는 별도 package분리가 나을지 고려 필요.
// TODO: 필요에 따라 조회 조건 고도화 필요.

import type { CrawlArxivSearchParamsDTO } from "@repo/types/dto/crawl/arxiv/arxiv.crawl.dto";
import type { ResponseTypeDTO } from "@repo/types/dto/response/response.dto";
import { serviceWrapper } from "#lib/helper/service/service.helper";

const urlForm = ({ from, to }: CrawlArxivSearchParamsDTO) =>
  `http://export.arxiv.org/api/query?search_query=all:Artificial+Intelligence+AND+submittedDate:[${from}+TO+${to}]&start=0&max_results=200&sortBy=submittedDate&sortOrder=descending`;

export async function fetchArxiv(searchParam: CrawlArxivSearchParamsDTO): Promise<ResponseTypeDTO<string>> {
  return await serviceWrapper(fetchArxiv.name, async () => {
    const response = await fetch(urlForm(searchParam));
    return await response.text();
  });
}
