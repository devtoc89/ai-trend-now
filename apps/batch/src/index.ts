require("dotenv").config();

import { logger } from "@repo/util/logger/pino.instance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { jobRegister } from "#helper/job.helper";
import { arxivAiPostJob } from "#jobs/arxivAiPostJob";
import { arxivCrawlJobMaker } from "#jobs/arxivCrawlJob";

dayjs.extend(utc);

function start() {
  logger.info("batch server now is running.");
  // TODO: make cronjob by rule based.
  for (let i = 0; i <= 31; i++) {
    jobRegister(arxivCrawlJobMaker({ timeDelta: { unit: "day", value: -i } }), `0 */${i + 1} * * * *`);
  }
  jobRegister(arxivAiPostJob, "*/12 * * * * *", true);
}

start();
