import { z } from "zod";
import { METRIC_TYPE_VALUES } from "../constants";

export const getMetricsQuerySchema = z.object({
  type: z
    .string()
    .transform((str) => Number(str))
    .refine((type) => {
      return METRIC_TYPE_VALUES.includes(type);
    }),
  createdBy: z.string().transform((str) => Number(str)),
});
