import { prisma } from "@root/prisma";
import { getMetricSummaryQuerySchema } from "@root/src/schemas/get-metric-summary.schema";
import { Request, Response } from "express";
import { z } from "zod";
import { format } from "date-fns";
import { groupBy, last } from "lodash/fp";
import { METRIC_TYPES } from "@root/src/constants";
import { convertTimePeriod } from "@root/src/utils/date";

type GetMetricSummaryQuery = z.infer<typeof getMetricSummaryQuerySchema>;

function groupData<Record extends { createdAt: Date }>(records: Record[]) {
  const groupedRecords = groupBy((record) => {
    return format(record.createdAt, "yyyy-MM-dd");
  }, records);

  return Object.values(groupedRecords).map(last);
}

async function getDistanceSummary(query: Omit<GetMetricSummaryQuery, "type">) {
  const { timePeriod } = query;
  const { startDate, endDate } = convertTimePeriod(timePeriod);

  const allDistances = await prisma.distance.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return groupData(allDistances);
}

async function getTemperatureSummary(
  query: Omit<GetMetricSummaryQuery, "type">
) {
  const { timePeriod } = query;
  const { startDate, endDate } = convertTimePeriod(timePeriod);

  const allTemperatures = await prisma.temperature.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return groupData(allTemperatures);
}

export const getMetricSummary = async (req: Request, res: Response) => {
  const result = getMetricSummaryQuerySchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }

  const { type, ...query } = result.data;
  const metrics =
    type === METRIC_TYPES.distance
      ? await getDistanceSummary(query)
      : await getTemperatureSummary(query);

  res.send(metrics);
};
