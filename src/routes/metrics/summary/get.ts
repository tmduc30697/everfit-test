import { prisma } from "@root/prisma";
import { getMetricSummaryQuerySchema } from "@root/src/schemas/get-metric-summary.schema";
import { Request, Response } from "express";
import { z } from "zod";
import { format } from "date-fns";
import { groupBy, last } from "lodash/fp";
import { METRIC_TYPES } from "@root/src/constants";
import { convertTimePeriod } from "@root/src/utils/date";
import { convertDistancesByUnit } from "@root/src/helpers/distance";
import { convertTemperaturesByUnit } from "@root/src/helpers/temperature";

type GetMetricSummaryQuery = z.infer<typeof getMetricSummaryQuerySchema>;

function groupData<Record extends { createdAt: Date }>(records: Record[]) {
  const groupedRecords = groupBy((record) => {
    return format(record.createdAt, "yyyy-MM-dd");
  }, records);

  const data = Object.values(groupedRecords).map(last).filter(Boolean);
  return data as Record[];
}

async function getDistanceSummary(query: Omit<GetMetricSummaryQuery, "type">) {
  const { unit, timePeriod } = query;
  const { startDate, endDate } = convertTimePeriod(timePeriod);

  const distances = await prisma.distance.findMany({
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

  const groupedDistances = groupData(distances);
  return unit
    ? convertDistancesByUnit(groupedDistances, unit)
    : groupedDistances;
}

async function getTemperatureSummary(
  query: Omit<GetMetricSummaryQuery, "type">
) {
  const { unit, timePeriod } = query;
  const { startDate, endDate } = convertTimePeriod(timePeriod);

  const temperatures = await prisma.temperature.findMany({
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

  const groupedTemperatures = groupData(temperatures);
  return unit
    ? convertTemperaturesByUnit(groupedTemperatures, unit)
    : groupedTemperatures;
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
