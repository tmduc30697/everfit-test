import { Request, Response } from "express";
import { prisma } from "@root/prisma";
import { METRIC_TYPES } from "../../constants";
import { createMetricBodySchema } from "@root/src/schemas/create-metric.schema";
import { Prisma } from "@prisma/client";

async function createDistance(data: Prisma.DistanceCreateInput) {
  const { unit, value, createdBy, createdAt } = data;
  return prisma.distance.create({
    data: {
      unit,
      value,
      createdBy,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    },
  });
}

async function createTemperature(data: Prisma.TemperatureCreateInput) {
  const { unit, value, createdBy, createdAt } = data;
  return prisma.temperature.create({
    data: {
      unit,
      value,
      createdBy,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    },
  });
}

export const createMetric = async (req: Request, res: Response) => {
  const result = createMetricBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }

  const { type, ...data } = result.data;
  const metric =
    type === METRIC_TYPES.distance
      ? await createDistance(data)
      : await createTemperature(data);

  res.json(metric);
};
