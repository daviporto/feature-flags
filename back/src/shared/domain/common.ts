import { BadRequestException } from '@nestjs/common';

export type PropOrFactory<T> = T | ((index: number) => T);

export function isEnumValue<T extends Record<string, unknown>>(
  enumObj: T,
  value: unknown,
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

export function validateEnumArray<T extends Record<string, unknown>>(
  input: string | string[] | undefined,
  enumObj: T,
  enumName: string,
): T[keyof T][] {
  const values = Array.isArray(input)
    ? input
    : typeof input === 'string'
      ? [input]
      : [];

  const invalidValues: string[] = [];
  const validValues: T[keyof T][] = [];

  values.forEach((value) => {
    if (isEnumValue(enumObj, value)) {
      validValues.push(value as T[keyof T]);
    } else {
      invalidValues.push(value);
    }
  });

  if (invalidValues.length > 0) {
    throw new BadRequestException(
      `Invalid ${enumName} value(s): ${invalidValues.join(', ')}. ` +
        `Valid values: ${Object.values(enumObj).join(', ')}`,
    );
  }

  return validValues;
}
