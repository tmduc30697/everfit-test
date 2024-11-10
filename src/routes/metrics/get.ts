import { prisma } from "@root/prisma";
import { METRIC_TYPES } from "@root/src/constants";
import { getMetricsQuerySchema } from "@root/src/schemas/get-metrics.schema";
import { Request, Response } from "express";
import { z } from "zod";

type GetMetricsQuery = z.infer<typeof getMetricsQuerySchema>;

function getDistances(query: Omit<GetMetricsQuery, "type">) {
  return prisma.distance.findMany({ where: query });
}

function getTemperatures(query: Omit<GetMetricsQuery, "type">) {
  return prisma.temperature.findMany({ where: query });
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
