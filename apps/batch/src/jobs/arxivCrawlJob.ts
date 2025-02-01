import dayjs, { type ManipulateType } from "dayjs";

export type ArxivCrawlJobParams = { timeDelta: { unit: ManipulateType; value: number } };

function makeParams({ timeDelta }: ArxivCrawlJobParams) {
  const nowUtc = dayjs().utc();
  const fromDate = nowUtc.add(timeDelta.value, timeDelta.unit);
  const toDate = fromDate.add(1, "day");
  return JSON.stringify({
    from: `${fromDate.format("YYYYMMDD")}`,
    to: `${toDate.format("YYYYMMDD")}`,
    source: "arxiv",
  });
}

export async function arxivCrawlJob(params: ArxivCrawlJobParams) {
  const res = await fetch(`${process.env.CRAWLER_SERVER_URL}/crawl`, {
    method: "post",
    body: makeParams(params),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return JSON.stringify(await res.json()).substring(0, 100);
}

export function arxivCrawlJobMaker(params: ArxivCrawlJobParams) {
  const targetFn = function () {
    return arxivCrawlJob(params);
  };
  Object.defineProperty(targetFn, "name", {
    value: `${arxivCrawlJob.name} : ${JSON.stringify(params)}`,
  });
  return targetFn;
}
