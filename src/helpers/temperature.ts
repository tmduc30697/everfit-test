import { TEMPERATURE_UNITS } from "../constants";

function convertToCelsius(value: number, fromUnit: number) {
  switch (fromUnit) {
    case TEMPERATURE_UNITS.celsius:
      return value;
    case TEMPERATURE_UNITS.fahrenheit:
      return (value - 32) / 1.8;
    case TEMPERATURE_UNITS.kelvin:
      return value - 273.15;
    default:
      return value;
  }
}

function convertFromCelciusTo(value: number, toUnit: number) {
  switch (toUnit) {
    case TEMPERATURE_UNITS.celsius:
      return value;
    case TEMPERATURE_UNITS.fahrenheit:
      return value * 1.8 + 32;
    case TEMPERATURE_UNITS.kelvin:
      return value + 273.15;
    default:
      return value;
  }
}

export function convertTemperatureToUnit(
  value: number,
  fromUnit: number,
  toUnit: number
): number {
  const celsiusValue = convertToCelsius(value, fromUnit);
  return convertFromCelciusTo(celsiusValue, toUnit);
}
