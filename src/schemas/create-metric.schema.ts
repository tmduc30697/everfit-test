import { z } from "zod";
import {
  DISTANCE_UNIT_VALUES,
  METRIC_TYPE_VALUES,
  METRIC_TYPES,
  TEMPERATURE_UNIT_VALUES,
} from "@root/src/constants";

export const createMetricBodySchema = z
  .object({
    type: z.number().refine((type, ...args) => {
      return METRIC_TYPE_VALUES.includes(type);
    }),
    value: z.number(),
    unit: z.number(),
    createdBy: z.number(),
  })
  .refine((data) => {
    const { type, unit } = data;
    return type === METRIC_TYPES.distance
      ? DISTANCE_UNIT_VALUES.includes(unit)
      : TEMPERATURE_UNIT_VALUES.includes(unit);
  });
