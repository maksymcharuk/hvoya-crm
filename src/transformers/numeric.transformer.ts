export class NumericTransformer {
  to(number?: number): string | undefined {
    return number?.toString();
  }
  from(number?: string): number | null {
    return number ? parseFloat(number) : null;
  }
}
