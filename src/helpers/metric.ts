import { Distance, Temperature } from "@prisma/client";
import { convertDistanceToUnit } from "./distance";
import { convertTemperatureToUnit } from "./temperature";

function convertRecordsByUnit<Record extends { value: number; unit: number }>(
  records: Record[],
  toUnit: number,
  convertToUnit: (value: number, fromUnit: number, toUnit: number) => number
) {
  return records.map((record) => {
    const { value, unit: fromUnit } = record;
    return {
      ...record,
      value: convertToUnit(value, fromUnit, toUnit),
      unit: toUnit,
    };
  });
}

export function convertDistancesByUnit(distances: Distance[], toUnit: number) {
  return convertRecordsByUnit(distances, toUnit, convertDistanceToUnit);
}

export function convertTemperaturesByUnit(
  temperatures: Temperature[],
  toUnit: number
) {
  return convertRecordsByUnit(temperatures, toUnit, convertTemperatureToUnit);
}
