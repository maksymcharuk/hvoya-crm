export function enumToLabelValue(e: any): { value: any; label: string }[] {
  return Object.entries(e).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });
}
