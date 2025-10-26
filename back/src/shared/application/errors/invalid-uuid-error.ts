export class InvalidUuidError extends Error {
  constructor(public value: any) {
    super(`value provided: ${value} is not a valid uuid`);
    this.name = 'InvalidUuidError';
  }
}
