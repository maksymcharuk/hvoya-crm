export function hasDuplicates<T>(arr: T[], prop: keyof T): boolean {
  const seen = new Set(); // create a new Set to track seen values
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]?.[prop];
    if (seen.has(value)) {
      return true; // a duplicate has been found
    }
    seen.add(value); // add the current value to the set
  }
  return false; // no duplicates were found
}
