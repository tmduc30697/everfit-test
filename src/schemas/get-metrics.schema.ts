import { z } from "zod";
import {
  DISTANCE_UNIT_VALUES,
  METRIC_TYPE_VALUES,
  METRIC_TYPES,
  TEMPERATURE_UNIT_VALUES,
} from "../constants";

export const getMetricsQuerySchema = z
  .object({
    type: z
      .string()
      .regex(/^\d+$/)
      .transform((str) => Number(str))
      .refine((type) => {
        return METRIC_TYPE_VALUES.includes(type);
      }),
    createdBy: z
      .string()
      .regex(/^\d+$/)
      .transform((str) => Number(str)),
    unit: z
      .string()
      .optional()
      .refine((unit) => {
        if (!unit) return true;
        return /^\d+$/.test(unit);
      })
      .transform((str) => Number(str)),
  })
  .refine((query) => {
    const { type, unit } = query;
    if (!unit) return true;
    return type === METRIC_TYPES.distance
      ? DISTANCE_UNIT_VALUES.includes(unit)
      : TEMPERATURE_UNIT_VALUES.includes(unit);
  });
