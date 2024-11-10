import { Request, Response } from "express";
import { prisma } from "@root/prisma";
import { METRIC_TYPES } from "../../constants";
import { createMetricBodySchema } from "@root/src/schemas/create-metric.schema";

export const createMetric = async (req: Request, res: Response) => {
  const result = createMetricBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }

  const { type, ...data } = result.data;
  const metric =
    type === METRIC_TYPES.distance
      ? await prisma.distance.create({ data })
      : await prisma.temperature.create({ data });

  res.json(metric);
};
