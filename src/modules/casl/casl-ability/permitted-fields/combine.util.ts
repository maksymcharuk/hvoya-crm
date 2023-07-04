export function combine(parent: string, fields: string[]): string[] {
  return fields.map((field) => `${parent}.${field}`);
}
