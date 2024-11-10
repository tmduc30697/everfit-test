import { z } from "zod";
import {
  DISTANCE_UNIT_VALUES,
  METRIC_TYPE_VALUES,
  METRIC_TYPES,
  TEMPERATURE_UNIT_VALUES,
  TEMPERATURE_UNITS,
} from "../constants";
import { convertTimePeriod } from "../utils/date";

export const getMetricSummaryQuerySchema = z
  .object({
    type: z
      .string()
      .transform((str) => Number(str))
      .refine((type) => {
        return METRIC_TYPE_VALUES.includes(type);
      }),
    timePeriod: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/)
      .refine((timePeriod) => {
        const { startDate, endDate } = convertTimePeriod(timePeriod);

        const isValidStart = !isNaN(startDate.getTime());
        const isValidEnd = !isNaN(endDate.getTime());
        if (!isValidStart || !isValidEnd) return false;

        return startDate < endDate;
      }),
    unit: z
      .string()
      .optional()
      .transform((str) => Number(str)),
  })
  .refine((query) => {
    const { type, unit } = query;

    if (!unit) return true;
    return type === METRIC_TYPES.distance
      ? DISTANCE_UNIT_VALUES.includes(unit)
      : TEMPERATURE_UNIT_VALUES.includes(unit);
  });
