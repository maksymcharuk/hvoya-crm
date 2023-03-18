export function mergeArraysByProperty<T extends { [key: string]: any }>(
  arr1: T[],
  arr2: T[],
  prop: keyof T,
): T[] {
  const mergedObjects: { [key: string]: any } = {};

  for (const obj of arr1) {
    const propValue = obj[prop];

    if (propValue in mergedObjects) {
      mergedObjects[propValue] = { ...mergedObjects[propValue], ...obj };
    } else {
      mergedObjects[propValue] = obj;
    }
  }

  for (const obj of arr2) {
    const propValue = obj[prop];

    if (propValue in mergedObjects) {
      mergedObjects[propValue] = { ...mergedObjects[propValue], ...obj };
    } else {
      mergedObjects[propValue] = obj;
    }
  }

  return Object.values(mergedObjects) as T[];
}
