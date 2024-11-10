import { prisma } from "@root/prisma";
import { METRIC_TYPES } from "@root/src/constants";
import { convertDistancesByUnit } from "@root/src/helpers/distance";
import { convertTemperaturesByUnit } from "@root/src/helpers/temperature";
import { getMetricsQuerySchema } from "@root/src/schemas/get-metrics.schema";
import { Request, Response } from "express";
import { z } from "zod";

type GetMetricsQuery = z.infer<typeof getMetricsQuerySchema>;

async function getDistances(query: Omit<GetMetricsQuery, "type">) {
  const { unit, createdBy } = query;
  const distances = await prisma.distance.findMany({
    where: { createdBy },
  });
  return unit ? convertDistancesByUnit(distances, unit) : distances;
}

async function getTemperatures(query: Omit<GetMetricsQuery, "type">) {
  const { unit, createdBy } = query;
  const temperatures = await prisma.temperature.findMany({
    where: { createdBy },
  });
  return unit ? convertTemperaturesByUnit(temperatures, unit) : temperatures;
}

export const getMetrics = async (req: Request, res: Response) => {
  const result = getMetricsQuerySchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }

  const { type, ...query } = result.data;
  const metrics =
    type === METRIC_TYPES.distance
      ? await getDistances(query)
      : await getTemperatures(query);

  res.send(metrics);
};
