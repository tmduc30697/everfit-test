import { z } from "zod";
import { METRIC_TYPE_VALUES } from "../constants";
import { convertTimePeriod } from "../utils/date";

export const getMetricSummaryQuerySchema = z.object({
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
      const {startDate, endDate} = convertTimePeriod(timePeriod);

      const isValidStart = !isNaN(startDate.getTime());
      const isValidEnd = !isNaN(endDate.getTime());
      if (!isValidStart || !isValidEnd) return false;

      return startDate < endDate;
    }),
});
