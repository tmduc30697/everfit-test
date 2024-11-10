import { Distance } from "@prisma/client";
import {
  DISTANCE_UNITS,
  METER_CM_RATIO,
  METER_FEET_RATIO,
  METER_INCH_RATIO,
  METER_YARD_RATIO,
} from "../constants";

function convertToMeter(value: number, fromUnit: number): number {
  switch (fromUnit) {
    case DISTANCE_UNITS.meter:
      return value;
    case DISTANCE_UNITS.centimeter:
      return value / METER_CM_RATIO;
    case DISTANCE_UNITS.inch:
      return value / METER_INCH_RATIO;
    case DISTANCE_UNITS.feet:
      return value / METER_FEET_RATIO;
    case DISTANCE_UNITS.yard:
      return value / METER_YARD_RATIO;
    default:
      return value;
  }
}

function convertFromMeterTo(value: number, toUnit: number): number {
  switch (toUnit) {
    case DISTANCE_UNITS.meter:
      return value;
    case DISTANCE_UNITS.centimeter:
      return value * METER_CM_RATIO;
    case DISTANCE_UNITS.inch:
      return value * METER_INCH_RATIO;
    case DISTANCE_UNITS.feet:
      return value * METER_FEET_RATIO;
    case DISTANCE_UNITS.yard:
      return value * METER_YARD_RATIO;
    default:
      return value;
  }
}

function convertToUnit(
  value: number,
  fromUnit: number,
  toUnit: number
): number {
  const meterValue = convertToMeter(value, fromUnit);
  return convertFromMeterTo(meterValue, toUnit);
}

export const convertDistancesByUnit = <
  Record extends Pick<Distance, "value" | "unit">
>(
  distances: Record[],
  toUnit: number
) => {
  return distances.map((distance) => {
    const { value, unit: fromUnit } = distance;
    return {
      ...distance,
      value: convertToUnit(value, fromUnit, toUnit),
      unit: toUnit,
    };
  });
};
